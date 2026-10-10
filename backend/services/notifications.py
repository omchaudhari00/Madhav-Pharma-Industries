"""
Notification service for OTP delivery via Email (Resend) and SMS (Fast2SMS).

Environment variables required (set in Render dashboard):
  RESEND_API_KEY   — Resend API key (https://resend.com)
  FAST2SMS_API_KEY — Fast2SMS API key (https://fast2sms.com)
"""

import os
import logging
import requests
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Email via Django mail backend (Resend in production, console in dev)
# ---------------------------------------------------------------------------

def send_otp_email(to_email: str, otp: str, purpose: str = "registration") -> bool:
    """
    Send an OTP verification email.
    Returns True on success, False on failure.
    """
    if purpose == "password_reset":
        subject = "Madhav Pharma Industries - Password Reset Code"
        body = (
            f"Hello,\n\n"
            f"Your single-use password reset verification code is: {otp}\n\n"
            f"This code is valid for 15 minutes. Do not share it with anyone.\n"
            f"If you did not request a password reset, please ignore this email.\n\n"
            f"Regards,\nMadhav Pharma Industries"
        )
    else:
        subject = "Madhav Pharma Industries - Your Verification Code"
        body = (
            f"Hello,\n\n"
            f"Your 6-digit registration verification code is: {otp}\n\n"
            f"This code is valid for 10 minutes and can only be used once. "
            f"Do not share this code with anyone.\n\n"
            f"Regards,\nMadhav Pharma Industries"
        )

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        logger.info(f"[Email OTP] Sent to {to_email} for {purpose}")
        return True
    except Exception as e:
        logger.error(f"[Email OTP] Failed to send to {to_email}: {e}")
        return False


# ---------------------------------------------------------------------------
# SMS via Fast2SMS (India — free tier: ~100 SMS/month on free plan)
# ---------------------------------------------------------------------------

FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2"


def send_otp_sms(mobile_number: str, otp: str, purpose: str = "registration") -> bool:
    """
    Send an OTP via SMS using the Fast2SMS Quick SMS API.
    mobile_number should be a 10-digit Indian mobile number (with or without +91).
    Returns True on success, False on failure.
    """
    api_key = os.getenv("FAST2SMS_API_KEY", "")
    if not api_key:
        logger.warning("[SMS OTP] FAST2SMS_API_KEY not set. Skipping SMS.")
        return False

    # Normalise: strip +91 / 91 prefix, keep last 10 digits
    number = mobile_number.strip().lstrip("+")
    if number.startswith("91") and len(number) == 12:
        number = number[2:]
    if len(number) != 10 or not number.isdigit():
        logger.warning(f"[SMS OTP] Invalid mobile number format: {mobile_number}")
        return False

    if purpose == "password_reset":
        message = f"Your Madhav Pharma Industries password reset code is {otp}. Valid for 15 minutes. Do not share."
    else:
        message = f"Your Madhav Pharma Industries registration verification code is {otp}. Valid for 10 minutes. Do not share."

    try:
        response = requests.get(
            FAST2SMS_URL,
            params={
                "authorization": api_key,
                "message": message,
                "language": "english",
                "route": "q",           # Quick SMS (transactional-style)
                "numbers": number,
            },
            timeout=10,
        )
        result = response.json()
        if result.get("return") is True:
            logger.info(f"[SMS OTP] Sent to {number} for {purpose}")
            return True
        else:
            logger.error(f"[SMS OTP] Fast2SMS error for {number}: {result}")
            return False
    except Exception as e:
        logger.error(f"[SMS OTP] Request failed for {number}: {e}")
        return False


# ---------------------------------------------------------------------------
# Combined: send via all available channels
# ---------------------------------------------------------------------------

def send_otp(email: str = "", mobile_number: str = "", otp: str = "", purpose: str = "registration") -> bool:
    """
    Attempt to send OTP via email and/or SMS.
    Raises an exception if BOTH channels fail and at least one was attempted.
    Returns True if at least one channel succeeded.
    """
    email_ok = False
    sms_ok = False
    attempted = False

    if email:
        attempted = True
        email_ok = send_otp_email(email, otp, purpose)

    if mobile_number:
        attempted = True
        sms_ok = send_otp_sms(mobile_number, otp, purpose)

    if attempted and not email_ok and not sms_ok:
        raise RuntimeError("Failed to deliver OTP via any available channel.")

    return email_ok or sms_ok
