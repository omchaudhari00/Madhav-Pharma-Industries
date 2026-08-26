from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

DEFAULT_PRODUCTS_SEED = [
    {
        'code_id': 'weight-loss-oil',
        'name': 'Completely Natural Remedy for Weight Loss',
        'category_title': 'Weight Loss',
        'category_subtitle': 'Remedy',
        'title_white': 'Weight Loss',
        'title_gold': 'Remedy',
        'badge_text': '100% Natural & Herbal',
        'specs': ['Helps in Weight Loss', 'Boosts Metabolism', '100% Natural Ingredients', 'Improves Digestion', 'Detoxifies & Purifies'],
        'card_image': '/images/weight-loss-oil.jpg',
        'hero_image': '/images/weight-loss-oil.jpg',
        'unit_price': 150,
        'retail_price': 349,
        'price': 150,
        'grade': '100% Natural Herbal & Ayurvedic',
        'availability_status': 'In Stock',
        'display_order': 1
    },
    {
        'code_id': 'cumin-seed-oil',
        'name': 'Pure Cumin Seed Oil (Jeera Oil)',
        'category_title': 'Cumin',
        'category_subtitle': 'Seed',
        'title_white': 'Cumin',
        'title_gold': 'Seed',
        'badge_text': 'Anti-inflammatory',
        'specs': ['Digestive Aid', 'Immunity Booster', 'Skin Clarity', 'Warm & Spicy Aroma', 'Relieves Bloating'],
        'card_image': '/images/cumin_product.jpg',
        'hero_image': '/images/cumin_hero.jpg',
        'unit_price': 2200,
        'retail_price': 299,
        'price': 2200,
        'grade': '100% Pure • Premium Therapeutic Grade',
        'availability_status': 'In Stock',
        'display_order': 2
    },
    {
        'code_id': 'fennel-seed-oil',
        'name': 'Natural Fennel Seed Oil',
        'category_title': 'Fennel',
        'category_subtitle': 'Seed Oil',
        'title_white': 'Fennel',
        'title_gold': 'Seed Oil',
        'badge_text': 'POPULAR CHOICE',
        'specs': ['100% Pure & Natural', 'Steam Distilled', 'Aromatic Essential Oil'],
        'card_image': '/images/bulk_1l.jpg',
        'hero_image': '/images/bulk_1l.jpg',
        'unit_price': 85,
        'retail_price': 249,
        'price': 85,
        'grade': '100% Steam Distilled • Food & Wellness Grade',
        'availability_status': 'In Stock',
        'display_order': 3
    },
    {
        'code_id': 'ajwain-seed-oil',
        'name': 'Pure Ajwain Seed Oil',
        'category_title': 'Ajwain',
        'category_subtitle': 'Seed Oil',
        'title_white': 'Ajwain',
        'title_gold': 'Seed Oil',
        'badge_text': 'HIGH POTENCY',
        'specs': ['100% Pure & Natural', 'Steam Distilled', 'Therapeutic Grade'],
        'card_image': '/images/bulk_1l.jpg',
        'hero_image': '/images/bulk_1l.jpg',
        'unit_price': 95,
        'retail_price': 279,
        'price': 95,
        'grade': '100% Steam Distilled • Pharma Grade',
        'availability_status': 'In Stock',
        'display_order': 4
    },
    {
        'code_id': 'black-seed-oil',
        'name': 'Pure Black Seed Oil (Kalonji Oil)',
        'category_title': 'Black Seed',
        'category_subtitle': 'Essential Oil',
        'title_white': 'Black Seed',
        'title_gold': 'Essential Oil',
        'badge_text': 'PREMIUM CHOICE',
        'specs': ['100% Pure & Cold Pressed/Distilled', 'Rich in Thymoquinone', 'Therapeutic Grade'],
        'card_image': '/images/bulk_1l.jpg',
        'hero_image': '/images/bulk_1l.jpg',
        'unit_price': 150,
        'retail_price': 349,
        'price': 150,
        'grade': '100% Steam Distilled • Pharma & Wellness Grade',
        'availability_status': 'In Stock',
        'display_order': 5
    }
]

