from rest_framework.viewsets import ModelViewSet

from products.models import Brand, ProductBase, Product
from products.serializers import (
    BrandSerializer,
    ProductBaseSerializer,
    ProductSerializer,
)


class BrandViewSet(ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class ProductBaseViewSet(ModelViewSet):
    queryset = ProductBase.objects.all()
    serializer_class = ProductBaseSerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
