from django.urls import path
from .views import CheckUserView, LoginView, RequestOTPView, VerifyOTPAndRegisterView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('check-user/', CheckUserView.as_view(), name='check_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/request-otp/', RequestOTPView.as_view(), name='request_otp'),
    path('register/verify-otp/', VerifyOTPAndRegisterView.as_view(), name='verify_otp'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
