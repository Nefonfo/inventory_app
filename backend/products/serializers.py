from rest_framework import serializers

from products.models import Brand, ProductBase, Product


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        depth = 2
        fields = ["id", "display_name", "name"]


class ProductBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBase
        depth = 2
        fields = ["id", "display_name", "name", "standard_price", "brand"]


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        depth = 2
        fields = [
            "id",
            "display_name",
            "product_base",
            "variant_name",
            "code",
            "variant_extra_price",
            "price",
            "all_free_quantity",
            "all_reserved_quantity",
            "all_total_quantity",
        ]
