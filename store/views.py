from django.shortcuts import render
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from decimal import Decimal
import stripe

from .models import Category, Product, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, OrderSerializer, 
    CreateOrderSerializer
)

# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_slug = request.query_params.get('category')
        if category_slug:
            products = self.queryset.filter(category__slug=category_slug)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category slug is required'}, status=400)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return Order.objects.all()
            return Order.objects.filter(user=self.request.user)
        return Order.objects.none()


@api_view(['POST'])
def create_payment_intent(request):
    """Create a Stripe payment intent"""
    try:
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        items = serializer.validated_data['items']
        
        # Calculate total amount
        total_amount = Decimal('0.00')
        order_items = []
        
        for item in items:
            product = Product.objects.get(id=item['product_id'])
            quantity = int(item['quantity'])
            
            if product.stock < quantity:
                return Response(
                    {'error': f'Insufficient stock for {product.name}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            total_amount += product.price * quantity
            order_items.append({
                'product': product,
                'quantity': quantity,
                'price': product.price
            })
        
        # Create Stripe payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(total_amount * 100),  # Convert to cents
            currency='usd',
            metadata={
                'email': serializer.validated_data['email'],
                'first_name': serializer.validated_data['first_name'],
                'last_name': serializer.validated_data['last_name'],
            }
        )
        
        # Create order
        order = Order.objects.create(
            email=serializer.validated_data['email'],
            first_name=serializer.validated_data['first_name'],
            last_name=serializer.validated_data['last_name'],
            address=serializer.validated_data['address'],
            city=serializer.validated_data['city'],
            postal_code=serializer.validated_data['postal_code'],
            country=serializer.validated_data['country'],
            phone=serializer.validated_data['phone'],
            total_amount=total_amount,
            stripe_payment_intent=intent.id,
            user=request.user if request.user.is_authenticated else None
        )
        
        # Create order items
        for item_data in order_items:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                price=item_data['price'],
                quantity=item_data['quantity']
            )
        
        return Response({
            'clientSecret': intent.client_secret,
            'orderId': order.id
        })
        
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def confirm_payment(request, order_id):
    """Confirm payment and update order status"""
    try:
        order = Order.objects.get(id=order_id)
        
        # Verify payment with Stripe
        intent = stripe.PaymentIntent.retrieve(order.stripe_payment_intent)
        
        if intent.status == 'succeeded':
            order.paid = True
            order.status = 'processing'
            order.save()
            
            # Update stock
            for item in order.items.all():
                product = item.product
                product.stock -= item.quantity
                product.save()
            
            return Response({
                'message': 'Payment confirmed',
                'order': OrderSerializer(order).data
            })
        else:
            return Response(
                {'error': 'Payment not completed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

