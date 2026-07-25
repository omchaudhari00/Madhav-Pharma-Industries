from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'

class Product(models.Model):
    AVAILABILITY_CHOICES = (
        ('In Stock', 'In Stock'),
        ('Out of Stock', 'Out of Stock'),
        ('Made to Order', 'Made to Order'),
    )

    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    description = models.TextField()
    specifications = models.TextField(blank=True, null=True) # Could be JSON in real scenario
    applications = models.TextField(blank=True, null=True)
    packaging_information = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    minimum_order_quantity = models.PositiveIntegerField(default=1)
    availability_status = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='In Stock')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500) # Simplified for now, usually an ImageField
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.product.name}"

class ProductCertificate(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='certificates')
    name = models.CharField(max_length=255)
    file_url = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.name} - {self.product.name}"
