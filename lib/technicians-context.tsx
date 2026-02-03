'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDemoStorage } from './demo-session';

export interface Technician {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  color: string; // hex color for route display
  status: 'active' | 'on-break' | 'off-duty' | 'inactive';
  startDate: string;
  stats?: {
    jobsToday: number;
    jobsCompleted: number;
    efficiency: number;
  };
}

interface TechniciansContextType {
  technicians: Technician[];
  addTechnician: (tech: Omit<Technician, 'id'>) => Technician;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  deactivateTechnician: (id: string) => void;
  activateTechnician: (id: string) => void;
  getTechnicianById: (id: string) => Technician | undefined;
  getActiveTechnicians: () => Technician[];
}

// Initial mock data - the 3 existing technicians
const initialTechnicians: Technician[] = [
  {
    id: 'tech-1',
    name: 'Mike Rodriguez',
    phone: '(555) 123-4567',
    email: 'mike.rodriguez@poolops.io',
    color: '#3B82F6', // blue
    status: 'active',
    startDate: '2024-03-15',
    stats: {
      jobsToday: 8,
      jobsCompleted: 6,
      efficiency: 98,
    },
  },
  {
    id: 'tech-2',
    name: 'Sarah Chen',
    phone: '(555) 234-5678',
    email: 'sarah.chen@poolops.io',
    color: '#10B981', // green
    status: 'active',
    startDate: '2024-05-20',
    stats: {
      jobsToday: 8,
      jobsCompleted: 7,
      efficiency: 102,
    },
  },
  {
    id: 'tech-3',
    name: 'Jake Thompson',
    phone: '(555) 345-6789',
    email: 'jake.thompson@poolops.io',
    color: '#F59E0B', // amber
    status: 'active',
    startDate: '2024-08-01',
    stats: {
      jobsToday: 6,
      jobsCompleted: 6,
      efficiency: 95,
    },
  },
];

const STORAGE_KEY = 'poolapp-technicians';

const TechniciansContext = createContext<TechniciansContextType | undefined>(undefined);

export function TechniciansProvider({ children }: { children: ReactNode }) {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const storage = getDemoStorage();
    const saved = storage?.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTechnicians(parsed);
        }
      } catch (e) {
        console.error('Failed to load technicians from storage:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to storage on change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      const storage = getDemoStorage();
      storage?.setItem(STORAGE_KEY, JSON.stringify(technicians));
    }
  }, [technicians, isHydrated]);

  const addTechnician = useCallback((techData: Omit<Technician, 'id'>): Technician => {
    const newTech: Technician = {
      ...techData,
      id: `tech-${Date.now()}`,
      stats: techData.stats || {
        jobsToday: 0,
        jobsCompleted: 0,
        efficiency: 100,
      },
    };

    setTechnicians(prev => [...prev, newTech]);
    return newTech;
  }, []);

  const updateTechnician = useCallback((id: string, updates: Partial<Technician>) => {
    setTechnicians(prev =>
      prev.map(tech =>
        tech.id === id ? { ...tech, ...updates } : tech
      )
    );
  }, []);

  const deleteTechnician = useCallback((id: string) => {
    setTechnicians(prev => prev.filter(tech => tech.id !== id));
  }, []);

  const deactivateTechnician = useCallback((id: string) => {
    setTechnicians(prev =>
      prev.map(tech =>
        tech.id === id ? { ...tech, status: 'inactive' as const } : tech
      )
    );
  }, []);

  const activateTechnician = useCallback((id: string) => {
    setTechnicians(prev =>
      prev.map(tech =>
        tech.id === id ? { ...tech, status: 'active' as const } : tech
      )
    );
  }, []);

  const getTechnicianById = useCallback((id: string): Technician | undefined => {
    return technicians.find(tech => tech.id === id);
  }, [technicians]);

  const getActiveTechnicians = useCallback((): Technician[] => {
    return technicians.filter(tech => tech.status !== 'inactive');
  }, [technicians]);

  return (
    <TechniciansContext.Provider
      value={{
        technicians,
        addTechnician,
        updateTechnician,
        deleteTechnician,
        deactivateTechnician,
        activateTechnician,
        getTechnicianById,
        getActiveTechnicians,
      }}
    >
      {children}
    </TechniciansContext.Provider>
  );
}

export function useTechnicians() {
  const context = useContext(TechniciansContext);
  if (context === undefined) {
    throw new Error('useTechnicians must be used within a TechniciansProvider');
  }
  return context;
}

// Export helper for use in places that don't need the full context
export function getTechColors(color: string): { bg: string; border: string; text: string; light: string } {
  // Map hex colors to Tailwind classes where possible, fallback to inline styles
  const colorMap: Record<string, { bg: string; border: string; text: string; light: string }> = {
    '#3B82F6': { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-700', light: 'bg-blue-50' },
    '#10B981': { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-700', light: 'bg-emerald-50' },
    '#F59E0B': { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-700', light: 'bg-amber-50' },
    '#EF4444': { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-700', light: 'bg-red-50' },
    '#8B5CF6': { bg: 'bg-violet-500', border: 'border-violet-400', text: 'text-violet-700', light: 'bg-violet-50' },
    '#EC4899': { bg: 'bg-pink-500', border: 'border-pink-400', text: 'text-pink-700', light: 'bg-pink-50' },
    '#06B6D4': { bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-700', light: 'bg-cyan-50' },
    '#84CC16': { bg: 'bg-lime-500', border: 'border-lime-400', text: 'text-lime-700', light: 'bg-lime-50' },
  };

  return colorMap[color] || {
    bg: 'bg-slate-500',
    border: 'border-slate-400',
    text: 'text-slate-700',
    light: 'bg-slate-50',
  };
}
