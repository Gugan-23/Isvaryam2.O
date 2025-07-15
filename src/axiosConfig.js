// src/axiosConfig.js
import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'https://isvaryam-backend.onrender.com' // development or staging
    : 'https://isvaryam-backend.onrender.com'; // production (change if needed)

// Attach token to every request if available
axios.interceptors.request.use(config => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.warn('Invalid user token in localStorage');
  }
  return config;
}, error => Promise.reject(error));



console.log('AXIOS BASE URL:', axios.defaults.baseURL); // ✅ Debug log


export default axios;
