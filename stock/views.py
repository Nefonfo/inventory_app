from rest_framework.viewsets import ModelViewSet

from stock.models import Warehouse, StockQuant, StockPicking, StockMove
from stock.serializers import (
    WarehouseSerializer,
    StockQuantSerializer,
    StockPickingSerializer,
    StockMoveSerializer,
)


class WarehouseViewSet(ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class StockQuantViewSet(ModelViewSet):
    queryset = StockQuant.objects.all()
    serializer_class = StockQuantSerializer


class StockPickingViewSet(ModelViewSet):
    queryset = StockPicking.objects.all()
    serializer_class = StockPickingSerializer


class StockMoveViewSet(ModelViewSet):
    queryset = StockMove.objects.all()
    serializer_class = StockMoveSerializer
