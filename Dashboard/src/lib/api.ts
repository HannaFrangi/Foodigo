import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = "http://localhost:5001/api";
  // import.meta.env.MODE === 'development' ? 'http://localhost:5001/api/' : '/api/';

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to handle auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      console.log('Unauthorized access');
      toast("hateNiggers")
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await axiosInstance.post('/auth/adminlogin', {
      email: credentials.email,
      password: credentials.password,
    }, {
      withCredentials: true,
    });
    return response.data;
  },

getInsights : async () => {
    const response = await axiosInstance.get('/admin', {
      withCredentials: true,
    });
    return response.data;
},

getAllUsers : async () => { 
  const response = await axiosInstance.get('/admin/all-users');
  return response.data; 
} , 

}