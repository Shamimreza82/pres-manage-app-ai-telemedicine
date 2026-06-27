'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { getAuthToken, getUser } from '@/lib/utils';


export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    const user = getUser();
    if (user?.role === 'SUPER_ADMIN') router.push('/dashboard/admin');
    else if (user?.role === 'MEDICAL_REPRESENTATIVE') router.push('/dashboard/mr');
    else if (user?.role === 'RECEPTIONIST') router.push('/dashboard/receptionist');
    else router.push('/dashboard/doctor');
  }, [router]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </>
  );
}
