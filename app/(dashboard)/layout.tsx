'use client';

import { useState } from 'react';
import { Sidebar, Header } from '@/components/dashboard';
import { RoutesProvider } from '@/lib/routes-context';
import { ScheduleProvider } from '@/lib/schedule-context';
import { CustomersProvider } from '@/lib/customers-context';
import { InvoicesProvider } from '@/lib/invoices-context';
import { TechniciansProvider } from '@/lib/technicians-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TechniciansProvider>
      <ScheduleProvider>
        <RoutesProvider>
          <CustomersProvider>
            <InvoicesProvider>
              <div className="min-h-screen bg-slate-50 dark:bg-surface-950 transition-colors">
                <div className="flex">
                  {/* Sidebar */}
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                  {/* Main content */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <Header onMenuClick={() => setSidebarOpen(true)} />

                    {/* Page content */}
                    <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8" tabIndex={-1}>
                      {children}
                    </main>
                  </div>
                </div>
              </div>
            </InvoicesProvider>
          </CustomersProvider>
        </RoutesProvider>
      </ScheduleProvider>
    </TechniciansProvider>
  );
}
