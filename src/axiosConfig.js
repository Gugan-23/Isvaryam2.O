// src/axiosConfig.js
import axios from 'axios';

// Use the correct backend URL consistently
const backendBaseURL = 'https://isvaryam2-o.onrender.com'; // or your actual backend URL

axios.defaults.baseURL = backendBaseURL;

axios.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});


console.log('AXIOS BASE URL:', axios.defaults.baseURL); // ✅ Debug log
export default axios;
