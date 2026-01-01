import axios from 'axios';
import type { LoginRequest, LoginResponse } from '../types';

const API_BASE_URL = 'https://test-backend-host.safaee1361.workers.dev/api/admin';

export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // API requires form-urlencoded format
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await axios.post<LoginResponse>(
    `${API_BASE_URL}/auth/login`,
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
};

export const logoutApi = (): void => {
  localStorage.removeItem('hoviat_token');
  localStorage.removeItem('hoviat_user');
  window.location.href = '/login';
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('hoviat_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('hoviat_token');
};
