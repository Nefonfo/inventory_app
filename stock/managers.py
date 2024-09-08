from django.db import models


class StockQuantManager(models.Manager):
    def get_or_create_for_warehouse_and_product(self, warehouse, product):
        stock_quant, created = self.get_or_create(
            warehouse=warehouse,
            product=product,
            defaults={"free_quantity": 0, "reserved_quantity": 0},
        )
        return stock_quant
