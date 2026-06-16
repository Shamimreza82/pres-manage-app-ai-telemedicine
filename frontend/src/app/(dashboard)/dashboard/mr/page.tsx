'use client';

import { useDashboardStats } from '@/features/mr/hooks';
import { Card } from '@/components/ui/card';
import { FileText, Activity, UserRound } from 'lucide-react';

export default function MrDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MR Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your assigned doctors</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-5 premium-card-static">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-glow shrink-0">
              <UserRound className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned Doctors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalDoctors || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 premium-card-static">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-glow shrink-0">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalPrescriptions || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 premium-card-static">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-glow shrink-0">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.todaysPrescriptions || 0}</p>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
