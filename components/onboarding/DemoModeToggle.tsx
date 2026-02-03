'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDemoMode, removeDemoSessionData, setDemoMode } from '@/lib/demo-session';

interface DemoModeToggleProps {
  className?: string;
  onModeChange?: (isDemoMode: boolean) => void;
}

export default function DemoModeToggle({ className = '', onModeChange }: DemoModeToggleProps) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setIsDemoMode(getDemoMode());
  }, []);

  const handleToggle = () => {
    if (isDemoMode) {
      // Switching from demo to fresh start - show confirmation
      setShowConfirmation(true);
    } else {
      // Switching to demo mode
      setIsDemoMode(true);
      setDemoMode(true);
      onModeChange?.(true);
      // Refresh to load demo data
      window.location.reload();
    }
  };

  const confirmFreshStart = () => {
    setIsDemoMode(false);
    removeDemoSessionData([
      'poolapp_customers',
      'poolapp-technicians',
      'poolapp-schedule',
      'poolapp-routes',
      'poolapp-invoices',
      'poolapp-checklist',
      'poolapp-checklist-dismissed',
      'poolapp-onboarding',
    ]);
    setDemoMode(false);
    setShowConfirmation(false);
    onModeChange?.(false);
    // Refresh to clear demo data
    window.location.reload();
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-purple-500' : 'bg-green-500'}`} />
              <span className="text-sm font-medium text-slate-700">
                {isDemoMode ? 'Demo Mode' : 'Your Data'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isDemoMode ? 'Exploring with sample data' : 'Working with your real business data'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isDemoMode ? 'bg-purple-500' : 'bg-green-500'
            }`}
          >
            <motion.div
              animate={{ x: isDemoMode ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        {/* Label showing mode benefits */}
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => {
              if (!isDemoMode) return;
              setShowConfirmation(true);
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              !isDemoMode
                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Fresh Start
            </div>
          </button>
          <button
            onClick={() => {
              if (isDemoMode) return;
              setIsDemoMode(true);
              setDemoMode(true);
              onModeChange?.(true);
              window.location.reload();
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isDemoMode
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Demo Mode
            </div>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Switch to Fresh Start?</h3>
              <p className="text-slate-600 mb-6">
                This will clear the demo data and start with a clean slate. Your onboarding data will be preserved.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmFreshStart}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Switch
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Utility hook for checking demo mode
export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setIsDemoMode(getDemoMode());
  }, []);

  const toggleDemoMode = () => {
    const newValue = !isDemoMode;
    setIsDemoMode(newValue);
    if (newValue) {
      setDemoMode(true);
    } else {
      removeDemoSessionData([
        'poolapp_customers',
        'poolapp-technicians',
        'poolapp-schedule',
        'poolapp-routes',
        'poolapp-invoices',
        'poolapp-checklist',
        'poolapp-checklist-dismissed',
        'poolapp-onboarding',
      ]);
      setDemoMode(false);
    }
    window.location.reload();
  };

  return { isDemoMode, toggleDemoMode };
}
