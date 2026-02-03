'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDemoStorage } from './demo-session';

export interface Customer {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  weeklyRate: number;
}

export interface OnboardingState {
  // Step 1: Hook
  zipCode: string;
  localPoolCount: number;
  averageRate: number;
  annualLoss: number;

  // Step 2: Account
  companyName: string;
  email: string;
  password: string;
  isAccountCreated: boolean;
  potentialPools: number;

  // Step 3 & 4: Customers
  customers: Customer[];
  isOptimized: boolean;

  // Route metrics
  originalDistance: number;
  optimizedDistance: number;
  timeSaved: number;
  annualSavings: number;

  // Progress
  currentStep: number;
  completedSteps: number[];
}

interface OnboardingContextType {
  state: OnboardingState;
  setZipCode: (zip: string) => void;
  setCompanyDetails: (name: string, email: string, password: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  removeCustomer: (id: string) => void;
  optimizeRoute: () => void;
  goToStep: (step: number) => void;
  completeStep: (step: number) => void;
  resetOnboarding: () => void;
}

const defaultState: OnboardingState = {
  zipCode: '',
  localPoolCount: 0,
  averageRate: 0,
  annualLoss: 4100,
  companyName: '',
  email: '',
  password: '',
  isAccountCreated: false,
  potentialPools: 0,
  customers: [],
  isOptimized: false,
  originalDistance: 0,
  optimizedDistance: 0,
  timeSaved: 0,
  annualSavings: 0,
  currentStep: 1,
  completedSteps: [],
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Mock data generator based on zip code
function generateMockData(zip: string) {
  // Use zip code to seed "random" but consistent data
  const seed = zip.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const poolCount = 800 + (seed % 600); // 800-1400 pools
  const avgRate = 125 + (seed % 75); // $125-200 per service

  return {
    localPoolCount: poolCount,
    averageRate: avgRate,
    potentialPools: poolCount + Math.floor(seed % 300),
  };
}

// Generate mock customer positions in a service area
function generateCustomerPosition(index: number, existingCustomers: Customer[]) {
  // Create a cluster pattern for realistic routing
  const basePositions = [
    { lat: 33.4484, lng: -112.0740 }, // Phoenix area
    { lat: 33.4152, lng: -111.8315 },
    { lat: 33.5091, lng: -111.8985 },
    { lat: 33.3942, lng: -111.9261 },
    { lat: 33.4373, lng: -111.7896 },
  ];

  const base = basePositions[index % basePositions.length];
  const offset = 0.01 * (index + 1);

  return {
    lat: base.lat + (Math.random() - 0.5) * offset,
    lng: base.lng + (Math.random() - 0.5) * offset,
  };
}

// Calculate route distance (simplified)
function calculateRouteDistance(customers: Customer[], optimized: boolean): number {
  if (customers.length < 2) return 0;

  let total = 0;
  const ordered = optimized
    ? [...customers].sort((a, b) => a.lat - b.lat) // Simple optimization: sort by latitude
    : customers;

  for (let i = 0; i < ordered.length - 1; i++) {
    const dx = ordered[i + 1].lat - ordered[i].lat;
    const dy = ordered[i + 1].lng - ordered[i].lng;
    total += Math.sqrt(dx * dx + dy * dy) * 69; // Rough miles conversion
  }

  return optimized ? total * 0.7 : total; // Optimization "saves" 30%
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(defaultState);

  // Load from storage on mount
  useEffect(() => {
    const storage = getDemoStorage();
    const saved = storage?.getItem('poolapp-onboarding');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error('Failed to load onboarding state:', e);
      }
    }
  }, []);

  // Save to storage on change
  useEffect(() => {
    const storage = getDemoStorage();
    storage?.setItem('poolapp-onboarding', JSON.stringify(state));
  }, [state]);

  const setZipCode = (zip: string) => {
    const mockData = generateMockData(zip);
    setState(prev => ({
      ...prev,
      zipCode: zip,
      ...mockData,
    }));
  };

  const setCompanyDetails = (name: string, email: string, password: string) => {
    setState(prev => ({
      ...prev,
      companyName: name,
      email,
      password,
      isAccountCreated: true,
    }));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const id = `customer-${Date.now()}`;
    const newCustomer = { ...customer, id };

    setState(prev => {
      const customers = [...prev.customers, newCustomer];
      const originalDistance = calculateRouteDistance(customers, false);

      return {
        ...prev,
        customers,
        originalDistance,
        isOptimized: false, // Reset optimization when adding customers
      };
    });
  };

  const removeCustomer = (id: string) => {
    setState(prev => {
      const customers = prev.customers.filter(c => c.id !== id);
      const originalDistance = calculateRouteDistance(customers, false);

      return {
        ...prev,
        customers,
        originalDistance,
        isOptimized: false,
      };
    });
  };

  const optimizeRoute = () => {
    setState(prev => {
      const optimizedDistance = calculateRouteDistance(prev.customers, true);
      const distanceSaved = prev.originalDistance - optimizedDistance;
      const timeSaved = distanceSaved * 2; // ~2 min per mile
      const weeklySavings = distanceSaved * 0.58 * 5; // $0.58/mile, 5 days/week
      const annualSavings = weeklySavings * 52;

      return {
        ...prev,
        isOptimized: true,
        optimizedDistance,
        timeSaved,
        annualSavings: Math.round(annualSavings * 100) / 100,
      };
    });
  };

  const goToStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const completeStep = (step: number) => {
    setState(prev => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step],
    }));
  };

  const resetOnboarding = () => {
    const storage = getDemoStorage();
    storage?.removeItem('poolapp-onboarding');
    setState(defaultState);
  };

  return (
    <OnboardingContext.Provider value={{
      state,
      setZipCode,
      setCompanyDetails,
      addCustomer,
      removeCustomer,
      optimizeRoute,
      goToStep,
      completeStep,
      resetOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
