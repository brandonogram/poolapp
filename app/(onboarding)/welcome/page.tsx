'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/lib/onboarding-context';
import {
  MockMap,
  Button,
  CTAButton,
  ProgressBar,
  AnimatedCounter,
  MoneyCounter,
  Confetti,
} from '@/components/onboarding';

interface NextStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  highlighted?: boolean;
}

const NEXT_STEPS: NextStep[] = [
  {
    id: 'schedule',
    title: 'Set Up Your Schedule',
    description: 'Define your working days and hours',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    href: '/dashboard/schedule',
    highlighted: true,
  },
  {
    id: 'customers',
    title: 'Import More Customers',
    description: 'Add your full customer list via CSV',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    href: '/dashboard/customers/import',
  },
  {
    id: 'team',
    title: 'Add Your Team',
    description: 'Invite technicians to the platform',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
    href: '/dashboard/team',
  },
  {
    id: 'billing',
    title: 'Set Up Billing',
    description: 'Connect Stripe for invoicing',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    href: '/dashboard/settings/billing',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const { state, completeStep, resetOnboarding } = useOnboarding();
  const [showConfetti, setShowConfetti] = useState(false);

  // Redirect if not optimized
  useEffect(() => {
    if (!state.isOptimized && state.customers.length === 0) {
      router.push('/setup/customers');
    }
  }, [state.isOptimized, state.customers.length, router]);

  // Trigger confetti on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
      completeStep(5);
    }, 500);

    return () => clearTimeout(timer);
  }, [completeStep]);

  // Calculate stats
  const weeklyRevenue = state.customers.reduce((sum, c) => sum + c.weeklyRate, 0);
  const monthlyRevenue = weeklyRevenue * 4;
  const annualSavings = state.annualSavings > 0 ? state.annualSavings : 4100;

  const handleGoToDashboard = () => {
    // In a real app, this would navigate to the main dashboard
    router.push('/dashboard');
  };

  const handleStartOver = () => {
    resetOnboarding();
    router.push('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <ProgressBar
          currentStep={5}
          totalSteps={5}
          completedSteps={[1, 2, 3, 4, 5]}
        />
      </div>

      {/* Confetti celebration */}
      <Confetti isActive={showConfetti} particleCount={150} duration={6000} />

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        {/* Celebration icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          You&apos;re all set, {state.companyName}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          Your first optimized Monday awaits. Here&apos;s what you&apos;ve accomplished:
        </motion.p>
      </motion.div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        {/* Customers added */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <AnimatedCounter
            value={state.customers.length}
            size="xl"
            className="text-slate-900"
          />
          <div className="text-slate-500 mt-1">Customers Added</div>
        </div>

        {/* Monthly revenue */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <MoneyCounter value={monthlyRevenue} size="xl" className="text-green-600" />
          <div className="text-green-700 mt-1">Monthly Revenue</div>
        </div>

        {/* Annual savings */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-cyan-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <MoneyCounter value={annualSavings} size="xl" className="text-cyan-600" />
          <div className="text-cyan-700 mt-1">Annual Savings</div>
        </div>
      </motion.div>

      {/* Map with optimized route */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Your Optimized Route
          </h2>
          <p className="text-slate-500">
            Saving {(state.originalDistance - state.optimizedDistance).toFixed(1)}{' '}
            miles per day
          </p>
        </div>
        <MockMap
          customers={state.customers}
          showRoutes={true}
          isOptimized={true}
          showHQ={true}
          companyLogo={state.companyName}
          zoomLevel={1.5}
          className="h-[400px] shadow-2xl shadow-blue-900/10 rounded-2xl"
        />
      </motion.div>

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
          What&apos;s Next?
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {NEXT_STEPS.map((step, index) => (
            <motion.a
              key={step.id}
              href={step.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`block rounded-xl border p-5 transition-all ${
                step.highlighted
                  ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    step.highlighted
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-semibold ${
                        step.highlighted ? 'text-blue-900' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {step.highlighted && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        Start here
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      step.highlighted ? 'text-blue-700' : 'text-slate-500'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 flex-shrink-0 ${
                    step.highlighted ? 'text-blue-400' : 'text-slate-300'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center space-y-4"
      >
        <CTAButton onClick={handleGoToDashboard}>
          Go to Dashboard
        </CTAButton>

        <p className="text-sm text-slate-500">
          Need help getting started?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Book a free onboarding call
          </a>
        </p>

        {/* Demo reset button */}
        <div className="pt-8 border-t border-slate-200 mt-8">
          <Button variant="ghost" onClick={handleStartOver}>
            Reset Demo
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
