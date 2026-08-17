from interactions.models import ActivityLog
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import QuoteCart, QuoteCartItem, Quotation, QuotationItem, NegotiationHistory
from .serializers import (
    QuoteCartSerializer, QuoteCartItemSerializer, 
    QuotationSerializer, NegotiationHistorySerializer
)
from django.db import transaction
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings

class QuoteCartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart, _ = QuoteCart.objects.get_or_create(customer=request.user)
        serializer = QuoteCartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, _ = QuoteCart.objects.get_or_create(customer=request.user)
        serializer = QuoteCartItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(cart=cart)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def submit_quote(self, request):
        cart, _ = QuoteCart.objects.get_or_create(customer=request.user)
        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            quotation = Quotation.objects.create(
                customer=request.user,
                customer_notes=request.data.get('customer_notes', '')
            )
            for item in cart.items.all():
                QuotationItem.objects.create(
                    quotation=quotation,
                    product=item.product,
                    quantity=item.quantity,
                    unit=item.unit,
                    additional_notes=item.additional_notes,
                    requested_price=item.target_price
                )
            cart.items.all().delete()
            
        serializer = QuotationSerializer(quotation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QuotationViewSet(viewsets.ModelViewSet):
    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return Quotation.objects.all()
        elif user.role == 'Sales':
            return Quotation.objects.filter(Q(sales_agent=user) | Q(sales_agent__isnull=True))
        return Quotation.objects.filter(customer=user)

    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        user = request.user
        items_data = request.data.get('items', [])
        customer_notes = request.data.get('notes', '')
        
        from catalog.models import Product
        with transaction.atomic():
            quotation = Quotation.objects.create(
                customer=user,
                customer_notes=customer_notes,
                status='Pending'
            )
            for item in items_data:
                product_name = item.get('name')
                product = Product.objects.filter(name__icontains=product_name).first() if product_name else None
                if not product and product_name:
                    product = Product.objects.create(
                        name=product_name,
                        specifications=item.get('grade', 'Standard'),
                        price=item.get('unitPrice', 100),
                        minimum_order_quantity=5,
                        availability_status='In Stock'
                    )
                if product:
                    QuotationItem.objects.create(
                        quotation=quotation,
                        product=product,
                        quantity=item.get('quantityKg', 1),
                        unit='KG',
                        requested_price=item.get('unitPrice', 100)
                    )
        serializer = self.get_serializer(quotation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def negotiate_price(self, request, pk=None):
        user = request.user
        if user.role not in ['Admin', 'Sales']:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        quotation = self.get_object()
        new_price = request.data.get('updated_price')
        remarks = request.data.get('remarks', '')
        
        if not new_price:
            return Response({"error": "updated_price is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        with transaction.atomic():
            NegotiationHistory.objects.create(
                quotation=quotation,
                previous_price=quotation.final_price,
                updated_price=new_price,
                updated_by=user,
                remarks=remarks
            )
            quotation.final_price = new_price
            quotation.status = 'Under Negotiation'
            quotation.save()
            
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def customer_action(self, request, pk=None):
        user = request.user
        quotation = self.get_object()
        
        if quotation.customer != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        action_type = request.data.get('action') # 'accept' or 'reject'
        if action_type == 'accept':
            quotation.status = 'Accepted by Customer'
            if quotation.sales_agent and quotation.sales_agent.email:
                try:
                    send_mail(
                        subject=f"Quotation #{quotation.id} Accepted by Customer",
                        message=f"Hello {quotation.sales_agent.first_name or 'Sales Representative'},\n\nQuotation #{quotation.id} has been Accepted by {quotation.customer}.\n\nYou can proceed with converting this quotation into an order.\n\nRegards,\nMadhav Pharma Industries",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[quotation.sales_agent.email],
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"[Email Alert Error] {e}")
        elif action_type == 'reject':
            quotation.status = 'Rejected by Customer'
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
            
        quotation.save()
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def sales_action(self, request, pk=None):
        user = request.user
        if user.role not in ['Admin', 'Sales']:
            return Response(status=status.HTTP_403_FORBIDDEN)
        quotation = self.get_object()
        action_type = request.data.get('action')  # 'approve', 'reject', or 'negotiate'
        if action_type == 'approve':
            quotation.status = 'Approved by Sales'
            if not quotation.sales_agent:
                quotation.sales_agent = user
            quotation.save()
        elif action_type == 'reject':
            quotation.status = 'Rejected by Customer'
            if not quotation.sales_agent:
                quotation.sales_agent = user
            quotation.save()
        elif action_type == 'negotiate':
            new_price = request.data.get('updated_price')
            remarks = request.data.get('remarks', '')
            if new_price:
                with transaction.atomic():
                    NegotiationHistory.objects.create(
                        quotation=quotation,
                        previous_price=quotation.final_price,
                        updated_price=new_price,
                        updated_by=user,
                        remarks=remarks
                    )
                    quotation.final_price = new_price
            quotation.status = 'Under Negotiation'
            if not quotation.sales_agent:
                quotation.sales_agent = user
            quotation.save()
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'])
    def assign_sales(self, request, pk=None):
        if request.user.role != 'Admin':
            return Response({"error": "Only Admin can assign sales agents"}, status=status.HTTP_403_FORBIDDEN)
        quotation = self.get_object()
        sales_agent_id = request.data.get('sales_agent_id')
        if not sales_agent_id:
            return Response({"error": "sales_agent_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        quotation.sales_agent_id = sales_agent_id
        quotation.save()
        return Response(QuotationSerializer(quotation).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        if request.user.role not in ['Admin', 'Sales']:
            return Response(status=status.HTTP_403_FORBIDDEN)
        quotation = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            quotation.status = new_status
            quotation.save()
            ActivityLog.objects.create(
                sales_person=request.user,
                order_id=f"Quote #{quotation.id}",
                description=f"Status updated to {new_status}",
                status=new_status
            )
            if new_status == 'Approved by Sales' and quotation.customer and quotation.customer.email:
                try:
                    send_mail(
                        subject=f"Quotation #{quotation.id} Approved by Sales",
                        message=f"Hello,\n\nYour quotation request #{quotation.id} has been Approved by Sales!\n\nPlease log in to your Customer Portal to review the approved pricing and accept the quote.\n\nRegards,\nMadhav Pharma Industries",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[quotation.customer.email],
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"[Email Alert Error] {e}")
        return Response(QuotationSerializer(quotation).data)

