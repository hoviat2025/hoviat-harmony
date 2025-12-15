import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginApi, logoutApi, getStoredUser, isAuthenticated } from '../api/authApi';
import type { LoginRequest, AuthUser } from '../types';
import { toast } from '@/hooks/use-toast';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Store token and user info
      localStorage.setItem('hoviat_token', data.access_token);
      localStorage.setItem('hoviat_user', JSON.stringify({
        username: data.username,
        is_superadmin: data.is_superadmin,
      }));

      toast({
        title: 'ورود موفق',
        description: `خوش آمدید ${data.username}`,
      });

      // Redirect to dashboard
      navigate('/');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'خطا در ورود',
        description: 'نام کاربری یا رمز عبور اشتباه است',
      });
    },
  });
};

export const useLogout = () => {
  return () => {
    logoutApi();
  };
};

export const useCurrentUser = (): AuthUser | null => {
  return getStoredUser();
};

export const useIsAuthenticated = (): boolean => {
  return isAuthenticated();
};
