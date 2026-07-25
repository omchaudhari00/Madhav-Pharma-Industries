from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuoteCartViewSet, QuotationViewSet

router = DefaultRouter()
router.register(r'cart', QuoteCartViewSet, basename='cart')
router.register(r'quotations', QuotationViewSet, basename='quotation')

urlpatterns = [
    path('', include(router.urls)),
]
