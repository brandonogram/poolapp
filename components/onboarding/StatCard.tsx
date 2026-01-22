'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter, { MoneyCounter } from './AnimatedCounter';

interface StatCardProps {
  label: string;
  value: number;
  type?: 'number' | 'money' | 'percentage';
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  delay?: number;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
}

export default function StatCard({
  label,
  value,
  type = 'number',
  prefix,
  suffix,
  icon,
  trend,
  trendValue,
  className = '',
  delay = 0,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-white border-slate-200',
    highlight: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
    warning: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
  };

  const trendColors = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    neutral: 'text-slate-600 bg-slate-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl border p-5 ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-100">{icon}</div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          {type === 'money' ? (
            <MoneyCounter value={value} size="lg" />
          ) : (
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              size="lg"
            />
          )}
        </div>

        {trend && trendValue && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3 }}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendColors[trend]}`}
          >
            {trend === 'up' && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trendValue}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Compact stat for inline display
export function InlineStat({
  label,
  value,
  prefix = '',
  suffix = '',
  className = '',
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-slate-500 text-sm">{label}:</span>
      <AnimatedCounter value={value} prefix={prefix} suffix={suffix} size="sm" />
    </div>
  );
}

// Loss aversion card with emphasis
export function LossCard({
  amount,
  period = 'year',
  message,
  className = '',
}: {
  amount: number;
  period?: string;
  message?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 p-6 ${className}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="loss-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10h20M10 0v20" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect fill="url(#loss-pattern)" width="100%" height="100%" />
        </svg>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium text-red-700">Money Left on the Table</span>
        </div>

        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-4xl font-bold text-red-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MoneyCounter value={amount} size="lg" className="text-red-600" />
          </motion.span>
          <span className="text-red-500 text-lg">/{period}</span>
        </div>

        {message && (
          <motion.p
            className="mt-3 text-sm text-red-700/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
