import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App.jsx';

import { Provider } from 'react-redux';

import { store } from './redux/store';

import { BrowserRouter } from 'react-router-dom';

import { GoogleOAuthProvider } from '@react-oauth/google';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './styles/app.scss';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '658378569553-vhfuo85a3clthm6gk8ef4vga5qb5dgr2.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <Provider store={store}>

      <BrowserRouter>

        <GoogleOAuthProvider clientId={googleClientId}>

          <App />

        </GoogleOAuthProvider>

      </BrowserRouter>

    </Provider>

  </React.StrictMode>,

);