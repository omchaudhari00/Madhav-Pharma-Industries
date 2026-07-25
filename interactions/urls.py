from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet, NotificationViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls)),
]
