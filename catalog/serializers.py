from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductCertificate

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'is_primary']

class ProductCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCertificate
        fields = ['id', 'name', 'file_url']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    certificates = ProductCertificateSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
