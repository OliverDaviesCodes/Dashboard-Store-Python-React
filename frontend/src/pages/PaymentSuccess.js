import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = location.state || {};

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {orderId && (
          <div className="order-details">
            <p><strong>Order ID:</strong> #{orderId}</p>
            {totalAmount && (
              <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
            )}
          </div>
        )}
        <p className="email-notice">
          A confirmation email has been sent to your email address.
        </p>
        <button onClick={() => navigate('/')} className="btn-home">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
