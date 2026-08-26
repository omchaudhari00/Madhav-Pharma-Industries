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

    code_id = models.CharField(max_length=100, unique=True, null=True, blank=True, db_index=True)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    category_title = models.CharField(max_length=255, blank=True, default='')
    category_subtitle = models.CharField(max_length=255, blank=True, default='')
    title_white = models.CharField(max_length=255, blank=True, default='')
    title_gold = models.CharField(max_length=255, blank=True, default='')
    badge_text = models.CharField(max_length=255, blank=True, default='')
    specs = models.JSONField(default=list, blank=True)
    grade = models.CharField(max_length=255, blank=True, default='')
    card_image = models.TextField(blank=True, default='')
    hero_image = models.TextField(blank=True, default='')
    custom_images = models.JSONField(default=list, blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    retail_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True, default='')
    specifications = models.TextField(blank=True, null=True)
    applications = models.TextField(blank=True, null=True)
    packaging_information = models.TextField(blank=True, null=True)
    minimum_order_quantity = models.PositiveIntegerField(default=1)
    availability_status = models.CharField(max_length=50, default='In Stock')
    retail_oos = models.BooleanField(default=False)
    b2b_oos = models.BooleanField(default=False)
    discontinued = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code_id or self.id})"

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
