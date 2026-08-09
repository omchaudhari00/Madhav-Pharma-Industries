"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import get_user_model
from django.http import HttpResponse

def clear_test_user(request):
    get_user_model().objects.filter(email='madhavpharmaindustries@gmail.com').delete()
    return HttpResponse("Database cleared for madhavpharmaindustries@gmail.com!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/catalog/', include('catalog.urls')),
    path('api/quotations/', include('quotations.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/interactions/', include('interactions.urls')),
    path('api/clear-db/', clear_test_user),
]
