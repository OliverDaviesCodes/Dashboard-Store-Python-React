from django.shortcuts import render
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from datetime import datetime, timedelta

from store.models import Order, Product, OrderItem

# Create your views here.


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """Get dashboard statistics"""
    
    # Total revenue
    total_revenue = Order.objects.filter(paid=True).aggregate(
        total=Sum('total_amount')
    )['total'] or 0
    
    # Total orders
    total_orders = Order.objects.count()
    paid_orders = Order.objects.filter(paid=True).count()
    
    # Total products
    total_products = Product.objects.count()
    available_products = Product.objects.filter(available=True).count()
    
    # Average order value
    avg_order_value = Order.objects.filter(paid=True).aggregate(
        avg=Avg('total_amount')
    )['avg'] or 0
    
    # Recent orders (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_orders = Order.objects.filter(
        created_at__gte=seven_days_ago
    ).count()
    
    recent_revenue = Order.objects.filter(
        paid=True,
        created_at__gte=seven_days_ago
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Orders by status
    orders_by_status = Order.objects.values('status').annotate(
        count=Count('id')
    )
    
    # Top selling products
    top_products = OrderItem.objects.values(
        'product__name', 'product__price'
    ).annotate(
        total_quantity=Sum('quantity'),
        total_revenue=Sum('price') * Sum('quantity')
    ).order_by('-total_quantity')[:5]
    
    # Daily revenue for the last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    daily_revenue = Order.objects.filter(
        paid=True,
        created_at__gte=thirty_days_ago
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        revenue=Sum('total_amount'),
        orders=Count('id')
    ).order_by('date')
    
    # Low stock products
    low_stock_products = Product.objects.filter(
        stock__lte=10,
        available=True
    ).values('id', 'name', 'stock', 'price')
    
    return Response({
        'summary': {
            'total_revenue': float(total_revenue),
            'total_orders': total_orders,
            'paid_orders': paid_orders,
            'total_products': total_products,
            'available_products': available_products,
            'avg_order_value': float(avg_order_value),
            'recent_orders': recent_orders,
            'recent_revenue': float(recent_revenue),
        },
        'orders_by_status': list(orders_by_status),
        'top_products': list(top_products),
        'daily_revenue': list(daily_revenue),
        'low_stock_products': list(low_stock_products),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def recent_orders(request):
    """Get recent orders"""
    from store.serializers import OrderSerializer
    
    orders = Order.objects.all()[:10]
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

