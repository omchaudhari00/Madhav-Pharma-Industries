from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
import hashlib
import hmac
import secrets

class CustomUserManager(BaseUserManager):
    def create_user(self, email=None, mobile_number=None, password=None, **extra_fields):
        if not email and not mobile_number:
            raise ValueError(_("Users must have either an email or a mobile number"))
        
        if email:
            email = self.normalize_email(email)
            
        user = self.model(email=email, mobile_number=mobile_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'Admin')
        return self.create_user(email=email, password=password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True, null=True, blank=True)
    mobile_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Sales', 'Sales'),
        ('Customer', 'Customer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Customer')
    is_verified = models.BooleanField(default=False)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    assigned_sales_person = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_customers'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def is_locked(self):
        if self.locked_until and self.locked_until > timezone.now():
            return True
        return False

    def increment_failed_attempts(self):
        self.failed_login_attempts += 1
        max_attempts = getattr(settings, 'AUTH_LOCKOUT_MAX_ATTEMPTS', 5)
        lockout_duration = getattr(settings, 'AUTH_LOCKOUT_DURATION_MINUTES', 15)
        if self.failed_login_attempts >= max_attempts:
            self.locked_until = timezone.now() + timedelta(minutes=lockout_duration)
        self.save(update_fields=['failed_login_attempts', 'locked_until'])

    def reset_lockout(self):
        if self.failed_login_attempts > 0 or self.locked_until is not None:
            self.failed_login_attempts = 0
            self.locked_until = None
            self.save(update_fields=['failed_login_attempts', 'locked_until'])

    def __str__(self):
        return self.email or str(self.mobile_number)

class CustomerProfile(models.Model):
    STAGE_CHOICES = (
        ('Lead', 'Lead'),
        ('Customer', 'Customer'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_registration_number = models.CharField(max_length=100, blank=True, null=True)
    tax_id = models.CharField(max_length=100, blank=True, null=True)
    customer_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='Lead')
    
    def check_and_update_stage(self):
        if self.customer_stage == 'Lead' and hasattr(self.user, 'orders') and self.user.orders.exists():
            self.customer_stage = 'Customer'
            self.save(update_fields=['customer_stage'])
            return True
        return False
    
    def __str__(self):
        return f"{self.user}'s Profile ({self.customer_stage})"

class Address(models.Model):
    ADDRESS_TYPES = (
        ('Billing', 'Billing'),
        ('Shipping', 'Shipping'),
    )
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default='Shipping')
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.customer} - {self.address_type} - {self.city}"

class OTPRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps', null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    mobile_number = models.CharField(max_length=20, null=True, blank=True)
    otp_hash = models.CharField(max_length=64, default='')
    token_hash = models.CharField(max_length=64, null=True, blank=True)
    purpose = models.CharField(max_length=30, default='registration')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveIntegerField(default=0)
    is_used = models.BooleanField(default=False)

    @classmethod
    def generate_otp_code(cls):
        # Cryptographically secure 6-digit numerical token
        return str(secrets.randbelow(900000) + 100000)

    @staticmethod
    def hash_value(value: str) -> str:
        return hashlib.sha256(value.strip().encode('utf-8')).hexdigest()

    @classmethod
    def create_otp(cls, email=None, mobile_number=None, user=None, purpose='registration', validity_minutes=10):
        # Invalidate existing active OTPs for the same target & purpose
        q = models.Q(purpose=purpose, is_used=False)
        if email:
            q &= models.Q(email__iexact=email)
        elif mobile_number:
            q &= models.Q(mobile_number=mobile_number)
        cls.objects.filter(q).update(is_used=True)

        raw_otp = cls.generate_otp_code()
        otp_hash = cls.hash_value(raw_otp)
        record = cls.objects.create(
            user=user,
            email=email.lower().strip() if email else None,
            mobile_number=mobile_number.strip() if mobile_number else None,
            otp_hash=otp_hash,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=validity_minutes),
            is_used=False,
            attempts=0
        )
        return record, raw_otp

    def verify(self, raw_otp: str) -> bool:
        if self.is_used or timezone.now() > self.expires_at:
            return False
        
        self.attempts += 1
        if self.attempts > 3:
            # Exceeded maximum guess attempts for this OTP: burn it immediately
            self.is_used = True
            self.save(update_fields=['attempts', 'is_used'])
            return False

        hashed_input = self.hash_value(raw_otp)
        if hmac.compare_digest(self.otp_hash, hashed_input):
            self.is_used = True
            self.save(update_fields=['attempts', 'is_used'])
            return True

        self.save(update_fields=['attempts'])
        return False
    
    def __str__(self):
        return f"OTP ({self.purpose}) for {self.email or self.mobile_number}"

