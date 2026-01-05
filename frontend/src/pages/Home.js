import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import { useCart } from '../utils/CartContext';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsRes.data.results || productsRes.data);
      setCategories(categoriesRes.data.results || categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category_name === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Exquisite Store</h1>
          <p>Discover premium products at unbeatable prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-filters">
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={selectedCategory === category.name ? 'active' : ''}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category_name}</p>
                <p className="price">${parseFloat(product.price).toFixed(2)}</p>
                <p className="description">
                  {product.description.substring(0, 80)}...
                </p>
                <div className="product-actions">
                  <Link to={`/product/${product.slug}`} className="btn-details">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-add-cart"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>🚚 Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="feature">
          <h3>💳 Secure Payment</h3>
          <p>Powered by Stripe</p>
        </div>
        <div className="feature">
          <h3>↩️ Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature">
          <h3>⭐ Quality Products</h3>
          <p>Premium selection</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
