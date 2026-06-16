'use client';

import { useRecDashboard } from '@/features/receptionist/hooks';
import { StatsCard } from '@/features/dashboard/components/StatsCard';
import { Users, FileText, Calendar, Activity } from 'lucide-react';

export default function ReceptionistDashboardPage() {
  const { data: stats, isLoading } = useRecDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { title: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, gradient: 'gradient-primary', delay: 0 },
    { title: 'Total Prescriptions', value: stats?.totalPrescriptions || 0, icon: FileText, gradient: 'gradient-success', delay: 0.1 },
    { title: 'Monthly Appointments', value: stats?.monthlyAppointments || 0, icon: Calendar, gradient: 'gradient-warning', delay: 0.2 },
    { title: 'This Month Rx', value: stats?.monthlyPrescriptions || 0, icon: Activity, gradient: 'gradient-info', delay: 0.3 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reception Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of the practice</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
