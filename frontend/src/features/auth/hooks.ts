'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setTokens, setUser } from '@/lib/utils';
import * as authApi from './api';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
      setUser(data.data.user);
      toast.success('Welcome back!');
      if (data.data.user.role === 'SUPER_ADMIN') {
        router.push('/dashboard/admin');
      } else if (data.data.user.role === 'MEDICAL_REPRESENTATIVE') {
        router.push('/dashboard/mr');
      } else if (data.data.user.role === 'RECEPTIONIST') {
        router.push('/dashboard/receptionist');
      } else {
        router.push('/dashboard/doctor');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
      setUser(data.data.user);
      toast.success('Account created successfully!');
      if (data.data.user.role === 'SUPER_ADMIN') {
        router.push('/dashboard/admin');
      } else if (data.data.user.role === 'MEDICAL_REPRESENTATIVE') {
        router.push('/dashboard/mr');
      } else if (data.data.user.role === 'RECEPTIONIST') {
        router.push('/dashboard/receptionist');
      } else {
        router.push('/dashboard/doctor');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      localStorage.clear();
      router.push('/auth/login');
      toast.info('Logged out');
    },
  });
};
