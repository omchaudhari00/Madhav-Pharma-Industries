# pyrefly: ignore [missing-import]
from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Allows access only to Admin users or Django superusers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (getattr(request.user, 'role', '') == 'Admin' or request.user.is_superuser)
        )

class IsSalesUser(BasePermission):
    """
    Allows access only to Sales agents.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', '') == 'Sales'
        )

class IsAdminOrSalesUser(BasePermission):
    """
    Allows access to both Admin and Sales roles.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (getattr(request.user, 'role', '') in ['Admin', 'Sales'] or request.user.is_superuser)
        )

class IsCustomerUser(BasePermission):
    """
    Allows access only to Customer / Lead users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', '') == 'Customer'
        )
