import os
import requests
import json
from django.core.cache import cache

SHIPROCKET_EMAIL = os.environ.get('SHIPROCKET_EMAIL', 'test@example.com')
SHIPROCKET_PASSWORD = os.environ.get('SHIPROCKET_PASSWORD', 'password123')
BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

def authenticate():
    token = cache.get('shiprocket_token')
    if token:
        return token
        
    url = f"{BASE_URL}/auth/login"
    payload = json.dumps({
        "email": SHIPROCKET_EMAIL,
        "password": SHIPROCKET_PASSWORD
    })
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, headers=headers, data=payload)
    if response.status_code == 200:
        data = response.json()
        token = data.get('token')
        # Shiprocket tokens last 10 days, cache it for 9 days (777600 seconds)
        cache.set('shiprocket_token', token, 777600)
        return token
    else:
        raise Exception(f"Failed to authenticate with Shiprocket: {response.text}")

def create_order(order):
    """
    Creates an order in Shiprocket.
    """
    token = authenticate()
    url = f"{BASE_URL}/orders/create/ad-hoc"
    
    # Simple mocked up data structure based on the Shiprocket API
    # In reality, this requires mapping your exact Django Order fields to Shiprocket
    payload = json.dumps({
        "order_id": order.order_number,
        "order_date": order.created_at.strftime('%Y-%m-%d %H:%M'),
        "pickup_location": "Primary", # User must configure this
        "billing_customer_name": order.customer_name or "Customer",
        "billing_last_name": "",
        "billing_address": order.delivery_address,
        "billing_city": "Mumbai", # Parse from address in real scenario
        "billing_pincode": "400001",
        "billing_state": "Maharashtra",
        "billing_country": "India",
        "billing_email": order.customer_email or "customer@example.com",
        "billing_phone": order.customer_phone or "9999999999",
        "shipping_is_billing": True,
        "order_items": [
            {
                "name": item.get('name', 'Product'),
                "sku": item.get('name', 'Product')[:10],
                "units": item.get('quantity', 1),
                "selling_price": item.get('unitPrice', 0),
            } for item in order.items_data
        ],
        "payment_method": "Prepaid" if order.payment_status == 'PAID' else "COD",
        "sub_total": float(order.total_amount),
        "length": 10,
        "breadth": 10,
        "height": 10,
        "weight": 1.5
    })
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    # We won't actually hit the API until credentials are provided, 
    # but we can return mock success to prevent crashes.
    if SHIPROCKET_EMAIL == 'test@example.com':
        return {
            "order_id": "SR-" + order.order_number,
            "shipment_id": "SHP-" + order.order_number,
            "status": "NEW"
        }
    
    response = requests.post(url, headers=headers, data=payload)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to create Shiprocket order: {response.text}")

def generate_awb(shipment_id):
    """
    Assigns a courier and generates AWB for a given shipment_id.
    """
    token = authenticate()
    url = f"{BASE_URL}/courier/assign/awb"
    
    payload = json.dumps({
        "shipment_id": shipment_id,
        "courier_id": "" # Leave blank for auto-assignment
    })
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    if SHIPROCKET_EMAIL == 'test@example.com':
        return {
            "awb_code": "AWB-MOCK-123456",
            "routing_code": "RT-01",
        }
        
    response = requests.post(url, headers=headers, data=payload)
    if response.status_code == 200:
        data = response.json()
        return data.get('response', {}).get('data', {})
    else:
        raise Exception(f"Failed to generate AWB: {response.text}")
