from django.db import models
from django.db.models import Sum

from computedfields.models import ComputedFieldsModel, computed

from core.models import BaseModel
from products.managers import ProductManager
from stock.models import Warehouse


class Brand(BaseModel):
    name = models.CharField(max_length=40, null=False, blank=False, unique=True)

    def __str__(self):
        return f"({self.name})"


class ProductBase(BaseModel):
    name = models.CharField(max_length=150, null=False, blank=False)
    standard_price = models.FloatField(null=False, blank=False, default=0.00)
    brand = models.ForeignKey(Brand, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        brand = f"({self.brand.name})" if self.brand else "(No brand)"
        return f"{self.name} {brand}"


class Product(BaseModel, ComputedFieldsModel):
    product_base = models.ForeignKey(
        ProductBase, null=False, blank=True, on_delete=models.PROTECT
    )
    variant_name = models.CharField(max_length=150, null=False, blank=False)
    code = models.CharField(max_length=80, null=True, blank=True)
    variant_extra_price = models.FloatField(null=False, blank=False)

    @computed(
        models.FloatField(null=False, blank=False),
        depends=[
            ("self", ["variant_extra_price"]),
            ("product_base", ["standard_price"]),
        ],
    )
    def price(self):
        return self.variant_extra_price + self.product_base.standard_price

    objects = ProductManager()

    def _get_qty(self, field_name):
        related_quants = self.stock_quants.filter(
            warehouse__type=Warehouse.WarehouseType.IN
        )
        return related_quants.aggregate(Sum(field_name)).get(f"{field_name}__sum", 0)

    @property
    def all_free_quantity(self):
        return self._get_qty("free_quantity")

    @property
    def all_reserved_quantity(self):
        return self._get_qty("reserved_quantity")

    @property
    def all_total_quantity(self):
        return self._get_qty("total_quantity")

    def __str__(self):
        code = f"[{self.code}] " if self.code else ""
        return f"{code}{self.product_base} - {self.variant_name}"
