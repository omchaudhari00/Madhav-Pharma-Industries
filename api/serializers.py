"""
Serializers translate between Product model instances and the JSON that React
sends and receives. `fields` is listed explicitly so a new model column is never
exposed by accident.
"""
from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock']
