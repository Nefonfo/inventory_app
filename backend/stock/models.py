from datetime import datetime

from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from computedfields.models import ComputedFieldsModel, computed

from stock.managers import StockQuantManager
from core.models import BaseModel


class Warehouse(BaseModel):
    class WarehouseType(models.TextChoices):
        IN = "IN", _("In Stock")
        OUT = "OUT", _("Out Stock")

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, null=False, blank=False)
    type = models.CharField(
        max_length=3,
        choices=WarehouseType.choices,
        default=WarehouseType.IN,
    )

    def __str__(self) -> str:
        return f"{self.name} [{self.type}]"


class StockQuant(BaseModel, ComputedFieldsModel):
    class Meta:
        unique_together = (
            "product",
            "warehouse",
        )

    product = models.ForeignKey(
        "products.Product",
        null=False,
        blank=False,
        on_delete=models.PROTECT,
        related_name="stock_quants",
    )
    warehouse = models.ForeignKey(
        Warehouse,
        null=False,
        blank=False,
        on_delete=models.PROTECT,
        related_name="stock_quant",
    )
    free_quantity = models.IntegerField(blank=False, default=0)
    reserved_quantity = models.IntegerField(blank=False, default=0)
    objects = StockQuantManager()

    @computed(
        models.IntegerField(null=False, blank=False),
        depends=[
            ("self", ["free_quantity", "reserved_quantity"]),
        ],
    )
    def total_quantity(self):
        return self.free_quantity + self.reserved_quantity

    def __str__(self) -> str:
        return f"Stock Quant of Product {self.product} from Warehouse: {self.warehouse} - Free: {self.free_quantity} / {self.total_quantity}"

    def validate_reserve(self, quantity_to_reserve):
        if self.free_quantity < quantity_to_reserve:
            raise ValidationError(
                _(
                    f"""You can't reserve more stock than you have.
                Warehouse "{self.warehouse}" has {self.free_quantity} units.
                And you want to reserve {quantity_to_reserve} units."""
                )
            )

    def validate_unreserve(self, quantity_to_free):
        if self.reserved_quantity < quantity_to_free:
            raise ValidationError(
                _(
                    f"""You can't unreserve more stock than you have.
                Warehouse "{self.warehouse}" has {self.free_quantity} units.
                And you want to unreserve {quantity_to_free} units."""
                )
            )

    def reserve_qty(self, quantity):
        self.validate_reserve(quantity)
        self.reserved_quantity += quantity
        self.free_quantity -= quantity
        self.save()

    def unreserve_qty(self, quantity):
        self.validate_unreserve(quantity)
        self.reserved_quantity -= quantity
        self.free_quantity += quantity
        self.save()


