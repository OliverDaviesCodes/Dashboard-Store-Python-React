import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    localStorage.setItem('adminToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('adminToken');
  }
};

const existingToken = localStorage.getItem('adminToken');
if (existingToken) {
  setAuthToken(existingToken);
}

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

// Auth API
export const loginAdmin = (username, password) =>
  api.post('/auth/login/', { username, password });
export const logoutAdmin = () => api.post('/auth/logout/');

export default api;
