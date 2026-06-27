'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuthToken, getUser } from '@/lib/utils';

export const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) router.push('/auth/login');
  }, [router]);
};

export const useAdminGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const user = getUser();
    if (user?.role !== 'SUPER_ADMIN') {
      router.push('/');
    }
  }, [router]);
};

export const useCurrentUser = () => getUser();
