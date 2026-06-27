'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PricingSection = () => (
  <section id="pricing" className="py-20 md:py-28 bg-muted/50">
    <div className="mx-auto max-w-7xl px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
      <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-12">Start for free, scale as you grow.</p>
      <Link href="/auth/register"><Button size="lg" className="text-base gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
    </div>
  </section>
);
