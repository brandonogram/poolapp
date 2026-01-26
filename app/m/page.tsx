'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MobileLandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Full-screen mobile experience */}
      <div className="px-5 py-8 max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Pool App</span>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            Pool & Spa Show Special
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Stop wasting{' '}
            <span className="text-cyan-400">2 hours a day</span>{' '}
            driving between pools
          </h1>

          <p className="text-white/70 text-base mb-6">
            Route optimization that saves{' '}
            <span className="text-cyan-400 font-semibold">$4,000+/year</span>
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-xl font-bold text-cyan-400">38%</div>
            <div className="text-[10px] text-white/60 uppercase tracking-wide">Less driving</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-xl font-bold text-cyan-400">2hr</div>
            <div className="text-[10px] text-white/60 uppercase tracking-wide">Saved daily</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-xl font-bold text-cyan-400">$4K+</div>
            <div className="text-[10px] text-white/60 uppercase tracking-wide">Annual savings</div>
          </div>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {[
            { icon: '🗺️', text: 'Smart route optimization - serve 4-6 more pools/day' },
            { icon: '🧪', text: 'Chemistry tracking with automatic alerts' },
            { icon: '💰', text: 'Same-day invoicing - get paid faster' },
            { icon: '📱', text: 'Mobile app for your techs in the field' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white/80 text-sm">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-b from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-500/30 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-cyan-400 text-xs font-medium mb-1">SHOW SPECIAL</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">$79</span>
                <span className="text-white/60">/mo</span>
                <span className="text-white/40 line-through text-sm">$99</span>
              </div>
            </div>
            <div className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
              Save $240/yr
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            {['14-day free trial', 'Up to 3 technicians', 'Route optimization', 'No credit card required'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/convention"
            className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl text-center shadow-lg shadow-cyan-500/30"
          >
            Start Free Trial
          </Link>
        </motion.div>

        {/* Demo Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/login"
            className="text-cyan-400 text-sm font-medium"
          >
            See demo dashboard →
          </Link>
          <p className="text-white/40 text-xs mt-1">demo@poolapp.com / demo123</p>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-white/40 text-xs">Pool & Spa Show 2026 - Atlantic City</p>
          <p className="text-white/30 text-xs mt-1">hello@poolapp.com</p>
        </div>
      </div>
    </div>
  );
}
