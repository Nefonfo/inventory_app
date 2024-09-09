from django.test import TestCase

from products.models import Brand, Product


class ProductTestCase(TestCase):
    def setUp(self):
        self.common_brand = Brand.objects.create(name="Apple")

    def test_auto_create_base(self):
        # Full Product Data
        product_1 = Product.objects.save_with_base(
            variant_name="256 GB",
            code="M2-02",
            variant_extra_price=299.99,
            product_base_name="MAC M2",
            product_base_standard_price=1000.00,
            product_base_brand=self.common_brand,
        )

        self.assertTrue(product_1.product_base)
        self.assertTrue(product_1.product_base.brand)
        self.assertEqual(product_1.product_base.name, "MAC M2")
        self.assertEqual(str(product_1), "[M2-02] MAC M2 (Apple) - 256 GB")
        self.assertEqual(product_1.price, 1299.99)
        # Partial Product Data
        product_2 = Product.objects.save_with_base(
            variant_name="512 GB",
            code="M3-03",
            variant_extra_price=399.99,
            product_base_name="MAC M3",
        )

        self.assertTrue(product_2.product_base)
        self.assertFalse(product_2.product_base.brand)
        self.assertEqual(product_2.product_base.name, "MAC M3")
        self.assertEqual(str(product_2), "[M3-03] MAC M3 (No brand) - 512 GB")
        self.assertEqual(product_2.price, 399.99)
