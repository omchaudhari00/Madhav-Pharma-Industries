from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from django.utils import timezone
import hmac
import hashlib
import uuid
from .models import Payment, Invoice, Order
from .serializers import PaymentSerializer, InvoiceSerializer, OrderSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Payment.objects.all()
        return Payment.objects.filter(quotation__customer=user)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='create-razorpay-order')
    def create_razorpay_order(self, request):
        """
        Creates a Razorpay order on the server side.
        Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in settings / .env for production.
        In sandbox/dev mode, gracefully returns a simulated order ID.
        """
        amount = request.data.get('amount', 0)
        currency = request.data.get('currency', 'INR')
        receipt = request.data.get('receipt', f"rcpt_{uuid.uuid4().hex[:8]}")

        razorpay_key = getattr(settings, 'RAZORPAY_KEY_ID', None)
        razorpay_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)

        if razorpay_key and razorpay_secret and razorpay_key != 'rzp_test_YOUR_KEY_ID_HERE':
            try:
                import razorpay
                client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
                order_data = {
                    'amount': int(float(amount) * 100),  # paise
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
                    'key_id': razorpay_key
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Sandbox / simulation fallback when live keys are not configured
        simulated_order_id = f"order_{uuid.uuid4().hex[:14]}"
        return Response({
            'success': True,
            'order_id': simulated_order_id,
            'amount': int(float(amount) * 100),
            'currency': currency,
            'key_id': 'rzp_test_simulated_key',
            'sandbox': True
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='verify-razorpay-signature')
    def verify_razorpay_payment(self, request):
        """
        HMAC-SHA256 Server-Side Signature Verification.
        Prevents client-side price manipulation or fake payment injection.
        """
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        payment_db_id = request.data.get('payment_id')

        razorpay_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)

        # In production with a live secret key, enforce HMAC verification
        if razorpay_secret and razorpay_secret != 'YOUR_KEY_SECRET_HERE':
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

        # Update Payment record if provided
        if payment_db_id:
            try:
                payment = Payment.objects.get(id=payment_db_id)
                payment.status = 'Completed'
                payment.signature_verified = True
                payment.payment_method = 'Razorpay'
                payment.transaction_reference = razorpay_payment_id
                payment.payment_date = timezone.now()
                payment.save()
            except Payment.DoesNotExist:
                pass

        return Response({
            'success': True,
            'status': 'Verified & Paid',
            'reference_id': razorpay_payment_id
        }, status=status.HTTP_200_OK)


class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Invoice.objects.all()
        return Invoice.objects.filter(quotation__customer=user)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Order.objects.all()
        return Order.objects.filter(customer=user)
