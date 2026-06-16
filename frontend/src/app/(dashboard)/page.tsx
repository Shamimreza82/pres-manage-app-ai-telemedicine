'use client';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/utils';

export default function DashboardRedirect() {
  const user = getUser();
  if (user?.role === 'SUPER_ADMIN') redirect('/dashboard/admin');
  if (user?.role === 'MEDICAL_REPRESENTATIVE') redirect('/dashboard/mr');
  redirect('/dashboard/doctor');
}
