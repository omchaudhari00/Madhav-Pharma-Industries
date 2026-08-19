from rest_framework import status, viewsets
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
    UserSerializer, CustomerProfileSerializer, AddressSerializer
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
    throttle_scope = 'auth'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier'].strip()
            password = serializer.validated_data['password']
            
            user = User.objects.filter(email__iexact=identifier.lower()).first() or User.objects.filter(mobile_number=identifier).first()
            
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
    throttle_scope = 'auth'

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
            email_sent = True
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
                return Response({"error": f"Server Email Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                "message": "OTP sent successfully to your email. Please verify."
            })
        first_error = next(iter(serializer.errors.values()))[0] if serializer.errors else "Invalid registration details."
        return Response({"error": str(first_error), "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        mobile_number = request.data.get('mobile_number', '').strip()

        if not email and not mobile_number:
            return Response({"error": "Email or mobile number is required to resend OTP."}, status=status.HTTP_400_BAD_REQUEST)

        if email and User.objects.filter(email__iexact=email).exists():
            return Response({"error": "An account with this email address already exists. Please sign in instead."}, status=status.HTTP_400_BAD_REQUEST)
        if mobile_number and User.objects.filter(mobile_number=mobile_number).exists():
            return Response({"error": "An account with this phone number already exists. Please use a different phone number or sign in."}, status=status.HTTP_400_BAD_REQUEST)

        # Invalidate previous unused OTP records for this email/mobile
        OTPRecord.objects.filter(
            email=email,
            mobile_number=mobile_number,
            is_used=False
        ).update(is_used=True)

        # Generate fresh OTP
        otp = str(random.randint(100000, 999999))
        OTPRecord.objects.create(
            email=email,
            mobile_number=mobile_number,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        subject = "Madhav Pharma Industries - Your Verification OTP (Resend)"
        message = f"Hello,\n\nYour new 6-digit verification code is: {otp}\n\nThis OTP is valid for 10 minutes. Do not share this code with anyone.\n\nRegards,\nMadhav Pharma Industries"
        email_sent = True
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
            print(f"[Email Error] Failed to resend OTP email to {email}: {e}")
            return Response({"error": "Failed to send OTP to your email. Please ensure the server email configuration is correct."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "A new OTP has been sent to your email."
        })

class VerifyOTPAndRegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

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
            city = serializer.validated_data.get('city', '').strip()
            state = serializer.validated_data.get('state', '').strip()
            postal_code = serializer.validated_data.get('postal_code', '').strip()
            
            if address_text or city or postal_code:
                Address.objects.create(
                    customer=profile,
                    address_line_1=address_text,
                    city=city,
                    state=state,
                    postal_code=postal_code,
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
        from django.db.models import Sum
        from orders.models import Order, Payment
        from quotations.models import Quotation

        total_customers = User.objects.filter(role='Customer').count()
        leads_count = CustomerProfile.objects.filter(customer_stage='Lead').count()
        customers_count = CustomerProfile.objects.filter(customer_stage='Customer').count()
        sales_count = User.objects.filter(role='Sales').count()

        # Real Financial & Order Analytics from Database
        total_revenue_result = Payment.objects.filter(status='Completed').aggregate(total=Sum('amount'))
        total_revenue = float(total_revenue_result['total'] or 0)

        total_transactions = Payment.objects.filter(status='Completed').count()
        total_orders = Order.objects.exclude(status='Cancelled').count()
        active_orders = Order.objects.filter(status__in=['Pending', 'Processing', 'Preparing in Stock', 'Confirmed', 'Shipped']).count()
        pending_quotes = Quotation.objects.filter(status__in=['Pending', 'Under Negotiation']).count()
        
        conversion_rate = 0.0
        if total_customers > 0:
            conversion_rate = round((customers_count / total_customers) * 100, 1)

        return Response({
            "total_revenue": total_revenue,
            "total_transactions": total_transactions,
            "total_orders": total_orders,
            "active_orders": active_orders,
            "pending_quotes": pending_quotes,
            "conversion_rate": conversion_rate,
            "total_users": total_customers,
            "leads_count": leads_count,
            "customers_count": customers_count,
            "sales_count": sales_count,
            "message": "Live admin dashboard statistics calculated successfully"
        })

class UserListView(APIView):
    permission_classes = [IsAdminOrSalesUser]

    def get(self, request):
        role_filter = request.query_params.get('role', None)
        queryset = User.objects.all().order_by('-id')
        if role_filter:
            queryset = queryset.filter(role__iexact=role_filter.strip())
        data = UserSerializer(queryset, many=True).data
        return Response(data)

class ManageSalesUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get('email', '').strip()
        mobile = request.data.get('mobile_number', '').strip()
        password = request.data.get('password', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        
        if not email or not mobile:
            return Response({"error": "Email and mobile number are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not password or len(password) < 8:
            return Response({"error": "A secure password of at least 8 characters is required for Sales accounts."}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email__iexact=email.lower()).exists():
            return Response({"error": "A user with this email address already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(mobile_number=mobile).exists():
            return Response({"error": "A user with this mobile number already exists."}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.create_user(
            email=email.lower(),
            mobile_number=mobile,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='Sales',
            is_verified=True
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class ForgotPasswordRequestOTPView(APIView):
    """
    Step 1: User provides their registered email or phone number.
    A 6-digit OTP is generated and emailed to them.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        identifier = request.data.get('identifier', '').strip().lower()

        if not identifier:
            return Response({'error': 'Please enter your email address or mobile number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the user by email or mobile number
        user = User.objects.filter(email__iexact=identifier).first()
        if not user:
            user = User.objects.filter(mobile_number=identifier.strip()).first()

        if not user:
            return Response({'error': 'No account found with this email address or mobile number.'}, status=status.HTTP_404_NOT_FOUND)

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        OTPRecord.objects.create(
            email=user.email or '',
            mobile_number=user.mobile_number or '',
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        if user.email:
            # Send OTP email
            subject = "Madhav Pharma Industries - Password Reset OTP"
            message = (
                f"Hello {user.first_name or 'Valued Customer'},\n\n"
                f"Your password reset verification code is: {otp}\n\n"
                f"This OTP is valid for 10 minutes. Do not share this code with anyone.\n"
                f"If you did not request a password reset, please ignore this email.\n\n"
                f"Regards,\nMadhav Pharma Industries"
            )
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"[Email Error] Failed to send password reset OTP to {user.email}: {e}")
                return Response({'error': f'Failed to send OTP email. Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                'message': 'A password reset OTP has been sent to your registered email address.',
                'email_hint': user.email[:3] + '***' + user.email[user.email.index('@'):]
            })
        else:
            return Response({
                'message': 'A password reset OTP has been generated for your registered mobile number.',
                'mobile_hint': '******' + (user.mobile_number[-4:] if user.mobile_number and len(user.mobile_number) >= 4 else '')
            })


class ForgotPasswordResetView(APIView):
    """
    Step 2: User provides the OTP and a new password.
    If the OTP is valid, the password is updated.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        identifier = request.data.get('identifier', '').strip().lower()
        otp = request.data.get('otp', '').strip()
        new_password = request.data.get('new_password', '')

        if not identifier or not otp or not new_password:
            return Response({'error': 'Email/phone, OTP, and new password are all required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the user
        user = User.objects.filter(email__iexact=identifier).first()
        if not user:
            user = User.objects.filter(mobile_number=identifier.strip()).first()

        if not user:
            return Response({'error': 'No account found with this email address or mobile number.'}, status=status.HTTP_404_NOT_FOUND)

        # Verify OTP across email and/or mobile_number
        otp_filter = Q(otp=otp, is_used=False, expires_at__gte=timezone.now())
        if user.email:
            otp_filter &= (Q(email__iexact=user.email) | Q(mobile_number=user.mobile_number or ''))
        else:
            otp_filter &= Q(mobile_number=user.mobile_number)

        record = OTPRecord.objects.filter(otp_filter).first()

        if not record:
            return Response({'error': 'Invalid or expired OTP. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used
        record.is_used = True
        record.save()

        # Update password
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password has been reset successfully. You can now sign in with your new password.'})


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'customer_profile'):
            return Address.objects.filter(customer=user.customer_profile)
        return Address.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'customer_profile'):
            CustomerProfile.objects.create(user=user)
        # Ensure only one default address
        is_default = serializer.validated_data.get('is_default', False)
        if is_default:
            Address.objects.filter(customer=user.customer_profile).update(is_default=False)
            
        serializer.save(customer=user.customer_profile)

    def perform_update(self, serializer):
        user = self.request.user
        is_default = serializer.validated_data.get('is_default', False)
        if is_default:
            Address.objects.filter(customer=user.customer_profile).update(is_default=False)
        serializer.save()

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'mobile_number' in data:
            new_mobile = data['mobile_number'].strip()
            if new_mobile and new_mobile != user.mobile_number:
                if User.objects.filter(mobile_number=new_mobile).exclude(pk=user.pk).exists():
                    return Response({'error': 'This phone number is already linked to another account.'}, status=status.HTTP_400_BAD_REQUEST)
            user.mobile_number = new_mobile
        user.save()
        return Response({'message': 'Profile updated successfully', 'user': UserSerializer(user).data})

