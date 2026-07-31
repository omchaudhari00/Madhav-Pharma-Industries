from django.urls import path
from .views import (
    CheckUserView, LoginView, RequestOTPView, VerifyOTPAndRegisterView,
    AdminDashboardStatsView, UserListView, ManageSalesUserView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('check-user/', CheckUserView.as_view(), name='check_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/request-otp/', RequestOTPView.as_view(), name='request_otp'),
    path('register/verify-otp/', VerifyOTPAndRegisterView.as_view(), name='verify_otp'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin_stats'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('sales-users/', ManageSalesUserView.as_view(), name='manage_sales_user'),
]

