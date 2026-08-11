import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App.jsx';

import { Provider } from 'react-redux';

import { store } from './redux/store';

import { BrowserRouter } from 'react-router-dom';

import { GoogleOAuthProvider } from '@react-oauth/google';

import ErrorBoundary from './components/ErrorBoundary';

import { googleClientId, isGoogleAuthEnabled } from './config/googleAuth';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './styles/app.scss';

// Google sign-in is optional: when no client id is configured the app still
// renders, it just does not offer the Google button.
const withGoogleAuth = (children) =>
  isGoogleAuthEnabled ? (
    <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
  ) : (
    children
  );

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <ErrorBoundary>

      <Provider store={store}>

        <BrowserRouter>

          {withGoogleAuth(<App />)}

        </BrowserRouter>

      </Provider>

    </ErrorBoundary>

  </React.StrictMode>,

);
