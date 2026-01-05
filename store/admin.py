from django.contrib import admin
from .models import Category, Product, Order, OrderItem

# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'available', 'created_at']
    list_filter = ['available', 'category', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock', 'available']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'first_name', 'last_name', 'total_amount', 
                    'status', 'paid', 'created_at']
    list_filter = ['paid', 'status', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    inlines = [OrderItemInline]
    readonly_fields = ['stripe_payment_intent', 'created_at', 'updated_at']

