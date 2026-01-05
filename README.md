# Dashboard-Store-Python-React

A complex e-commerce store built with Python (Django) and React featuring an exquisite main page, complete payment functionality with Stripe, and an admin dashboard with data analytics.

## Features

### Store Features
- 🛍️ **Exquisite Main Page**: Beautiful, responsive design with smooth animations
- 📦 **Product Management**: Browse products by category with detailed views
- 🛒 **Shopping Cart**: Full cart functionality with quantity management
- 💳 **Stripe Payment Integration**: Secure payment processing with test mode
- ✅ **Order Confirmation**: Payment success page with order details

### Admin Dashboard Features
- 📊 **Data Analytics**: Comprehensive statistics and visualizations
- 💰 **Revenue Tracking**: Total and recent revenue metrics
- 📈 **Sales Charts**: Line and bar charts for daily revenue and order status
- 🏆 **Top Products**: See best-selling items
- ⚠️ **Low Stock Alerts**: Monitor inventory levels
- 📋 **Order Management**: View and manage all orders

## Technology Stack

### Backend
- Python 3.12+
- Django 5.0
- Django REST Framework
- Stripe Python SDK
- SQLite Database (can be changed to PostgreSQL)

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Stripe.js & React Stripe Elements
- Recharts for data visualization

## Installation & Setup

### Prerequisites
- Python 3.12 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. **Navigate to project directory:**
```bash
cd Dashboard-Store-Python-React
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run database migrations:**
```bash
python manage.py migrate
```

4. **Populate database with sample data:**
```bash
python manage.py populate_db
```

5. **Create admin superuser:**
```bash
python manage.py createsuperuser
# Use: username=admin, email=admin@store.com, password=admin123
```

6. **Start Django development server:**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install npm dependencies:**
```bash
npm install
```

3. **Start React development server:**
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

## Stripe Test Card Details

Use these test cards to test payment functionality:

### Successful Payment
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Requires Authentication (3D Secure)
- **Card Number**: `4000 0025 0000 3155`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### Declined Payment
- **Card Number**: `4000 0000 0000 9995`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

## Admin Dashboard Access

1. **Django Admin Panel:**
   - URL: `http://localhost:8000/admin/`
   - Username: `admin`
   - Password: `admin123`
   - Manage products, orders, categories directly

2. **React Dashboard:**
   - URL: `http://localhost:3000/dashboard`
   - Requires admin authentication
   - View analytics, charts, and statistics

## API Endpoints

### Store API
- `GET /api/store/categories/` - List all categories
- `GET /api/store/products/` - List all products
- `GET /api/store/products/{slug}/` - Get product details
- `GET /api/store/products/by_category/?category={slug}` - Filter by category
- `POST /api/store/payment/create/` - Create payment intent
- `POST /api/store/payment/confirm/{order_id}/` - Confirm payment

### Dashboard API
- `GET /api/dashboard/stats/` - Get dashboard statistics
- `GET /api/dashboard/recent-orders/` - Get recent orders

## Project Structure

```
Dashboard-Store-Python-React/
├── backend/                 # Django settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── store/                   # Store app
│   ├── models.py           # Product, Order, Category models
│   ├── views.py            # API views
│   ├── serializers.py      # DRF serializers
│   ├── admin.py            # Django admin config
│   └── management/         # Management commands
├── dashboard/              # Dashboard app
│   ├── views.py           # Dashboard analytics views
│   └── urls.py
├── frontend/               # React application
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── utils/         # Utilities (CartContext)
│       └── App.js
├── requirements.txt        # Python dependencies
└── manage.py              # Django management script
```

## Sample Products

The database includes sample products in the following categories:
- Electronics (Wireless Headphones, Smart Watch, Laptop Stand, USB-C Hub)
- Clothing (Classic T-Shirt, Denim Jeans, Running Shoes)
- Books (Python Programming Guide, Web Development Handbook)
- Home & Garden (Plant Pot Set, LED Desk Lamp)
- Sports (Yoga Mat, Water Bottle)

## Usage

1. **Browse Products**: Visit the home page to see all products
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the cart icon in the header
4. **Checkout**: Proceed to checkout and fill in billing information
5. **Payment**: Use test card details to complete payment
6. **Success**: View order confirmation and return to shopping

## Development

### Backend Development
- Models are in `store/models.py`
- API views in `store/views.py`
- Admin dashboard views in `dashboard/views.py`

### Frontend Development
- Main pages in `frontend/src/pages/`
- Reusable components in `frontend/src/components/`
- API calls in `frontend/src/services/api.js`
- Cart state management in `frontend/src/utils/CartContext.js`

## Security Notes

- The Stripe keys in this project are **test keys only**
- Never commit real Stripe secret keys to version control
- Use environment variables for production deployment
- The default Django secret key should be changed in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the GitHub repository.

