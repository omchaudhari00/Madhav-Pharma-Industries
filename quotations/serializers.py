from rest_framework import serializers
from .models import QuoteCart, QuoteCartItem, Quotation, QuotationItem, NegotiationHistory
from catalog.serializers import ProductSerializer
from accounts.serializers import UserSerializer

class QuoteCartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    class Meta:
        model = QuoteCartItem
        fields = '__all__'
        read_only_fields = ['cart']

class QuoteCartSerializer(serializers.ModelSerializer):
    items = QuoteCartItemSerializer(many=True, read_only=True)
    class Meta:
        model = QuoteCart
        fields = '__all__'
        read_only_fields = ['customer']

class QuotationItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    class Meta:
        model = QuotationItem
        fields = '__all__'
        read_only_fields = ['quotation']

class NegotiationHistorySerializer(serializers.ModelSerializer):
    updated_by_details = UserSerializer(source='updated_by', read_only=True)
    class Meta:
        model = NegotiationHistory
        fields = '__all__'
        read_only_fields = ['quotation', 'previous_price', 'updated_by']

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    negotiation_history = NegotiationHistorySerializer(many=True, read_only=True)
    customer_details = UserSerializer(source='customer', read_only=True)
    sales_agent_details = UserSerializer(source='sales_agent', read_only=True)
    
    class Meta:
        model = Quotation
        fields = '__all__'
        read_only_fields = ['quotation_number', 'customer', 'status', 'created_at', 'updated_at']
