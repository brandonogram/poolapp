'use client';

import React from 'react';
import { OnboardingProvider } from '@/lib/onboarding-context';
import { motion } from 'framer-motion';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Subtle background pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="bg-pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="50" cy="50" r="1" fill="#0066FF" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bg-pattern)" />
          </svg>
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">PoolOps</span>
            </motion.div>

            {/* Help link */}
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              href="#"
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Need help?
            </motion.a>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10">{children}</main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-100 bg-white/50 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>PoolOps - Route optimization for pool pros</span>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-700">
                  Privacy
                </a>
                <a href="#" className="hover:text-slate-700">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </OnboardingProvider>
  );
}
