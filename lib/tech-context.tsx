'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types for Tech App
export interface TechStop {
  id: string;
  order: number;
  customerName: string;
  address: string;
  gateCode: string;
  status: 'completed' | 'current' | 'upcoming';
  poolSize: number;
  poolType: 'Chlorine' | 'Saltwater' | 'Mineral';
  lastServiceDate: string;
  notes: string;
  specialInstructions?: string;
}

export interface ChemistryReading {
  pH: number;
  chlorine: number;
  alkalinity: number;
  cya?: number;
  calcium?: number;
  salt?: number;
}

export interface ServiceEntry {
  stopId: string;
  chemistry: ChemistryReading;
  tasks: {
    skim: boolean;
    brush: boolean;
    vacuum: boolean;
    baskets: boolean;
    filter: boolean;
    equipment: boolean;
  };
  chemicalsAdded: boolean;
  photos: string[];
  notes: string;
  completedAt?: string;
}

export interface TechRoute {
  date: string;
  techName: string;
  totalStops: number;
  completedStops: number;
  estimatedHours: number;
  totalMiles: number;
  stops: TechStop[];
}

interface TechContextType {
  route: TechRoute;
  currentStopId: string | null;
  isOnline: boolean;
  pendingSync: number;
  getCurrentStop: () => TechStop | null;
  getUpcomingStops: () => TechStop[];
  getCompletedStops: () => TechStop[];
  startStop: (stopId: string) => void;
  completeStop: (stopId: string, entry: Omit<ServiceEntry, 'stopId' | 'completedAt'>) => void;
  skipStop: (stopId: string, reason: string) => void;
  setOnline: (online: boolean) => void;
}

const TechContext = createContext<TechContextType | undefined>(undefined);

// Mock route data for demo
const generateMockRoute = (): TechRoute => {
  const stops: TechStop[] = [
    {
      id: 'stop-1',
      order: 1,
      customerName: 'Johnson Family',
      address: '1234 Oak Lane, Phoenix, AZ',
      gateCode: '#4521',
      status: 'completed',
      poolSize: 18000,
      poolType: 'Saltwater',
      lastServiceDate: '2026-01-19',
      notes: 'Dog is friendly. Check salt cell.',
      specialInstructions: 'Use side gate',
    },
    {
      id: 'stop-2',
      order: 2,
      customerName: 'Martinez Residence',
      address: '567 Palm Drive, Phoenix, AZ',
      gateCode: '9876',
      status: 'completed',
      poolSize: 15000,
      poolType: 'Chlorine',
      lastServiceDate: '2026-01-19',
      notes: 'Equipment shed behind garage.',
    },
    {
      id: 'stop-3',
      order: 3,
      customerName: 'Williams Estate',
      address: '890 Sunset Blvd, Scottsdale, AZ',
      gateCode: 'Side gate unlocked',
      status: 'completed',
      poolSize: 25000,
      poolType: 'Saltwater',
      lastServiceDate: '2026-01-19',
      notes: 'Large infinity pool. Check overflow channel.',
      specialInstructions: 'Ring doorbell on arrival',
    },
    {
      id: 'stop-4',
      order: 4,
      customerName: 'Thompson Home',
      address: '2345 Cactus Way, Phoenix, AZ',
      gateCode: '#1234',
      status: 'completed',
      poolSize: 16000,
      poolType: 'Chlorine',
      lastServiceDate: '2026-01-19',
      notes: 'Key under mat.',
    },
    {
      id: 'stop-5',
      order: 5,
      customerName: 'Garcia Family',
      address: '678 Desert Rose, Tempe, AZ',
      gateCode: '5555',
      status: 'completed',
      poolSize: 8000,
      poolType: 'Chlorine',
      lastServiceDate: '2026-01-19',
      notes: '',
    },
    {
      id: 'stop-6',
      order: 6,
      customerName: 'Anderson Pool',
      address: '1111 Mountain View, Mesa, AZ',
      gateCode: '#7890',
      status: 'completed',
      poolSize: 22000,
      poolType: 'Saltwater',
      lastServiceDate: '2026-01-15',
      notes: 'Competition lap pool. Very particular about chemistry.',
      specialInstructions: 'pH must be 7.2-7.4',
    },
    {
      id: 'stop-7',
      order: 7,
      customerName: 'Davis Residence',
      address: '3456 Valley Lane, Phoenix, AZ',
      gateCode: 'Open - no code',
      status: 'completed',
      poolSize: 14000,
      poolType: 'Mineral',
      lastServiceDate: '2026-01-19',
      notes: 'Mineral system - check cartridge monthly.',
    },
    {
      id: 'stop-8',
      order: 8,
      customerName: 'Wilson Family',
      address: '789 Hillside Dr, Scottsdale, AZ',
      gateCode: '#2468',
      status: 'completed',
      poolSize: 20000,
      poolType: 'Saltwater',
      lastServiceDate: '2026-01-16',
      notes: 'Has spa attached. Check spa chemistry too.',
    },
    {
      id: 'stop-9',
      order: 9,
      customerName: 'Brown Pool House',
      address: '4567 Oasis Ct, Gilbert, AZ',
      gateCode: '1357',
      status: 'completed',
      poolSize: 17000,
      poolType: 'Chlorine',
      lastServiceDate: '2026-01-16',
      notes: 'Pool house has separate filter system.',
    },
    {
      id: 'stop-10',
      order: 10,
      customerName: 'Chen Residence',
      address: '234 Elm Street, Phoenix, AZ',
      gateCode: '#9999',
      status: 'completed',
      poolSize: 12000,
      poolType: 'Chlorine',
      lastServiceDate: '2026-01-19',
      notes: 'Small backyard, tight space.',
    },
    {
      id: 'stop-11',
      order: 11,
      customerName: 'Roberts Family',
      address: '567 Maple Ave, Tempe, AZ',
      gateCode: 'Ring bell - owner opens',
      status: 'current',
      poolSize: 15000,
      poolType: 'Saltwater',
      lastServiceDate: '2026-01-19',
      notes: 'Elderly owner, always home.',
      specialInstructions: 'Be patient at gate',
    },
    {
      id: 'stop-12',
      order: 12,
      customerName: 'Kim Residence',
      address: '890 Pine Rd, Chandler, AZ',
      gateCode: '#3333',
      status: 'upcoming',
      poolSize: 18000,
      poolType: 'Chlorine',
      lastServiceDate: '2026-01-19',
      notes: 'New customer. First solo visit.',
    },
    {
      id: 'stop-13',
      order: 13,
      customerName: 'Patel Home',
      address: '1234 Birch Ln, Mesa, AZ',
      gateCode: '4444',
      status: 'upcoming',
      poolSize: 16000,
      poolType: 'Saltwater',
      lastServiceDate: '2026-01-19',
      notes: 'Check heater - reported issue last week.',
      specialInstructions: 'Document heater status',
    },
    {
      id: 'stop-14',
      order: 14,
      customerName: 'Taylor Estate',
      address: '5678 Cedar Way, Scottsdale, AZ',
      gateCode: '#8888',
      status: 'upcoming',
      poolSize: 30000,
      poolType: 'Saltwater',
      lastServiceDate: '2026-01-19',
      notes: 'Large estate, multiple water features.',
    },
    {
      id: 'stop-15',
      order: 15,
      customerName: 'Miller Residence',
      address: '8901 Sunset Hills, Phoenix, AZ',
      gateCode: '#1111',
      status: 'upcoming',
      poolSize: 16500,
      poolType: 'Chlorine',
      lastServiceDate: '2026-01-17',
      notes: 'Last stop of the day.',
    },
  ];

  return {
    date: 'Sunday, January 26',
    techName: 'Mike Rodriguez',
    totalStops: stops.length,
    completedStops: stops.filter(s => s.status === 'completed').length,
    estimatedHours: 7.5,
    totalMiles: 48,
    stops,
  };
};

