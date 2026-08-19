from django.db import models
from accounts.models import User
from catalog.models import Product
import uuid

class QuoteCart(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE, related_name='quote_cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.customer}"

class QuoteCartItem(models.Model):
    cart = models.ForeignKey(QuoteCart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit = models.CharField(max_length=50)
    additional_notes = models.TextField(blank=True, null=True)
    target_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Quotation(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Under Negotiation', 'Under Negotiation'),
        ('Approved by Sales', 'Approved by Sales'),
        ('Accepted by Customer', 'Accepted by Customer'),
        ('Rejected by Customer', 'Rejected by Customer'),
        ('Closed', 'Closed'),
    )

    quotation_number = models.CharField(max_length=50, unique=True, blank=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quotations')
    sales_agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_quotations', limit_choices_to={'role': 'Sales'})
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    customer_notes = models.TextField(blank=True, null=True)
    sales_remarks = models.TextField(blank=True, null=True)
    final_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    valid_until = models.DateField(null=True, blank=True)
    
    # Snapshot fields for preserving customer data at the time of quotation creation
    snapshot_customer_name = models.CharField(max_length=255, blank=True, null=True)
    snapshot_customer_phone = models.CharField(max_length=20, blank=True, null=True)
    snapshot_customer_address = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.quotation_number:
            self.quotation_number = f"QT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.quotation_number

class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=50)
    additional_notes = models.TextField(blank=True, null=True)
    requested_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    agreed_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

class NegotiationHistory(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='negotiation_history')
    previous_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    updated_price = models.DecimalField(max_digits=12, decimal_places=2)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
