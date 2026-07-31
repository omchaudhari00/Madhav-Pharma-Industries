from rest_framework import serializers
from .models import User, CustomerProfile, Address
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class UserSerializer(serializers.ModelSerializer):
    customer_stage = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'mobile_number', 'role', 'first_name', 'last_name', 'is_verified', 'customer_stage']

    def get_customer_stage(self, obj):
        if hasattr(obj, 'customer_profile'):
            obj.customer_profile.check_and_update_stage()
            return obj.customer_profile.customer_stage
        return 'Customer' if obj.role == 'Customer' else obj.role

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

class RegistrationRequestSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField()
    mobile_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    mobile_number = serializers.CharField(required=False)
    otp = serializers.CharField(max_length=6)
    
    # Store registration details temporarily
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
