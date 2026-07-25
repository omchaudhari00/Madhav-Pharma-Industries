from rest_framework import serializers
from .models import Review, Notification
from accounts.serializers import UserSerializer
from catalog.serializers import ProductSerializer

class ReviewSerializer(serializers.ModelSerializer):
    customer_details = UserSerializer(source='customer', read_only=True)
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['is_approved', 'customer']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
