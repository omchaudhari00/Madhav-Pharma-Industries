from rest_framework import serializers
from .models import Payment, Invoice, Order
from accounts.serializers import UserSerializer, AddressSerializer

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = [
            'payment_id', 'amount', 'status', 'payment_method',
            'signature_verified', 'transaction_reference', 'payment_date'
        ]

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['invoice_number', 'total_amount', 'invoice_date']

class OrderSerializer(serializers.ModelSerializer):
    customer_details = UserSerializer(source='customer', read_only=True)
    shipping_address_details = AddressSerializer(source='shipping_address', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = [
            'order_number', 'customer', 'quotation', 'payment', 'invoice',
            'total_amount', 'created_at', 'updated_at'
        ]

