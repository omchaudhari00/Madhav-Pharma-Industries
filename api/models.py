"""
The simple Product model exposed at /api/products/.

Django talks to PostgreSQL through the DATABASES setting in backend/settings.py,
which reads its credentials from the .env file at the project root. This model
never touches connection details itself -- it just describes a table, and Django
translates it into PostgreSQL SQL for us.
"""
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        # Keeps GET /api/products/ in a predictable order.
        ordering = ['id']

    def __str__(self):
        return self.name
