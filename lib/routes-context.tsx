'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useCustomers, Customer } from './customers-context';
import { useTechnicians, Technician } from './technicians-context';
import { getDemoStorage } from './demo-session';
import { deriveLatLng } from './geo';

// Types
export interface RouteStop {
  id: string;
  order: number;
  originalOrder: number;
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
  addStop: (technicianId: string, customerId: string, timeWindow: 'morning' | 'afternoon', isPriority?: boolean) => void;
  updateStop: (technicianId: string, stopId: string, updates: Partial<RouteStop>) => void;
  removeStop: (technicianId: string, stopId: string) => void;
  reorderStops: (technicianId: string, fromIndex: number, toIndex: number) => void;
  getTotalSavings: () => { milesSaved: number; timeSaved: number; fuelSaved: number; yearlySavings: number };
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

const STORAGE_KEY = 'poolapp-routes';

const MINUTES_PER_MILE = 2.4;
const FUEL_COST_PER_MILE = 0.58;

function haversineMiles(a: RouteStop, b: RouteStop): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function computeDistance(stops: RouteStop[]): number {
  if (stops.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < stops.length - 1; i += 1) {
    total += haversineMiles(stops[i], stops[i + 1]);
  }
  return total;
}

function nearestNeighbor(stops: RouteStop[]): RouteStop[] {
  if (stops.length <= 2) return [...stops];
  const remaining = stops.slice(1);
  const route = [stops[0]];

  while (remaining.length > 0) {
    const last = route[route.length - 1];
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < remaining.length; i += 1) {
      const distance = haversineMiles(last, remaining[i]);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }
    route.push(remaining.splice(bestIndex, 1)[0]);
  }

  return route;
}

function twoOpt(route: RouteStop[], maxIterations = 120): RouteStop[] {
  if (route.length < 4) return route;
  let bestRoute = route.slice();
  let improved = true;
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations += 1;
    for (let i = 1; i < bestRoute.length - 2; i += 1) {
      for (let k = i + 1; k < bestRoute.length - 1; k += 1) {
        const newRoute = bestRoute.slice();
        const segment = newRoute.slice(i, k + 1).reverse();
        newRoute.splice(i, segment.length, ...segment);
        if (computeDistance(newRoute) + 0.01 < computeDistance(bestRoute)) {
          bestRoute = newRoute;
          improved = true;
        }
      }
    }
  }

  return bestRoute;
}

function optimizeStops(stops: RouteStop[]): RouteStop[] {
  if (stops.length <= 2) return [...stops];

  const priority = stops.filter(stop => stop.isPriority);
  const morning = stops.filter(stop => !stop.isPriority && stop.timeWindow === 'morning');
  const afternoon = stops.filter(stop => !stop.isPriority && stop.timeWindow === 'afternoon');
  const anytime = stops.filter(stop => !stop.isPriority && !stop.timeWindow);

  const optimizedPriority = priority.length > 1 ? twoOpt(nearestNeighbor(priority)) : priority;
  const optimizedMorning = morning.length > 1 ? twoOpt(nearestNeighbor(morning)) : morning;
  const optimizedAfternoon = afternoon.length > 1 ? twoOpt(nearestNeighbor(afternoon)) : afternoon;
  const optimizedAnytime = anytime.length > 1 ? twoOpt(nearestNeighbor(anytime)) : anytime;

  return [
    ...optimizedPriority,
    ...optimizedMorning,
    ...optimizedAfternoon,
    ...optimizedAnytime,
  ];
}

function calculateSavings(totalDistance: number, optimizedDistance: number): RouteSavings {
  const milesSaved = Math.max(0, totalDistance - optimizedDistance);
  const timeSaved = milesSaved * MINUTES_PER_MILE;
  const fuelSaved = milesSaved * FUEL_COST_PER_MILE;
  return {
    milesSaved: Math.round(milesSaved * 10) / 10,
    timeSaved: Math.round(timeSaved),
    fuelSaved: Math.round(fuelSaved * 100) / 100,
  };
}

