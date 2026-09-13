from django.db.models import Avg
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Review, Notification, ActivityLog
from .serializers import ReviewSerializer, NotificationSerializer, ActivityLogSerializer
from accounts.models import User
from quotations.models import Quotation
from orders.models import Order, Payment

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'by_product']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Review.objects.all().order_by('-review_date')

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'role') or user.role != 'Customer':
            raise PermissionDenied("Only customers can submit reviews.")
        product_id = self.request.data.get('product')
        if Review.objects.filter(product_id=product_id, customer=user).exists():
            raise ValidationError({"detail": "You have already reviewed this product."})
        serializer.save(customer=user)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'Admin':
            return Response(
                {"detail": "Only admins can delete reviews."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_product(self, request):
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reviews = Review.objects.filter(product_id=product_id).order_by('-review_date')
        count = reviews.count()

        if count > 0:
            avg = reviews.aggregate(avg=Avg('rating'))['avg'] or 0
            breakdown = {}
            for star in range(1, 6):
                breakdown[str(star)] = reviews.filter(rating=star).count()
        else:
            avg = 0
            breakdown = {'5': 0, '4': 0, '3': 0, '2': 0, '1': 0}

        serializer = ReviewSerializer(reviews, many=True)
        return Response({
            'reviews': serializer.data,
            'stats': {
                'average': round(float(avg), 1),
                'total': count,
                'breakdown': breakdown
            }
        })


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

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'Admin':
            return ActivityLog.objects.none()
        return ActivityLog.objects.all().order_by('-timestamp')