export function TechProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<TechRoute>(generateMockRoute());
  const [currentStopId, setCurrentStopId] = useState<string | null>('stop-11');
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(0);

  const getCurrentStop = useCallback(() => {
    return route.stops.find(s => s.id === currentStopId) || null;
  }, [route.stops, currentStopId]);

  const getUpcomingStops = useCallback(() => {
    const currentIndex = route.stops.findIndex(s => s.id === currentStopId);
    return route.stops.filter((_, index) => index > currentIndex);
  }, [route.stops, currentStopId]);

  const getCompletedStops = useCallback(() => {
    return route.stops.filter(s => s.status === 'completed');
  }, [route.stops]);

  const startStop = useCallback((stopId: string) => {
    setCurrentStopId(stopId);
    setRoute(prev => ({
      ...prev,
      stops: prev.stops.map(stop => ({
        ...stop,
        status: stop.id === stopId ? 'current' : stop.status,
      })),
    }));
  }, []);

  const completeStop = useCallback((stopId: string, entry: Omit<ServiceEntry, 'stopId' | 'completedAt'>) => {
    const stopIndex = route.stops.findIndex(s => s.id === stopId);
    const nextStop = route.stops[stopIndex + 1];

    setRoute(prev => ({
      ...prev,
      completedStops: prev.completedStops + 1,
      stops: prev.stops.map((stop, index) => {
        if (stop.id === stopId) {
          return { ...stop, status: 'completed' as const };
        }
        if (nextStop && stop.id === nextStop.id) {
          return { ...stop, status: 'current' as const };
        }
        return stop;
      }),
    }));

    if (nextStop) {
      setCurrentStopId(nextStop.id);
    } else {
      setCurrentStopId(null);
    }

    if (!isOnline) {
      setPendingSync(prev => prev + 1);
    }
  }, [route.stops, isOnline]);

  const skipStop = useCallback((stopId: string, reason: string) => {
    const stopIndex = route.stops.findIndex(s => s.id === stopId);
    const nextStop = route.stops[stopIndex + 1];

    setRoute(prev => ({
      ...prev,
      stops: prev.stops.map((stop, index) => {
        if (stop.id === stopId) {
          return { ...stop, status: 'completed' as const, notes: `SKIPPED: ${reason}` };
        }
        if (nextStop && stop.id === nextStop.id) {
          return { ...stop, status: 'current' as const };
        }
        return stop;
      }),
    }));

    if (nextStop) {
      setCurrentStopId(nextStop.id);
    } else {
      setCurrentStopId(null);
    }
  }, [route.stops]);

  const setOnline = useCallback((online: boolean) => {
    setIsOnline(online);
    if (online && pendingSync > 0) {
      // Simulate sync
      setTimeout(() => setPendingSync(0), 1500);
    }
  }, [pendingSync]);

  return (
    <TechContext.Provider
      value={{
        route,
        currentStopId,
        isOnline,
        pendingSync,
        getCurrentStop,
        getUpcomingStops,
        getCompletedStops,
        startStop,
        completeStop,
        skipStop,
        setOnline,
      }}
    >
      {children}
    </TechContext.Provider>
  );
}

export function useTech() {
  const context = useContext(TechContext);
  if (context === undefined) {
    throw new Error('useTech must be used within a TechProvider');
  }
  return context;
}
