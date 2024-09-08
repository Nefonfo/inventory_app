from django.db import models, transaction


class ProductManager(models.Manager):
    def save_with_base(self, **kwargs):
        from products.models import ProductBase

        with transaction.atomic():
            product_base_vals = {
                key.replace("product_base_", ""): value
                for key, value in kwargs.items()
                if key.startswith("product_base_")
            }
            for key in product_base_vals.keys():
                kwargs.pop(f"product_base_{key}")
            kwargs.update(
                {"product_base": ProductBase.objects.create(**product_base_vals)}
            )
            return self.create(**kwargs)
