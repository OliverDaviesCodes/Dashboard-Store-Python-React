import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import { useCart } from '../utils/CartContext';
import './Home.css';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
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
    setSnackMessage(`${product.name} added to cart!`);
    setSnackOpen(true);
  };

  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
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

      <Box sx={{ py: 6, backgroundColor: 'background.default' }}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom>
            Shop by Category
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ my: 2 }}>
            <Chip
              label="All Products"
              color={selectedCategory === 'all' ? 'primary' : 'default'}
              variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              onClick={() => setSelectedCategory('all')}
            />
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                color={selectedCategory === category.name ? 'primary' : 'default'}
                variant={selectedCategory === category.name ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(category.name)}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {product.image ? (
                  <CardMedia component="img" height="200" image={product.image} alt={product.name} />
                ) : (
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
                    <Typography variant="body2" color="text.secondary">No Image</Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    {product.category_name}
                  </Typography>
                  <Typography variant="h5" color="success.main" sx={{ my: 1, fontWeight: 'bold' }}>
                    ${parseFloat(product.price).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description.substring(0, 80)}...
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
                  <Button
                    component={Link}
                    to={`/product/${product.slug}`}
                    variant="outlined"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    variant="contained"
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">🚚 Free Shipping</Typography>
                <Typography variant="body2" color="text.secondary">On orders over $50</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">💳 Secure Payment</Typography>
                <Typography variant="body2" color="text.secondary">Powered by Stripe</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">↩️ Easy Returns</Typography>
                <Typography variant="body2" color="text.secondary">30-day return policy</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">⭐ Quality Products</Typography>
                <Typography variant="body2" color="text.secondary">Premium selection</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={snackOpen} autoHideDuration={2500} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
