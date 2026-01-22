'use client';

import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showSuccessState?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      showSuccessState = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

    const hasValue = props.value !== undefined && props.value !== '';
    const showSuccess = showSuccessState && hasValue && !error;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <motion.input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border-2 bg-white px-4 py-3 text-slate-900
              placeholder:text-slate-400 transition-all duration-200
              focus:outline-none focus:ring-0
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || showSuccess || error ? 'pr-10' : ''}
              ${
                error
                  ? 'border-red-300 focus:border-red-500'
                  : showSuccess
                  ? 'border-green-300 focus:border-green-500'
                  : 'border-slate-200 focus:border-blue-500'
              }
            `}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            animate={{
              boxShadow: isFocused
                ? error
                  ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                  : '0 0 0 3px rgba(59, 130, 246, 0.1)'
                : 'none',
            }}
            {...props}
          />

          {/* Right icon area */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-red-500"
                >
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
              ) : showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-green-500"
                >
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              ) : rightIcon ? (
                <motion.div key="icon" className="text-slate-400">
                  {rightIcon}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Error or hint message */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-1.5 text-sm text-red-600"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-1.5 text-sm text-slate-500"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

// Specialized zip code input
export function ZipCodeInput({
  value,
  onChange,
  onComplete,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange(newValue);

    if (newValue.length === 5 && onComplete) {
      onComplete(newValue);
    }
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      placeholder="Enter your zip code"
      value={value}
      onChange={handleChange}
      maxLength={5}
      className={className}
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      }
      showSuccessState={value.length === 5}
    />
  );
}

// Password input with visibility toggle
export function PasswordInput({
  label = 'Password',
  ...props
}: Omit<InputProps, 'type'>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      label={label}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-slate-400 hover:text-slate-600"
        >
          {showPassword ? (
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
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      }
      {...props}
    />
  );
}
