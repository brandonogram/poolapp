'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Card } from '@/components/ui';
import { useRoutes } from '@/lib/routes-context';
import { AddStopModal, StopCard, TechnicianLocationMap } from '@/components/routes';
import { useRealtimeJobs } from '@/hooks/useRealtimeJobs';

const WORKING_DAYS_PER_WEEK = 5;
const WEEKS_PER_YEAR = 52;

export default function RoutesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <RoutesPageContent />;
}

function RoutesPageContent() {
  const { routes, getTotalSavings, reorderStops } = useRoutes();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState<'after' | 'before'>('after');
  const [addStopModal, setAddStopModal] = useState<{ isOpen: boolean; techId: string; techName: string } | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Real-time jobs subscription
  // Using a demo company ID - in production, this would come from auth context
  const demoCompanyId = 'demo-company-id';
  const { jobs: realtimeJobs, isConnected, loading: realtimeLoading, refresh: refreshJobs } = useRealtimeJobs(
    demoCompanyId,
    { autoConnect: true }
  );

  const savings = getTotalSavings();

  // Calculate totals from actual routes
  const totalOriginalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);
  const totalOptimizedDistance = routes.reduce((sum, r) => sum + r.optimizedDistance, 0);
  const totalMilesSaved = Math.round((totalOriginalDistance - totalOptimizedDistance) * 10) / 10;
  const totalTimeSavedHours = Math.round((savings.timeSaved / 60) * 10) / 10;
  const dailyFuelSavings = Math.round(savings.fuelSaved);
  const weeklySavingsAmount = dailyFuelSavings * WORKING_DAYS_PER_WEEK;
  const yearlySavingsAmount = weeklySavingsAmount * WEEKS_PER_YEAR;

  const totalStops = routes.reduce((sum, r) => sum + r.stops.length, 0);
  const completedStops = routes.reduce((sum, r) => sum + r.stops.filter(s => s.status === 'completed').length, 0);
  const optimizationScore = totalStops > 0 ? Math.round((totalOptimizedDistance / totalOriginalDistance) * 100) : 100;
  const efficiencyScore = 100 - optimizationScore + 75; // Higher is better

  const selectedTechData = selectedTech
    ? routes.find(r => r.technicianId === selectedTech)
    : null;

  const handleMoveStop = (techId: string, fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    reorderStops(techId, fromIndex, toIndex);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section - Big Savings Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="heroGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#heroGrid)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-100 text-sm font-medium">Today's Route Optimization</span>
                <Badge
                  variant={isConnected ? 'success' : 'default'}
                  className={`border-0 ${
                    isConnected
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                    isConnected ? 'bg-green-400 animate-pulse' : 'bg-white/50'
                  }`} />
                  {isConnected ? 'Live' : 'Connecting...'}
                </Badge>
                {realtimeJobs.length > 0 && (
                  <span className="text-green-100 text-xs">
                    ({realtimeJobs.length} jobs synced)
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">You're Saving Money Today</h1>
            </div>

            {/* Optimization Score */}
            <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray={`${Math.min(efficiencyScore, 100)}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{Math.min(efficiencyScore, 99)}%</span>
                </div>
              </div>
              <div>
                <p className="text-white/80 text-sm">Optimization</p>
                <p className="font-semibold">Score</p>
              </div>
            </div>
          </div>

          {/* Big Numbers - Main Selling Point */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5"
            >
              <p className="text-green-100 text-sm mb-1">Miles Saved Today</p>
              <p className="text-3xl md:text-4xl font-bold">{totalMilesSaved || 0}</p>
              <p className="text-green-200 text-sm mt-1">miles less driving</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5"
            >
              <p className="text-green-100 text-sm mb-1">Time Saved Today</p>
              <p className="text-3xl md:text-4xl font-bold">{totalTimeSavedHours || 0}</p>
              <p className="text-green-200 text-sm mt-1">hours back</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5"
            >
              <p className="text-green-100 text-sm mb-1">Fuel Saved Today</p>
              <p className="text-3xl md:text-4xl font-bold">${dailyFuelSavings || 0}</p>
              <p className="text-green-200 text-sm mt-1">in fuel costs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20"
            >
              <p className="text-green-100 text-sm mb-1">Yearly Projection</p>
              <p className="text-3xl md:text-4xl font-bold">${yearlySavingsAmount.toLocaleString()}</p>
              <p className="text-green-200 text-sm mt-1">${weeklySavingsAmount}/week</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Before/After Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Route Comparison */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Route Comparison</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{totalStops} stops total</p>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setShowBeforeAfter('before')}
                    className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                      showBeforeAfter === 'before'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setShowBeforeAfter('after')}
                    className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all min-h-[44px] ${
                      showBeforeAfter === 'after'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    After
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="relative h-[300px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id="mapGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                        <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#cbd5e1" strokeWidth="0.3" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#mapGrid)" />
                  </svg>
                </div>

                {/* Route visualization */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                  <AnimatePresence mode="wait">
                    {showBeforeAfter === 'before' ? (
                      <motion.g
                        key="before"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Inefficient route - zigzag pattern */}
                        <path
                          d="M 40 250 L 350 50 L 80 80 L 320 220 L 60 150 L 280 100 L 100 200 L 350 150 L 50 50"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="8,4"
                          opacity="0.7"
                        />
                        {/* Stop markers */}
                        {[
                          { x: 40, y: 250 }, { x: 350, y: 50 }, { x: 80, y: 80 },
                          { x: 320, y: 220 }, { x: 60, y: 150 }, { x: 280, y: 100 },
                          { x: 100, y: 200 }, { x: 350, y: 150 }, { x: 50, y: 50 }
                        ].slice(0, Math.min(totalStops, 9)).map((pos, i) => (
                          <g key={i}>
                            <circle cx={pos.x} cy={pos.y} r="12" fill="white" stroke="#EF4444" strokeWidth="2" />
                            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#EF4444">
                              {i + 1}
                            </text>
                          </g>
                        ))}
                      </motion.g>
                    ) : (
                      <motion.g
                        key="after"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Optimized route - efficient loop */}
                        <path
                          d="M 40 250 C 60 200 60 150 50 50 C 70 60 80 70 80 80 C 140 85 200 90 280 100 C 310 120 340 140 350 150 C 355 100 355 70 350 50 C 340 130 330 180 320 220 C 250 215 180 210 100 200 C 75 180 55 160 60 150"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Optimized stop markers */}
                        {[
                          { x: 40, y: 250 }, { x: 50, y: 50 }, { x: 80, y: 80 },
                          { x: 280, y: 100 }, { x: 350, y: 150 }, { x: 350, y: 50 },
                          { x: 320, y: 220 }, { x: 100, y: 200 }, { x: 60, y: 150 }
                        ].slice(0, Math.min(totalStops, 9)).map((pos, i) => (
                          <g key={i}>
                            <circle cx={pos.x} cy={pos.y} r="12" fill="white" stroke="#10B981" strokeWidth="2" />
                            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10B981">
                              {i + 1}
                            </text>
                          </g>
                        ))}
                      </motion.g>
                    )}
                  </AnimatePresence>

                  {/* Start marker */}
                  <g>
                    <circle cx="40" cy="280" r="10" fill="#1E40AF" />
                    <text x="40" y="284" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">S</text>
                  </g>
                </svg>

                {/* Distance overlay */}
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg shadow-lg ${
                  showBeforeAfter === 'before'
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  <p className="text-xs opacity-90">
                    {showBeforeAfter === 'before' ? 'Original Route' : 'Optimized Route'}
                  </p>
                  <p className="text-xl font-bold">
                    {showBeforeAfter === 'before' ? Math.round(totalOriginalDistance) : Math.round(totalOptimizedDistance)} miles
                  </p>
                </div>

                {/* Savings badge */}
                {showBeforeAfter === 'after' && totalMilesSaved > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-2 rounded-lg shadow-lg"
                  >
                    <p className="text-xs">You're Saving</p>
                    <p className="text-lg font-bold">-{totalMilesSaved} miles</p>
                  </motion.div>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500" style={{ borderTop: '3px dashed #EF4444' }}></div>
                  <span className="text-slate-600">Before: {Math.round(totalOriginalDistance)} mi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500"></div>
                  <span className="text-slate-600">After: {Math.round(totalOptimizedDistance)} mi</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Savings Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Your Savings Breakdown</h2>
              <p className="text-sm text-slate-500 mt-0.5">See exactly where you're saving</p>
            </div>

            <div className="p-5 space-y-5">
              {/* Daily breakdown */}
              <div className="bg-green-50 rounded-xl p-5">
                <h3 className="text-sm font-medium text-green-800 mb-4">Today's Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-green-900 font-medium">Distance Reduced</p>
                        <p className="text-xs text-green-600">{Math.round(totalOriginalDistance)} mi to {Math.round(totalOptimizedDistance)} mi</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-600">-{totalMilesSaved} mi</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-green-900 font-medium">Time Back</p>
                        <p className="text-xs text-green-600">More pools or earlier finish</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-600">+{totalTimeSavedHours} hrs</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-green-900 font-medium">Fuel Costs</p>
                        <p className="text-xs text-green-600">At $0.50/mile average</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-600">-${dailyFuelSavings}</span>
                  </div>
                </div>
              </div>

              {/* Projections */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="text-sm font-medium text-slate-700 mb-4">Projected Savings</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">${dailyFuelSavings}</p>
                    <p className="text-xs text-slate-500 mt-1">Per Day</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">${weeklySavingsAmount}</p>
                    <p className="text-xs text-slate-500 mt-1">Per Week</p>
                  </div>
                  <div className="relative">
                    <p className="text-2xl font-bold text-green-600">${yearlySavingsAmount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Per Year</p>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Technician Location Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
      >
        <Card>
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">Live Technician Tracking</h2>
                  <Badge
                    variant={isConnected ? 'success' : 'default'}
                    className={isConnected ? 'bg-green-100 text-green-700' : ''}
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                      isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
                    }`} />
                    {isConnected ? 'Live' : 'Offline'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">See where your technicians are in real-time</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5">
                  <TechnicianLocationMap
                    companyId={demoCompanyId}
                    height={350}
                    showLiveIndicator={false}
                    onTechnicianClick={(location) => {
                      // Find and select the matching technician in routes
                      const matchingRoute = routes.find(
                        r => r.technicianId === location.technician_id
                      );
                      if (matchingRoute) {
                        setSelectedTech(location.technician_id);
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showMap && (
            <div className="p-5">
              <div className="flex items-center justify-center gap-6 py-8 text-slate-500">
                <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-slate-700">Track technicians in real-time</p>
                  <p className="text-sm">Click "Show Map" to see live locations</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Per-Tech Routes with CRUD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="p-5 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Technician Routes</h2>
                <p className="text-sm text-slate-500 mt-0.5">Manage stops and optimize routes</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshJobs()}
                  disabled={realtimeLoading}
                  className="flex items-center gap-1.5"
                >
                  <svg
                    className={`w-4 h-4 ${realtimeLoading ? 'animate-spin' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
                <span className="text-sm text-slate-500">
                  {completedStops} of {totalStops} stops completed
                </span>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${totalStops > 0 ? (completedStops / totalStops) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                  onClick={() => setSelectedTech(selectedTech === route.technicianId ? null : route.technicianId)}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTech === route.technicianId
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    {route.stops.every(s => s.status === 'completed') ? (
                      <Badge variant="success">Done</Badge>
                    ) : route.stops.some(s => s.status === 'in-progress') ? (
                      <Badge variant="primary" dot>Active</Badge>
                    ) : (
                      <Badge variant="default">Pending</Badge>
                    )}
                  </div>

                  {/* Tech info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: route.technicianColor }}
                    >
                      {route.technicianName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{route.technicianName}</h3>
                      <p className="text-sm text-slate-500">
                        {route.stops.filter(s => s.status === 'completed').length}/{route.stops.length} stops
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${route.stops.length > 0 ? (route.stops.filter(s => s.status === 'completed').length / route.stops.length) * 100 : 0}%`,
                          backgroundColor: route.technicianColor
                        }}
                      />
                    </div>
                  </div>

                  {/* Savings for this tech */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded-lg py-2 px-1">
                      <p className="text-lg font-bold text-green-600">-{route.savings.milesSaved}</p>
                      <p className="text-xs text-green-700">miles</p>
                    </div>
                    <div className="bg-green-50 rounded-lg py-2 px-1">
                      <p className="text-lg font-bold text-green-600">+{Math.round(route.savings.timeSaved / 60 * 10) / 10}h</p>
                      <p className="text-xs text-green-700">saved</p>
                    </div>
                    <div className="bg-green-50 rounded-lg py-2 px-1">
                      <p className="text-lg font-bold text-green-600">${Math.round(route.savings.fuelSaved)}</p>
                      <p className="text-xs text-green-700">fuel</p>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selectedTech === route.technicianId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-green-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Original route:</span>
                            <span className="text-slate-400 line-through">{route.totalDistance} mi</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Optimized route:</span>
                            <span className="text-green-600 font-medium">{route.optimizedDistance} mi</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-green-100">
                            <span className="text-green-700 font-medium">Total saved:</span>
                            <span className="text-green-600 font-bold">
                              {route.savings.milesSaved} miles ({route.totalDistance > 0 ? Math.round((route.savings.milesSaved / route.totalDistance) * 100) : 0}%)
                            </span>
                          </div>
                        </div>

                        {/* Add Stop Button */}
                        <Button
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setAddStopModal({
                              isOpen: true,
                              techId: route.technicianId,
                              techName: route.technicianName,
                            });
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white mb-4"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Stop
                        </Button>

                        {/* Stops List */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {route.stops.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p>No stops on this route</p>
                              <p className="text-sm">Click "Add Stop" to begin</p>
                            </div>
                          ) : (
                            route.stops.map((stop, stopIndex) => (
                              <StopCard
                                key={stop.id}
                                stop={stop}
                                technicianId={route.technicianId}
                                technicianColor={route.technicianColor}
                                isFirst={stopIndex === 0}
                                isLast={stopIndex === route.stops.length - 1}
                                onMoveUp={() => handleMoveStop(route.technicianId, stopIndex, 'up')}
                                onMoveDown={() => handleMoveStop(route.technicianId, stopIndex, 'down')}
                              />
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Smart Routes = More Money in Your Pocket
                </h3>
                <p className="text-slate-300 max-w-lg">
                  Our AI optimizes your routes daily, saving you <span className="text-green-400 font-semibold">${yearlySavingsAmount.toLocaleString()}/year</span> in fuel and giving you <span className="text-green-400 font-semibold">{totalTimeSavedHours} hours</span> back every day.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Report
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Open in Maps
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Add Stop Modal */}
      {addStopModal && (
        <AddStopModal
          isOpen={addStopModal.isOpen}
          onClose={() => setAddStopModal(null)}
          technicianId={addStopModal.techId}
          technicianName={addStopModal.techName}
          existingStops={routes.find(r => r.technicianId === addStopModal.techId)?.stops || []}
        />
      )}
    </div>
  );
}
