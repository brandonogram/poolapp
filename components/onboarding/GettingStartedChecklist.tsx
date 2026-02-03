'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getDemoStorage } from '@/lib/demo-session';
import { useCustomers } from '@/lib/customers-context';
import { useTechnicians } from '@/lib/technicians-context';
import { useInvoices } from '@/lib/invoices-context';
import { useRoutes } from '@/lib/routes-context';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  href: string;
  isComplete: boolean;
  icon: React.ReactNode;
}

interface GettingStartedChecklistProps {
  className?: string;
}

export default function GettingStartedChecklist({ className = '' }: GettingStartedChecklistProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const { customers } = useCustomers();
  const { technicians } = useTechnicians();
  const { invoices } = useInvoices();
  const { routes } = useRoutes();

  useEffect(() => {
    const storage = getDemoStorage();
    // Check storage for dismissed state
    const dismissed = storage?.getItem('poolapp-checklist-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Load checklist state
    const savedChecklist = storage?.getItem('poolapp-checklist');
    const parsed = savedChecklist ? JSON.parse(savedChecklist) : {};

    setChecklist([
      {
        id: 'technicians',
        title: 'Add your technicians',
        description: 'Build your team roster',
        href: '/technicians',
        isComplete: parsed.technicians || false,
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        ),
      },
      {
        id: 'customers',
        title: 'Import or add customers',
        description: 'Add your pool service list',
        href: '/customers',
        isComplete: parsed.customers || false,
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        id: 'routes',
        title: 'Set up your first route',
        description: 'Optimize your daily stops',
        href: '/routes',
        isComplete: parsed.routes || false,
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
      },
      {
        id: 'invoices',
        title: 'Create your first invoice',
        description: 'Start getting paid faster',
        href: '/invoices',
        isComplete: parsed.invoices || false,
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        id: 'quickbooks',
        title: 'Connect QuickBooks',
        description: 'Coming soon',
        href: '#',
        isComplete: false,
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    const storage = getDemoStorage();
    setChecklist((prev) => {
      if (prev.length === 0) return prev;
      const nextChecklist = prev.map(item => {
        if (item.id === 'technicians') {
          return { ...item, isComplete: technicians.length > 0 };
        }
        if (item.id === 'customers') {
          return { ...item, isComplete: customers.length > 0 };
        }
        if (item.id === 'routes') {
          const hasStops = routes.some(route => route.stops.length > 0);
          return { ...item, isComplete: hasStops };
        }
        if (item.id === 'invoices') {
          return { ...item, isComplete: invoices.length > 0 };
        }
        return item;
      });
      const savedState: Record<string, boolean> = {};
      nextChecklist.forEach(item => {
        savedState[item.id] = item.isComplete;
      });
      storage?.setItem('poolapp-checklist', JSON.stringify(savedState));
      return nextChecklist;
    });
  }, [customers.length, technicians.length, invoices.length, routes]);

  const completedCount = checklist.filter(item => item.isComplete).length;
  const totalCount = checklist.length;
  const progressPercent = (completedCount / totalCount) * 100;

  const handleDismiss = () => {
    const storage = getDemoStorage();
    storage?.setItem('poolapp-checklist-dismissed', 'true');
    setIsDismissed(true);
  };

  const markComplete = (id: string) => {
    const newChecklist = checklist.map(item =>
      item.id === id ? { ...item, isComplete: true } : item
    );
    setChecklist(newChecklist);

    // Save to storage
    const savedState: Record<string, boolean> = {};
    newChecklist.forEach(item => {
      savedState[item.id] = item.isComplete;
    });
    const storage = getDemoStorage();
    storage?.setItem('poolapp-checklist', JSON.stringify(savedState));
  };

  if (isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Getting Started</h3>
                <p className="text-sm text-slate-600">{completedCount} of {totalCount} complete</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Checklist Items */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="divide-y divide-slate-100"
            >
              {checklist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.id === 'quickbooks' ? (
                    <div className="px-5 py-4 flex items-center gap-4 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-500">{item.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                            Coming soon
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => !item.isComplete && markComplete(item.id)}
                      className={`px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors ${
                        item.isComplete ? 'opacity-60' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          item.isComplete
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {item.isComplete ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          item.icon
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${item.isComplete ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      {!item.isComplete && (
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* All done message */}
        {completedCount === totalCount - 1 && !isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 py-4 bg-green-50 text-center"
          >
            <p className="text-green-700 font-medium">
              Great progress! You&apos;re almost set up.
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
