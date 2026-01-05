import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../utils/CartContext';
import { confirmPayment } from '../services/api';
import './CheckoutForm.css';

const CheckoutForm = ({ orderId, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else {
        // Payment successful, confirm with backend
        await confirmPayment(orderId);
        clearCart();
        navigate('/payment-success', { 
          state: { orderId, totalAmount } 
        });
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      {error && <div className="payment-error">{error}</div>}
      
      <PaymentElement />
      
      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="btn-pay"
      >
        {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
