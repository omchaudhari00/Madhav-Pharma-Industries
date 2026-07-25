from django.contrib import admin
from .models import Category, Product, ProductImage, ProductCertificate

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductCertificateInline(admin.TabularInline):
    model = ProductCertificate
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'availability_status', 'is_active')
    list_filter = ('availability_status', 'is_active', 'category')
    search_fields = ('name', 'description')
    inlines = [ProductImageInline, ProductCertificateInline]

admin.site.register(Category)
