import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import CartProvider from './hooks/useCart';
import './axiosConfig';
import { AuthProvider } from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider } from './hooks/useLoading';
import './interceptors/authInterceptor';
import 'bootstrap/dist/css/bootstrap.min.css';

// Google Fonts (move this to index.html instead)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> // REMOVE THIS LINE TO PREVENT DOUBLE RENDER IN DEV
    <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <App />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  // </React.StrictMode> // REMOVE THIS LINE TOO
);

reportWebVitals();
