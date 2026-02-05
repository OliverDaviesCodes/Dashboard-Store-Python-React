import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, setAuthToken } from '../services/api';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAdmin(username, password);
      const { token } = res.data;
      setAuthToken(token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Admin Login</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sign in with a superuser account to access the dashboard.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
