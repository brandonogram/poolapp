'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TechProvider, useTech } from '@/lib/tech-context';
import { ThemeToggleCompact } from '@/components/ui/theme-toggle';
import { AccessibilityQuickControls } from '@/components/ui/accessibility-settings';

// Icons as inline SVGs for simplicity
const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

function NavLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[72px] min-h-[56px] ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-700'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

function SyncStatus() {
  const { isOnline, pendingSync, setOnline } = useTech();

  return (
    <button
      onClick={() => setOnline(!isOnline)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-surface-700 min-h-[44px] transition-colors"
      aria-label={`Sync status: ${isOnline ? (pendingSync > 0 ? `Syncing ${pendingSync} items` : 'Synced') : 'Offline'}. Click to toggle.`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          isOnline
            ? pendingSync > 0
              ? 'bg-yellow-500 animate-pulse'
              : 'bg-green-500'
            : 'bg-red-500'
        }`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {isOnline
          ? pendingSync > 0
            ? `Syncing ${pendingSync}...`
            : 'Synced'
          : 'Offline'}
      </span>
    </button>
  );
}

function TechLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-surface-900 flex flex-col max-w-md mx-auto transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 border-b border-slate-200 dark:border-surface-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center" aria-hidden="true">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">PoolApp</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggleCompact />
          <AccessibilityQuickControls />
          <SyncStatus />
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-auto pb-24" tabIndex={-1}>
        {children}
      </main>

      {/* Bottom Navigation - Large touch targets for wet hands */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-800 border-t border-slate-200 dark:border-surface-700 px-4 py-2 safe-area-inset-bottom transition-colors" aria-label="Main navigation">
        <div className="flex items-center justify-around max-w-md mx-auto gap-2">
          <NavLink href="/tech/route" icon={MapIcon} label="Route" />
          <NavLink href="/tech/history" icon={ClockIcon} label="History" />
          <NavLink href="/tech/account" icon={UserIcon} label="Account" />
        </div>
      </nav>
    </div>
  );
}

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return (
    <TechProvider>
      <TechLayoutContent>{children}</TechLayoutContent>
    </TechProvider>
  );
}
