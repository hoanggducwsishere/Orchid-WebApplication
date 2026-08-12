import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import PageLoader from '../components/PageLoader';
import { API_BASE_URL, getRequestErrorMessage } from '../config/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(getRequestErrorMessage(err, 'Registration failed'));
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Card className="p-4 shadow-lg border-0 rounded-4 position-relative overflow-hidden" style={{ width: '100%', maxWidth: '400px' }}>
        {isLoading && <PageLoader overlay message="Creating your account..." />}

        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">Create Account</h3>
          <p className="text-muted small">Join the Orchid Collection</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-muted">Full Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-semibold text-muted">Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="py-2"
            />
          </Form.Group>
          <Button 
            variant="premium-action" 
            type="submit" 
            disabled={isLoading}
            className="w-100 py-2 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                <span>Signing Up...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </Button>
        </Form>
        <div className="text-center mt-4">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="small fw-semibold text-decoration-none">Sign In</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;

