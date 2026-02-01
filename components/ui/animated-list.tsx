'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: 'fade' | 'slide' | 'scale' | 'slideRight';
}

const animations: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
};

/**
 * Animated list component that staggers children animations.
 * Wraps list items with enter/exit animations.
 */
export function AnimatedList({
  children,
  className = '',
  staggerDelay = 0.05,
  animation = 'slide',
}: AnimatedListProps) {
  const variants = animations[animation];

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {children.map((child, index) => (
          <motion.div
            key={index}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.2,
              delay: index * staggerDelay,
            }}
            layout
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedItemProps {
  children: ReactNode;
  index?: number;
  animation?: 'fade' | 'slide' | 'scale' | 'slideRight';
  delay?: number;
  className?: string;
}

/**
 * Single animated item component.
 * Use for individual elements that need enter animations.
 */
export function AnimatedItem({
  children,
  index = 0,
  animation = 'slide',
  delay = 0,
  className = '',
}: AnimatedItemProps) {
  const variants = animations[animation];

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.2,
        delay: delay + index * 0.05,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Simple fade-in animation wrapper.
 */
export function FadeIn({ children, delay = 0, duration = 0.3, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

/**
 * Slide-in animation wrapper with configurable direction.
 */
export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.3,
  distance = 20,
  className = '',
}: SlideInProps) {
  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const initial = {
    opacity: 0,
    ...directionMap[direction],
  };

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Scale-in animation wrapper.
 */
export function ScaleIn({ children, delay = 0, duration = 0.3, className = '' }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

/**
 * Container that staggers its children's animations.
 * Children should use variants with 'initial' and 'animate' states.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pre-defined animation variants for use with motion components.
 */
export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};
