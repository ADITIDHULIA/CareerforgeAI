import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2-minute safety buffer for heavy AI analysis
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerforge_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: any }>) => {
    if (error.response?.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('careerforge_token');
      localStorage.removeItem('careerforge_user');
      // Do not redirect if already on login/register/landing
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register') &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login?session_expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.map((e: any) => e.message || e).join(', ');
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};
