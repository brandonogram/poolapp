'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { customers, technicians } from './mock-data';

// Types
export interface RouteStop {
  id: string;
  order: number;
  customerId: string;
  customerName: string;
  address: string;
  estimatedArrival: string;
  estimatedDuration: number;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  lat: number;
  lng: number;
  timeWindow?: 'morning' | 'afternoon';
  notes?: string;
  isPriority?: boolean;
}

export interface TechnicianRoute {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianColor: string;
  date: string;
  stops: RouteStop[];
  totalDistance: number;
  optimizedDistance: number;
  savings: RouteSavings;
}

export interface RouteSavings {
  milesSaved: number;
  timeSaved: number;
  fuelSaved: number;
}

interface RoutesContextType {
  routes: TechnicianRoute[];
  addStop: (technicianId: string, customerId: string, timeWindow: 'morning' | 'afternoon') => void;
  updateStop: (technicianId: string, stopId: string, updates: Partial<RouteStop>) => void;
  removeStop: (technicianId: string, stopId: string) => void;
  reorderStops: (technicianId: string, fromIndex: number, toIndex: number) => void;
  getTotalSavings: () => { milesSaved: number; timeSaved: number; fuelSaved: number; yearlySavings: number };
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

const STORAGE_KEY = 'poolapp-routes';

// Savings calculation formula
const calculateSavings = (stops: RouteStop[]): RouteSavings => {
  const baseDistance = stops.length * 5.5; // ~5.5 miles avg between stops unoptimized
  const optimizedDistance = stops.length * 3.5; // ~3.5 miles optimized
  const milesSaved = baseDistance - optimizedDistance;
  const timeSaved = milesSaved * 3; // ~3 min per mile
  const fuelSaved = milesSaved * 0.50; // $0.50 per mile
  return {
    milesSaved: Math.round(milesSaved * 10) / 10,
    timeSaved: Math.round(timeSaved),
    fuelSaved: Math.round(fuelSaved * 100) / 100
  };
};

const generateId = () => `stop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Generate initial routes from mock data
const generateInitialRoutes = (): TechnicianRoute[] => {
  return technicians.map((tech, techIndex) => {
    // Assign some customers to each tech
    const techCustomers = customers.filter((_, i) => i % 3 === techIndex).slice(0, 4 + techIndex * 2);

    const stops: RouteStop[] = techCustomers.map((customer, index) => ({
      id: generateId(),
      order: index + 1,
      customerId: customer.id,
      customerName: customer.name,
      address: customer.address,
      estimatedArrival: `${8 + index}:00 AM`,
      estimatedDuration: 45,
      status: index < 2 ? 'completed' : index === 2 ? 'in-progress' : 'pending' as const,
      lat: customer.lat,
      lng: customer.lng,
      timeWindow: index < Math.ceil(techCustomers.length / 2) ? 'morning' : 'afternoon' as const,
      notes: customer.notes || '',
      isPriority: false,
    }));

    const savings = calculateSavings(stops);
    const totalDistance = stops.length * 5.5;
    const optimizedDistance = stops.length * 3.5;

    return {
      id: `route-${tech.id}`,
      technicianId: tech.id,
      technicianName: tech.name,
      technicianColor: tech.color,
      date: new Date().toISOString().split('T')[0],
      stops,
      totalDistance: Math.round(totalDistance * 10) / 10,
      optimizedDistance: Math.round(optimizedDistance * 10) / 10,
      savings,
    };
  });
};

export function RoutesProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<TechnicianRoute[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRoutes(parsed);
        } catch (e) {
          console.error('Failed to parse stored routes:', e);
          setRoutes(generateInitialRoutes());
        }
      } else {
        setRoutes(generateInitialRoutes());
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
    }
  }, [routes, isInitialized]);

  const recalculateRoute = useCallback((route: TechnicianRoute): TechnicianRoute => {
    const savings = calculateSavings(route.stops);
    const totalDistance = route.stops.length * 5.5;
    const optimizedDistance = route.stops.length * 3.5;

    return {
      ...route,
      totalDistance: Math.round(totalDistance * 10) / 10,
      optimizedDistance: Math.round(optimizedDistance * 10) / 10,
      savings,
    };
  }, []);

  const addStop = useCallback((technicianId: string, customerId: string, timeWindow: 'morning' | 'afternoon') => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    setRoutes(prevRoutes => {
      return prevRoutes.map(route => {
        if (route.technicianId !== technicianId) return route;

        // Check if customer already exists in this route
        if (route.stops.some(s => s.customerId === customerId)) {
          return route;
        }

        const newStop: RouteStop = {
          id: generateId(),
          order: route.stops.length + 1,
          customerId: customer.id,
          customerName: customer.name,
          address: customer.address,
          estimatedArrival: timeWindow === 'morning' ? '10:00 AM' : '2:00 PM',
          estimatedDuration: 45,
          status: 'pending',
          lat: customer.lat,
          lng: customer.lng,
          timeWindow,
          notes: '',
          isPriority: false,
        };

        const updatedRoute = {
          ...route,
          stops: [...route.stops, newStop],
        };

        return recalculateRoute(updatedRoute);
      });
    });
  }, [recalculateRoute]);

  const updateStop = useCallback((technicianId: string, stopId: string, updates: Partial<RouteStop>) => {
    setRoutes(prevRoutes => {
      return prevRoutes.map(route => {
        if (route.technicianId !== technicianId) return route;

        const updatedStops = route.stops.map(stop => {
          if (stop.id !== stopId) return stop;
          return { ...stop, ...updates };
        });

        return recalculateRoute({ ...route, stops: updatedStops });
      });
    });
  }, [recalculateRoute]);

  const removeStop = useCallback((technicianId: string, stopId: string) => {
    setRoutes(prevRoutes => {
      return prevRoutes.map(route => {
        if (route.technicianId !== technicianId) return route;

        const filteredStops = route.stops.filter(stop => stop.id !== stopId);
        // Reorder remaining stops
        const reorderedStops = filteredStops.map((stop, index) => ({
          ...stop,
          order: index + 1,
        }));

        return recalculateRoute({ ...route, stops: reorderedStops });
      });
    });
  }, [recalculateRoute]);

  const reorderStops = useCallback((technicianId: string, fromIndex: number, toIndex: number) => {
    setRoutes(prevRoutes => {
      return prevRoutes.map(route => {
        if (route.technicianId !== technicianId) return route;

        const newStops = [...route.stops];
        const [movedStop] = newStops.splice(fromIndex, 1);
        newStops.splice(toIndex, 0, movedStop);

        // Update order numbers
        const reorderedStops = newStops.map((stop, index) => ({
          ...stop,
          order: index + 1,
        }));

        return recalculateRoute({ ...route, stops: reorderedStops });
      });
    });
  }, [recalculateRoute]);

  const getTotalSavings = useCallback(() => {
    const totals = routes.reduce(
      (acc, route) => ({
        milesSaved: acc.milesSaved + route.savings.milesSaved,
        timeSaved: acc.timeSaved + route.savings.timeSaved,
        fuelSaved: acc.fuelSaved + route.savings.fuelSaved,
      }),
      { milesSaved: 0, timeSaved: 0, fuelSaved: 0 }
    );

    // Yearly projection: daily savings * 5 days * 52 weeks
    const yearlySavings = totals.fuelSaved * 5 * 52;

    return {
      milesSaved: Math.round(totals.milesSaved * 10) / 10,
      timeSaved: Math.round(totals.timeSaved),
      fuelSaved: Math.round(totals.fuelSaved * 100) / 100,
      yearlySavings: Math.round(yearlySavings),
    };
  }, [routes]);

  return (
    <RoutesContext.Provider
      value={{
        routes,
        addStop,
        updateStop,
        removeStop,
        reorderStops,
        getTotalSavings,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
}

export function useRoutes() {
  const context = useContext(RoutesContext);
  if (context === undefined) {
    throw new Error('useRoutes must be used within a RoutesProvider');
  }
  return context;
}
