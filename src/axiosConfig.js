// src/axiosConfig.js
import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'https://isvaryam-backend.onrender.com'
    : '/';

axios.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

console.log('AXIOS BASE URL:', axios.defaults.baseURL); // ✅ Debug log
export default axios; // ✅ This line is missing in your current file
