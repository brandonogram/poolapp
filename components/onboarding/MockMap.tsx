'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Customer } from '@/lib/onboarding-context';

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  type: 'customer' | 'hq' | 'territory';
}

interface RouteLine {
  from: MapPin;
  to: MapPin;
  optimized?: boolean;
}

interface MockMapProps {
  pins?: MapPin[];
  customers?: Customer[];
  showTerritory?: boolean;
  territoryCenter?: { lat: number; lng: number };
  showRoutes?: boolean;
  isOptimized?: boolean;
  zoomLevel?: number;
  animate?: boolean;
  className?: string;
  showHQ?: boolean;
  companyLogo?: string;
}

const PIN_COLORS = {
  customer: '#0066FF',
  hq: '#00C853',
  territory: '#00D4FF',
};

// Convert lat/lng to percentage position on map
function toMapPosition(lat: number, lng: number, center: { lat: number; lng: number }, zoom: number) {
  const scale = zoom * 0.5;
  const x = 50 + (lng - center.lng) * scale * 100;
  const y = 50 - (lat - center.lat) * scale * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

export default function MockMap({
  pins = [],
  customers = [],
  showTerritory = false,
  territoryCenter = { lat: 33.4484, lng: -112.074 },
  showRoutes = false,
  isOptimized = false,
  zoomLevel = 1,
  animate = true,
  className = '',
  showHQ = false,
  companyLogo,
}: MockMapProps) {
  const [visiblePins, setVisiblePins] = useState<string[]>([]);
  const [routeProgress, setRouteProgress] = useState(0);

  // Convert customers to pins
  const customerPins: MapPin[] = customers.map((c, i) => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    label: c.name || `Pool ${i + 1}`,
    type: 'customer' as const,
  }));

  const allPins = [...pins, ...customerPins];

  // Animate pins appearing
  useEffect(() => {
    if (!animate) {
      setVisiblePins(allPins.map(p => p.id));
      return;
    }

    const newPins = allPins.filter(p => !visiblePins.includes(p.id));
    if (newPins.length > 0) {
      newPins.forEach((pin, i) => {
        setTimeout(() => {
          setVisiblePins(prev => [...prev, pin.id]);
        }, i * 300);
      });
    }
  }, [allPins.length, animate]);

  // Animate route drawing
  useEffect(() => {
    if (showRoutes && allPins.length >= 2) {
      setRouteProgress(0);
      const duration = 1500;
      const steps = 60;
      const increment = 100 / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        setRouteProgress(Math.min(100, current));
        if (current >= 100) clearInterval(interval);
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [showRoutes, isOptimized, allPins.length]);

  // Generate route lines
  const getRouteLines = () => {
    if (allPins.length < 2) return [];

    const orderedPins = isOptimized
      ? [...allPins].sort((a, b) => a.lat - b.lat)
      : allPins;

    const lines: RouteLine[] = [];
    for (let i = 0; i < orderedPins.length - 1; i++) {
      lines.push({
        from: orderedPins[i],
        to: orderedPins[i + 1],
        optimized: isOptimized,
      });
    }
    return lines;
  };

  const routeLines = getRouteLines();

  // Calculate center from pins or use territory center
  const mapCenter = allPins.length > 0
    ? {
        lat: allPins.reduce((sum, p) => sum + p.lat, 0) / allPins.length,
        lng: allPins.reduce((sum, p) => sum + p.lng, 0) / allPins.length,
      }
    : territoryCenter;

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Map background with gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(0, 102, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.06) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)
          `,
        }}
      />

      {/* Grid lines for map effect */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Territory circle */}
      <AnimatePresence>
        {showTerritory && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${60 * zoomLevel}%`,
              height: `${60 * zoomLevel}%`,
            }}
          >
            <motion.div
              className="w-full h-full rounded-full border-2 border-cyan-400/30"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(0, 212, 255, 0.4)',
                  '0 0 0 20px rgba(0, 212, 255, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route lines */}
      {showRoutes && routeLines.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isOptimized ? '#00C853' : '#0066FF'} />
              <stop offset="100%" stopColor={isOptimized ? '#00D4FF' : '#0066FF'} />
            </linearGradient>
          </defs>
          {routeLines.map((line, i) => {
            const from = toMapPosition(line.from.lat, line.from.lng, mapCenter, zoomLevel);
            const to = toMapPosition(line.to.lat, line.to.lng, mapCenter, zoomLevel);
            const lineProgress = Math.min(100, Math.max(0, (routeProgress - i * (100 / routeLines.length)) * routeLines.length / 100 * 100));

            return (
              <motion.line
                key={`${line.from.id}-${line.to.id}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${from.x + (to.x - from.x) * lineProgress / 100}%`}
                y2={`${from.y + (to.y - from.y) * lineProgress / 100}%`}
                stroke="url(#routeGradient)"
                strokeWidth={isOptimized ? 3 : 2}
                strokeLinecap="round"
                strokeDasharray={isOptimized ? 'none' : '8 4'}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            );
          })}
        </svg>
      )}

      {/* HQ marker */}
      <AnimatePresence>
        {showHQ && (
          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute z-20"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
                animate={{ boxShadow: ['0 4px 20px rgba(0, 200, 83, 0.4)', '0 4px 30px rgba(0, 200, 83, 0.6)', '0 4px 20px rgba(0, 200, 83, 0.4)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {companyLogo ? (
                  <span className="text-white font-bold text-lg">{companyLogo.charAt(0).toUpperCase()}</span>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded-md"
              >
                Your HQ
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer pins */}
      <AnimatePresence>
        {allPins.map((pin, index) => {
          const pos = toMapPosition(pin.lat, pin.lng, mapCenter, zoomLevel);
          const isVisible = visiblePins.includes(pin.id);

          if (!isVisible) return null;

          return (
            <motion.div
              key={pin.id}
              initial={{ scale: 0, y: -30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -30 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 15,
                delay: animate ? index * 0.15 : 0,
              }}
              className="absolute z-10"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {/* Pin shadow */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              />

              {/* Pin */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
              >
                <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
                    fill={PIN_COLORS[pin.type]}
                  />
                  <circle cx="16" cy="16" r="6" fill="white" />
                </svg>

                {/* Pin number */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-xs">
                  {index + 1}
                </div>
              </motion.div>

              {/* Label tooltip */}
              {pin.label && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded-md shadow-lg"
                >
                  {pin.label}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <span>Service Area</span>
        </div>
      </div>
    </div>
  );
}
