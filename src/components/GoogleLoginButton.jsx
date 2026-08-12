import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { API_BASE_URL, getRequestErrorMessage } from '../config/api';

// Kept in its own component so the useGoogleLogin hook only ever runs when a
// Google client id is configured. See src/config/googleAuth.js.
const GoogleLoginButton = ({ onSuccess, onError, loading: externalLoading, onLoadingStart, onLoadingEnd }) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setInternalLoading(true);
      if (onLoadingStart) onLoadingStart('Verifying Google credentials...');

      try {
        // Exchange the Google access token for this app's own JWT. Storing the
        // Google token instead would fail every API call: it is an opaque string,
        // not a JWT, so the backend cannot parse it.
        const res = await axios.post(`${API_BASE_URL}/auth/google`, {
          accessToken: codeResponse.access_token
        });

        onSuccess({
          ...res.data,
          isAdmin: !!(res.data.isAdmin || res.data.admin)
        });
      } catch (err) {
        console.error('Google login failed:', err);
        onError(getRequestErrorMessage(err, 'Failed to login with Google.'));
      } finally {
        setInternalLoading(false);
        if (onLoadingEnd) onLoadingEnd();
      }
    },
    onError: () => {
      if (onLoadingEnd) onLoadingEnd();
      onError('Google Sign In failed.');
    },
  });

  return (
    <Button
      variant="outline-dark"
      className="w-100 py-2 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2 border-1"
      onClick={() => googleLogin()}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          <span>Connecting Google...</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.2-.43-4.75H24v9h12.75c-.55 2.94-2.21 5.44-4.71 7.12l7.31 5.67C43.6 36.6 46.5 30.82 46.5 24z" />
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.3-5.68c-2.03 1.36-4.63 2.18-8.59 2.18-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Sign in with Google</span>
        </>
      )}
    </Button>
  );
};

export default GoogleLoginButton;

