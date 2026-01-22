'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  highlightOnChange?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1,
  decimals = 0,
  className = '',
  highlightOnChange = true,
  size = 'md',
}: AnimatedCounterProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const prevValue = useRef(value);

  const spring = useSpring(prevValue.current, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) => {
    return current.toFixed(decimals);
  });

  useEffect(() => {
    spring.set(value);

    if (highlightOnChange && value !== prevValue.current) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 500);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
    prevValue.current = value;
  }, [value, spring, highlightOnChange]);

  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-4xl font-bold',
    xl: 'text-6xl font-bold',
  };

  return (
    <motion.span
      className={`inline-flex items-baseline tabular-nums ${sizeClasses[size]} ${className}`}
      animate={{
        scale: isHighlighted ? [1, 1.05, 1] : 1,
        color: isHighlighted ? ['inherit', '#00C853', 'inherit'] : 'inherit',
      }}
      transition={{ duration: 0.3 }}
    >
      {prefix && <span className="text-slate-500">{prefix}</span>}
      <motion.span>{display}</motion.span>
      {suffix && <span className="text-slate-500 text-[0.6em] ml-1">{suffix}</span>}
    </motion.span>
  );
}

// Specialized counter for money
interface MoneyCounterProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCents?: boolean;
  perPeriod?: string;
}

export function MoneyCounter({
  value,
  className = '',
  size = 'md',
  showCents = false,
  perPeriod,
}: MoneyCounterProps) {
  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <AnimatedCounter
        value={value}
        prefix="$"
        decimals={showCents ? 2 : 0}
        size={size}
        suffix={perPeriod ? `/${perPeriod}` : ''}
      />
    </span>
  );
}

// Specialized counter for distance
interface DistanceCounterProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function DistanceCounter({
  value,
  className = '',
  size = 'md',
}: DistanceCounterProps) {
  return (
    <AnimatedCounter
      value={value}
      suffix="mi"
      decimals={1}
      size={size}
      className={className}
    />
  );
}

// Specialized counter for time
interface TimeCounterProps {
  minutes: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function TimeCounter({
  minutes,
  className = '',
  size = 'md',
}: TimeCounterProps) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return (
      <span className={`inline-flex items-baseline gap-1 ${className}`}>
        <AnimatedCounter value={hours} suffix="hr" size={size} />
        <AnimatedCounter value={mins} suffix="min" size={size} />
      </span>
    );
  }

  return (
    <AnimatedCounter
      value={minutes}
      suffix="min"
      decimals={0}
      size={size}
      className={className}
    />
  );
}