const generateId = () => `stop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function ensureStopGeo(stop: RouteStop): RouteStop {
  const originalOrder = typeof stop.originalOrder === 'number' ? stop.originalOrder : stop.order;
  if (typeof stop.lat === 'number' && typeof stop.lng === 'number') {
    return { ...stop, originalOrder };
  }
  const derived = deriveLatLng(stop.address, '');
  return { ...stop, ...derived, originalOrder };
}

// Generate initial routes from mock data
const generateInitialRoutes = (customers: Customer[], technicians: Technician[]): TechnicianRoute[] => {
  return technicians.map((tech, techIndex) => {
    const techCustomers = customers.filter((_, i) => i % technicians.length === techIndex).slice(0, 4 + techIndex * 2);

    const rawStops: RouteStop[] = techCustomers.map((customer, index) => {
      const coords = typeof customer.lat === 'number' && typeof customer.lng === 'number'
        ? { lat: customer.lat, lng: customer.lng }
        : deriveLatLng(customer.address, customer.city);

      return {
        id: generateId(),
        order: index + 1,
        originalOrder: index + 1,
        customerId: customer.id,
        customerName: customer.name,
        address: customer.address,
        estimatedArrival: `${8 + index}:00 AM`,
        estimatedDuration: 45,
        status: index < 2 ? 'completed' : index === 2 ? 'in-progress' : 'pending' as const,
        lat: coords.lat,
        lng: coords.lng,
        timeWindow: index < Math.ceil(techCustomers.length / 2) ? 'morning' : 'afternoon' as const,
        notes: customer.notes || '',
        isPriority: false,
      };
    });

    const optimized = optimizeStops(rawStops);
    const optimizedStops = optimized.map((stop, index) => ({
      ...stop,
      order: index + 1,
      estimatedArrival: `${8 + index}:00 AM`,
    }));

    const totalDistance = computeDistance(rawStops);
    const optimizedDistance = computeDistance(optimizedStops);
    const savings = calculateSavings(totalDistance, optimizedDistance);

    return {
      id: `route-${tech.id}`,
      technicianId: tech.id,
      technicianName: tech.name,
      technicianColor: tech.color,
      date: new Date().toISOString().split('T')[0],
      stops: optimizedStops,
      totalDistance: Math.round(totalDistance * 10) / 10,
      optimizedDistance: Math.round(optimizedDistance * 10) / 10,
      savings,
    };
  });
};

export function RoutesProvider({ children }: { children: ReactNode }) {
  const { customers } = useCustomers();
  const { technicians } = useTechnicians();
  const [routes, setRoutes] = useState<TechnicianRoute[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storage = getDemoStorage();
      const stored = storage?.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRoutes(parsed);
          setIsInitialized(true);
          return;
        } catch (e) {
          console.error('Failed to parse stored routes:', e);
        }
      }

      if (customers.length === 0 || technicians.length === 0) {
        return;
      }

      setRoutes(generateInitialRoutes(customers, technicians));
      setIsInitialized(true);
    }
  }, [customers, technicians]);

  // Save to storage on changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const storage = getDemoStorage();
      storage?.setItem(STORAGE_KEY, JSON.stringify(routes));
    }
  }, [routes, isInitialized]);

  const recalculateRoute = useCallback((route: TechnicianRoute): TechnicianRoute => {
    const hydratedStops = route.stops.map(ensureStopGeo);
    const originalStops = [...hydratedStops].sort((a, b) => a.originalOrder - b.originalOrder);
    const totalDistance = computeDistance(originalStops);
    const optimizedDistance = computeDistance(optimizeStops(hydratedStops));
    const savings = calculateSavings(totalDistance, optimizedDistance);

    return {
      ...route,
      stops: hydratedStops,
      totalDistance: Math.round(totalDistance * 10) / 10,
      optimizedDistance: Math.round(optimizedDistance * 10) / 10,
      savings,
    };
  }, []);

  const addStop = useCallback((technicianId: string, customerId: string, timeWindow: 'morning' | 'afternoon', isPriority = false) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    const coords = typeof customer.lat === 'number' && typeof customer.lng === 'number'
      ? { lat: customer.lat, lng: customer.lng }
      : deriveLatLng(customer.address, customer.city);

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
      originalOrder: route.stops.length + 1,
      customerId: customer.id,
      customerName: customer.name,
      address: customer.address,
          estimatedArrival: timeWindow === 'morning' ? '10:00 AM' : '2:00 PM',
          estimatedDuration: 45,
          status: 'pending',
          lat: coords.lat,
          lng: coords.lng,
          timeWindow,
          notes: '',
          isPriority,
        };

        const updatedRoute = {
          ...route,
          stops: [...route.stops, newStop],
        };

        return recalculateRoute(updatedRoute);
      });
    });
  }, [customers, recalculateRoute]);

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