def seed_default_products_if_needed():
    for item in DEFAULT_PRODUCTS_SEED:
        code = item['code_id']
        prod = Product.objects.filter(code_id=code).first()
        if not prod:
            # Check if there is an existing product with matching name
            prod = Product.objects.filter(name__icontains=item['category_title']).first()
            if prod:
                prod.code_id = code
                prod.category_title = item['category_title']
                prod.category_subtitle = item['category_subtitle']
                prod.title_white = item['title_white']
                prod.title_gold = item['title_gold']
                prod.badge_text = item['badge_text']
                prod.specs = item['specs']
                prod.grade = item['grade']
                prod.card_image = item['card_image']
                prod.hero_image = item['hero_image']
                prod.unit_price = item['unit_price']
                prod.retail_price = item['retail_price']
                prod.price = item['price']
                prod.display_order = item['display_order']
                prod.save()
            else:
                Product.objects.create(**item)

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (getattr(request.user, 'role', None) == 'Admin' or request.user.is_staff or request.user.is_superuser)
        )

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('display_order', 'id')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'code_id'
    filterset_fields = ['category', 'availability_status']
    search_fields = ['name', 'description']

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        if lookup_value and lookup_value.isdigit():
            obj = Product.objects.filter(id=int(lookup_value)).first()
            if obj:
                return obj
        obj = Product.objects.filter(code_id=lookup_value).first()
        if obj:
            return obj
        return super().get_object()

    def list(self, request, *args, **kwargs):
        seed_default_products_if_needed()
        queryset = Product.objects.filter(is_active=True).order_by('display_order', 'id')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAdminOrReadOnly])
    def update_details(self, request):
        code_id = request.data.get('code_id') or request.data.get('id')
        if not code_id:
            return Response({"error": "Product code_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        seed_default_products_if_needed()
        prod = None
        if str(code_id).isdigit():
            prod = Product.objects.filter(id=int(code_id)).first()
        if not prod:
            prod = Product.objects.filter(code_id=str(code_id)).first()
        if not prod:
            return Response({"error": f"Product '{code_id}' not found."}, status=status.HTTP_404_NOT_FOUND)

        if 'unit_price' in request.data:
            prod.unit_price = request.data['unit_price']
            prod.price = request.data['unit_price']
        if 'retail_price' in request.data:
            prod.retail_price = request.data['retail_price']
        if 'price_5l' in request.data:
            prod.price_5l = request.data['price_5l']
        if 'custom_images' in request.data:
            prod.custom_images = request.data['custom_images']
        if 'custom_images_5l' in request.data:
            prod.custom_images_5l = request.data['custom_images_5l']
        if 'description' in request.data:
            prod.description = request.data['description']
        if 'description_5l' in request.data:
            prod.description_5l = request.data['description_5l']
        if 'specs' in request.data:
            prod.specs = request.data['specs']
        if 'badge_text' in request.data:
            prod.badge_text = request.data['badge_text']
        if 'grade' in request.data:
            prod.grade = request.data['grade']
        if 'retail_oos' in request.data:
            prod.retail_oos = bool(request.data['retail_oos'])
        if 'b2b_oos' in request.data:
            prod.b2b_oos = bool(request.data['b2b_oos'])
        if 'discontinued' in request.data:
            prod.discontinued = bool(request.data['discontinued'])

        prod.save()
        return Response({
            "success": True,
            "message": f"Product '{prod.name}' updated successfully.",
            "product": ProductSerializer(prod).data
        })

    @action(detail=False, methods=['post'], permission_classes=[IsAdminOrReadOnly])
    def toggle_stock(self, request):
        code_id = request.data.get('code_id') or request.data.get('id')
        toggle_type = request.data.get('type') # 'retail', 'b2b', 'discontinued'

        if not code_id or not toggle_type:
            return Response({"error": "code_id and type are required."}, status=status.HTTP_400_BAD_REQUEST)

        seed_default_products_if_needed()
        prod = None
        if str(code_id).isdigit():
            prod = Product.objects.filter(id=int(code_id)).first()
        if not prod:
            prod = Product.objects.filter(code_id=str(code_id)).first()
        if not prod:
            return Response({"error": f"Product '{code_id}' not found."}, status=status.HTTP_404_NOT_FOUND)

        if toggle_type == 'retail':
            prod.retail_oos = not prod.retail_oos
        elif toggle_type == 'b2b':
            prod.b2b_oos = not prod.b2b_oos
        elif toggle_type == 'discontinued':
            prod.discontinued = not prod.discontinued

        prod.save()
        return Response({
            "success": True,
            "product": ProductSerializer(prod).data
        })
