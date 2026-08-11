import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

// A render/effect error anywhere in the tree used to unmount the entire app and
// leave a blank white page. This boundary keeps the failure visible and local.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled application error:', error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <Container className="py-5" style={{ maxWidth: '640px' }}>
        <Alert variant="danger" className="rounded-3 shadow-sm">
          <Alert.Heading className="fw-bold">Something went wrong</Alert.Heading>
          <p className="mb-3 small">
            The page could not be displayed. Please reload, and if the problem
            persists contact support.
          </p>
          <pre className="small text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <Button variant="outline-danger" size="sm" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </Alert>
      </Container>
    );
  }
}
