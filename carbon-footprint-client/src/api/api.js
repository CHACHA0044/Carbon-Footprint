import axios from 'axios';

// ✅ Replace localhost with your live Render backend URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://carbon-backend-ra0j.onrender.com/api', // fallback for dev
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
