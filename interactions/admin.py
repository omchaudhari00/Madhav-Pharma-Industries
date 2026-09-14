from django.contrib import admin
from .models import Review, Notification

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'customer', 'rating', 'comment', 'review_date')
    list_filter = ('rating', 'review_date')
    search_fields = ('customer__email', 'customer__first_name', 'customer__last_name', 'product__name', 'product__code_id', 'comment')
    readonly_fields = ('review_date',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at')
    list_filter = ('is_read',)
