from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CheckUserView, LoginView, RequestOTPView, ResendOTPView, VerifyOTPAndRegisterView,
    AdminDashboardStatsView, UserListView, ManageSalesUserView, AddressViewSet,
    ForgotPasswordRequestOTPView, ForgotPasswordResetView, UpdateProfileView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path('check-user/', CheckUserView.as_view(), name='check_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/request-otp/', RequestOTPView.as_view(), name='request_otp'),
    path('register/resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('register/verify-otp/', VerifyOTPAndRegisterView.as_view(), name='verify_otp'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin_stats'),
    path('dashboard-stats/', AdminDashboardStatsView.as_view(), name='dashboard_stats'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('sales-users/', ManageSalesUserView.as_view(), name='manage_sales_user'),
    path('forgot-password/request-otp/', ForgotPasswordRequestOTPView.as_view(), name='forgot_password_request_otp'),
    path('forgot-password/reset/', ForgotPasswordResetView.as_view(), name='forgot_password_reset'),
    path('', include(router.urls)),
]

