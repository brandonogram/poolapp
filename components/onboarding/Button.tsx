'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 focus:ring-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
    secondary: 'bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-500',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500',
    success: 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600 focus:ring-green-500 shadow-lg shadow-green-500/25 hover:shadow-green-500/40',
  };

  const sizeStyles = {
    sm: 'text-sm px-4 py-2 gap-1.5',
    md: 'text-base px-6 py-3 gap-2',
    lg: 'text-lg px-8 py-4 gap-2.5',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {isLoading ? (
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.span>
      ) : null}

      <span className={`flex items-center gap-2 ${isLoading ? 'invisible' : ''}`}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </motion.button>
  );
}

// CTA Button with extra emphasis
export function CTAButton({
  children,
  className = '',
  ...props
}: Omit<ButtonProps, 'variant' | 'size'>) {
  return (
    <motion.div className="relative">
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 blur-lg opacity-50"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <Button
        variant="primary"
        size="lg"
        className={`relative ${className}`}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

// Icon button
export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & Omit<HTMLMotionProps<'button'>, 'children'>) {
  const sizeStyles = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  };

  return (
    <motion.button
      className={`rounded-lg ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      {...props}
    >
      {icon}
    </motion.button>
  );
}
