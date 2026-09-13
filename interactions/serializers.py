from rest_framework import serializers
from .models import Review, Notification, ActivityLog

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'product', 'customer', 'customer_name', 'rating', 'comment', 'review_date']
        read_only_fields = ['customer']

    def get_customer_name(self, obj):
        name = f"{obj.customer.first_name} {obj.customer.last_name}".strip()
        return name if name else obj.customer.email.split('@')[0]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

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
