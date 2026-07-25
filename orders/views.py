from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
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
