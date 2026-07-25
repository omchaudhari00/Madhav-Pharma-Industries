from django.contrib import admin
from .models import User, CustomerProfile, Address, OTPRecord

admin.site.register(User)
admin.site.register(CustomerProfile)
admin.site.register(Address)
admin.site.register(OTPRecord)
