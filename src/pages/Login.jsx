import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = ({ setIsLoggedIn, setUserProfile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`,
            Accept: 'application/json'
          }
        });
        const profile = {
          ...res.data,
          token: codeResponse.access_token,
          isAdmin: res.data.email === import.meta.env.VITE_ADMIN_EMAIL || res.data.email === 'admin@orchid.vn'
        };
        localStorage.setItem('user', JSON.stringify(profile));
        setIsLoggedIn(true);
        setUserProfile(profile);
        navigate('/');
      } catch (err) {
        console.error('Failed to fetch Google user profile:', err);
        setError('Failed to login with Google.');
      }
    },
    onError: () => setError('Google Sign In failed.'),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const response = await axios.post(`${apiBase.replace(/\/$/, '')}/auth/login`, {
        email,
        password
      });

      if (response.data.token) {
        const userObj = {
          ...response.data,
          isAdmin: !!(response.data.isAdmin || response.data.admin)
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        setIsLoggedIn(true);
        setUserProfile(userObj);
        navigate('/');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Card className="p-4 shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <svg width="40" height="40" fill="none" stroke="var(--bs-primary)" strokeWidth="2.5" viewBox="0 0 24 24" className="mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21V9.75M12 9.75a3 3 0 1 1 6 0M12 9.75a3 3 0 1 0-6 0M6 9.75a6 6 0 0 1 12 0" />
          </svg>
          <h3 className="fw-bold text-dark">Welcome Back</h3>
          <p className="text-muted small">Please login to your account</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-semibold text-muted">Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="py-2"
            />
          </Form.Group>
          <Button variant="premium-action" type="submit" className="w-100 py-2 rounded-pill fw-semibold mb-3">
            Sign In
          </Button>
        </Form>

        <div className="d-flex align-items-center my-3 text-muted">
          <hr className="flex-grow-1" />
          <span className="px-2 small text-uppercase fw-semibold">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <Button 
          variant="outline-dark" 
          className="w-100 py-2 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2 border-1"
          onClick={() => googleLogin()}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.2-.43-4.75H24v9h12.75c-.55 2.94-2.21 5.44-4.71 7.12l7.31 5.67C43.6 36.6 46.5 30.82 46.5 24z" />
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.3-5.68c-2.03 1.36-4.63 2.18-8.59 2.18-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Sign in with Google</span>
        </Button>

        <div className="text-center mt-4">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="small fw-semibold text-decoration-none">Sign Up</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
