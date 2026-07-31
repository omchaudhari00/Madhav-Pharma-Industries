from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import random
from django.core.mail import send_mail
from django.conf import settings

from .models import User, CustomerProfile, OTPRecord, Address
from .serializers import (
    CheckUserSerializer, LoginSerializer, 
    RegistrationRequestSerializer, OTPVerificationSerializer,
    UserSerializer, CustomerProfileSerializer
)
from .permissions import IsAdminUser, IsSalesUser, IsAdminOrSalesUser

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
            identifier = serializer.validated_data['identifier'].strip()
            exists = User.objects.filter(email=identifier).exists() or \
                     User.objects.filter(mobile_number=identifier).exists()
            return Response({"exists": exists})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier'].strip()
            password = serializer.validated_data['password']
            
            # Hardcoded Admin credentials check
            if identifier == 'theom.chaudhari@gmail.com' and password == 'Omsc@990':
                user, _ = User.objects.get_or_create(
                    email='theom.chaudhari@gmail.com',
                    defaults={
                        'mobile_number': '9999999999',
                        'first_name': 'Om',
                        'last_name': 'Chaudhari',
                        'role': 'Admin',
                        'is_verified': True
                    }
                )
                user.role = 'Admin'
                user.first_name = 'Om'
                user.last_name = 'Chaudhari'
                user.set_password('Omsc@990')
                user.save()
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful",
                    "tokens": tokens,
                    "user": UserSerializer(user).data
                })

            # Hardcoded Sales credentials check
            if identifier == 'vatsaldevani2005@gmail.com' and password == 'iamvatsal2209':
                user, _ = User.objects.get_or_create(
                    email='vatsaldevani2005@gmail.com',
                    defaults={
                        'mobile_number': '8888888888',
                        'first_name': 'Vatsal',
                        'last_name': 'Devani',
                        'role': 'Sales',
                        'is_verified': True
                    }
                )
                user.role = 'Sales'
                user.first_name = 'Vatsal'
                user.last_name = 'Devani'
                user.set_password('iamvatsal2209')
                user.save()
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful",
                    "tokens": tokens,
                    "user": UserSerializer(user).data
                })
            
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
            email = serializer.validated_data.get('email', '').strip().lower()
            mobile_number = serializer.validated_data.get('mobile_number', '').strip()
            
            if User.objects.filter(email__iexact=email).exists():
                return Response({"error": "An account with this email address already exists. Please sign in instead."}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(mobile_number=mobile_number).exists():
                return Response({"error": "An account with this phone number already exists. Please use a different phone number or sign in."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate OTP (Mocked for now)
            otp = str(random.randint(100000, 999999))
            
            OTPRecord.objects.create(
                email=email,
                mobile_number=mobile_number,
                otp=otp,
                expires_at=timezone.now() + timedelta(minutes=10)
            )
            
            # Send OTP email using Django Gmail SMTP
            subject = "Madhav Pharma Industries - Your Verification OTP"
            message = f"Hello,\n\nYour 6-digit verification code is: {otp}\n\nThis OTP is valid for 10 minutes. Do not share this code with anyone.\n\nRegards,\nMadhav Pharma Industries"
            try:
                if email:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        fail_silently=False,
                    )
            except Exception as e:
                print(f"[Email Error] Failed to send OTP email to {email}: {e}")
                # Fallback print for local debugging
                print(f"MOCK OTP for {email}/{mobile_number}: {otp}")
            
            return Response({"message": "OTP sent successfully to your email. Please verify."})
        first_error = next(iter(serializer.errors.values()))[0] if serializer.errors else "Invalid registration details."
        return Response({"error": str(first_error), "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
            
            if email and User.objects.filter(email__iexact=email).exists():
                return Response({"error": "An account with this email address already exists. Please sign in instead."}, status=status.HTTP_400_BAD_REQUEST)
            if mobile_number and User.objects.filter(mobile_number=mobile_number).exists():
                return Response({"error": "An account with this phone number already exists. Please use a different phone number or sign in."}, status=status.HTTP_400_BAD_REQUEST)
            
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
            
            profile = CustomerProfile.objects.create(user=user)
            address_text = serializer.validated_data.get('address', '').strip()
            if address_text:
                Address.objects.create(
                    customer=profile,
                    address_line_1=address_text,
                    city='',
                    state='',
                    postal_code='',
                    country='India',
                    is_default=True
                )
            
            tokens = get_tokens_for_user(user)
            
            return Response({
                "message": "Registration successful",
                "tokens": tokens,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
            
        first_error = next(iter(serializer.errors.values()))[0] if serializer.errors else "Invalid verification details."
        return Response({"error": str(first_error), "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_customers = User.objects.filter(role='Customer').count()
        leads_count = CustomerProfile.objects.filter(customer_stage='Lead').count()
        customers_count = CustomerProfile.objects.filter(customer_stage='Customer').count()
        sales_count = User.objects.filter(role='Sales').count()
        return Response({
            "total_users": total_customers,
            "leads_count": leads_count,
            "customers_count": customers_count,
            "sales_count": sales_count,
            "message": "Admin dashboard statistics retrieved"
        })

class UserListView(APIView):
    permission_classes = [IsAdminOrSalesUser]

    def get(self, request):
        role_filter = request.query_params.get('role', None)
        queryset = User.objects.all()
        if role_filter:
            queryset = queryset.filter(role=role_filter)
        data = UserSerializer(queryset, many=True).data
        return Response(data)

class ManageSalesUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get('email')
        mobile = request.data.get('mobile_number')
        password = request.data.get('password', 'Sales@1234')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if User.objects.filter(email=email).exists() or User.objects.filter(mobile_number=mobile).exists():
            return Response({"error": "User with email or mobile already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.create_user(
            email=email,
            mobile_number=mobile,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='Sales',
            is_verified=True
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
