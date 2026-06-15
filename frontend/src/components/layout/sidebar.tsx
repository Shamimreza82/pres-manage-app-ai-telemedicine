'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getUser } from '@/lib/utils';
import { useLogout } from '@/features/auth/hooks';
import { LayoutDashboard, Users, FileText, Calendar, Building2, LogOut, Sun, Moon, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeContext } from '@/providers/theme-provider';

const menuItems = [
  { href: '/dashboard/doctor', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-blue-600' },
  { href: '/patients', label: 'Patients', icon: Users, gradient: 'from-emerald-500 to-emerald-600' },
  { href: '/prescriptions', label: 'Prescriptions', icon: FileText, gradient: 'from-violet-500 to-violet-600' },
  { href: '/appointments', label: 'Appointments', icon: Calendar, gradient: 'from-amber-500 to-orange-500' },
  { href: '/profile', label: 'Clinic Profile', icon: Building2, gradient: 'from-rose-500 to-rose-600' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const user = getUser();
  const logout = useLogout();
  const { theme, toggle } = useThemeContext();

  return (
    <aside className="hidden lg:flex lg:flex-col w-[260px] bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800/50 min-h-screen">
      {/* Brand */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">PresManage</h1>
            <p className="text-xs text-muted-foreground">{user?.doctor?.clinicName || 'Doctor Portal'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                  isActive
                    ? 'text-white bg-gradient-to-r ' + item.gradient
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
                )}
              >
                <Icon className={cn('h-5 w-5 relative z-10', isActive ? 'text-white' : '')} />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60 relative z-10" />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 space-y-2">
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
