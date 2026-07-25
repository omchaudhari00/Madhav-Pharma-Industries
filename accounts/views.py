from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import random

from .models import User, CustomerProfile, OTPRecord
from .serializers import (
    CheckUserSerializer, LoginSerializer, 
    RegistrationRequestSerializer, OTPVerificationSerializer,
    UserSerializer, CustomerProfileSerializer
)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CheckUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckUserSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            user = User.objects.filter(email=identifier).first() or User.objects.filter(mobile_number=identifier).first()
            if user:
                return Response({"exists": True, "message": "User exists, please provide password."})
            return Response({"exists": False, "message": "User does not exist, proceed to registration."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            password = serializer.validated_data['password']
            
            user = User.objects.filter(email=identifier).first() or User.objects.filter(mobile_number=identifier).first()
            
            if user and user.check_password(password):
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful",
                    "tokens": tokens,
                    "user": UserSerializer(user).data
                })
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RequestOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            mobile_number = serializer.validated_data['mobile_number']
            
            if User.objects.filter(email=email).exists() or User.objects.filter(mobile_number=mobile_number).exists():
                return Response({"error": "User with this email or mobile already exists"}, status=status.HTTP_400_BAD_REQUEST)

            # Generate OTP (Mocked for now)
            otp = str(random.randint(100000, 999999))
            
            OTPRecord.objects.create(
                email=email,
                mobile_number=mobile_number,
                otp=otp,
                expires_at=timezone.now() + timedelta(minutes=10)
            )
            
            # TODO: Integrate actual Email/SMS provider here
            print(f"MOCK OTP for {email}/{mobile_number}: {otp}")
            
            return Response({"message": "OTP sent successfully. Please verify."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPAndRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            mobile_number = serializer.validated_data.get('mobile_number')
            otp = serializer.validated_data['otp']
            
            record = OTPRecord.objects.filter(
                email=email, 
                mobile_number=mobile_number, 
                otp=otp, 
                is_used=False,
                expires_at__gte=timezone.now()
            ).first()
            
            if not record:
                return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
                
            record.is_used = True
            record.save()
            
            # Create user
            user = User.objects.create_user(
                email=email,
                mobile_number=mobile_number,
                password=serializer.validated_data['password'],
                first_name=serializer.validated_data.get('first_name', ''),
                last_name=serializer.validated_data.get('last_name', ''),
                role='Customer',
                is_verified=True
            )
            
            CustomerProfile.objects.create(user=user)
            
            tokens = get_tokens_for_user(user)
            
            return Response({
                "message": "Registration successful",
                "tokens": tokens,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
