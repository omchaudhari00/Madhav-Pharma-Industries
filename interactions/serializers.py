from rest_framework import serializers
from .models import Review, Notification, ActivityLog
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

class ActivityLogSerializer(serializers.ModelSerializer):
    sales_person_name = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = '__all__'

    def get_sales_person_name(self, obj):
        if obj.sales_person:
            return f"{obj.sales_person.first_name} {obj.sales_person.last_name}".strip() or obj.sales_person.email
        return "Unknown"
