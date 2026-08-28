"""
The two DRF views behind the five product endpoints:

    GET    /api/products/        list      -> ProductListCreateView
    POST   /api/products/        create    -> ProductListCreateView
    GET    /api/products/<id>/   retrieve  -> ProductDetailView
    PUT    /api/products/<id>/   update    -> ProductDetailView
    DELETE /api/products/<id>/   destroy   -> ProductDetailView

This project sets DEFAULT_PERMISSION_CLASSES to IsAuthenticated globally (the
customer/sales/admin portals need that), so these two views opt out explicitly
with AllowAny. That keeps the beginner walkthrough in the README working without
a login. Tighten this to IsAuthenticated once you put real data here.
"""
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Product
from .serializers import ProductSerializer


class ProductListCreateView(generics.ListCreateAPIView):
    """GET (list) and POST (create) on /api/products/."""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET, PUT and DELETE on /api/products/<id>/."""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
