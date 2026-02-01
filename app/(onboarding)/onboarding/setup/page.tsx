'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Step indicator component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                isComplete
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isComplete ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-1 rounded-full transition-all ${
                  stepNum < currentStep ? 'bg-green-500' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Step 1: Business Info
function BusinessInfoStep({
  data,
  onChange,
  onNext,
}: {
  data: { companyName: string; numTechnicians: number; numPools: number };
  onChange: (field: string, value: string | number) => void;
  onNext: () => void;
}) {
  const isValid = data.companyName.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell us about your business</h2>
        <p className="text-slate-600">This helps us customize PoolApp for your needs.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            placeholder="e.g., Blue Wave Pool Services"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of Technicians
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onChange('numTechnicians', Math.max(1, data.numTechnicians - 1))}
              className="w-12 h-12 rounded-xl border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <div className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-bold text-slate-900">{data.numTechnicians}</span>
              <span className="text-slate-500 ml-2">{data.numTechnicians === 1 ? 'tech' : 'techs'}</span>
            </div>
            <button
              type="button"
              onClick={() => onChange('numTechnicians', data.numTechnicians + 1)}
              className="w-12 h-12 rounded-xl border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Approximate Pools Serviced
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '1-25', value: 25 },
              { label: '26-50', value: 50 },
              { label: '51-100', value: 100 },
              { label: '100+', value: 150 },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange('numPools', option.value)}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  data.numPools === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
          isValid
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Continue
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </motion.div>
  );
}

// Step 2: Add First Technician
function TechnicianStep({
  data,
  onChange,
  onNext,
  onSkip,
}: {
  data: { name: string; phone: string; email: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const isValid = data.name.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Add your first technician</h2>
        <p className="text-slate-600">You can add more technicians later from the dashboard.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Technician Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g., Mike Rodriguez"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number <span className="text-slate-400">(optional)</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email <span className="text-slate-400">(optional)</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="mike@company.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
          />
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Add Technician & Continue
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <button
          onClick={onSkip}
          className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          Skip - I&apos;ll do this later
        </button>
      </div>
    </motion.div>
  );
}

// Step 3: Add First Customer
function CustomerStep({
  data,
  onChange,
  onNext,
  onSkip,
  onUseDemoData,
}: {
  data: { name: string; address: string; phone: string; email: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onSkip: () => void;
  onUseDemoData: () => void;
}) {
  const isValid = data.name.trim().length > 0 && data.address.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Add your first customer</h2>
        <p className="text-slate-600">Or use demo data to explore the app first.</p>
      </div>

      {/* Import/Demo options */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onUseDemoData}
          className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="font-medium text-slate-900 text-sm">Use Demo Data</div>
          <div className="text-xs text-slate-500">Explore with sample data</div>
        </button>

        <button
          type="button"
          className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all text-left opacity-50 cursor-not-allowed"
          disabled
        >
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="font-medium text-slate-900 text-sm">Import CSV</div>
          <div className="text-xs text-slate-500">Coming soon</div>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-slate-500">or add manually</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g., Johnson Family"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="e.g., 123 Palm Drive, Phoenix AZ 85001"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="customer@email.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Add Customer & Continue
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <button
          onClick={onSkip}
          className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          Skip - I&apos;ll add customers later
        </button>
      </div>
    </motion.div>
  );
}

// Step 4: Complete
function CompleteStep({
  businessName,
  onGoToDashboard,
}: {
  businessName: string;
  onGoToDashboard: () => void;
}) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: '50vw',
                y: '50vh',
              }}
              animate={{
                opacity: 0,
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: 'easeOut',
              }}
              className={`absolute w-3 h-3 rounded-full ${
                ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-cyan-500'][
                  i % 5
                ]
              }`}
            />
          ))}
        </div>
      )}

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
      >
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">You&apos;re all set!</h2>
        <p className="text-lg text-slate-600">
          Welcome to PoolApp, <span className="font-semibold">{businessName || 'there'}</span>!
        </p>
      </motion.div>

      {/* What's next */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 rounded-xl p-5 text-left"
      >
        <h3 className="font-semibold text-blue-900 mb-3">What&apos;s next?</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-blue-700 text-sm">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Add more technicians to your team
          </li>
          <li className="flex items-center gap-2 text-blue-700 text-sm">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Import your customer list
          </li>
          <li className="flex items-center gap-2 text-blue-700 text-sm">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Set up your first optimized route
          </li>
        </ul>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onGoToDashboard}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
      >
        Go to Dashboard
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

// Main setup wizard page
export default function SetupWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [useDemoData, setUseDemoData] = useState(false);

  // Business info state
  const [businessInfo, setBusinessInfo] = useState({
    companyName: '',
    numTechnicians: 1,
    numPools: 0,
  });

  // Technician state
  const [technician, setTechnician] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Customer state
  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleBusinessInfoChange = (field: string, value: string | number) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleTechnicianChange = (field: string, value: string) => {
    setTechnician((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (field: string, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleUseDemoData = () => {
    setUseDemoData(true);
    localStorage.setItem('poolapp-demo-mode', 'true');
    localStorage.setItem('poolapp-onboarding-complete', 'true');
    localStorage.setItem('poolapp-business-info', JSON.stringify({
      companyName: 'Blue Wave Pool Services',
      numTechnicians: 4,
      numPools: 125,
    }));
    setCurrentStep(4);
    setBusinessInfo({
      companyName: 'Blue Wave Pool Services',
      numTechnicians: 4,
      numPools: 125,
    });
  };

  const handleComplete = () => {
    localStorage.setItem('poolapp-onboarding-complete', 'true');
    localStorage.setItem('poolapp-demo-mode', useDemoData ? 'true' : 'false');
    localStorage.setItem('poolapp-business-info', JSON.stringify(businessInfo));
    if (technician.name) {
      localStorage.setItem('poolapp-first-technician', JSON.stringify(technician));
    }
    if (customer.name) {
      localStorage.setItem('poolapp-first-customer', JSON.stringify(customer));
    }
  };

  const goToDashboard = () => {
    handleComplete();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
            <span className="text-xl font-bold text-slate-900">PoolApp</span>
          </div>
          {currentStep < 4 && (
            <button
              onClick={() => {
                handleUseDemoData();
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Skip setup
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-md w-full">
          {/* Step Indicator */}
          {currentStep < 4 && (
            <StepIndicator currentStep={currentStep} totalSteps={3} />
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <BusinessInfoStep
                key="step1"
                data={businessInfo}
                onChange={handleBusinessInfoChange}
                onNext={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <TechnicianStep
                key="step2"
                data={technician}
                onChange={handleTechnicianChange}
                onNext={() => setCurrentStep(3)}
                onSkip={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <CustomerStep
                key="step3"
                data={customer}
                onChange={handleCustomerChange}
                onNext={() => setCurrentStep(4)}
                onSkip={() => setCurrentStep(4)}
                onUseDemoData={handleUseDemoData}
              />
            )}
            {currentStep === 4 && (
              <CompleteStep
                key="step4"
                businessName={businessInfo.companyName}
                onGoToDashboard={goToDashboard}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/50">
        <div className="max-w-2xl mx-auto px-6 py-4 text-center">
          <p className="text-sm text-slate-500">
            Need help?{' '}
            <a href="mailto:support@poolapp.com" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
