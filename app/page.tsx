'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Countdown timer for convention urgency
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

// FAQ data
const faqs = [
  {
    question: 'How long does it take to set up?',
    answer: 'About 5 minutes. Import your customers from a spreadsheet, add your techs, and you\'re ready to go. Our setup wizard guides you through every step.',
  },
  {
    question: 'Does it work with QuickBooks?',
    answer: 'QuickBooks integration is coming in Q2 2026! For now, you can export invoices as CSV. We\'re also building Xero and FreshBooks integrations.',
  },
  {
    question: 'Can I try before buying?',
    answer: 'Absolutely! Start with a 14-day free trial - no credit card required. Use all features with your real data. If you love it, pick a plan. If not, no hard feelings.',
  },
  {
    question: 'What if I need help?',
    answer: 'Founder members get direct founder support via text/call. All plans include priority email support with <4 hour response times during business hours.',
  },
  {
    question: 'How many pools can I manage?',
    answer: 'Convention Special includes up to 200 pools. Need more? Our Pro plan (coming soon) supports unlimited pools and technicians.',
  },
  {
    question: 'Does it work offline?',
    answer: 'Yes! Techs can log services, take photos, and complete stops even without signal. Everything syncs automatically when back online.',
  },
];

// FAQ Item component
function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/70 leading-relaxed pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const countdown = useCountdown();
  const [founderSpotsLeft] = useState(12);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Sticky Convention Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <p className="text-white text-sm font-bold">
            Pool & Spa Show Special Ends In:
          </p>
          <div className="flex items-center gap-1">
            <span className="font-mono bg-white/20 px-2 py-1 rounded text-white font-bold text-sm">
              {countdown.days}d
            </span>
            <span className="font-mono bg-white/20 px-2 py-1 rounded text-white font-bold text-sm">
              {countdown.hours.toString().padStart(2, '0')}h
            </span>
            <span className="font-mono bg-white/20 px-2 py-1 rounded text-white font-bold text-sm">
              {countdown.minutes.toString().padStart(2, '0')}m
            </span>
            <span className="font-mono bg-white/20 px-2 py-1 rounded text-white font-bold text-sm">
              {countdown.seconds.toString().padStart(2, '0')}s
            </span>
          </div>
          <Link
            href="/convention"
            className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold hover:bg-orange-50 transition-colors"
          >
            Claim Deal
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">PoolApp</span>
          </div>
          <Link
            href="/login"
            className="text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
          >
            Try Demo
          </Link>
        </div>
      </header>

      {/* ==================== HERO SECTION - ABOVE THE FOLD ==================== */}
      <section className="px-4 pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Copy */}
            <div>
              {/* Social Proof Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-green-300 text-sm font-medium mb-5"
              >
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border border-slate-800" />
                  ))}
                </div>
                <span>500+ pool pros on the waitlist</span>
              </motion.div>

              {/* Pain Point Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5"
              >
                Tired of your techs{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  zigzagging across town
                </span>{' '}
                while you lose money?
              </motion.h1>

              {/* Value Prop + Savings */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-white/70 mb-6"
              >
                PoolApp&apos;s smart routing saves you{' '}
                <span className="text-green-400 font-bold text-xl">$4,000+ per year</span>{' '}
                in fuel and labor. Your techs do more stops. You make more money. Simple.
              </motion.p>

              {/* Primary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <Link
                  href="/convention"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all"
                >
                  Start Free Trial
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <span className="text-white/50 text-sm self-center">No credit card required</span>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 text-sm text-white/60"
              >
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  14-day free trial
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </span>
              </motion.div>
            </div>

            {/* Right Column - Product Screenshot/Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Mock Dashboard Screenshot */}
                <div className="aspect-[4/3] p-4">
                  {/* Header Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-white/40">PoolApp Dashboard</div>
                  </div>

                  {/* Mock Route Map */}
                  <div className="relative h-32 bg-slate-700/50 rounded-lg mb-3 overflow-hidden">
                    <div className="absolute inset-0 opacity-50">
                      {/* Grid lines for map effect */}
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }} />
                    </div>
                    {/* Optimized route line */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                      <path
                        d="M 20,50 Q 50,20 80,40 T 140,30 T 180,50"
                        fill="none"
                        stroke="url(#routeGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                      {/* Stop markers */}
                      <circle cx="20" cy="50" r="6" fill="#22c55e" />
                      <circle cx="80" cy="40" r="5" fill="#06b6d4" />
                      <circle cx="140" cy="30" r="5" fill="#06b6d4" />
                      <circle cx="180" cy="50" r="6" fill="#ef4444" />
                    </svg>
                    <div className="absolute bottom-2 left-2 text-xs text-cyan-400 font-medium bg-slate-900/80 px-2 py-1 rounded">
                      Optimized: 38% less driving
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-green-500/20 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-green-400">$347</div>
                      <div className="text-xs text-white/50">Saved today</div>
                    </div>
                    <div className="bg-cyan-500/20 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-cyan-400">12</div>
                      <div className="text-xs text-white/50">Stops done</div>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-purple-400">2.1hr</div>
                      <div className="text-xs text-white/50">Time saved</div>
                    </div>
                  </div>

                  {/* Task List Preview */}
                  <div className="space-y-1.5">
                    {['Johnson Pool - Cleaned', 'Martinez Residence - Chlorine added', 'Lake View HOA - Complete'].map((task, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 rounded px-2 py-1.5 text-xs">
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/70">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold">
                Live Demo Available
              </div>
            </motion.div>
          </div>

          {/* Stats Bar - Below Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 pt-8 border-t border-white/10"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-green-400">$4,000+</div>
              <div className="text-xs sm:text-sm text-white/60">Avg yearly savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">38%</div>
              <div className="text-xs sm:text-sm text-white/60">Less driving time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">4-6</div>
              <div className="text-xs sm:text-sm text-white/60">Extra stops/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-yellow-400">4.9/5</div>
              <div className="text-xs sm:text-sm text-white/60">User rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== VIDEO/DEMO SECTION ==================== */}
      <section className="px-4 py-12 bg-white/5 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              See PoolApp in Action
            </h2>
            <p className="text-white/60">
              Watch how pool pros are saving 2+ hours every day
            </p>
          </motion.div>

          {/* Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden relative group cursor-pointer">
              {/* Thumbnail/Preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                {/* Play Button */}
                <Link
                  href="/login"
                  className="relative z-10 flex flex-col items-center gap-4 group"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:shadow-cyan-500/50 transition-all">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Watch 2-min Demo</span>
                </Link>

                {/* Background visual */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
                </div>
              </div>

              {/* Feature highlights on video */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {['Smart Routes', 'Chemistry Tracking', 'Instant Invoicing', 'Customer Portal'].map((feature) => (
                  <span key={feature} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/80">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Video Benefits */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-cyan-400 font-bold">5 min</div>
                <div className="text-xs text-white/60">Setup time</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-bold">Day 1</div>
                <div className="text-xs text-white/60">See results</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-bold">100%</div>
                <div className="text-xs text-white/60">Free to try</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES WITH BEFORE/AFTER ==================== */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
              Built by pool pros, for pool pros
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Real Results, Not Promises
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Every feature is designed to save you time and make you money. Here&apos;s exactly what changes:
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Feature 1: Route Optimization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/10 flex items-center justify-center text-cyan-400 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Smart Route Optimization</h3>
                  <p className="text-white/60 mb-4">
                    AI calculates the fastest route considering traffic, pool locations, and service times. No more wasted miles.
                  </p>
                  <div className="inline-flex items-center gap-2 text-lg font-bold text-cyan-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Saves 38% driving time
                  </div>
                </div>
                {/* Before/After */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-400 text-xs font-bold uppercase mb-2">Before</div>
                    <div className="text-2xl font-bold text-white mb-1">87 miles</div>
                    <div className="text-sm text-white/60">Daily driving</div>
                    <div className="mt-2 text-sm text-red-400">Zigzag routes</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 text-xs font-bold uppercase mb-2">After</div>
                    <div className="text-2xl font-bold text-white mb-1">54 miles</div>
                    <div className="text-sm text-white/60">Daily driving</div>
                    <div className="mt-2 text-sm text-green-400">Optimized path</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Chemistry Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="md:order-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/10 flex items-center justify-center text-green-400 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Chemistry Tracking</h3>
                  <p className="text-white/60 mb-4">
                    Log readings in seconds. Get alerts before problems happen. Know every pool&apos;s complete history instantly.
                  </p>
                  <div className="inline-flex items-center gap-2 text-lg font-bold text-green-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Prevents $500+ callbacks
                  </div>
                </div>
                {/* Before/After */}
                <div className="md:order-1 grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-400 text-xs font-bold uppercase mb-2">Before</div>
                    <div className="text-2xl font-bold text-white mb-1">3-4</div>
                    <div className="text-sm text-white/60">Callbacks/month</div>
                    <div className="mt-2 text-sm text-red-400">~$600 lost</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 text-xs font-bold uppercase mb-2">After</div>
                    <div className="text-2xl font-bold text-white mb-1">0-1</div>
                    <div className="text-sm text-white/60">Callbacks/month</div>
                    <div className="mt-2 text-sm text-green-400">Proactive alerts</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Same-Day Invoicing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/10 flex items-center justify-center text-purple-400 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Same-Day Invoicing</h3>
                  <p className="text-white/60 mb-4">
                    Job done? Invoice sent. Automatically. Customers pay online. No more chasing payments or paperwork.
                  </p>
                  <div className="inline-flex items-center gap-2 text-lg font-bold text-purple-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Get paid 3x faster
                  </div>
                </div>
                {/* Before/After */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-400 text-xs font-bold uppercase mb-2">Before</div>
                    <div className="text-2xl font-bold text-white mb-1">21 days</div>
                    <div className="text-sm text-white/60">Avg payment time</div>
                    <div className="mt-2 text-sm text-red-400">Manual invoicing</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 text-xs font-bold uppercase mb-2">After</div>
                    <div className="text-2xl font-bold text-white mb-1">7 days</div>
                    <div className="text-sm text-white/60">Avg payment time</div>
                    <div className="mt-2 text-sm text-green-400">Auto-invoicing</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 4: Customer Portal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="md:order-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 flex items-center justify-center text-orange-400 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Customer Portal</h3>
                  <p className="text-white/60 mb-4">
                    Customers see their service history, upcoming visits, and pay online. Fewer &quot;when are you coming?&quot; calls.
                  </p>
                  <div className="inline-flex items-center gap-2 text-lg font-bold text-orange-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    50% fewer phone calls
                  </div>
                </div>
                {/* Before/After */}
                <div className="md:order-1 grid grid-cols-2 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-red-400 text-xs font-bold uppercase mb-2">Before</div>
                    <div className="text-2xl font-bold text-white mb-1">15+</div>
                    <div className="text-sm text-white/60">Calls/day</div>
                    <div className="mt-2 text-sm text-red-400">&quot;When&apos;s my service?&quot;</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 text-xs font-bold uppercase mb-2">After</div>
                    <div className="text-2xl font-bold text-white mb-1">5-7</div>
                    <div className="text-sm text-white/60">Calls/day</div>
                    <div className="mt-2 text-sm text-green-400">Self-service portal</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIAL ==================== */}
      <section className="px-4 py-12 bg-white/5 border-y border-white/10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-white/10 relative"
          >
            {/* Quote mark */}
            <div className="absolute top-4 left-6 text-6xl text-cyan-500/20 font-serif">&ldquo;</div>

            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote className="text-xl sm:text-2xl text-white mb-6 leading-relaxed">
              &ldquo;We were skeptical - another app promising to fix everything. But the route optimization alone saved us{' '}
              <span className="text-cyan-400 font-semibold">8 hours a week</span>. That&apos;s an extra day of service.{' '}
              <span className="text-green-400 font-semibold">ROI was obvious in week one.</span>&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                MR
              </div>
              <div>
                <div className="text-white font-bold text-lg">Mike Rodriguez</div>
                <div className="text-white/60">Blue Wave Pools - Phoenix, AZ</div>
                <div className="text-cyan-400 text-sm font-medium">47 pools, 2 techs</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full text-red-300 text-sm font-bold mb-4 animate-pulse">
              <span className="w-2 h-2 bg-red-400 rounded-full" />
              Only {founderSpotsLeft} Founder Spots Left
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Convention-Only Pricing
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              These rates are only available during the Pool & Spa Show. After Jan 31, prices go up.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Convention Special */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-b from-cyan-500/20 to-blue-500/10 rounded-2xl p-6 border-2 border-cyan-500/50"
            >
              <div className="absolute -top-3 left-6 px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
                Most Popular
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-white mb-1">Convention Special</h3>
                <p className="text-white/60 text-sm mb-4">Pool & Spa Show exclusive</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black text-white">$79</span>
                  <span className="text-white/60">/month</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white/40 line-through">$99/mo</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-sm font-bold">Save $240/year</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Up to 3 technicians',
                    'Up to 200 pools',
                    'Route optimization (save $4K+/year)',
                    'Chemistry tracking & alerts',
                    'Same-day invoicing',
                    'Customer portal',
                    '14-day free trial',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-white/80 text-sm">
                      <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/convention"
                  className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-center rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  Start Free Trial
                </Link>
              </div>
            </motion.div>

            {/* Founder Rate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-b from-orange-500/20 to-red-500/10 rounded-2xl p-6 border-2 border-orange-500/50"
            >
              <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                Only {founderSpotsLeft} left!
              </div>
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-white mb-1">Founder Rate</h3>
                <p className="text-white/60 text-sm mb-4">Locked forever - first 50 only</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black text-white">$59</span>
                  <span className="text-white/60">/month</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white/40 line-through">$99/mo</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-sm font-bold">Save $480/year FOREVER</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Everything in Convention Special',
                    'Price locked for LIFE',
                    'Early access to new features',
                    'Direct founder support (text/call)',
                    'Shape the product roadmap',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-white/80 text-sm">
                      <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/convention"
                  className="block w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-center rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  Claim Founder Spot
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Pricing Comparison & Trust */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <h4 className="text-white font-bold mb-4 text-center">How We Compare</h4>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-white/40 text-sm mb-1">Other Route Software</div>
                <div className="text-white font-bold">$150-300/mo</div>
              </div>
              <div>
                <div className="text-white/40 text-sm mb-1">Invoicing Apps</div>
                <div className="text-white font-bold">$50-100/mo</div>
              </div>
              <div>
                <div className="text-cyan-400 text-sm mb-1 font-medium">PoolApp (All-in-One)</div>
                <div className="text-cyan-400 font-bold">$59-79/mo</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                256-bit encryption
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No hidden fees
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                30-day money-back guarantee
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="px-4 py-16 bg-white/5 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Common Questions
            </h2>
            <p className="text-white/60">
              Everything you need to know before getting started
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="divide-y divide-white/10 px-6">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaqIndex === index}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                />
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/50 text-sm mt-6"
          >
            More questions? Email us at{' '}
            <a href="mailto:hello@poolapp.com" className="text-cyan-400 hover:underline">hello@poolapp.com</a>
            {' '}or find us at booth #247
          </motion.p>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-3xl p-8 sm:p-12 border border-cyan-500/30 text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              {/* Recap Value */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                  $4K+ yearly savings
                </span>
                <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold">
                  38% less driving
                </span>
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
                  2 hours saved daily
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Stop Losing Money?
              </h2>

              <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
                Join 500+ pool pros who are already working smarter. Convention pricing disappears January 31st.
              </p>

              {/* Main CTA */}
              <Link
                href="/convention"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all mb-6"
              >
                Start Your Free Trial Now
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  14-day free trial
                </span>
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card needed
                </span>
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </span>
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure & encrypted
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== DEMO LINK ==================== */}
      <section className="px-4 py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60 mb-4">Want to explore the dashboard first?</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
          >
            Try the interactive demo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-white/40 text-sm mt-2">Login: demo@poolapp.com / demo123</p>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="px-4 py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          <p className="mb-2">Questions? Find us at booth #247 or email hello@poolapp.com</p>
          <p>PoolApp 2026 - Route smarter, profit more.</p>
        </div>
      </footer>
    </div>
  );
}
