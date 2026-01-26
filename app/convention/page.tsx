'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Pricing options for the convention
const PLANS = [
  {
    id: 'convention-special',
    name: 'Convention Special',
    price: 79,
    period: '/mo',
    originalPrice: 99,
    description: 'Pool & Spa Show exclusive pricing',
    features: [
      'Up to 3 Technicians',
      'Up to 200 pools',
      'Route optimization (save $4K+/year)',
      'Chemistry tracking & alerts',
      'Same-day invoicing',
      'Customer portal',
      'Priority support',
      '14-day free trial',
    ],
    badge: 'Show Special',
    highlighted: true,
    savings: '$240/year saved',
  },
  {
    id: 'founder',
    name: 'Founder Rate',
    price: 59,
    period: '/mo',
    originalPrice: 99,
    description: 'Locked forever - first 50 only',
    features: [
      'Everything in Convention Special',
      'Price locked for life',
      'Early access to new features',
      'Direct founder support line',
      'Shape the product roadmap',
    ],
    badge: 'Only 12 left!',
    highlighted: false,
    savings: '$480/year saved',
    urgent: true,
  },
];

export default function ConventionPage() {
  const [selectedPlan, setSelectedPlan] = useState('convention-special');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleGetStarted = async (planId: string) => {
    setSelectedPlan(planId);
    setShowForm(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: selectedPlan,
          email,
          companyName,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback to demo mode if Stripe isn't configured
        alert('Demo mode: In production, this would redirect to Stripe checkout.\n\nEmail: ' + email + '\nPlan: ' + selectedPlan);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Pool App</span>
          </Link>
          <div className="text-right">
            <div className="text-cyan-400 text-sm font-medium">Pool & Spa Show 2026</div>
            <div className="text-white/60 text-xs">Atlantic City, NJ</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Show Exclusive - Expires Jan 31
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Stop wasting{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              2 hours/day
            </span>{' '}
            driving between pools
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
          >
            Route optimization that saves pool service businesses{' '}
            <span className="text-cyan-400 font-semibold">$4,000+/year</span> in fuel and enables{' '}
            <span className="text-cyan-400 font-semibold">4-6 more stops</span> per tech per day.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12"
          >
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">38%</div>
              <div className="text-xs text-white/60">Less driving</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">2hr</div>
              <div className="text-xs text-white/60">Saved daily</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">$4K+</div>
              <div className="text-xs text-white/60">Annual savings</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="plans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {PLANS.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`relative rounded-2xl p-6 ${
                      plan.highlighted
                        ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {/* Badge */}
                    <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold ${
                      plan.urgent
                        ? 'bg-orange-500 text-white'
                        : 'bg-cyan-500 text-white'
                    }`}>
                      {plan.badge}
                    </div>

                    <div className="pt-4">
                      <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-white/60 text-sm mb-4">{plan.description}</p>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-white/60">{plan.period}</span>
                        <span className="text-white/40 line-through text-sm">${plan.originalPrice}</span>
                      </div>
                      <div className="text-green-400 text-sm font-medium mb-6">{plan.savings}</div>

                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
                            <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <button
                        onClick={() => handleGetStarted(plan.id)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                          plan.highlighted
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Start 14-Day Free Trial
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-4"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to plans
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
                  <p className="text-white/60 mb-6">
                    {selectedPlan === 'founder' ? 'Founder Rate - $59/mo locked forever' : 'Convention Special - $79/mo'}
                  </p>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-1">Company Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Blue Wave Pools"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Start Free Trial'
                      )}
                    </button>

                    <p className="text-center text-white/40 text-xs">
                      No credit card required for trial. Cancel anytime.
                    </p>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-white/60">Pool pros on waitlist</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">$4,100</div>
              <div className="text-white/60">Avg. annual savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-white/60">Beta user rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Link */}
      <section className="px-4 py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60 mb-4">Want to see it in action first?</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
          >
            Try the demo dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-white/40 text-sm mt-2">Login: demo@poolapp.com / demo123</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          <p>Questions? Find us at the show or email hello@poolapp.com</p>
          <p className="mt-2">Pool App 2026. Route smarter, work less.</p>
        </div>
      </footer>
    </div>
  );
}
