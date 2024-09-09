from django.test import TestCase
from django.core.exceptions import ValidationError

from stock.models import Warehouse, StockQuant, StockMove, StockPicking
from products.models import Product, ProductBase, Brand


class StockTest(TestCase):

    # Helpers for testing
    def _round_stock_quant_batch(self, stock_quants, expected_values):
        for stock_quant, expected_value in zip(stock_quants, expected_values):
            self._round_stock_quant(stock_quant, expected_value)

    def _round_stock_quant(
        self,
        stock_quant,
        expected_values=(0, 0, 0),
        fields=("free_quantity", "reserved_quantity", "total_quantity"),
    ):
        # needs to refresh data
        stock_quant.refresh_from_db()
        for field, expected in zip(fields, expected_values):
            real_value = getattr(stock_quant, field)
            self.assertEqual(
                expected,
                real_value,
                f"Failed for {field} in {stock_quant}: expected {expected}, got {real_value}",
            )

    def _generate_picking(self):
        """Helper method to generate a stock picking with default values"""
        # Use existing warehouse and product attributes
        test_picking = StockPicking.objects.create(
            warehouse_from=self.warehouse_in_2,
            warehouse_to=self.warehouse_in,
        )

        StockMove.objects.create(
            stock_picking=test_picking,
            product=self.product_1,
            quantity=1,
        )

        StockMove.objects.create(
            stock_picking=test_picking,
            product=self.product_2,
            quantity=1,
        )

        return test_picking

    def _assert_validation_error(self, func):
        """Helper method to assert that a function raises a ValidationError"""
        with self.assertRaises(ValidationError):
            func()

    # Testing

    def setUp(self):
        self.warehouse_out = Warehouse.objects.create(
            name="Client Address", type="OUT", code="CL1"
        )
        self.warehouse_in = Warehouse.objects.create(
            name="Coyoacan Warehouse", code="CY1"
        )
        self.warehouse_in_2 = Warehouse.objects.create(
            name="Monterrey Warehouse", code="MYT1"
        )
        self.common_brand = Brand.objects.create(name="Apple")
        self.product_base = ProductBase.objects.create(
            name="MAC M2", standard_price=1000.00, brand=self.common_brand
        )
        self.product_1 = Product.objects.create(
            variant_name="256 GB",
            code="M2-02",
            variant_extra_price=299.99,
            product_base=self.product_base,
        )
        self.product_2 = Product.objects.create(
            variant_name="512 GB",
            code="M2-03",
            variant_extra_price=599.99,
            product_base=self.product_base,
        )
        self.stock_quant_1 = StockQuant.objects.create(
            product=self.product_1, warehouse=self.warehouse_in, free_quantity=24
        )
        self.stock_quant_2 = StockQuant.objects.create(
            product=self.product_2, warehouse=self.warehouse_in_2, free_quantity=10
        )
        self.stock_quant_3 = StockQuant.objects.create(
            product=self.product_1, warehouse=self.warehouse_in_2, free_quantity=22
        )

    def test_stock_picking_1(self):
        test_picking = StockPicking.objects.create(
            warehouse_from=self.warehouse_in_2,
            warehouse_to=self.warehouse_in,
        )

        StockMove.objects.create(
            stock_picking=test_picking,
            product=self.product_1,
            quantity=10,
        )
        test_picking.set_in_progress()

        # tests
        self.assertEqual(
            StockPicking.StockPickingStates.IN_PROGRESS, test_picking.state
        )

        self._round_stock_quant_batch(
            stock_quants=[self.stock_quant_3, self.stock_quant_1],
            expected_values=[(12, 10, 22), (24, 0, 24)],
        )

        # Cancel it
        test_picking.set_cancel()
        # tests
        self.assertEqual(StockPicking.StockPickingStates.CANCELLED, test_picking.state)

        self._round_stock_quant_batch(
            stock_quants=[self.stock_quant_3, self.stock_quant_1],
            expected_values=[(22, 0, 22), (24, 0, 24)],
        )

        # Draft it
        test_picking.set_draft()
        # needs to refresh data
        self.assertEqual(StockPicking.StockPickingStates.DRAFT, test_picking.state)
        self._round_stock_quant_batch(
            stock_quants=[self.stock_quant_3, self.stock_quant_1],
            expected_values=[(22, 0, 22), (24, 0, 24)],
        )

    def test_stock_picking_code(self):
        # IN -> IN = INTERNAL
        test_picking_1 = StockPicking.objects.create(
            warehouse_from=self.warehouse_in_2,
            warehouse_to=self.warehouse_in,
        )
        self.assertEqual(
            test_picking_1.code_type, StockPicking.StockPickingCodeTypes.INTERNAL
        )
        # OUT -> IN = IN
        test_picking_1 = StockPicking.objects.create(
            warehouse_from=self.warehouse_out,
            warehouse_to=self.warehouse_in,
        )
        self.assertEqual(
            test_picking_1.code_type, StockPicking.StockPickingCodeTypes.IN
        )
        # IN -> OUT = OUT
        test_picking_2 = StockPicking.objects.create(
            warehouse_from=self.warehouse_in_2,
            warehouse_to=self.warehouse_out,
        )
        self.assertEqual(
            test_picking_2.code_type, StockPicking.StockPickingCodeTypes.OUT
        )

    def test_stock_picking_2(self):
        test_picking = StockPicking.objects.create(
            warehouse_from=self.warehouse_in_2,
            warehouse_to=self.warehouse_in,
        )

        StockMove.objects.create(
            stock_picking=test_picking,
            product=self.product_1,
            quantity=10,
        )

        StockMove.objects.create(
            stock_picking=test_picking,
            product=self.product_2,
            quantity=2,
        )

        test_picking.set_in_progress()

        self.assertEqual(
            StockPicking.StockPickingStates.IN_PROGRESS, test_picking.state
        )
        self._round_stock_quant_batch(
            stock_quants=[self.stock_quant_3, self.stock_quant_2, self.stock_quant_1],
            expected_values=[(12, 10, 22), (8, 2, 10), (24, 0, 24)],
        )

        # Done
        test_picking.set_done()
        # the stock quant must be created before during the set_in_progress
        stock_quant_4 = StockQuant.objects.get_or_create_for_warehouse_and_product(
            warehouse=test_picking.warehouse_to, product=self.product_2
        )
        self.assertEqual(StockPicking.StockPickingStates.DONE, test_picking.state)
        self._round_stock_quant_batch(
            stock_quants=[
                stock_quant_4,
                self.stock_quant_3,
                self.stock_quant_2,
                self.stock_quant_1,
            ],
            expected_values=[(2, 0, 2), (12, 0, 12), (8, 0, 8), (34, 0, 34)],
        )

    def test_bad_stock_picking_1(self):
        # Bad type
        warehouse_out_2 = Warehouse.objects.create(
            name="Client Address 2", type="OUT", code="CL2"
        )
        with self.assertRaisesMessage(
            ValidationError, "You cannot set type OUT in location and destination!"
        ):
            StockPicking.objects.create(
                warehouse_from=self.warehouse_out,
                warehouse_to=warehouse_out_2,
            )
        # Bad qty (reserve)
        test_picking = StockPicking.objects.create(
            warehouse_from=self.warehouse_in_2,
            warehouse_to=self.warehouse_in,
        )

        with self.assertRaises(ValidationError):
            StockMove.objects.create(
                stock_picking=test_picking,
                product=self.product_1,
                quantity=100,
            )
            test_picking.set_in_progress()

        # Bad unreserve
        with self.assertRaises(ValidationError):
            self.stock_quant_2.unreserve_qty(999)

    def test_set_draft(self):
        """Test various scenarios for setting the state to DRAFT"""
        test_picking = self._generate_picking()
        # Wrong flow: draft -> draft
        self._assert_validation_error(test_picking.set_draft)
        # Wrong flow: in progress -> draft
        test_picking.set_in_progress()
        self._assert_validation_error(test_picking.set_draft)
        # Wrong flow: done -> draft
        test_picking.set_done()
        self._assert_validation_error(test_picking.set_draft)
        # Correct flow: cancel -> draft
        test_picking_2 = self._generate_picking()
        test_picking_2.set_in_progress()
        test_picking_2.set_cancel()
        test_picking_2.set_draft()
        self.assertEqual(test_picking_2.state, StockPicking.StockPickingStates.DRAFT)

    def test_set_in_progress(self):
        """Test various scenarios for setting the state to IN_PROGRESS"""
        test_picking = self._generate_picking()
        # Correct flow: draft -> in progress
        test_picking.set_in_progress()
        self.assertEqual(
            test_picking.state, StockPicking.StockPickingStates.IN_PROGRESS
        )
        # Wrong flow: in progress -> in progress
        self._assert_validation_error(test_picking.set_in_progress)
        # Wrong flow: cancel -> in progress
        test_picking.set_cancel()
        self._assert_validation_error(test_picking.set_in_progress)
        # Wrong flow: done -> in progress
        test_picking.set_draft()
        test_picking.set_in_progress()
        test_picking.set_done()
        self._assert_validation_error(test_picking.set_in_progress)

    def test_set_done(self):
        """Test various scenarios for setting the state to DONE"""
        test_picking = self._generate_picking()
        # Incorrect flow: draft -> done
        self._assert_validation_error(test_picking.set_done)
        # Incorrect flow: cancel -> done
        test_picking.set_in_progress()
        test_picking.set_cancel()
        self._assert_validation_error(test_picking.set_done)
        # Correct flow: in progress -> done
        test_picking.set_draft()
        test_picking.set_in_progress()
        test_picking.set_done()
        self.assertEqual(test_picking.state, StockPicking.StockPickingStates.DONE)
        # Incorrect flow: done -> done
        self._assert_validation_error(test_picking.set_done)

    def test_set_cancel(self):
        """Test various scenarios for setting the state to CANCELLED"""
        test_picking = self._generate_picking()
        # Correct flow: draft -> cancel
        test_picking.set_cancel()
        self.assertEqual(test_picking.state, StockPicking.StockPickingStates.CANCELLED)
        # Correct flow: in progress -> cancel
        test_picking_1 = self._generate_picking()
        test_picking_1.set_in_progress()
        test_picking_1.set_cancel()
        self.assertEqual(
            test_picking_1.state, StockPicking.StockPickingStates.CANCELLED
        )
        # Incorrect flow: done -> cancel
        test_picking_2 = self._generate_picking()
        test_picking_2.set_in_progress()
        test_picking_2.set_done()
        self._assert_validation_error(test_picking_2.set_cancel)
        # Incorrect flow: cancel -> cancel
        test_picking_3 = self._generate_picking()
        test_picking_3.set_in_progress()
        test_picking_3.set_cancel()
        self._assert_validation_error(test_picking_3.set_cancel)

    def test_product_integration_aggregation_fields(self):
        fields = ("all_free_quantity", "all_reserved_quantity", "all_total_quantity")
        product_1 = Product.objects.save_with_base(
            variant_name="128 GB",
            code="M1-01",
            variant_extra_price=100.99,
            product_base_name="MAC M1",
            product_base_standard_price=800.00,
            product_base_brand=self.common_brand,
        )

        StockQuant.objects.create(
            product=product_1, warehouse=self.warehouse_in, free_quantity=24
        )
        StockQuant.objects.create(
            product=product_1, warehouse=self.warehouse_in_2, free_quantity=32
        )

        self._round_stock_quant(product_1, (56, 0, 56), fields=fields)

        test_picking_1 = StockPicking.objects.create(
            warehouse_from=self.warehouse_in_2,
            warehouse_to=self.warehouse_out,
        )

        StockMove.objects.create(
            stock_picking=test_picking_1,
            product=product_1,
            quantity=12,
        )
        test_picking_1.set_in_progress()

        self._round_stock_quant(product_1, (44, 12, 56), fields=fields)

        test_picking_1.set_done()

        self._round_stock_quant(product_1, (44, 0, 44), fields=fields)
