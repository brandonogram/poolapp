'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Card, Avatar, ProgressBar } from '@/components/ui';
import { todayRoutes, technicians, getTechnicianById } from '@/lib/mock-data';

interface RouteStop {
  id: string;
  order: number;
  customerId: string;
  customerName: string;
  address: string;
  status: string;
  estimatedArrival: string;
  estimatedDuration: number;
}

export default function RoutesPage() {
  const [selectedTech, setSelectedTech] = useState<string>('tech-1');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);
  const [serviceNotes, setServiceNotes] = useState('');
  const [chemistryReadings, setChemistryReadings] = useState({
    chlorine: '',
    ph: '',
    alkalinity: '',
    calcium: '',
  });

  const selectedRoute = todayRoutes.find((r) => r.technicianId === selectedTech);
  const tech = getTechnicianById(selectedTech);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  const handleStopClick = (stop: RouteStop) => {
    setSelectedStop(stop);
    setServiceNotes('');
    setChemistryReadings({ chlorine: '', ph: '', alkalinity: '', calcium: '' });
  };

  const handleCloseModal = () => {
    setSelectedStop(null);
  };

  const handleSaveService = () => {
    // In a real app, this would save to the database
    alert(`Service logged for ${selectedStop?.customerName}!\n\nNotes: ${serviceNotes || 'None'}\nChlorine: ${chemistryReadings.chlorine || 'N/A'}\npH: ${chemistryReadings.ph || 'N/A'}`);
    setSelectedStop(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-primary-500';
      case 'pending':
        return 'bg-slate-300';
      case 'skipped':
        return 'bg-red-500';
      default:
        return 'bg-slate-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Done</Badge>;
      case 'in-progress':
        return <Badge variant="primary" dot>Current</Badge>;
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
      case 'skipped':
        return <Badge variant="danger">Skipped</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500">Routes</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and optimize today's service routes. Click on a stop to log service.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900"
          >
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
          <Button onClick={handleOptimize} loading={isOptimizing}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
          </Button>
        </div>
      </div>

      {/* Stats comparison */}
      {selectedRoute && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Original Distance</p>
                <p className="text-xl font-bold text-slate-400 line-through">
                  {selectedRoute.totalDistance} mi
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Optimized Distance</p>
                <p className="text-xl font-bold text-green-600">
                  {selectedRoute.optimizedDistance} mi
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Time Saved</p>
                <p className="text-xl font-bold text-primary-600">
                  {Math.round((selectedRoute.estimatedTime - selectedRoute.optimizedTime) / 60 * 10) / 10} hrs
                </p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Fuel Saved</p>
                <p className="text-xl font-bold text-amber-600">
                  ${Math.round((selectedRoute.totalDistance - selectedRoute.optimizedDistance) * 0.58 * 10) / 10}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <Card title="Today's Route" subtitle={tech?.name}>
          <div className="h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="routeGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#routeGrid)" />
              </svg>
            </div>

            {/* Route visualization */}
            {selectedRoute && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
                {/* Route path */}
                <path
                  d="M 50 400 C 100 350 120 300 180 280 C 240 260 260 200 300 180 C 340 160 380 120 420 140 C 460 160 450 220 400 260 C 350 300 300 320 280 380 C 260 440 200 450 150 420"
                  fill="none"
                  stroke="#0066FF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70"
                  strokeDasharray="10,5"
                />

                {/* Stop markers */}
                {selectedRoute.stops.map((stop, index) => {
                  const positions = [
                    { x: 50, y: 400 },
                    { x: 120, y: 300 },
                    { x: 180, y: 280 },
                    { x: 260, y: 200 },
                    { x: 300, y: 180 },
                    { x: 380, y: 120 },
                    { x: 420, y: 140 },
                    { x: 400, y: 260 },
                    { x: 280, y: 380 },
                    { x: 150, y: 420 },
                  ];
                  const pos = positions[index % positions.length];

                  return (
                    <g
                      key={stop.id}
                      className="cursor-pointer"
                      onClick={() => handleStopClick(stop as RouteStop)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y + 3}
                        r="18"
                        fill="rgba(0,0,0,0.1)"
                      />
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="16"
                        fill="white"
                        stroke={
                          stop.status === 'completed'
                            ? '#10B981'
                            : stop.status === 'in-progress'
                            ? '#0066FF'
                            : '#94a3b8'
                        }
                        strokeWidth="3"
                        className="hover:stroke-[4px] transition-all"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 5}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill={
                          stop.status === 'completed'
                            ? '#10B981'
                            : stop.status === 'in-progress'
                            ? '#0066FF'
                            : '#64748b'
                        }
                      >
                        {stop.order}
                      </text>
                    </g>
                  );
                })}

                {/* Start marker */}
                <g>
                  <circle cx="50" cy="450" r="12" fill="#001B44" />
                  <text x="50" y="454" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                    S
                  </text>
                </g>
              </svg>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
              <p className="text-xs text-slate-500">Click a stop to log service</p>
            </div>
          </div>
        </Card>

        {/* Stops list */}
        <Card
          title="Route Stops"
          subtitle={`${selectedRoute?.stops.filter((s) => s.status === 'completed').length || 0} of ${selectedRoute?.stops.length || 0} completed`}
          action={
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </Button>
          }
        >
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
            {selectedRoute?.stops.map((stop, index) => (
              <div
                key={stop.id}
                onClick={() => handleStopClick(stop as RouteStop)}
                className={`relative flex gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  stop.status === 'in-progress'
                    ? 'border-primary-200 bg-primary-50 hover:border-primary-300'
                    : stop.status === 'completed'
                    ? 'border-green-100 bg-green-50/50 hover:border-green-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Connection line */}
                {index < (selectedRoute?.stops.length || 0) - 1 && (
                  <div
                    className={`absolute left-8 top-full w-0.5 h-3 -translate-x-1/2 ${
                      stop.status === 'completed' ? 'bg-green-300' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Stop number */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    stop.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : stop.status === 'in-progress'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {stop.status === 'completed' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stop.order
                  )}
                </div>

                {/* Stop info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{stop.customerName}</p>
                      <p className="text-sm text-slate-500">{stop.address}</p>
                    </div>
                    {getStatusBadge(stop.status)}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {stop.estimatedArrival}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ~{stop.estimatedDuration} min
                    </span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 flex items-center">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom optimization summary */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Route Optimized</h3>
              <p className="text-sm text-slate-500">
                This route has been optimized, saving{' '}
                <span className="font-semibold text-green-600">
                  {selectedRoute ? selectedRoute.totalDistance - selectedRoute.optimizedDistance : 0} miles
                </span>{' '}
                and{' '}
                <span className="font-semibold text-green-600">
                  {selectedRoute ? Math.round((selectedRoute.estimatedTime - selectedRoute.optimizedTime) / 60 * 10) / 10 : 0} hours
                </span>{' '}
                today.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Route
            </Button>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Open in Maps
            </Button>
          </div>
        </div>
      </Card>

      {/* Service Log Modal */}
      <AnimatePresence>
        {selectedStop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedStop.customerName}</h2>
                    <p className="text-sm text-slate-500 mt-1">{selectedStop.address}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  {getStatusBadge(selectedStop.status)}
                  <span className="text-sm text-slate-500">Stop #{selectedStop.order}</span>
                  <span className="text-sm text-slate-500">ETA: {selectedStop.estimatedArrival}</span>
                </div>
              </div>

              {/* Service Form */}
              <div className="p-6 space-y-6">
                {/* Chemistry Readings */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Chemistry Readings</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Chlorine (ppm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={chemistryReadings.chlorine}
                        onChange={(e) => setChemistryReadings({ ...chemistryReadings, chlorine: e.target.value })}
                        placeholder="1.0 - 3.0"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        pH Level
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={chemistryReadings.ph}
                        onChange={(e) => setChemistryReadings({ ...chemistryReadings, ph: e.target.value })}
                        placeholder="7.2 - 7.6"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Alkalinity (ppm)
                      </label>
                      <input
                        type="number"
                        value={chemistryReadings.alkalinity}
                        onChange={(e) => setChemistryReadings({ ...chemistryReadings, alkalinity: e.target.value })}
                        placeholder="80 - 120"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Calcium (ppm)
                      </label>
                      <input
                        type="number"
                        value={chemistryReadings.calcium}
                        onChange={(e) => setChemistryReadings({ ...chemistryReadings, calcium: e.target.value })}
                        placeholder="200 - 400"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Service Performed</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Skimmed', 'Vacuumed', 'Brushed', 'Cleaned Filter', 'Added Chlorine', 'Adjusted pH', 'Emptied Baskets'].map((action) => (
                      <button
                        key={action}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-primary-100 hover:text-primary-700 rounded-full transition-colors text-slate-700"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Service Notes
                  </label>
                  <textarea
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="Add any notes about the service..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Photos</h3>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                    <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-slate-500">Click to add photos</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex gap-3">
                <Button variant="outline" onClick={handleCloseModal} fullWidth>
                  Cancel
                </Button>
                <Button onClick={handleSaveService} fullWidth>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Service
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
