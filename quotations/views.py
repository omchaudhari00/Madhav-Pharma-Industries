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
            return Quotation.objects.filter(sales_agent=user)
        return Quotation.objects.filter(customer=user)

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
        elif action_type == 'reject':
            quotation.status = 'Rejected by Customer'
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
            
        quotation.save()
        return Response(QuotationSerializer(quotation).data)
