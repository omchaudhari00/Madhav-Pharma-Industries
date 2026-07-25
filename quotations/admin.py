from django.contrib import admin
from .models import QuoteCart, QuoteCartItem, Quotation, QuotationItem, NegotiationHistory

class QuoteCartItemInline(admin.TabularInline):
    model = QuoteCartItem
    extra = 0

@admin.register(QuoteCart)
class QuoteCartAdmin(admin.ModelAdmin):
    list_display = ('customer', 'created_at')
    inlines = [QuoteCartItemInline]

class QuotationItemInline(admin.TabularInline):
    model = QuotationItem
    extra = 0

class NegotiationHistoryInline(admin.TabularInline):
    model = NegotiationHistory
    extra = 0
    readonly_fields = ('updated_by', 'created_at')

@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ('quotation_number', 'customer', 'sales_agent', 'status', 'final_price', 'created_at')
    list_filter = ('status', 'sales_agent')
    search_fields = ('quotation_number', 'customer__email', 'customer__mobile_number')
    inlines = [QuotationItemInline, NegotiationHistoryInline]
