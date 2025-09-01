import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://foodigo.onrender.com/api'
    : '/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies for auth validation
  headers: {
    'Content-Type': 'application/json',
  },
});
