'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getUser } from '@/lib/utils';
import { useLogout } from '@/features/auth/hooks';
import {
  LayoutDashboard, Users, FileText, Calendar, Building2,
  LogOut, Sun, Moon, Stethoscope, ChevronLeft, ChevronRight,
  Shield, UserCog, CreditCard, PersonStanding, ClipboardList,
} from 'lucide-react';
import { useThemeContext } from '@/providers/theme-provider';

const doctorMenu = [
  { href: '/dashboard/doctor', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-blue-600' },
  { href: '/patients', label: 'Patients', icon: Users, gradient: 'from-emerald-500 to-emerald-600' },
  { href: '/prescriptions', label: 'Prescriptions', icon: FileText, gradient: 'from-violet-500 to-violet-600' },
  { href: '/appointments', label: 'Appointments', icon: Calendar, gradient: 'from-amber-500 to-orange-500' },
  { href: '/profile', label: 'Clinic', icon: Building2, gradient: 'from-rose-500 to-rose-600' },
];

const adminMenu = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: Shield, gradient: 'from-indigo-500 to-indigo-600' },
  { href: '/dashboard/admin/doctors', label: 'Doctors', icon: Stethoscope, gradient: 'from-emerald-500 to-emerald-600' },
  { href: '/dashboard/admin/patients', label: 'Patients', icon: PersonStanding, gradient: 'from-sky-500 to-sky-600' },
  { href: '/dashboard/admin/users', label: 'Users', icon: UserCog, gradient: 'from-violet-500 to-violet-600' },
  { href: '/dashboard/admin/subscriptions', label: 'Subscriptions', icon: CreditCard, gradient: 'from-amber-500 to-orange-500' },
  { href: '/dashboard/admin/logs', label: 'Activity Logs', icon: ClipboardList, gradient: 'from-rose-500 to-rose-600' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();
  const { theme, toggle } = useThemeContext();

  useEffect(() => { setMounted(true); }, []);

  const user = mounted ? getUser() : null;
  const isAdmin = user?.role === 'SUPER_ADMIN';
  const menuItems = isAdmin ? adminMenu : doctorMenu;

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setCollapsed(true)} />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800/50 min-h-screen transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Brand */}
        <div className={cn('p-4 border-b border-gray-100 dark:border-gray-800/50 flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl gradient-primary shadow-glow flex items-center justify-center shrink-0">
                {isAdmin ? <Shield className="h-5 w-5 text-white" /> : <Stethoscope className="h-5 w-5 text-white" />}
              </div>
              <div className="truncate">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">PresManage</h1>
                <p className="text-xs text-muted-foreground truncate">{isAdmin ? 'Admin Portal' : (user?.doctor?.clinicName || 'Doctor Portal')}</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
              {isAdmin ? <Shield className="h-5 w-5 text-white" /> : <Stethoscope className="h-5 w-5 text-white" />}
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isAdmin
              ? pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href + '/'))
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <div key={`${item.href}-${item.label}`} title={collapsed ? item.label : undefined}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                    collapsed ? 'justify-center px-0 py-3' : 'px-3.5 py-2.5',
                    isActive
                      ? 'text-white bg-gradient-to-r ' + item.gradient
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  )}
                >
                  <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : '')} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn('p-4 border-t border-gray-100 dark:border-gray-800/50 space-y-2', collapsed ? 'flex flex-col items-center' : '')}>
          <button
            onClick={toggle}
            className={cn(
              'flex items-center gap-3 rounded-xl text-sm transition-all',
              collapsed
                ? 'justify-center p-3 text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800/50'
                : 'w-full px-3.5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
            )}
            title={collapsed ? 'Toggle theme' : undefined}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={() => logout.mutate()}
            className={cn(
              'flex items-center gap-3 rounded-xl text-sm transition-all text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30',
              collapsed ? 'justify-center p-3' : 'w-full px-3.5 py-2.5'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
