from django.core.management.base import BaseCommand
from store.models import Category, Product
from decimal import Decimal


class Command(BaseCommand):
    help = 'Populate the database with sample products'

    def handle(self, *args, **kwargs):
        # Create categories
        categories_data = [
            {'name': 'Electronics', 'slug': 'electronics', 'description': 'Electronic devices and accessories'},
            {'name': 'Clothing', 'slug': 'clothing', 'description': 'Fashion and apparel'},
            {'name': 'Books', 'slug': 'books', 'description': 'Books and publications'},
            {'name': 'Home & Garden', 'slug': 'home-garden', 'description': 'Home and garden products'},
            {'name': 'Sports', 'slug': 'sports', 'description': 'Sports equipment and accessories'},
        ]
        
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'description': cat_data['description']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
        
        # Create products
        products_data = [
            # Electronics
            {'name': 'Wireless Headphones', 'slug': 'wireless-headphones', 'description': 'High-quality wireless headphones with noise cancellation', 'price': Decimal('129.99'), 'category_slug': 'electronics', 'stock': 50},
            {'name': 'Smart Watch', 'slug': 'smart-watch', 'description': 'Feature-rich smartwatch with health tracking', 'price': Decimal('299.99'), 'category_slug': 'electronics', 'stock': 30},
            {'name': 'Laptop Stand', 'slug': 'laptop-stand', 'description': 'Ergonomic adjustable laptop stand', 'price': Decimal('49.99'), 'category_slug': 'electronics', 'stock': 100},
            {'name': 'USB-C Hub', 'slug': 'usbc-hub', 'description': 'Multi-port USB-C hub with HDMI and card reader', 'price': Decimal('39.99'), 'category_slug': 'electronics', 'stock': 75},
            
            # Clothing
            {'name': 'Classic T-Shirt', 'slug': 'classic-tshirt', 'description': 'Comfortable cotton t-shirt in various colors', 'price': Decimal('19.99'), 'category_slug': 'clothing', 'stock': 200},
            {'name': 'Denim Jeans', 'slug': 'denim-jeans', 'description': 'Premium quality denim jeans', 'price': Decimal('69.99'), 'category_slug': 'clothing', 'stock': 80},
            {'name': 'Running Shoes', 'slug': 'running-shoes', 'description': 'Lightweight running shoes with great cushioning', 'price': Decimal('89.99'), 'category_slug': 'clothing', 'stock': 60},
            
            # Books
            {'name': 'Python Programming Guide', 'slug': 'python-programming-guide', 'description': 'Comprehensive guide to Python programming', 'price': Decimal('34.99'), 'category_slug': 'books', 'stock': 45},
            {'name': 'Web Development Handbook', 'slug': 'web-dev-handbook', 'description': 'Modern web development techniques and best practices', 'price': Decimal('39.99'), 'category_slug': 'books', 'stock': 35},
            
            # Home & Garden
            {'name': 'Plant Pot Set', 'slug': 'plant-pot-set', 'description': 'Set of 3 ceramic plant pots', 'price': Decimal('24.99'), 'category_slug': 'home-garden', 'stock': 90},
            {'name': 'LED Desk Lamp', 'slug': 'led-desk-lamp', 'description': 'Adjustable LED desk lamp with USB charging', 'price': Decimal('44.99'), 'category_slug': 'home-garden', 'stock': 70},
            
            # Sports
            {'name': 'Yoga Mat', 'slug': 'yoga-mat', 'description': 'Non-slip premium yoga mat', 'price': Decimal('29.99'), 'category_slug': 'sports', 'stock': 120},
            {'name': 'Water Bottle', 'slug': 'water-bottle', 'description': 'Insulated stainless steel water bottle', 'price': Decimal('19.99'), 'category_slug': 'sports', 'stock': 150},
        ]
        
        for prod_data in products_data:
            category = Category.objects.get(slug=prod_data['category_slug'])
            product, created = Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults={
                    'name': prod_data['name'],
                    'description': prod_data['description'],
                    'price': prod_data['price'],
                    'category': category,
                    'stock': prod_data['stock'],
                    'available': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
        
        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
