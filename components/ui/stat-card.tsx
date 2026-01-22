'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className = '' }: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-navy-500 tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  trend.positive !== false ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.positive !== false ? (
                  <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {trend.value}%
              </span>
              <span className="text-sm text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-primary-50 rounded-lg text-primary-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
