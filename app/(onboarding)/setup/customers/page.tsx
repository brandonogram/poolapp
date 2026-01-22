'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding, Customer } from '@/lib/onboarding-context';
import {
  MockMap,
  Input,
  Button,
  CTAButton,
  ProgressBar,
  AnimatedCounter,
  MoneyCounter,
  ConfettiBurst,
} from '@/components/onboarding';

// Mock addresses for quick add
const MOCK_ADDRESSES = [
  { address: '123 Palm Drive', lat: 33.4484, lng: -112.074 },
  { address: '456 Desert Rose Lane', lat: 33.4152, lng: -111.8315 },
  { address: '789 Cactus Court', lat: 33.5091, lng: -111.8985 },
  { address: '321 Sunset Boulevard', lat: 33.3942, lng: -111.9261 },
  { address: '654 Mountain View Way', lat: 33.4373, lng: -111.7896 },
];

export default function CustomersPage() {
  const router = useRouter();
  const {
    state,
    addCustomer,
    removeCustomer,
    optimizeRoute,
    goToStep,
    completeStep,
  } = useOnboarding();

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [weeklyRate, setWeeklyRate] = useState('158');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOptimization, setShowOptimization] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!state.isAccountCreated) {
      router.push('/setup');
    }
  }, [state.isAccountCreated, router]);

  // Show optimization when 3+ customers
  useEffect(() => {
    if (state.customers.length >= 3 && !showOptimization && !state.isOptimized) {
      setTimeout(() => setShowOptimization(true), 500);
    }
  }, [state.customers.length, showOptimization, state.isOptimized]);

  // Calculate weekly revenue
  const weeklyRevenue = state.customers.reduce((sum, c) => sum + c.weeklyRate, 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!customerAddress.trim()) {
      newErrors.customerAddress = 'Address is required';
    }

    if (!weeklyRate || parseFloat(weeklyRate) <= 0) {
      newErrors.weeklyRate = 'Please enter a valid rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Get a mock position
    const mockIndex = state.customers.length % MOCK_ADDRESSES.length;
    const mockPos = MOCK_ADDRESSES[mockIndex];

    const newCustomer = {
      name: customerName,
      address: customerAddress || mockPos.address,
      lat: mockPos.lat + (Math.random() - 0.5) * 0.02,
      lng: mockPos.lng + (Math.random() - 0.5) * 0.02,
      weeklyRate: parseFloat(weeklyRate),
    };

    addCustomer(newCustomer);
    setLastAddedId(`customer-${Date.now()}`);

    // Show micro confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);

    // Reset form
    setCustomerName('');
    setCustomerAddress('');
    setWeeklyRate('158');
  };

  const handleQuickAdd = () => {
    const mockIndex = state.customers.length % MOCK_ADDRESSES.length;
    const mockPos = MOCK_ADDRESSES[mockIndex];
    const names = ['Johnson', 'Smith', 'Williams', 'Brown', 'Garcia'];
    const name = names[state.customers.length % names.length];

    const newCustomer = {
      name: `${name} Residence`,
      address: mockPos.address,
      lat: mockPos.lat + (Math.random() - 0.5) * 0.02,
      lng: mockPos.lng + (Math.random() - 0.5) * 0.02,
      weeklyRate: 140 + Math.floor(Math.random() * 40),
    };

    addCustomer(newCustomer);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);

    // Simulate optimization
    await new Promise((resolve) => setTimeout(resolve, 2000));

    optimizeRoute();
    setIsOptimizing(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  const handleContinue = () => {
    completeStep(3);
    completeStep(4);
    goToStep(5);
    router.push('/welcome');
  };

  const customersNeeded = Math.max(0, 3 - state.customers.length);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <ProgressBar
          currentStep={state.isOptimized ? 4 : 3}
          totalSteps={5}
          completedSteps={state.completedSteps}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        {/* Left side - Form and list */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">
              {state.isOptimized ? 'Route Optimized!' : 'Add Your Customers'}
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              {state.isOptimized
                ? 'See your savings below.'
                : 'Watch your route build in real-time.'}
            </p>
          </motion.div>

          {/* Revenue counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-700">Weekly Revenue</div>
                <MoneyCounter
                  value={weeklyRevenue}
                  size="lg"
                  perPeriod="week"
                  className="text-green-600"
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-green-700">Customers</div>
                <AnimatedCounter
                  value={state.customers.length}
                  size="lg"
                  className="text-green-600"
                />
              </div>
            </div>
          </motion.div>

          {/* Optimization unlock banner */}
          <AnimatePresence>
            {!state.isOptimized && customersNeeded > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">
                      Add {customersNeeded} more to unlock route optimization
                    </div>
                    <div className="text-sm text-blue-700">
                      See how much time and money you can save
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {showOptimization && !state.isOptimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-5 text-white"
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <div className="text-xl font-bold">
                      Optimization Unlocked!
                    </div>
                    <div className="text-white/80">
                      Click below to optimize your route
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleOptimize}
                  isLoading={isOptimizing}
                >
                  {isOptimizing ? 'Optimizing...' : 'Optimize My Route'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optimization results */}
          <AnimatePresence>
            {state.isOptimized && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Before/After comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 rounded-xl p-4 text-center">
                    <div className="text-sm text-slate-500 mb-1">Before</div>
                    <div className="text-2xl font-bold text-slate-400 line-through">
                      {state.originalDistance.toFixed(1)} mi
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-xl p-4 text-center">
                    <div className="text-sm text-green-700 mb-1">After</div>
                    <div className="text-2xl font-bold text-green-600">
                      {state.optimizedDistance.toFixed(1)} mi
                    </div>
                  </div>
                </div>

                {/* Savings card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <div className="text-center">
                    <div className="text-sm text-green-700 mb-2">
                      Projected Annual Savings
                    </div>
                    <MoneyCounter
                      value={state.annualSavings > 0 ? state.annualSavings : 4100}
                      size="xl"
                      className="text-green-600"
                    />
                    <div className="text-sm text-green-600 mt-2">
                      + {Math.round(state.timeSaved)} minutes saved daily
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <CTAButton onClick={handleContinue} fullWidth>
                  Continue to Dashboard
                </CTAButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add customer form */}
          {!state.isOptimized && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <h3 className="font-semibold text-slate-900 mb-4">
                Add a Customer
              </h3>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                <Input
                  label="Customer Name"
                  placeholder="e.g., Johnson Residence"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={errors.customerName}
                />

                <Input
                  label="Address"
                  placeholder="e.g., 123 Palm Drive"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  error={errors.customerAddress}
                />

                <Input
                  label="Weekly Rate"
                  type="number"
                  placeholder="158"
                  value={weeklyRate}
                  onChange={(e) => setWeeklyRate(e.target.value)}
                  error={errors.weeklyRate}
                  leftIcon={<span className="text-slate-400">$</span>}
                />

                <div className="flex gap-3">
                  <Button type="submit" variant="primary" className="flex-1">
                    Add Customer
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleQuickAdd}
                  >
                    Quick Add
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Customer list */}
          {state.customers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <h3 className="font-medium text-slate-700 text-sm">
                Your Customers ({state.customers.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {state.customers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">
                          {customer.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {customer.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-green-600">
                        ${customer.weeklyRate}/wk
                      </span>
                      {!state.isOptimized && (
                        <button
                          onClick={() => removeCustomer(customer.id)}
                          className="text-slate-400 hover:text-red-500"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right side - Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-8"
        >
          <MockMap
            customers={state.customers}
            showRoutes={state.customers.length >= 2}
            isOptimized={state.isOptimized}
            showHQ={true}
            companyLogo={state.companyName}
            zoomLevel={1.5}
            className="h-[600px] shadow-2xl shadow-blue-900/10"
          />

          {/* Route stats overlay */}
          {state.customers.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg"
            >
              <div className="text-xs text-slate-500 mb-1">Route Distance</div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-lg font-bold ${
                    state.isOptimized ? 'text-green-600' : 'text-slate-900'
                  }`}
                >
                  {(state.isOptimized
                    ? state.optimizedDistance
                    : state.originalDistance
                  ).toFixed(1)}{' '}
                  mi
                </span>
                {state.isOptimized && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    Optimized
                  </span>
                )}
              </div>
            </motion.div>
          )}

          <ConfettiBurst isActive={showConfetti} x={50} y={30} />
        </motion.div>
      </div>
    </div>
  );
}
