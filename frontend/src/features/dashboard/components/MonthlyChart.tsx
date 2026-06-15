'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthlyChartProps {
  data: number[];
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const max = Math.max(...data, 1);

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-white">Monthly Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 flex items-end gap-1.5">
          {data.map((value, i) => {
            const height = (value / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-blue-100 to-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 relative overflow-hidden"
                  style={{ height: `${Math.max(height, 4)}%` }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{MONTHS[i]}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
