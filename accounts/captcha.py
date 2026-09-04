import time
import hmac
import hashlib
import json
import base64
import secrets
from django.conf import settings

# Memory cache for used tokens to prevent replay attacks
_USED_CAPTCHA_TOKENS = set()

def _cleanup_used_tokens():
    global _USED_CAPTCHA_TOKENS
    if len(_USED_CAPTCHA_TOKENS) > 5000:
        _USED_CAPTCHA_TOKENS.clear()

def generate_captcha():
    """
    Generates a cryptographically signed human-verification puzzle.
    Returns:
        dict: { 'captcha_token': str, 'question': str }
    """
    _cleanup_used_tokens()
    
    a = secrets.randbelow(40) + 10
    b = secrets.randbelow(30) + 5
    op = secrets.choice(['+', '-'])
    if op == '+':
        ans = a + b
        question = f"What is {a} + {b}?"
    else:
        if a < b:
            a, b = b, a
        ans = a - b
        question = f"What is {a} - {b}?"
    
    expires_at = int(time.time()) + 300 # 5 minutes validity
    nonce = secrets.token_hex(8)
    answer_hash = hashlib.sha256(str(ans).encode()).hexdigest()
    
    payload = {
        'exp': expires_at,
        'ans': answer_hash,
        'nonce': nonce,
    }
    
    payload_json = json.dumps(payload, separators=(',', ':'))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode()).decode()
    
    sig = hmac.new(
        settings.SECRET_KEY.encode(),
        payload_b64.encode(),
        hashlib.sha256
    ).hexdigest()
    
    token = f"{payload_b64}.{sig}"
    
    return {
        'captcha_token': token,
        'question': question,
    }

def verify_captcha(token: str, answer: str) -> tuple[bool, str]:
    """
    Verifies the provided answer against the signed captcha_token.
    Returns:
        (is_valid: bool, error_message: str)
    """
    if not token or not answer:
        return False, "Security verification challenge answer is required."
    
    parts = token.split('.')
    if len(parts) != 2:
        return False, "Invalid security verification token format."
    
    payload_b64, sig = parts[0], parts[1]
    
    # Verify HMAC signature
    expected_sig = hmac.new(
        settings.SECRET_KEY.encode(),
        payload_b64.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(sig, expected_sig):
        return False, "Security verification token signature is invalid or tampered with."
    
    # Check if already used
    if token in _USED_CAPTCHA_TOKENS:
        return False, "Security challenge token has already been used. Please request a new challenge."
    
    try:
        payload_json = base64.urlsafe_b64decode(payload_b64.encode()).decode()
        payload = json.loads(payload_json)
    except Exception:
        return False, "Failed to decode security verification payload."
    
    # Check expiration
    if time.time() > payload.get('exp', 0):
        return False, "Security verification challenge has expired. Please try again."
    
    # Verify answer
    expected_hash = payload.get('ans', '')
    submitted_hash = hashlib.sha256(str(answer).strip().encode()).hexdigest()
    
    if not hmac.compare_digest(expected_hash, submitted_hash):
        return False, "Incorrect verification challenge answer. Please try again."
    
    # Mark as used
    _USED_CAPTCHA_TOKENS.add(token)
    return True, ""
