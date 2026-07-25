from rest_framework import serializers
from .models import User, CustomerProfile, Address
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'mobile_number', 'role', 'first_name', 'last_name', 'is_verified']

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
