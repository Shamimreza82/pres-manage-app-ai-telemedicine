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

export const useAdminGuard = useAuthGuard;

export const useCurrentUser = () => getUser();
