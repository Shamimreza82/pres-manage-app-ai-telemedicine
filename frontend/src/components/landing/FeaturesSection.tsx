'use client';

import { Stethoscope, FileText, Calendar, Shield } from 'lucide-react';

const FEATURES = [
  { icon: FileText, title: 'Digital Prescriptions', desc: 'Create, manage, and share prescriptions digitally with auto-generated PDFs.' },
  { icon: Calendar, title: 'Appointment Management', desc: 'Schedule and track patient appointments with auto serial number generation.' },
  { icon: Stethoscope, title: 'Patient Records', desc: 'Maintain comprehensive patient history, vitals, and medical records.' },
  { icon: Shield, title: 'Secure & Compliant', desc: 'Role-based access control with audit logs for compliance and security.' },
];

export const FeaturesSection = () => (
  <section id="features" className="py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Powerful features designed for modern healthcare practices.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="group rounded-xl border border-border bg-card p-6 hover:shadow-medium transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white mb-5 group-hover:scale-105 transition-transform">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
