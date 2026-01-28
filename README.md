# Dashboard-Store-Python-React

A complex e-commerce store built with Python (Django) and React featuring an exquisite main page, complete payment functionality with Stripe, and an admin dashboard with data analytics.

## Features

### Store Features
- 🛍️ **Main Page**: Beautiful, responsive design with smooth animations
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
- React 19
- React Router v7
- Axios for API calls
- Stripe.js & React Stripe Elements
- Recharts for data visualization

## Installation & Setup

### Prerequisites
- Python 3.12 (recommended)
- Node.js 18 or higher
- npm (or yarn)

On Windows, you can install Python 3.12 via winget:

```powershell
winget install --id Python.Python.3.12 -e --source winget --accept-package-agreements --accept-source-agreements
```

### Backend Setup (Windows quick start)

1. **Navigate to project directory:**
```powershell
cd Dashboard-Store-Python-React
```

2. **Create and use a virtual environment (Python 3.12):**
```powershell
py -3.12 -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```
If activation fails or you prefer not to activate, you can still use the venv by prefixing commands with `.-venv\Scripts\python.exe`.

3. **Install Python dependencies:**
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

4. **Run database migrations:**
```powershell
python manage.py migrate
```

5. **Populate database with sample data:**
```powershell
python manage.py populate_db
```

6. **Create admin superuser:**
```powershell
python manage.py createsuperuser
```

7. **Start Django development server:**
```powershell
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

The frontend API base URL is configured in [frontend/src/services/api.js](frontend/src/services/api.js) as `http://localhost:8000/api`.

## Stripe Testing

Use test cards from [STRIPE_TEST_CARDS.md](STRIPE_TEST_CARDS.md) to exercise payment flows.

This project creates a Stripe PaymentIntent and later confirms the payment by retrieving the intent server-side. Webhooks are not required for local testing.

## Admin Dashboard Access

1. **Django Admin Panel:**
   - URL: `http://localhost:8000/admin/`
   - Username: `admin`
   - Password: `admin123`
   - Manage products, orders, categories directly

2. **React Dashboard:**
   - URL: `http://localhost:3000/dashboard`
   - Requires admin authentication (backend enforces `IsAdminUser` on dashboard endpoints)
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

Dashboard endpoints are restricted to admin users (`IsAdminUser`). Ensure you log in with your superuser when accessing dashboard data from the React app.

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

## Troubleshooting (Windows)

- **pip not found after upgrade**: Use `python -m pip` inside the venv to avoid PATH issues.
- **Missing Activate.ps1**: Recreate the venv with Python 3.12: `py -3.12 -m venv .venv`. Ensure you run PowerShell with `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` before activation.
- **Pillow build errors / Django import errors**: If you installed Python 3.14, dependencies may fail. Install Python 3.12 via winget and recreate the venv, then reinstall requirements.
- **CORS issues**: Backend allows `http://localhost:3000`. Ensure the React app runs on that port or update [backend/settings.py](backend/settings.py) `CORS_ALLOWED_ORIGINS`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the GitHub repository.

