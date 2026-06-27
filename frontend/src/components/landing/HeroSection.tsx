'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => (
  <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 pointer-events-none" />
    <div className="relative mx-auto max-w-7xl px-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-8">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
        Trusted by healthcare professionals
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
        Prescription Management{' '}
        <span className="text-gradient">Made Simple</span>
      </h1>
      <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
        A modern SaaS platform that streamlines patient management, prescription creation,
        appointment scheduling, and clinic operations — all in one place.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/auth/register">
          <Button size="lg" className="w-full sm:w-auto text-base gap-2">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
            See Features
          </Button>
        </Link>
      </div>
      <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free plan available</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
      </div>
    </div>
  </section>
);
