'use client';

import { useState } from 'react';
import { Button, Badge, Avatar, Card } from '@/components/ui';
import { weeklySchedule, technicians, customers } from '@/lib/mock-data';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const dates = ['Jan 20', 'Jan 21', 'Jan 22', 'Jan 23', 'Jan 24'];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday (today)
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  // Get customers for a specific day and technician
  const getPoolsForCell = (techId: string, dayIndex: number) => {
    const dayName = fullDays[dayIndex];
    return customers.filter(
      (c) => c.assignedTechId === techId && c.serviceDay === dayName
    );
  };

  // Get unscheduled pools
  const getUnscheduledPools = () => {
    return customers.filter((c) => !c.assignedTechId || !c.serviceDay);
  };

  const handleDragStart = (e: React.DragEvent, customerId: string) => {
    e.dataTransfer.setData('customerId', customerId);
  };

  const handleDragOver = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    setDragOverCell(cellId);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCell(null);
    // In a real app, this would update the customer's schedule
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500">Schedule</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your weekly pool service schedule
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Week
          </Button>
          <Button variant="outline">
            Next Week
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Optimize All
          </Button>
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Week of January 20, 2026</h2>
            <p className="text-sm text-slate-500">
              {weeklySchedule.technicians.reduce((sum, t) => sum + t.pools.reduce((a, b) => a + b, 0), 0)} pools scheduled across {technicians.length} technicians
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {daysOfWeek.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedDay === index
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="sticky left-0 z-10 bg-slate-50 px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">
                  Technician
                </th>
                {daysOfWeek.map((day, index) => (
                  <th
                    key={day}
                    className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider min-w-[180px] ${
                      selectedDay === index
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-xs font-normal mt-0.5">{dates[index]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {technicians.map((tech) => (
                <tr key={tech.id}>
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 border-r border-slate-100">
                    <div className="flex items-center gap-3">
                      <Avatar name={tech.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{tech.name}</p>
                        <p className="text-xs text-slate-500">{tech.phone}</p>
                      </div>
                    </div>
                  </td>
                  {daysOfWeek.map((day, dayIndex) => {
                    const pools = getPoolsForCell(tech.id, dayIndex);
                    const cellId = `${tech.id}-${dayIndex}`;
                    const isToday = dayIndex === 2;
                    const isDragOver = dragOverCell === cellId;

                    return (
                      <td
                        key={day}
                        className={`px-4 py-3 align-top ${
                          selectedDay === dayIndex ? 'bg-primary-50/30' : ''
                        } ${isDragOver ? 'bg-primary-100' : ''}`}
                        onDragOver={(e) => handleDragOver(e, cellId)}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="space-y-2">
                          {/* Pool count badge */}
                          <div className="flex items-center justify-between">
                            <Badge variant={pools.length > 0 ? 'primary' : 'default'}>
                              {pools.length} pools
                            </Badge>
                            {isToday && pools.length > 0 && (
                              <Badge variant="success" dot>
                                Active
                              </Badge>
                            )}
                          </div>

                          {/* Pool cards */}
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {pools.slice(0, 3).map((pool) => (
                              <div
                                key={pool.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, pool.id)}
                                className="group px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs cursor-move hover:border-primary-300 hover:shadow-sm transition-all"
                              >
                                <p className="font-medium text-slate-700 truncate">{pool.name}</p>
                                <p className="text-slate-400 truncate">${pool.rate}</p>
                              </div>
                            ))}
                            {pools.length > 3 && (
                              <button className="w-full px-2 py-1 text-xs text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded">
                                +{pools.length - 3} more
                              </button>
                            )}
                          </div>

                          {/* Empty state / drop zone */}
                          {pools.length === 0 && (
                            <div className="h-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">
                              Drop pools here
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Unscheduled row */}
              <tr className="bg-amber-50/50">
                <td className="sticky left-0 z-10 bg-amber-50 px-6 py-4 border-r border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-amber-800">Unscheduled</p>
                      <p className="text-xs text-amber-600">Needs assignment</p>
                    </div>
                  </div>
                </td>
                {daysOfWeek.map((day, dayIndex) => (
                  <td
                    key={day}
                    className={`px-4 py-3 align-top ${selectedDay === dayIndex ? 'bg-amber-100/50' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">{weeklySchedule.unscheduled[dayIndex]}</Badge>
                      {weeklySchedule.unscheduled[dayIndex] > 0 && (
                        <button className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                          Assign
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">62</p>
              <p className="text-sm text-slate-500">Total Pools This Week</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">12</p>
              <p className="text-sm text-slate-500">Unscheduled Pools</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">94%</p>
              <p className="text-sm text-slate-500">Route Efficiency</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
