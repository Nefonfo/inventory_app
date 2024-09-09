from rest_framework import serializers

from stock.models import Warehouse, StockQuant, StockPicking, StockMove


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        depth = 2
        fields = ["id", "display_name", "name", "code", "type"]


class StockQuantSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockQuant
        depth = 3
        fields = [
            "id",
            "display_name",
            "product",
            "warehouse",
            "free_quantity",
            "reserved_quantity",
            "total_quantity",
        ]


class StockPickingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockPicking
        depth = 3
        fields = [
            "id",
            "display_name",
            "name",
            "state",
            "warehouse_from",
            "warehouse_to",
            "code_type",
            "stock_moves",
        ]


class StockMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMove
        depth = 3
        fields = ["id", "display_name", "product", "quantity", "stock_picking"]
