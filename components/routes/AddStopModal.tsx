'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '@/components/ui';
import { customers } from '@/lib/mock-data';
import { useRoutes, RouteStop } from '@/lib/routes-context';

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicianId: string;
  technicianName: string;
  existingStops: RouteStop[];
}

export function AddStopModal({ isOpen, onClose, technicianId, technicianName, existingStops }: AddStopModalProps) {
  const { addStop } = useRoutes();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [timeWindow, setTimeWindow] = useState<'morning' | 'afternoon'>('morning');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter out customers already in this route
  const existingCustomerIds = existingStops.map(s => s.customerId);
  const availableCustomers = customers.filter(
    c => !existingCustomerIds.includes(c.id) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = () => {
    if (selectedCustomer) {
      addStop(technicianId, selectedCustomer, timeWindow);
      setSelectedCustomer('');
      setTimeWindow('morning');
      setSearchTerm('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCustomer('');
    setTimeWindow('morning');
    setSearchTerm('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Add Stop to Route</h2>
              <p className="text-green-100 text-sm mt-1">Adding to {technicianName}'s route</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Customer
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or address..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
                />
              </div>

              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Customer <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
                  {availableCustomers.length === 0 ? (
                    <p className="text-slate-500 text-sm p-3 text-center">
                      {searchTerm ? 'No customers found' : 'All customers already on route'}
                    </p>
                  ) : (
                    availableCustomers.map(customer => (
                      <div
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedCustomer === customer.id
                            ? 'bg-green-50 border-2 border-green-500'
                            : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">{customer.name}</p>
                            <p className="text-sm text-slate-500">{customer.address}</p>
                          </div>
                          <Badge variant={customer.status === 'active' ? 'success' : customer.status === 'overdue' ? 'warning' : 'default'}>
                            {customer.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Time Window */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Time Window
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTimeWindow('morning')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      timeWindow === 'morning'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-medium">Morning</span>
                    <span className="block text-xs mt-1 opacity-70">8:00 AM - 12:00 PM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeWindow('afternoon')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      timeWindow === 'afternoon'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="font-medium">Afternoon</span>
                    <span className="block text-xs mt-1 opacity-70">12:00 PM - 5:00 PM</span>
                  </button>
                </div>
              </div>

              {/* Optimization Preview */}
              {selectedCustomer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Route will be optimized</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Adding this stop will automatically optimize the route order for maximum efficiency.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedCustomer}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Stop
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
