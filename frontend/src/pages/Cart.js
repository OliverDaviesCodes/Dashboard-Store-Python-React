import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../utils/CartContext';
import './Cart.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setSnackMessage('Your cart is empty!');
      setSnackOpen(true);
      return;
    }
    navigate('/checkout');
  };

  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackOpen(false);
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>Your Cart is Empty</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Add some products to get started!
        </Typography>
        <Button component={Link} to="/" variant="contained">Continue Shopping</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            {cartItems.map((item, idx) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                <Box sx={{ width: 96, height: 96, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 1 }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Typography variant="caption" color="text.secondary">No Image</Typography>
                  )}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.category_name}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>${parseFloat(item.price).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button variant="outlined" size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
                  <Button variant="outlined" size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                </Box>
                <Typography sx={{ minWidth: 80, textAlign: 'right' }}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Typography>
                <IconButton color="error" onClick={() => removeFromCart(item.id)} aria-label="Remove">
                  <DeleteIcon />
                </IconButton>
                {idx < cartItems.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${getCartTotal().toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1, fontWeight: 700 }}>
              <Typography fontWeight={700}>Total:</Typography>
              <Typography fontWeight={700}>${getCartTotal().toFixed(2)}</Typography>
            </Box>
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleCheckout}>Proceed to Checkout</Button>
            <Button fullWidth component={Link} to="/" variant="text" sx={{ mt: 1 }}>Continue Shopping</Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snackOpen} autoHideDuration={2500} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackClose} severity="warning" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
