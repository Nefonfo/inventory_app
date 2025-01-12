from rest_framework.routers import DefaultRouter

from django_rest_passwordreset.urls import add_reset_password_urls_to_router

from products.views import BrandViewSet, ProductBaseViewSet, ProductViewSet
from stock.views import (
    WarehouseViewSet,
    StockQuantViewSet,
    StockPickingViewSet,
    StockMoveViewSet,
)

router = DefaultRouter()

# products module
router.register(r"brand", BrandViewSet, basename="brand")
router.register(r"product-base", ProductBaseViewSet, basename="product-base")
router.register(r"product", ProductViewSet, basename="product")

# stock module
router.register(r"warehouse", WarehouseViewSet, basename="warehouse")
router.register(r"stock-quant", StockQuantViewSet, basename="stock-quant")
router.register(r"stock-picking", StockPickingViewSet, basename="stock-picking")
router.register(r"stock-move", StockMoveViewSet, basename="stock-move")

# password reset
add_reset_password_urls_to_router(router, base_path="api/password_reset")

api_routes = router.urls
