from django.contrib import admin
from .models import Payment, Invoice, Order

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'quotation', 'amount', 'status', 'payment_date')
    list_filter = ('status',)

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'quotation', 'total_amount', 'invoice_date')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'status', 'created_at')
    list_filter = ('status',)
