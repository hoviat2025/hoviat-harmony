import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://hoviat-admin-fast-api.onrender.com/api/admin';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add Authorization Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('hoviat_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Auth Errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.error?.message || 'خطایی رخ داده است';

    switch (status) {
      case 401:
        // Unauthorized - Redirect to login
        localStorage.removeItem('hoviat_token');
        localStorage.removeItem('hoviat_user');
        window.location.href = '/login';
        break;
      
      case 403:
        // Forbidden - Show toast, do NOT redirect
        toast({
          variant: 'destructive',
          title: 'دسترسی محدود',
          description: 'شما مجوز دسترسی به این بخش را ندارید',
        });
        break;
      
      case 404:
        toast({
          variant: 'destructive',
          title: 'یافت نشد',
          description: 'منبع مورد نظر یافت نشد',
        });
        break;
      
      case 422:
        toast({
          variant: 'destructive',
          title: 'ورودی نامعتبر',
          description: errorMessage,
        });
        break;
      
      default:
        if (status && status >= 500) {
          toast({
            variant: 'destructive',
            title: 'خطای سرور',
            description: 'لطفاً دوباره تلاش کنید',
          });
        }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
