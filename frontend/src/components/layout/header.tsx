'use client';

import { getUser } from '@/lib/utils';
import { Bell } from 'lucide-react';

export const Header = () => {
  const user = getUser();

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Welcome back, <span className="text-gradient">{user?.doctor?.fullName?.split(' ')[0] || 'Doctor'}</span>
            </h2>
            <p className="text-xs text-muted-foreground">{user?.doctor?.specialization || ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-primary text-[9px] font-bold text-white flex items-center justify-center shadow-glow">
              3
            </span>
          </button>
          <div className="w-9 h-9 rounded-xl gradient-primary shadow-glow flex items-center justify-center text-white text-sm font-semibold">
            {user?.doctor?.fullName?.charAt(0) || 'D'}
          </div>
        </div>
      </div>
    </header>
  );
};
