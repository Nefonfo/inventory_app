from django.db import models

from computedfields.models import ComputedFieldsModel, computed

from products.managers import ProductManager
from core.models import BaseModel


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

    def __str__(self):
        code = f"[{self.code}] " if self.code else ""
        return f"{code}{self.product_base} - {self.variant_name}"
