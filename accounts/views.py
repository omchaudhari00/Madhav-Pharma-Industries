from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import time
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from django.contrib.auth.hashers import check_password

from .models import User, CustomerProfile, OTPRecord, Address
from .serializers import (
    CheckUserSerializer, LoginSerializer, 
    RegistrationRequestSerializer, OTPVerificationSerializer,
    UserSerializer, CustomerProfileSerializer, AddressSerializer
)
from .permissions import IsAdminUser, IsSalesUser, IsAdminOrSalesUser
from .captcha import generate_captcha, verify_captcha

# Pre-computed Argon2 hash used for constant-time comparisons when a user is not found
DUMMY_ARGON2_HASH = (
    "argon2$argon2id$v=19$m=102400,t=2,p=8$TFBSWkZVTzdBaWVBcmxtN24xVjZTaQ$QcZTyoWpmz+6mj8GLsF7KOGFRXbzC2uPeY8IdYvO7gI"
)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CaptchaChallengeView(APIView):
    """
    Returns a cryptographically signed human-verification puzzle.
    Used as an anti-bot fallback when failed attempts are detected.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def get(self, request):
        return Response({"captcha": generate_captcha()})

class CheckUserView(APIView):
    """
    Decommissioned to eliminate user enumeration. Always returns a neutral response.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        return Response({"message": "Endpoint decommissioned for security compliance."})

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": "Please provide a valid email and password."}, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['identifier'].strip()
        password = serializer.validated_data['password']
        captcha_token = serializer.validated_data.get('captcha_token', '').strip()
        captcha_answer = serializer.validated_data.get('captcha_answer', '').strip()

        user = User.objects.filter(email__iexact=identifier.lower()).first() or \
               User.objects.filter(mobile_number=identifier).first()

        # 1. Check account lockout if user exists
        if user and user.is_locked():
            lockout_time = user.locked_until.strftime("%H:%M UTC") if user.locked_until else "15 minutes"
            return Response({
                "error": f"Account is temporarily locked due to excessive failed sign-in attempts. Please try again after {lockout_time} or reset your password.",
                "locked": True
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # 2. Check if CAPTCHA verification is required (after 3 failed attempts)
        captcha_threshold = getattr(settings, 'AUTH_CAPTCHA_THRESHOLD', 3)
        if user and user.failed_login_attempts >= captcha_threshold:
            if not captcha_token or not captcha_answer:
                return Response({
                    "error": "Security verification required. Please solve the challenge to sign in.",
                    "requires_captcha": True,
                    "captcha": generate_captcha()
                }, status=status.HTTP_400_BAD_REQUEST)
            
            is_valid_captcha, captcha_err = verify_captcha(captcha_token, captcha_answer)
            if not is_valid_captcha:
                return Response({
                    "error": captcha_err,
                    "requires_captcha": True,
                    "captcha": generate_captcha()
                }, status=status.HTTP_400_BAD_REQUEST)

        # 3. Validate password with timing attack normalization
        if user:
            is_valid_pw = user.check_password(password)
        else:
            # Run against dummy Argon2 hash to normalize response timing to ~50-100ms
            check_password(password, DUMMY_ARGON2_HASH)
            is_valid_pw = False

        if not is_valid_pw:
            if user:
                user.increment_failed_attempts()
                if user.is_locked():
                    return Response({
                        "error": "Account has been temporarily locked for 15 minutes due to 5 consecutive failed attempts.",
                        "locked": True
                    }, status=status.HTTP_429_TOO_MANY_REQUESTS)
                if user.failed_login_attempts >= captcha_threshold:
                    return Response({
                        "error": "Invalid credentials. Security verification challenge required.",
                        "requires_captcha": True,
                        "captcha": generate_captcha()
                    }, status=status.HTTP_401_UNAUTHORIZED)

            return Response({
                "error": "Invalid credentials. Please check your email and password."
            }, status=status.HTTP_401_UNAUTHORIZED)

        # 4. Check active and verified status (Strict server-side verification requirement)
        if not user.is_active:
            return Response({
                "error": "This account is inactive. Please contact support at contact@madhavpharmaindustries.com."
            }, status=status.HTTP_403_FORBIDDEN)

        if not user.is_verified:
            return Response({
                "error": "Please verify your email address before signing in. Check your inbox for your verification code.",
                "unverified": True
            }, status=status.HTTP_403_FORBIDDEN)

        # 5. Successful login: reset lockout counters
        user.reset_lockout()
        tokens = get_tokens_for_user(user)
        return Response({
            "message": "Login successful",
            "tokens": tokens,
            "user": UserSerializer(user).data
        })

class RequestOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = RegistrationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0] if serializer.errors else "Invalid registration details."
            return Response({"error": str(first_error), "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email', '').strip().lower()
        mobile_number = serializer.validated_data.get('mobile_number', '').strip()

        # Check if account already exists (Anti-Enumeration: return identical message and notify user)
        existing_user = User.objects.filter(email__iexact=email).first() or \
                        User.objects.filter(mobile_number=mobile_number).first()

        if existing_user:
            # Anti-Enumeration: Send email to existing account notifying them of registration attempt
            subject = "Madhav Pharma Industries - Registration Attempt Notification"
            message = (
                f"Hello,\n\n"
                f"Someone recently attempted to register a new account using this email address at Madhav Pharma Industries.\n\n"
                f"If you already have an account, you can sign in directly or use our password reset page if you have forgotten your credentials.\n\n"
                f"If this was not you, no action is needed and your account remains secure.\n\n"
                f"Regards,\nMadhav Pharma Industries"
            )
            try:
                if existing_user.email:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[existing_user.email],
                        fail_silently=True,
                    )
            except Exception as e:
                print(f"[Email Notification Error]: {e}")

            # Return identical response to prevent enumeration
            return Response({
                "message": "If this email address is eligible for registration, a 6-digit verification code has been sent."
            }, status=status.HTTP_200_OK)

        # User does not exist: create cryptographically hashed OTP record
        record, raw_otp = OTPRecord.create_otp(
            email=email,
            mobile_number=mobile_number,
            purpose='registration',
            validity_minutes=10
        )

        subject = "Madhav Pharma Industries - Your Verification Code"
        message = (
            f"Hello,\n\n"
            f"Your 6-digit registration verification code is: {raw_otp}\n\n"
            f"This code is valid for 10 minutes and can only be used once. Do not share this code with anyone.\n\n"
            f"Regards,\nMadhav Pharma Industries"
        )
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
            return Response({"error": "Failed to send verification code. Please check server email service."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "If this email address is eligible for registration, a 6-digit verification code has been sent."
        }, status=status.HTTP_200_OK)

class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        mobile_number = request.data.get('mobile_number', '').strip()

        if not email and not mobile_number:
            return Response({"error": "Email or mobile number is required to resend OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # Anti-enumeration check
        existing_user = User.objects.filter(email__iexact=email).first() if email else None
        if not existing_user and mobile_number:
            existing_user = User.objects.filter(mobile_number=mobile_number).first()

        if existing_user:
            # Simulate timing and return generic response
            time.sleep(0.3)
            return Response({
                "message": "If this email address is eligible for registration, a new verification code has been sent."
            }, status=status.HTTP_200_OK)

        record, raw_otp = OTPRecord.create_otp(
            email=email,
            mobile_number=mobile_number,
            purpose='registration',
            validity_minutes=10
        )

        subject = "Madhav Pharma Industries - Your Verification Code (Resend)"
        message = (
            f"Hello,\n\n"
            f"Your new 6-digit verification code is: {raw_otp}\n\n"
            f"This code is valid for 10 minutes. Do not share this code with anyone.\n\n"
            f"Regards,\nMadhav Pharma Industries"
        )
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
            print(f"[Email Error] Failed to resend OTP to {email}: {e}")
            return Response({"error": "Failed to send verification code."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "If this email address is eligible for registration, a new verification code has been sent."
        }, status=status.HTTP_200_OK)

class VerifyOTPAndRegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0] if serializer.errors else "Invalid verification details."
            return Response({"error": str(first_error), "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email', '').strip().lower()
        mobile_number = serializer.validated_data.get('mobile_number', '').strip()
        otp = serializer.validated_data['otp'].strip()

        # Find latest active OTP record
        record_query = Q(purpose='registration', is_used=False, expires_at__gte=timezone.now())
        if email:
            record_query &= Q(email__iexact=email)
        elif mobile_number:
            record_query &= Q(mobile_number=mobile_number)

        record = OTPRecord.objects.filter(record_query).order_by('-created_at').first()
        if not record or not record.verify(otp):
            return Response({
                "error": "Invalid or expired verification code. Please request a new code."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        if (email and User.objects.filter(email__iexact=email).exists()) or \
           (mobile_number and User.objects.filter(mobile_number=mobile_number).exists()):
            return Response({
                "error": "An account with these credentials already exists. Please sign in instead."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create user with Argon2 password hashing and verified status
        user = User.objects.create_user(
            email=email if email else None,
            mobile_number=mobile_number if mobile_number else None,
            password=serializer.validated_data['password'],
            first_name=serializer.validated_data.get('first_name', '').strip(),
            last_name=serializer.validated_data.get('last_name', '').strip(),
            role='Customer',
            is_verified=True,
            is_active=True
        )

        profile = CustomerProfile.objects.create(user=user)
        address_text = serializer.validated_data.get('address', '').strip()
        city = serializer.validated_data.get('city', '').strip()
        state = serializer.validated_data.get('state', '').strip()
        postal_code = serializer.validated_data.get('postal_code', '').strip()

        if address_text or city or postal_code:
            Address.objects.create(
                customer=profile,
                address_line_1=address_text or 'Not provided',
                city=city or 'Not provided',
                state=state or 'Not provided',
                postal_code=postal_code or 'Not provided',
                country='India',
                is_default=True
            )

        tokens = get_tokens_for_user(user)
        return Response({
            "message": "Registration successful. Welcome to Madhav Pharma Industries.",
            "tokens": tokens,
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


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
        payment_rev_result = Payment.objects.filter(status__in=['Completed', 'Paid']).aggregate(total=Sum('amount'))
        payment_rev = payment_rev_result['total'] or Decimal('0.00')
        
        order_rev_result = Order.objects.exclude(status='Cancelled').aggregate(total=Sum('total_amount'))
        order_rev = order_rev_result['total'] or Decimal('0.00')
        
        total_revenue = float(max(payment_rev, order_rev))

        total_transactions = max(
            Payment.objects.filter(status__in=['Completed', 'Paid']).count(),
            Order.objects.exclude(status='Cancelled').count()
        )
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
        assigned_to = request.query_params.get('assigned_to', None)
        queryset = User.objects.all().order_by('-id')

        # If a sales rep requests users without admin privileges, show their assigned customers
        if request.user.role == 'Sales' and request.query_params.get('all') != 'true':
            queryset = queryset.filter(assigned_sales_person=request.user)

        if role_filter:
            queryset = queryset.filter(role__iexact=role_filter.strip())

        if assigned_to:
            if assigned_to == 'unassigned':
                queryset = queryset.filter(assigned_sales_person__isnull=True)
            elif assigned_to.isdigit():
                queryset = queryset.filter(assigned_sales_person_id=int(assigned_to))

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

class AssignCustomersView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, sales_user_id):
        sales_user = User.objects.filter(id=sales_user_id, role='Sales').first()
        if not sales_user:
            return Response({"error": "Sales representative not found."}, status=status.HTTP_404_NOT_FOUND)

        customer_ids = request.data.get('customer_ids', [])
        if not isinstance(customer_ids, list):
            return Response({"error": "customer_ids must be a list of customer IDs."}, status=status.HTTP_400_BAD_REQUEST)

        # Unassign customers currently assigned to this sales user if not in new list
        User.objects.filter(assigned_sales_person=sales_user).exclude(id__in=customer_ids).update(assigned_sales_person=None)

        # Assign selected customers
        if customer_ids:
            User.objects.filter(id__in=customer_ids, role='Customer').update(assigned_sales_person=sales_user)

        # Refresh and return sales user data with updated counts
        sales_user.refresh_from_db()
        return Response({
            "success": True,
            "message": f"Successfully assigned {len(customer_ids)} customers to {sales_user.first_name or sales_user.email}.",
            "sales_user": UserSerializer(sales_user).data
        })

class ToggleSalesUserStatusView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, sales_user_id):
        sales_user = User.objects.filter(id=sales_user_id, role='Sales').first()
        if not sales_user:
            return Response({"error": "Sales representative not found."}, status=status.HTTP_404_NOT_FOUND)

        sales_user.is_active = not sales_user.is_active
        sales_user.save(update_fields=['is_active'])

        action_str = "Restored" if sales_user.is_active else "Revoked"
        return Response({
            "success": True,
            "message": f"Access has been {action_str.lower()} for {sales_user.first_name or sales_user.email}.",
            "sales_user": UserSerializer(sales_user).data
        })

class ForgotPasswordRequestOTPView(APIView):
    """
    Step 1: User provides their registered email or phone number.
    Anti-Enumeration: returns identical 200 response and uniform timing whether account exists or not.
    Cryptographic OTP: stores SHA-256 hash, valid for 15 minutes, single-use.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        identifier = request.data.get('identifier', '').strip().lower()

        if not identifier:
            return Response({'error': 'Please enter your email address or mobile number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the user by email or mobile number
        user = User.objects.filter(email__iexact=identifier).first() or \
               User.objects.filter(mobile_number=identifier).first()

        if user and user.email:
            record, raw_otp = OTPRecord.create_otp(
                email=user.email,
                mobile_number=user.mobile_number or '',
                user=user,
                purpose='password_reset',
                validity_minutes=15
            )

            # Send OTP email
            subject = "Madhav Pharma Industries - Password Reset Code"
            message = (
                f"Hello {user.first_name or 'Valued Customer'},\n\n"
                f"Your single-use password reset verification code is: {raw_otp}\n\n"
                f"This code is valid for 15 minutes. It can only be used once.\n"
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
                # Internal log; do not leak failure or user existence to caller

        else:
            # Timing attack mitigation: simulate email dispatch latency
            time.sleep(0.35)

        # Anti-enumeration: exact same response regardless of user existence, NO leaked email_hint
        return Response({
            'message': 'If an account exists with this email address or phone number, a 6-digit password reset code has been sent.'
        }, status=status.HTTP_200_OK)


class ForgotPasswordResetView(APIView):
    """
    Step 2: User provides the OTP and a new password.
    Validates single-use hashed OTP, updates password with Argon2, resets lockouts,
    and invalidates all remaining OTP records for this user.
    """
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        identifier = request.data.get('identifier', '').strip().lower()
        otp = request.data.get('otp', '').strip()
        new_password = request.data.get('new_password', '')

        if not identifier or not otp or not new_password:
            return Response({'error': 'Email/phone, verification code, and new password are all required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the user
        user = User.objects.filter(email__iexact=identifier).first() or \
               User.objects.filter(mobile_number=identifier).first()

        if not user:
            # Timing attack mitigation
            check_password(new_password, DUMMY_ARGON2_HASH)
            return Response({'error': 'Invalid or expired verification code. Please request a new code.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify OTP record across email and/or mobile_number
        record_query = Q(purpose='password_reset', is_used=False, expires_at__gte=timezone.now())
        if user.email:
            record_query &= Q(email__iexact=user.email)
        else:
            record_query &= Q(mobile_number=user.mobile_number)

        record = OTPRecord.objects.filter(record_query).order_by('-created_at').first()

        if not record or not record.verify(otp):
            return Response({'error': 'Invalid or expired verification code. Please request a new code.'}, status=status.HTTP_400_BAD_REQUEST)

        # Invalidate all remaining active OTPs for this user
        OTPRecord.objects.filter(user=user, is_used=False).update(is_used=True)

        # Update password using Argon2 slow KDF
        user.set_password(new_password)
        # Clear lockout counters
        user.reset_lockout()
        user.save()

        return Response({'message': 'Password has been reset successfully. You can now sign in with your new password.'}, status=status.HTTP_200_OK)



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

