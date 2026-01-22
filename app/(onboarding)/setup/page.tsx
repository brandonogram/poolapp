'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/lib/onboarding-context';
import {
  MockMap,
  Input,
  PasswordInput,
  Button,
  CTAButton,
  ProgressBar,
  AnimatedCounter,
  ConfettiBurst,
} from '@/components/onboarding';

export default function SetupPage() {
  const router = useRouter();
  const { state, setCompanyDetails, goToStep, completeStep } = useOnboarding();

  const [companyName, setCompanyName] = useState(state.companyName);
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Redirect if no zip code
  useEffect(() => {
    if (!state.zipCode) {
      router.push('/');
    }
  }, [state.zipCode, router]);

  // If already created account, show success state
  useEffect(() => {
    if (state.isAccountCreated && state.companyName) {
      setCompanyName(state.companyName);
      setEmail(state.email);
      setShowSuccess(true);
    }
  }, [state.isAccountCreated, state.companyName, state.email]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setCompanyDetails(companyName, email, password);
    setIsSubmitting(false);
    setShowConfetti(true);
    setShowSuccess(true);

    // Reset confetti
    setTimeout(() => setShowConfetti(false), 100);
  };

  const handleContinue = () => {
    completeStep(2);
    goToStep(3);
    router.push('/setup/customers');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <ProgressBar
          currentStep={2}
          totalSteps={5}
          completedSteps={state.completedSteps}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start mt-12">
        {/* Left side - Form */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Claim your territory
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Set up your account in 30 seconds.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <Input
                  label="Company Name"
                  placeholder="e.g., Blue Wave Pool Services"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={errors.companyName}
                  showSuccessState
                  leftIcon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  showSuccessState
                  leftIcon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                />

                <PasswordInput
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  hint="Use a mix of letters, numbers, and symbols"
                />

                <CTAButton
                  type="submit"
                  fullWidth
                  isLoading={isSubmitting}
                  rightIcon={
                    !isSubmitting && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    )
                  }
                >
                  {isSubmitting ? 'Creating Account...' : 'Create My Account'}
                </CTAButton>

                <p className="text-center text-sm text-slate-500">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Success message */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        className="w-6 h-6 text-white"
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
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        Welcome, {companyName}!
                      </h3>
                      <p className="text-green-700 mt-1">
                        Your territory has been claimed. Time to add your first
                        customers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Potential stat */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 text-center"
                >
                  <div className="text-sm text-slate-500 mb-2">
                    Your potential market
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <AnimatedCounter
                      value={state.potentialPools}
                      size="xl"
                      className="text-blue-600"
                    />
                    <span className="text-2xl text-slate-400">pools</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    within your service area
                  </p>
                </motion.div>

                {/* Continue button */}
                <CTAButton
                  onClick={handleContinue}
                  fullWidth
                  rightIcon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  }
                >
                  Add Your First Customer
                </CTAButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side - Map with logo plant animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative lg:sticky lg:top-8"
        >
          <MockMap
            showTerritory={true}
            showHQ={showSuccess}
            companyLogo={companyName}
            zoomLevel={1.5}
            className="h-[500px] shadow-2xl shadow-blue-900/10"
          />

          {/* Territory info overlay */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg"
          >
            <div className="text-xs text-slate-500 mb-1">Service Area</div>
            <div className="font-semibold text-slate-900">{state.zipCode}</div>
          </motion.div>

          {/* Potential pools badge */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-4 shadow-lg text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-80">Potential</div>
                    <div className="text-2xl font-bold">
                      <AnimatedCounter value={state.potentialPools} /> pools
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">in range</div>
                    <div className="text-lg font-semibold">
                      {Math.round(state.potentialPools * 0.15)} serviceable/day
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confetti burst on success */}
          <ConfettiBurst isActive={showConfetti} x={50} y={50} />
        </motion.div>
      </div>
    </div>
  );
}
