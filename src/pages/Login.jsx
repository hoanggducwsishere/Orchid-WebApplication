import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { isGoogleAuthEnabled } from '../config/googleAuth';
import { API_BASE_URL, getRequestErrorMessage } from '../config/api';

const Login = ({ setIsLoggedIn, setUserProfile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Set by the API client when it clears an expired session, so the redirect does
  // not look like the app randomly logged the user out.
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';

  const handleGoogleSuccess = (profile) => {
    localStorage.setItem('user', JSON.stringify(profile));
    setIsLoggedIn(true);
    setUserProfile(profile);
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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
      setError(getRequestErrorMessage(err, 'Invalid email or password'));
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
        
        {sessionExpired && !error && (
          <Alert variant="warning" className="py-2 small">
            Your session has expired. Please sign in again.
          </Alert>
        )}

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

        {isGoogleAuthEnabled && (
          <>
            <div className="d-flex align-items-center my-3 text-muted">
              <hr className="flex-grow-1" />
              <span className="px-2 small text-uppercase fw-semibold">OR</span>
              <hr className="flex-grow-1" />
            </div>

            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={setError} />
          </>
        )}

        <div className="text-center mt-4">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="small fw-semibold text-decoration-none">Sign Up</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
