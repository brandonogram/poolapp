'use client';

import Link from 'next/link';
import { useTech } from '@/lib/tech-context';
import { useTheme } from '@/lib/theme-context';

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const ContrastIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18a9 9 0 019 9 9 9 0 01-9 9m0-18a9 9 0 00-9 9 9 9 0 009 9" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

export default function AccountPage() {
  const { isOnline, setOnline, pendingSync } = useTech();
  const { theme, setTheme, resolvedTheme, contrastMode, setContrastMode } = useTheme();

  // Mock user data
  const user = {
    name: 'Mike Rodriguez',
    email: 'mike@poolservice.com',
    phone: '(555) 123-4567',
    role: 'Senior Technician',
    employeeId: 'TECH-001',
    startDate: 'March 2023',
  };

  // Weekly stats
  const weeklyStats = {
    poolsServiced: 68,
    hoursWorked: 42,
    milesDriven: 285,
    avgTimePerStop: 28,
  };

  const isDark = resolvedTheme === 'dark';
  const isHighContrast = contrastMode === 'high';

  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleHighContrast = () => {
    setContrastMode(isHighContrast ? 'normal' : 'high');
  };

  return (
    <div className="p-4 pb-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 mb-6 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center" aria-hidden="true">
            <span className="text-3xl font-bold text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">{user.role}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">ID: {user.employeeId}</p>
          </div>
        </div>
      </div>

      {/* This Week Stats */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-6 shadow-sm transition-colors" role="region" aria-label="This week's statistics">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">This Week</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-surface-700 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{weeklyStats.poolsServiced}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pools Serviced</p>
          </div>
          <div className="bg-slate-50 dark:bg-surface-700 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{weeklyStats.hoursWorked}h</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Hours Worked</p>
          </div>
          <div className="bg-slate-50 dark:bg-surface-700 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{weeklyStats.milesDriven}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Miles Driven</p>
          </div>
          <div className="bg-slate-50 dark:bg-surface-700 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{weeklyStats.avgTimePerStop}m</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Avg per Stop</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden mb-6 shadow-sm transition-colors">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 px-4 pt-4 pb-2">Quick Settings</h2>

        {/* Offline Mode Toggle */}
        <button
          onClick={() => setOnline(!isOnline)}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-700 active:bg-slate-100 dark:active:bg-surface-600 min-h-[64px] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label={`Connection status: ${isOnline ? 'Online' : 'Offline'}. Click to toggle.`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'}`} />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-slate-100">Connection Status</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isOnline ? 'Online' : 'Offline'} {pendingSync > 0 && `(${pendingSync} pending)`}
              </p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full transition-colors ${isOnline ? 'bg-green-600 dark:bg-green-500' : 'bg-slate-300 dark:bg-surface-600'}`} role="switch" aria-checked={isOnline}>
            <div className={`w-5 h-5 bg-white rounded-full m-1 transition-transform ${isOnline ? 'translate-x-5' : ''}`} />
          </div>
        </button>

        <div className="border-t border-slate-100 dark:border-surface-700" />

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-700 active:bg-slate-100 dark:active:bg-surface-600 min-h-[64px] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label={`Dark mode: ${isDark ? 'On' : 'Off'}. Click to toggle.`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-surface-700 rounded-xl flex items-center justify-center">
              {isDark ? <MoonIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <SunIcon className="w-5 h-5 text-amber-600" />}
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-slate-100">Dark Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Reduce eye strain</p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full transition-colors ${isDark ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-surface-600'}`} role="switch" aria-checked={isDark}>
            <div className={`w-5 h-5 bg-white rounded-full m-1 transition-transform ${isDark ? 'translate-x-5' : ''}`} />
          </div>
        </button>

        <div className="border-t border-slate-100 dark:border-surface-700" />

        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-700 active:bg-slate-100 dark:active:bg-surface-600 min-h-[64px] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label={`High contrast mode: ${isHighContrast ? 'On' : 'Off'}. Click to toggle.`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
              <ContrastIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-slate-100">High Contrast Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Better visibility in sunlight</p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full transition-colors ${isHighContrast ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-surface-600'}`} role="switch" aria-checked={isHighContrast}>
            <div className={`w-5 h-5 bg-white rounded-full m-1 transition-transform ${isHighContrast ? 'translate-x-5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Contact & Support */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden mb-6 shadow-sm transition-colors">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 px-4 pt-4 pb-2">Support</h2>

        <a
          href="tel:5551234567"
          className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-700 active:bg-slate-100 dark:active:bg-surface-600 min-h-[64px] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label="Call office at (555) 123-4567"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
              <PhoneIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-slate-100">Call Office</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">(555) 123-4567</p>
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </a>

        <div className="border-t border-slate-100 dark:border-surface-700" />

        <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-surface-700 active:bg-slate-100 dark:active:bg-surface-600 min-h-[64px] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-slate-100">App Settings</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Notifications, preferences</p>
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      {/* Logout */}
      <Link
        href="/login"
        className="w-full bg-white dark:bg-surface-800 rounded-2xl px-4 py-4 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 active:bg-red-100 dark:active:bg-red-900/50 shadow-sm min-h-[56px] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
      >
        <LogoutIcon className="w-5 h-5" />
        Sign Out
      </Link>

      {/* App Version */}
      <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
        PoolApp Tech v1.0.0
      </p>
    </div>
  );
}
