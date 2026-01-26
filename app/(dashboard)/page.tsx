'use client';

import { useState, useEffect } from 'react';

interface Alert {
  id: number;
  pool: string;
  issue: string;
  severity: string;
}

interface Route {
  id: number;
  tech: string;
  stops: number;
  distance: string;
}

export default function Dashboard() {
  const [revenue, setRevenue] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [efficiency, setEfficiency] = useState({ jobs: 0, time: '0h' });

  useEffect(() => {
    // Mock live data (replace with real Supabase queries)
    setRevenue(12500);
    setAlerts([
      { id: 1, pool: 'Smith Residence', issue: 'pH out of range (7.8)', severity: 'high' },
      { id: 2, pool: 'Johnson Pool', issue: 'Low chlorine', severity: 'medium' }
    ]);
    setRoutes([
      { id: 1, tech: 'Juan', stops: 8, distance: '25mi' },
      { id: 2, tech: 'Tech2', stops: 6, distance: '18mi' }
    ]);
    setEfficiency({ jobs: 14, time: '4.2h avg' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">PoolApp Dashboard v2.1</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Revenue Widget */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Monthly Revenue</h2>
          <p className="text-3xl font-bold text-green-600">${revenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Forecast: +12%</p>
        </div>

        {/* Tech Efficiency */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Tech Efficiency</h2>
          <p className="text-2xl font-bold text-blue-600">{efficiency.jobs} jobs/tech</p>
          <p className="text-sm text-gray-500">{efficiency.time}</p>
        </div>

        {/* Chem Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2 lg:col-span-2 xl:col-span-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chemical Alerts</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex justify-between items-center p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <span>{alert.pool}: {alert.issue}</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{alert.severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Routes */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2 lg:col-span-2 xl:col-span-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today&apos;s Routes</h2>
          <div className="space-y-3">
            {routes.map(route => (
              <div key={route.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                <span className="font-medium">{route.tech}</span>
                <span>{route.stops} stops - {route.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
