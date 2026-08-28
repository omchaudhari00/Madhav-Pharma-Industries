"""
Included by backend/urls.py under the 'api/' prefix, so the paths below become
/api/products/ and /api/products/<id>/.
"""
from django.urls import path

from .views import ProductDetailView, ProductListCreateView

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]
