// src/axiosConfig.js
import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV === 'production'
    ? '/api' // ✅ production points to server-side API
    : 'https://isvaryam2-o.onrender.com/api'; // ✅ dev uses deployed backend

axios.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

console.log('AXIOS BASE URL:', axios.defaults.baseURL); // ✅ Debug log

export default axios;
