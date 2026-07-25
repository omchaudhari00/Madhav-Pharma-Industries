from rest_framework import serializers
from .models import Payment, Invoice, Order
from accounts.serializers import UserSerializer, AddressSerializer

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    customer_details = UserSerializer(source='customer', read_only=True)
    shipping_address_details = AddressSerializer(source='shipping_address', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
