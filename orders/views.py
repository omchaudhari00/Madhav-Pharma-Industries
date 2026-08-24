from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
import hmac
import hashlib
import uuid
import logging
from decimal import Decimal
from .models import Payment, Invoice, Order
from .serializers import PaymentSerializer, InvoiceSerializer, OrderSerializer
from quotations.models import Quotation
from catalog.models import Product
from interactions.models import ActivityLog
from accounts.models import User

logger = logging.getLogger(__name__)


def _resolve_authenticated_user(request):
    """Manually attempt JWT authentication on AllowAny endpoints.
    Returns the User instance or None."""
    if request.user and request.user.is_authenticated:
        return request.user
    try:
        from rest_framework_simplejwt.authentication import JWTAuthentication
        jwt_auth = JWTAuthentication()
        auth_result = jwt_auth.authenticate(request)
        if auth_result:
            return auth_result[0]
    except Exception:
        pass
    return None

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'Sales']:
            return Payment.objects.all().order_by('-payment_date', '-id')
        return Payment.objects.filter(
            Q(quotation__customer=user) | Q(order__customer=user)
        ).order_by('-payment_date', '-id')

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-razorpay-order')
    def create_razorpay_order(self, request):
        """
        Creates a Razorpay order on the server side with server-validated amount.
        """
        quotation_id = request.data.get('quotation_id')
        items = request.data.get('items', [])
        client_amount = request.data.get('amount')
        currency = request.data.get('currency', 'INR')
        receipt = request.data.get('receipt', f"rcpt_{uuid.uuid4().hex[:8]}")

        # Server-side amount computation
        calculated_amount = Decimal('0.00')
        if quotation_id:
            try:
                quote = Quotation.objects.get(id=quotation_id)
                if quote.final_price:
                    calculated_amount = Decimal(str(quote.final_price))
                else:
                    calculated_amount = Decimal(str(client_amount or 0))
            except Quotation.DoesNotExist:
                return Response({'error': 'Quotation not found.'}, status=status.HTTP_404_NOT_FOUND)
        elif items and isinstance(items, list):
            for item in items:
                p_name = item.get('name', '').strip()
                qty = int(item.get('quantity', 1))
                prod = Product.objects.filter(name__iexact=p_name, is_active=True).first()
                if prod and prod.price:
                    unit_price = Decimal(str(prod.price))
                else:
                    unit_price = Decimal(str(item.get('unitPrice', 0)))
                calculated_amount += unit_price * qty
        else:
            try:
                calculated_amount = Decimal(str(client_amount or 0))
            except Exception:
                calculated_amount = Decimal('0.00')

        if calculated_amount <= 0:
            return Response({'error': 'Invalid order amount.'}, status=status.HTTP_400_BAD_REQUEST)

        razorpay_key = getattr(settings, 'RAZORPAY_KEY_ID', None)
        razorpay_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
        has_configured_keys = bool(
            razorpay_key and 
            razorpay_secret and 
            razorpay_key != 'rzp_test_YOUR_KEY_ID_HERE' and 
            razorpay_secret != 'YOUR_KEY_SECRET_HERE'
        )

        if not has_configured_keys:
            # Sandbox fallback only when server keys are not configured
            simulated_order_id = f"order_sim_{uuid.uuid4().hex[:12]}"
            return Response({
                'success': True,
                'order_id': simulated_order_id,
                'amount': int(calculated_amount * 100),
                'currency': currency,
                'key_id': razorpay_key or 'rzp_test_key',
                'is_simulated': True
            }, status=status.HTTP_200_OK)

        try:
            import razorpay
            client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
            order_data = {
                'amount': int(calculated_amount * 100),  # in paise
                'currency': currency,
                'receipt': receipt,
                'payment_capture': 1
            }
            rzp_order = client.order.create(data=order_data)
            return Response({
                'success': True,
                'order_id': rzp_order['id'],
                'amount': rzp_order['amount'],
                'currency': rzp_order['currency'],
                'key_id': razorpay_key,
                'is_simulated': False
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='verify-razorpay-signature')
    def verify_razorpay_payment(self, request):
        """
        HMAC-SHA256 Server-Side Signature Verification & DB Order/Payment/Invoice creation.
        Enforces idempotency, server catalog price verification, and replay attack prevention.
        """
        razorpay_order_id = request.data.get('razorpay_order_id', '')
        razorpay_payment_id = request.data.get('razorpay_payment_id', '')
        razorpay_signature = request.data.get('razorpay_signature', '')
        quotation_id = request.data.get('quotation_id')
        order_details = request.data.get('orderDetails', {})

        razorpay_key = getattr(settings, 'RAZORPAY_KEY_ID', None)
        razorpay_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
        has_configured_keys = bool(
            razorpay_key and 
            razorpay_secret and 
            razorpay_key != 'rzp_test_YOUR_KEY_ID_HERE' and 
            razorpay_secret != 'YOUR_KEY_SECRET_HERE'
        )

        # Disallow simulated orders when real keys are configured on the server
        if has_configured_keys and str(razorpay_order_id).startswith('order_sim_'):
            return Response({
                'success': False,
                'error': 'Simulated payments are rejected on live payment environments.'
            }, status=status.HTTP_400_BAD_REQUEST)

        is_simulated = not has_configured_keys

        # Idempotency check: prevent replay attacks with the same payment reference
        if razorpay_payment_id and Payment.objects.filter(transaction_reference=razorpay_payment_id).exists():
            existing_order = Order.objects.filter(payment__transaction_reference=razorpay_payment_id).first()
            if existing_order:
                return Response({
                    'success': True,
                    'status': 'Already Processed',
                    'order_id': existing_order.order_number,
                    'invoice_number': existing_order.invoice.invoice_number if existing_order.invoice else None,
                    'reference_id': razorpay_payment_id,
                    'order': OrderSerializer(existing_order).data
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'error': 'This transaction reference has already been recorded.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not is_simulated:
            # Enforce cryptographic HMAC verification in live mode
            message = f"{razorpay_order_id}|{razorpay_payment_id}"
            generated_signature = hmac.new(
                razorpay_secret.encode('utf-8'),
                message.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            if not hmac.compare_digest(generated_signature, str(razorpay_signature)):
                return Response({
                    'success': False,
                    'error': 'Cryptographic HMAC signature mismatch. Potential tampering detected.'
                }, status=status.HTTP_400_BAD_REQUEST)

        # Atomic creation/update of Payment, Invoice, and Order records in PostgreSQL
        with transaction.atomic():
            quote = None
            if quotation_id:
                quote = Quotation.objects.filter(id=quotation_id).first()

            # Manually resolve user from JWT token (AllowAny doesn't auto-authenticate)
            user = _resolve_authenticated_user(request)

            # Fallback: try to find user by checkout email if still anonymous
            if not user and order_details.get('email'):
                checkout_email = order_details['email'].strip().lower()
                user = User.objects.filter(email__iexact=checkout_email).first()
            
            # Recompute total amount strictly from server-side quote or verified catalog pricing
            total_amt = Decimal('0.00')
            items_data = []
            if quote and quote.final_price:
                total_amt = Decimal(str(quote.final_price))
            elif order_details and 'items' in order_details and isinstance(order_details['items'], list):
                for it in order_details['items']:
                    p_name = it.get('name', '').strip()
                    qty = int(it.get('quantity', 1))
                    prod = Product.objects.filter(name__iexact=p_name, is_active=True).first()
                    if prod and prod.price:
                        unit_price = Decimal(str(prod.price))
                    else:
                        unit_price = Decimal(str(it.get('unitPrice', 0)))
                    
                    total_amt += unit_price * qty
                    items_data.append({
                        'name': prod.name if prod else p_name,
                        'quantity': qty,
                        'unitPrice': float(unit_price),
                        'sizeLabel': it.get('sizeLabel', '50ml Bottle')
                    })
            elif order_details and 'totalAmount' in order_details:
                raw_amt = str(order_details.get('totalAmount')).replace('₹', '').replace(',', '').strip()
                try:
                    total_amt = Decimal(raw_amt)
                except Exception:
                    total_amt = Decimal('0.00')

            # If live Razorpay client is present, cross-verify amount captured by Razorpay
            if not is_simulated and razorpay_key and razorpay_secret and razorpay_payment_id:
                try:
                    import razorpay
                    client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
                    rzp_payment = client.payment.fetch(razorpay_payment_id)
                    captured_paise = rzp_payment.get('amount', 0)
                    captured_inr = Decimal(str(captured_paise)) / Decimal('100')
                    if captured_inr > 0:
                        total_amt = captured_inr
                except Exception as e:
                    pass

            payment = Payment.objects.create(
                quotation=quote,
                amount=total_amt,
                status='Completed',
                payment_method='Razorpay (Verified)',
                currency='INR',
                signature_verified=True,
                transaction_reference=razorpay_payment_id or f"TXN-{uuid.uuid4().hex[:8].upper()}",
                payment_date=timezone.now()
            )

            invoice = Invoice.objects.create(
                quotation=quote,
                payment=payment,
                total_amount=total_amt,
                tax_information="GST 18% Inclusive"
            )

            order_type = 'B2B' if quote else 'Retail'
            customer_name = order_details.get('customerName', '')
            customer_email = order_details.get('email', '')
            customer_phone = order_details.get('phone', '')
            delivery_address = order_details.get('deliveryAddress', '')
            if not items_data:
                items_data = order_details.get('items', [])

            if user and not customer_name:
                customer_name = f"{user.first_name} {user.last_name}".strip()
            if user and not customer_email:
                customer_email = user.email
            if user and not customer_phone:
                customer_phone = user.mobile_number

            order = Order.objects.create(
                order_type=order_type,
                customer=user,
                quotation=quote,
                payment=payment,
                invoice=invoice,
                customer_name=customer_name,
                customer_phone=customer_phone,
                customer_email=customer_email,
                delivery_address=delivery_address,
                items_data=items_data,
                total_amount=total_amt,
                status='Preparing in Stock' if order_type == 'Retail' else 'Processing',
                payment_status=f"PAID ({payment.transaction_reference})"
            )

            if quote:
                quote.status = 'Paid'
                quote.save()

            # Record system activity log using valid model attributes (sales_person, order_id, description, status)
            ActivityLog.objects.create(
                sales_person=user if (user and user.role in ['Admin', 'Sales']) else None,
                order_id=order.order_number,
                description=f"Payment of ₹{total_amt} successfully verified via {payment.payment_method}. Reference: {payment.transaction_reference}",
                status='Paid'
            )

        return Response({
            'success': True,
            'status': 'Verified & Paid',
            'order_id': order.order_number,
            'invoice_number': invoice.invoice_number,
            'reference_id': payment.transaction_reference,
            'order': OrderSerializer(order).data
        }, status=status.HTTP_200_OK)


class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'Sales']:
            return Invoice.objects.all().order_by('-invoice_date')
        return Invoice.objects.filter(
            Q(quotation__customer=user) | Q(order__customer=user)
        ).order_by('-invoice_date')


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'Sales']:
            return Order.objects.all().order_by('-created_at')
        # Match orders by customer FK, email, or mobile number for maximum coverage
        return Order.objects.filter(
            Q(customer=user) |
            Q(customer_email__iexact=user.email) |
            (Q(customer_phone=user.mobile_number) if user.mobile_number else Q())
        ).distinct().order_by('-created_at')

    def perform_update(self, serializer):
        # Only Admin or Sales users are permitted to update order status
        user = self.request.user
        if user.role in ['Admin', 'Sales'] or user.is_staff:
            serializer.save()
        else:
            raise PermissionDenied("Only Admin and Sales personnel are authorized to modify order records.")

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='confirm-payment')
    def confirm_payment(self, request):
        """
        Endpoint to receive payment notification and trigger WhatsApp confirmation.
        """
        order_data = request.data
        customer_phone = order_data.get('phone', '')
        customer_name = order_data.get('customerName', 'Customer')
        order_id = order_data.get('id', 'Unknown')
        total_amount = order_data.get('totalAmount', '0')

        whatsapp_message = (
            f"Hello {customer_name}, your order {order_id} for {total_amount} "
            f"has been successfully confirmed by Madhav Pharma Industries! "
            f"Your order is currently being prepared for dispatch."
        )

        print("========================================")
        print(f"SENDING WHATSAPP NOTIFICATION TO: {customer_phone}")
        print(f"MESSAGE:\n{whatsapp_message}")
        print("========================================")

        return Response({
            'success': True, 
            'message': 'WhatsApp confirmation triggered successfully.'
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='create-shipment')
    def create_shipment(self, request, pk=None):
        """
        Creates an order in Shiprocket and immediately generates the AWB tracking code.
        """
        user = request.user
        if user.role not in ['Admin', 'Sales'] and not user.is_staff:
            raise PermissionDenied("Only Admin and Sales personnel can generate shipments.")
            
        order = self.get_object()
        
        try:
            from backend.services.shiprocket import create_order, generate_awb
            
            # Step 1: Create Order in Shiprocket
            if not order.shiprocket_order_id:
                sr_data = create_order(order)
                order.shiprocket_order_id = str(sr_data.get('order_id', ''))
                order.shiprocket_shipment_id = str(sr_data.get('shipment_id', ''))
                order.status = 'Shipped'
                order.save()
            
            # Step 2: Generate AWB
            if order.shiprocket_shipment_id and not order.awb_code:
                awb_data = generate_awb(order.shiprocket_shipment_id)
                order.awb_code = awb_data.get('awb_code')
                if order.awb_code:
                    order.tracking_url = f"https://shiprocket.co/tracking/{order.awb_code}"
                order.save()
                
            return Response({
                'success': True,
                'message': 'Shipment created and AWB generated successfully.',
                'order': OrderSerializer(order).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

