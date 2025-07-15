// src/axiosConfig.js
import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://isvaryam-backend.onrender.com' // ✅ CORRECT URL
    : 'http://localhost:5000'; // or your dev backend

axios.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axios;
