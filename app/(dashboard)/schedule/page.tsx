'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Avatar, Card, Toast, useToast } from '@/components/ui';
import { weeklySchedule, technicians, customers as initialCustomers, Customer } from '@/lib/mock-data';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const dates = ['Jan 20', 'Jan 21', 'Jan 22', 'Jan 23', 'Jan 24'];

// Pool card component with Framer Motion animations
function PoolCard({
  pool,
  onDragStart,
  isBeingDragged,
}: {
  pool: Customer;
  onDragStart: (e: React.DragEvent, customerId: string) => void;
  isBeingDragged: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isBeingDragged ? 0.5 : 1,
        scale: isBeingDragged ? 0.95 : 1,
        boxShadow: isBeingDragged ? '0 10px 25px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, pool.id)}
      className="group px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs cursor-move hover:border-primary-300 hover:shadow-sm transition-all"
    >
      <p className="font-medium text-slate-700 truncate">{pool.name}</p>
      <p className="text-slate-400 truncate">${pool.rate}</p>
    </motion.div>
  );
}

// Drop zone component with visual feedback
function DropZone({
  isDragOver,
  isEmpty,
  children,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  isDragOver: boolean;
  isEmpty: boolean;
  children: React.ReactNode;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <motion.div
      animate={{
        scale: isDragOver ? 1.02 : 1,
        backgroundColor: isDragOver ? 'rgb(219 234 254)' : 'transparent',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`space-y-1.5 min-h-[64px] rounded-lg p-1 transition-colors ${
        isDragOver ? 'ring-2 ring-primary-400 ring-offset-1' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
      {isEmpty && !isDragOver && (
        <div className="h-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">
          Drop pools here
        </div>
      )}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-10 border-2 border-dashed border-primary-400 bg-primary-50 rounded-lg flex items-center justify-center text-xs text-primary-600 font-medium"
        >
          Release to move here
        </motion.div>
      )}
    </motion.div>
  );
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday (today)
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const [draggingCustomerId, setDraggingCustomerId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<Customer[]>(initialCustomers);
  const { messages, addToast, dismissToast } = useToast();

  // Get customers for a specific day and technician
  const getPoolsForCell = useCallback((techId: string, dayIndex: number) => {
    const dayName = fullDays[dayIndex];
    return customerData.filter(
      (c) => c.assignedTechId === techId && c.serviceDay === dayName
    );
  }, [customerData]);

  // Get unscheduled pools
  const getUnscheduledPools = useCallback(() => {
    return customerData.filter((c) => !c.assignedTechId || !c.serviceDay);
  }, [customerData]);

  const handleDragStart = (e: React.DragEvent, customerId: string) => {
    e.dataTransfer.setData('customerId', customerId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingCustomerId(customerId);
  };

  const handleDragEnd = () => {
    setDraggingCustomerId(null);
  };

  const handleDragOver = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell(cellId);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, techId: string, dayIndex: number) => {
    e.preventDefault();
    setDragOverCell(null);
    setDraggingCustomerId(null);

    const customerId = e.dataTransfer.getData('customerId');
    if (!customerId) return;

    const dayName = fullDays[dayIndex];
    const customer = customerData.find((c) => c.id === customerId);

    if (!customer) return;

    // Check if the customer is already in this cell
    if (customer.assignedTechId === techId && customer.serviceDay === dayName) {
      return; // No change needed
    }

    const tech = technicians.find((t) => t.id === techId);

    // Update customer data with new assignment
    setCustomerData((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, assignedTechId: techId, serviceDay: dayName }
          : c
      )
    );

    // Show success toast
    addToast(
      `Moved ${customer.name} to ${tech?.name || 'technician'} on ${dayName}`,
      'success'
    );
  };

  // Calculate total pools for the week
  const totalPools = customerData.filter(c => c.assignedTechId && c.serviceDay).length;
  const unscheduledCount = customerData.filter(c => !c.assignedTechId || !c.serviceDay).length;

  return (
    <div className="space-y-6" onDragEnd={handleDragEnd}>
      {/* Toast notifications */}
      <Toast messages={messages} onDismiss={dismissToast} />

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
              {totalPools} pools scheduled across {technicians.length} technicians
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
                        }`}
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

                          {/* Pool cards with drop zone */}
                          <DropZone
                            isDragOver={isDragOver}
                            isEmpty={pools.length === 0}
                            onDragOver={(e) => handleDragOver(e, cellId)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, tech.id, dayIndex)}
                          >
                            <AnimatePresence mode="popLayout">
                              {pools.slice(0, 3).map((pool) => (
                                <PoolCard
                                  key={pool.id}
                                  pool={pool}
                                  onDragStart={handleDragStart}
                                  isBeingDragged={draggingCustomerId === pool.id}
                                />
                              ))}
                            </AnimatePresence>
                            {pools.length > 3 && (
                              <button className="w-full px-2 py-1 text-xs text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded">
                                +{pools.length - 3} more
                              </button>
                            )}
                          </DropZone>
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
                {daysOfWeek.map((day, dayIndex) => {
                  const unscheduledForDay = weeklySchedule.unscheduled[dayIndex];
                  return (
                    <td
                      key={day}
                      className={`px-4 py-3 align-top ${selectedDay === dayIndex ? 'bg-amber-100/50' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">{unscheduledForDay}</Badge>
                        {unscheduledForDay > 0 && (
                          <button className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                            Assign
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
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
              <motion.p
                key={totalPools}
                initial={{ scale: 1.2, color: '#10B981' }}
                animate={{ scale: 1, color: '#0f172a' }}
                className="text-2xl font-bold text-slate-900"
              >
                {totalPools}
              </motion.p>
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
              <motion.p
                key={unscheduledCount}
                initial={{ scale: 1.2, color: '#F59E0B' }}
                animate={{ scale: 1, color: '#0f172a' }}
                className="text-2xl font-bold text-slate-900"
              >
                {unscheduledCount}
              </motion.p>
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
