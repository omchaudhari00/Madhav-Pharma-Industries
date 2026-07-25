from django.db import models
from accounts.models import User
from catalog.models import Product

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField() # 1 to 5
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    review_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.rating} star by {self.customer} for {self.product.name}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user} - {self.title}"
