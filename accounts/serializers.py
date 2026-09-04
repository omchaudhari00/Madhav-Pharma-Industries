from rest_framework import serializers
from .models import User, CustomerProfile, Address
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

class UserSerializer(serializers.ModelSerializer):
    customer_stage = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    orders_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    assigned_sales_person_name = serializers.SerializerMethodField()
    assigned_customers_count = serializers.SerializerMethodField()
    closed_deals_count = serializers.SerializerMethodField()
    active_quotes_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'mobile_number', 'role', 'first_name', 'last_name',
            'is_verified', 'is_active', 'customer_stage', 'address',
            'orders_count', 'total_spent',
            'assigned_sales_person', 'assigned_sales_person_name',
            'assigned_customers_count', 'closed_deals_count', 'active_quotes_count'
        ]

    def get_customer_stage(self, obj):
        if hasattr(obj, 'customer_profile'):
            obj.customer_profile.check_and_update_stage()
            return obj.customer_profile.customer_stage
        return 'Customer' if obj.role == 'Customer' else obj.role

    def get_address(self, obj):
        if hasattr(obj, 'customer_profile'):
            addr = obj.customer_profile.addresses.filter(is_default=True).first() or obj.customer_profile.addresses.first()
            if addr:
                return addr.address_line_1
        return ''

    def get_orders_count(self, obj):
        from orders.models import Order
        from django.db.models import Q
        return Order.objects.filter(
            Q(customer=obj) | Q(customer_email__iexact=obj.email)
        ).exclude(status='Cancelled').count()

    def get_total_spent(self, obj):
        from orders.models import Order
        from django.db.models import Q, Sum
        result = Order.objects.filter(
            Q(customer=obj) | Q(customer_email__iexact=obj.email)
        ).exclude(status='Cancelled').aggregate(total=Sum('total_amount'))
        return float(result['total'] or 0)

    def get_assigned_sales_person_name(self, obj):
        if obj.assigned_sales_person:
            name = f"{obj.assigned_sales_person.first_name} {obj.assigned_sales_person.last_name}".strip()
            return name or obj.assigned_sales_person.email or f"Sales Rep #{obj.assigned_sales_person.id}"
        return None

    def get_assigned_customers_count(self, obj):
        if obj.role == 'Sales':
            return obj.assigned_customers.count()
        return 0

    def get_closed_deals_count(self, obj):
        if obj.role == 'Sales':
            from orders.models import Order
            from django.db.models import Q
            assigned_ids = list(obj.assigned_customers.values_list('id', flat=True))
            assigned_emails = list(obj.assigned_customers.exclude(email__isnull=True).values_list('email', flat=True))
            if not assigned_ids and not assigned_emails:
                return 0
            return Order.objects.filter(
                Q(customer_id__in=assigned_ids) | Q(customer_email__in=assigned_emails)
            ).exclude(status='Cancelled').count()
        return 0

    def get_active_quotes_count(self, obj):
        if obj.role == 'Sales':
            from quotations.models import Quotation
            assigned_ids = list(obj.assigned_customers.values_list('id', flat=True))
            if not assigned_ids:
                return 0
            return Quotation.objects.filter(
                customer_id__in=assigned_ids,
                status__in=['Pending', 'Under Negotiation', 'Approved by Sales', 'Counter Offer by Sales', 'Pending Approval']
            ).count()
        return 0


class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = CustomerProfile
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['customer']

class CheckUserSerializer(serializers.Serializer):
    identifier = serializers.CharField()

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)
    captcha_token = serializers.CharField(required=False, allow_blank=True)
    captcha_answer = serializers.CharField(required=False, allow_blank=True)

class RegistrationRequestSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField()
    mobile_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    captcha_token = serializers.CharField(required=False, allow_blank=True)
    captcha_answer = serializers.CharField(required=False, allow_blank=True)

    def validate_password(self, value):
        if len(value) > 100:
            raise serializers.ValidationError("Password must be a maximum of 100 characters.")
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages)[0])
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_mobile_number(self, value):
        return value.strip()

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    mobile_number = serializers.CharField(required=False)
    otp = serializers.CharField(max_length=6)
    
    # Store registration details temporarily
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        return value.strip().lower() if value else ''

    def validate_mobile_number(self, value):
        return value.strip() if value else ''