class StockPicking(BaseModel, ComputedFieldsModel):
    class StockPickingStates(models.TextChoices):
        DRAFT = "DR", _("Draft")
        IN_PROGRESS = "PG", _("In Progress")
        DONE = "DN", _("Done")
        CANCELLED = "C", _("Cancelled")

    class StockPickingCodeTypes(models.TextChoices):
        IN = "IN", _("In")
        OUT = "OUT", _("Out")
        INTERNAL = "INTERNAL", _("Internal")

    name = models.CharField(max_length=255, unique=True, null=False, blank=True)
    state = models.CharField(
        max_length=3,
        choices=StockPickingStates.choices,
        default=StockPickingStates.DRAFT,
    )
    warehouse_from = models.ForeignKey(
        Warehouse,
        null=False,
        blank=False,
        on_delete=models.PROTECT,
        related_name="stock_moves_from",
    )
    warehouse_to = models.ForeignKey(
        Warehouse,
        null=False,
        blank=False,
        on_delete=models.PROTECT,
        related_name="stock_moves_to",
    )

    @computed(
        models.CharField(
            max_length=10,
            choices=StockPickingCodeTypes.choices,
            default=StockPickingCodeTypes.IN,
            null=False,
            blank=False,
        ),
        depends=[
            ("self", ["warehouse_from", "warehouse_to"]),
        ],
    )
    def code_type(self):
        if (
            self.warehouse_from.type
            == self.warehouse_to.type
            == Warehouse.WarehouseType.IN
        ):
            code_type_result = self.StockPickingCodeTypes.INTERNAL
        elif (
            self.warehouse_from.type == Warehouse.WarehouseType.IN
            and self.warehouse_to.type == Warehouse.WarehouseType.OUT
        ):
            code_type_result = self.StockPickingCodeTypes.OUT
        elif (
            self.warehouse_from.type == Warehouse.WarehouseType.OUT
            and self.warehouse_to.type == Warehouse.WarehouseType.IN
        ):
            code_type_result = self.StockPickingCodeTypes.IN
        else:
            raise Exception(
                _("There is not code type for movement that you are trying!")
            )
        return code_type_result

    def __str__(self):
        return self.name

    def _generate_name(self):
        now = datetime.now()
        date_str = now.strftime("%m%d%y")
        base_name = f"[{self.code_type}] {self.warehouse_from.code}/{self.warehouse_to.code}/{date_str}"
        return base_name

    def _get_unique_name(self):
        base_name = self._generate_name()
        counter = 1
        unique_name = base_name

        while StockPicking.objects.filter(name=unique_name).exists():
            unique_name = f"{base_name}-{counter}"
            counter += 1

        return unique_name

    def save(self, *args, **kwargs):
        if self.pk is None and (self.name is None or self.name == ""):
            self.name = self._get_unique_name()
        if (
            self.warehouse_from.type
            == self.warehouse_to.type
            == Warehouse.WarehouseType.OUT
        ):
            raise ValidationError(
                _("You cannot set type OUT in location and destination!")
            )
        return super().save(*args, **kwargs)

    def validate_state(self, action_name, states):
        if self.state not in states:
            raise ValidationError(
                _(
                    f"""
            To {action_name} this stock picking, the state must be in: {', '.join(states)}
            """
                )
            )

    def set_draft(self):
        self.validate_state("set in draft", (self.StockPickingStates.CANCELLED))
        self.state = self.StockPickingStates.DRAFT

    def set_in_progress(self):
        self.validate_state("set in progress", (self.StockPickingStates.DRAFT))
        with transaction.atomic():
            for stock_move in self.stock_moves.all():
                quant_from = StockQuant.objects.get_or_create_for_warehouse_and_product(
                    warehouse=self.warehouse_from, product=stock_move.product
                )
                quant_from.reserve_qty(stock_move.quantity)
            self.state = self.StockPickingStates.IN_PROGRESS
            self.save()

    def set_done(self):
        self.validate_state("set done", (self.StockPickingStates.IN_PROGRESS))
        with transaction.atomic():
            for stock_move in self.stock_moves.all():
                quant_from = StockQuant.objects.get_or_create_for_warehouse_and_product(
                    self.warehouse_from, stock_move.product
                )
                quant_to = StockQuant.objects.get_or_create_for_warehouse_and_product(
                    self.warehouse_to, stock_move.product
                )

                quant_from.validate_unreserve(stock_move.quantity)

                quant_from.reserved_quantity -= stock_move.quantity
                quant_to.free_quantity += stock_move.quantity

                quant_from.save()
                quant_to.save()

                self.state = self.StockPickingStates.DONE
                self.save()

    def set_cancel(self):
        self.validate_state(
            "cancel",
            (self.StockPickingStates.DRAFT, self.StockPickingStates.IN_PROGRESS),
        )
        with transaction.atomic():
            if self.state == self.StockPickingStates.IN_PROGRESS:
                for stock_move in self.stock_moves.all():
                    quant_from = (
                        StockQuant.objects.get_or_create_for_warehouse_and_product(
                            self.warehouse_from, stock_move.product
                        )
                    )
                    quant_from.unreserve_qty(stock_move.quantity)
            self.state = self.StockPickingStates.CANCELLED
            self.save()


class StockMove(BaseModel):
    product = models.ForeignKey(
        "products.Product", null=False, blank=False, on_delete=models.PROTECT
    )
    quantity = models.IntegerField(null=False, blank=False, default=0)
    stock_picking = models.ForeignKey(
        StockPicking,
        null=False,
        blank=False,
        on_delete=models.PROTECT,
        related_name="stock_moves",
    )

    def __str__(self):
        return f"Stock Move of {self.product} (Qty: {self.quantity}) for Picking: {self.stock_picking}"

    def save(self, *args, **kwargs) -> None:
        if (
            self.pk is None
            and self.stock_picking.state != StockPicking.StockPickingStates.DRAFT
        ):
            raise ValidationError(
                _(
                    "You cannot create a stock move in a stock picking that is not in Draft!"
                )
            )
        return super().save(*args, **kwargs)
