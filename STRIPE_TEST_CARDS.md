# Stripe Test Card Details

## For Testing Payment Functionality

This document provides test card details for testing the Stripe payment integration in the Dashboard Store.

### ✅ Successful Payment

**Card Number**: `4242 4242 4242 4242`  
**Expiry Date**: Any future date (e.g., `12/28`, `01/30`)  
**CVC**: Any 3 digits (e.g., `123`, `456`)  
**ZIP/Postal Code**: Any 5 digits (e.g., `12345`, `90210`)

**Result**: Payment will be processed successfully and the order will be confirmed.

---

### 🔒 Requires Authentication (3D Secure)

**Card Number**: `4000 0025 0000 3155`  
**Expiry Date**: Any future date  
**CVC**: Any 3 digits  
**ZIP/Postal Code**: Any 5 digits  

**Result**: Payment will require additional authentication (3D Secure) before being processed.

---

### ❌ Declined Payment

**Card Number**: `4000 0000 0000 9995`  
**Expiry Date**: Any future date  
**CVC**: Any 3 digits  
**ZIP/Postal Code**: Any 5 digits  

**Result**: Payment will be declined with a generic decline message.

---

## Additional Test Cards

### Insufficient Funds
**Card Number**: `4000 0000 0000 9995`

### Lost Card
**Card Number**: `4000 0000 0000 9987`

### Stolen Card
**Card Number**: `4000 0000 0000 9979`

### Expired Card
**Card Number**: `4000 0000 0000 0069`

---

## Testing Workflow

1. **Browse Products**: Navigate to http://localhost:3000
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the cart icon in the header
4. **Checkout**: Click "Proceed to Checkout"
5. **Fill Billing Info**: Enter your details
6. **Continue to Payment**: Click the button
7. **Enter Card Details**: Use one of the test cards above
8. **Complete Payment**: Click "Pay" button
9. **View Confirmation**: See the success page with order details

---

## Notes

- All test cards require **any future expiry date**
- Use **any 3-digit CVC code**
- Use **any 5-digit postal code**
- These cards only work in **test mode** (not in production)
- For more test cards, visit: https://stripe.com/docs/testing

---

## Admin Access

To view orders in the admin dashboard:

1. Navigate to http://localhost:8000/admin/
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click on "Orders" under the "STORE" section
4. View all completed orders with payment status

---

**Happy Testing!** 🎉
