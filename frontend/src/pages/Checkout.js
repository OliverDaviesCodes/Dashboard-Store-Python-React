import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { useCart } from '../utils/CartContext';
import { createPaymentIntent } from '../services/api';
import './Checkout.css';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

// Use test public key
const stripePromise = loadStripe('pk_test_51QRnzqGm2OGWjUXK0000000000000000000000000000000000000000000');

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const items = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const response = await createPaymentIntent({
        ...formData,
        items,
      });

      setClientSecret(response.data.clientSecret);
      setOrderId(response.data.orderId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create payment intent');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Go to Home</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            {!clientSecret ? (
              <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>Billing Information</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Postal Code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </form>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>Payment Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">Test Card Details</Typography>
                  <Typography variant="body2"><strong>Success:</strong> 4242 4242 4242 4242</Typography>
                  <Typography variant="body2"><strong>Requires authentication:</strong> 4000 0025 0000 3155</Typography>
                  <Typography variant="body2"><strong>Declined:</strong> 4000 0000 0000 9995</Typography>
                  <Typography variant="body2">Use any future expiry date, any 3-digit CVC, and any postal code</Typography>
                </Box>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    totalAmount={getCartTotal()}
                  />
                </Elements>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                <Typography>{item.name} x {item.quantity}</Typography>
                <Typography>${(parseFloat(item.price) * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${getCartTotal().toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>Free</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1, fontWeight: 700 }}>
              <Typography fontWeight={700}>Total:</Typography>
              <Typography fontWeight={700}>${getCartTotal().toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
