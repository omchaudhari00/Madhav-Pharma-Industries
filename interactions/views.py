from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Review, Notification
from .serializers import ReviewSerializer, NotificationSerializer
from accounts.models import User
from quotations.models import Quotation
from orders.models import Order, Payment

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
        
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'Admin':
            return Review.objects.all()
        return Review.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
        
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        if request.user.role != 'Admin':
            return Response(status=status.HTTP_403_FORBIDDEN)
        review = self.get_object()
        review.is_approved = True
        review.save()
        return Response(ReviewSerializer(review).data)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

class ReportViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def dashboard_summary(self, request):
        if request.user.role != 'Admin':
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        return Response({
            "total_customers": User.objects.filter(role='Customer').count(),
            "total_quotations": Quotation.objects.count(),
            "pending_quotations": Quotation.objects.filter(status='Pending').count(),
            "total_orders": Order.objects.count(),
            "completed_payments": Payment.objects.filter(status='Completed').count()
        })
