'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for the onboarding state
export interface BusinessInfo {
  companyName: string;
  numTechnicians: number;
  numPools: number;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface OnboardingChecklist {
  addTechnicians: boolean;
  importCustomers: boolean;
  setupRoute: boolean;
  createInvoice: boolean;
  connectQuickbooks: boolean;
}

export interface HintsState {
  revenueHint: boolean;
  routeOptimizeHint: boolean;
  chemistryHint: boolean;
  technicianHint: boolean;
  invoiceHint: boolean;
}

export interface NewUserOnboardingState {
  // Onboarding progress
  hasCompletedOnboarding: boolean;
  currentStep: number;

  // Business info
  businessInfo: BusinessInfo;

  // First technician (optional)
  firstTechnician: Technician | null;

  // First customer (optional)
  firstCustomer: Customer | null;

  // Demo mode
  isDemoMode: boolean;

  // Checklist
  checklist: OnboardingChecklist;
  checklistDismissed: boolean;

  // Hints
  hints: HintsState;
}

interface OnboardingContextType {
  state: NewUserOnboardingState;
  setBusinessInfo: (info: BusinessInfo) => void;
  setFirstTechnician: (tech: Technician | null) => void;
  setFirstCustomer: (customer: Customer | null) => void;
  completeOnboarding: () => void;
  setCurrentStep: (step: number) => void;
  toggleDemoMode: () => void;
  useDemoData: () => void;
  useFreshStart: () => void;
  updateChecklist: (key: keyof OnboardingChecklist, value: boolean) => void;
  dismissChecklist: () => void;
  markHintSeen: (key: keyof HintsState) => void;
  resetOnboarding: () => void;
}

const defaultState: NewUserOnboardingState = {
  hasCompletedOnboarding: false,
  currentStep: 1,
  businessInfo: {
    companyName: '',
    numTechnicians: 1,
    numPools: 0,
  },
  firstTechnician: null,
  firstCustomer: null,
  isDemoMode: false,
  checklist: {
    addTechnicians: false,
    importCustomers: false,
    setupRoute: false,
    createInvoice: false,
    connectQuickbooks: false,
  },
  checklistDismissed: false,
  hints: {
    revenueHint: false,
    routeOptimizeHint: false,
    chemistryHint: false,
    technicianHint: false,
    invoiceHint: false,
  },
};

const NewUserOnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'poolapp-new-user-onboarding';

export function NewUserOnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NewUserOnboardingState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error('Failed to load onboarding state:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setBusinessInfo = (info: BusinessInfo) => {
    setState(prev => ({
      ...prev,
      businessInfo: info,
    }));
  };

  const setFirstTechnician = (tech: Technician | null) => {
    setState(prev => ({
      ...prev,
      firstTechnician: tech,
      checklist: {
        ...prev.checklist,
        addTechnicians: tech !== null,
      },
    }));
  };

  const setFirstCustomer = (customer: Customer | null) => {
    setState(prev => ({
      ...prev,
      firstCustomer: customer,
      checklist: {
        ...prev.checklist,
        importCustomers: customer !== null,
      },
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
    }));
  };

  const setCurrentStep = (step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
    }));
  };

  const toggleDemoMode = () => {
    setState(prev => ({
      ...prev,
      isDemoMode: !prev.isDemoMode,
    }));
  };

  const useDemoData = () => {
    setState(prev => ({
      ...prev,
      isDemoMode: true,
      businessInfo: {
        companyName: 'Blue Wave Pool Services',
        numTechnicians: 4,
        numPools: 125,
      },
      checklist: {
        addTechnicians: true,
        importCustomers: true,
        setupRoute: true,
        createInvoice: false,
        connectQuickbooks: false,
      },
    }));
  };

  const useFreshStart = () => {
    setState(prev => ({
      ...prev,
      isDemoMode: false,
      firstTechnician: null,
      firstCustomer: null,
    }));
  };

  const updateChecklist = (key: keyof OnboardingChecklist, value: boolean) => {
    setState(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: value,
      },
    }));
  };

  const dismissChecklist = () => {
    setState(prev => ({
      ...prev,
      checklistDismissed: true,
    }));
  };

  const markHintSeen = (key: keyof HintsState) => {
    setState(prev => ({
      ...prev,
      hints: {
        ...prev.hints,
        [key]: true,
      },
    }));
  };

  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <NewUserOnboardingContext.Provider value={{
      state,
      setBusinessInfo,
      setFirstTechnician,
      setFirstCustomer,
      completeOnboarding,
      setCurrentStep,
      toggleDemoMode,
      useDemoData,
      useFreshStart,
      updateChecklist,
      dismissChecklist,
      markHintSeen,
      resetOnboarding,
    }}>
      {children}
    </NewUserOnboardingContext.Provider>
  );
}

export function useNewUserOnboarding() {
  const context = useContext(NewUserOnboardingContext);
  if (context === undefined) {
    throw new Error('useNewUserOnboarding must be used within a NewUserOnboardingProvider');
  }
  return context;
}
