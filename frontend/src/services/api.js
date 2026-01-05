import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store API
export const getCategories = () => api.get('/store/categories/');
export const getProducts = () => api.get('/store/products/');
export const getProduct = (slug) => api.get(`/store/products/${slug}/`);
export const getProductsByCategory = (categorySlug) => 
  api.get(`/store/products/by_category/?category=${categorySlug}`);

// Order API
export const createPaymentIntent = (data) => api.post('/store/payment/create/', data);
export const confirmPayment = (orderId) => api.post(`/store/payment/confirm/${orderId}/`);

// Dashboard API
export const getDashboardStats = () => api.get('/dashboard/stats/');
export const getRecentOrders = () => api.get('/dashboard/recent-orders/');

export default api;
