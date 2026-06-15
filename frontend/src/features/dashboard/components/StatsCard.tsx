'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export const StatsCard = ({ title, value, icon: Icon, gradient }: StatsCardProps) => (
  <div className="animate-fade-in">
    <Card className="premium-card overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2.5 rounded-xl ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-105`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="mt-1 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full w-3/5 rounded-full bg-gradient-to-r ${gradient}`} />
        </div>
      </CardContent>
    </Card>
  </div>
);
