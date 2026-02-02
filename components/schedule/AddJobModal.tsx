'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import type { Customer, Technician, Pool } from '@/lib/types/database';

// Type assertion helper for Supabase data
type SupabaseData<T> = T[] | null;

// Demo company ID - in production this would come from auth context
const DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001';

interface AddJobModalProps {
  trigger?: React.ReactNode;
  onJobCreated?: () => void;
}

const SERVICE_TYPES = [
  { value: 'regular', label: 'Regular Maintenance' },
  { value: 'chemical', label: 'Chemical Balance' },
  { value: 'opening', label: 'Pool Opening' },
  { value: 'closing', label: 'Pool Closing' },
  { value: 'maintenance', label: 'Equipment Maintenance' },
] as const;

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-slate-100 text-slate-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-amber-100 text-amber-700' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
] as const;

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
];

const DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function AddJobModal({ trigger, onJobCreated }: AddJobModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data from Supabase
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [poolId, setPoolId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [serviceType, setServiceType] = useState<typeof SERVICE_TYPES[number]['value']>('regular');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]['value']>('medium');
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');

  // Fetch customers and technicians on open
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (customersError) throw customersError;

      // Fetch technicians
      const { data: techniciansData, error: techniciansError } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (techniciansError) throw techniciansError;

      setCustomers((customersData as SupabaseData<Customer>) || []);
      setTechnicians((techniciansData as SupabaseData<Technician>) || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch pools when customer changes
  const fetchPools = useCallback(async (customerId: string) => {
    if (!customerId) {
      setPools([]);
      setPoolId('');
      return;
    }

    try {
      const { data: poolsData, error: poolsError } = await supabase
        .from('pools')
        .select('*')
        .eq('customer_id', customerId)
        .order('name');

      if (poolsError) throw poolsError;

      const typedPools = (poolsData as SupabaseData<Pool>) || [];
      setPools(typedPools);

      // Auto-select first pool if available
      if (typedPools.length > 0) {
        setPoolId(typedPools[0].id);
      } else {
        setPoolId('');
      }
    } catch (err) {
      console.error('Error fetching pools:', err);
    }
  }, []);

  // Handle open
  const handleOpen = () => {
    setIsOpen(true);
    setDate(new Date().toISOString().split('T')[0]);
    fetchData();
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setCustomerId('');
    setPoolId('');
    setTechnicianId('');
    setDate('');
    setTime('09:00');
    setServiceType('regular');
    setPriority('medium');
    setDuration(45);
    setNotes('');
    setPools([]);
    setError(null);
  };

  // Handle customer change
  const handleCustomerChange = (newCustomerId: string) => {
    setCustomerId(newCustomerId);
    fetchPools(newCustomerId);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId || !poolId || !date) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Using type assertion since Supabase types are not fully configured
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('service_jobs')
        .insert({
          company_id: DEMO_COMPANY_ID,
          customer_id: customerId,
          pool_id: poolId,
          technician_id: technicianId || null,
          scheduled_date: date,
          scheduled_time: time,
          status: 'scheduled',
          estimated_duration: duration,
        });

      if (insertError) throw insertError;

      // Success - close modal and notify parent
      handleClose();
      onJobCreated?.();
    } catch (err) {
      console.error('Error creating job:', err);
      setError('Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedTech = technicians.find(t => t.id === technicianId);

  return (
    <>
      {/* Trigger button */}
      {trigger ? (
        <div onClick={handleOpen}>{trigger}</div>
      ) : (
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors whitespace-nowrap shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Job
        </button>
      )}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        title="Add New Job"
        description="Schedule a new service job for a customer"
        size="lg"
      >
        {isLoading ? (
          <DialogBody>
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="animate-spin h-8 w-8 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm text-slate-500">Loading data...</p>
              </div>
            </div>
          </DialogBody>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogBody>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* Customer */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-slate-900 min-h-[44px]"
                  >
                    <option value="">Select a customer...</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.address}
                      </option>
                    ))}
                  </select>
                  {selectedCustomer && (
                    <p className="mt-1.5 text-sm text-slate-500">
                      {selectedCustomer.city}, {selectedCustomer.state}
                    </p>
                  )}
                </div>

                {/* Pool (only show if customer selected) */}
                {customerId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pool <span className="text-red-500">*</span>
                    </label>
                    {pools.length > 0 ? (
                      <select
                        value={poolId}
                        onChange={(e) => setPoolId(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-slate-900 min-h-[44px]"
                      >
                        {pools.map(pool => (
                          <option key={pool.id} value={pool.id}>
                            {pool.name} ({pool.type.replace('_', ' ')})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        No pools found for this customer. Please add a pool first.
                      </p>
                    )}
                  </div>
                )}

                {/* Date & Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-slate-900 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-slate-900 min-h-[44px]"
                    >
                      {TIME_SLOTS.map(slot => (
                        <option key={slot} value={slot}>
                          {formatTime(slot)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Technician */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Technician
                  </label>
                  {technicians.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setTechnicianId('')}
                        className={`
                          p-3 rounded-lg border-2 transition-all text-center
                          ${!technicianId
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                      >
                        <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-slate-200 text-slate-500 font-semibold text-sm">
                          ?
                        </div>
                        <p className={`text-xs font-medium ${!technicianId ? 'text-green-700' : 'text-slate-700'}`}>
                          Unassigned
                        </p>
                      </button>
                      {technicians.map(tech => {
                        const isSelected = technicianId === tech.id;
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => setTechnicianId(tech.id)}
                            className={`
                              p-3 rounded-lg border-2 transition-all text-center
                              ${isSelected
                                ? 'border-green-500 bg-green-50'
                                : 'border-slate-200 hover:border-slate-300'
                              }
                            `}
                          >
                            <div
                              className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold text-sm"
                              style={{ backgroundColor: tech.color || '#3B82F6' }}
                            >
                              {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <p className={`text-xs font-medium truncate ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>
                              {tech.name.split(' ')[0]}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                      No technicians available
                    </p>
                  )}
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_TYPES.map(type => {
                      const isSelected = serviceType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setServiceType(type.value)}
                          className={`
                            px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px]
                            ${isSelected
                              ? 'bg-green-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                          `}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {PRIORITIES.map(p => {
                      const isSelected = priority === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPriority(p.value)}
                          className={`
                            flex-1 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px]
                            ${isSelected
                              ? 'ring-2 ring-green-500 ring-offset-2'
                              : ''
                            }
                            ${p.color}
                          `}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Duration
                  </label>
                  <div className="flex gap-2">
                    {DURATIONS.map(d => {
                      const isSelected = duration === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setDuration(d.value)}
                          className={`
                            flex-1 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px]
                            ${isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                          `}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-slate-900"
                  />
                </div>
              </div>
            </DialogBody>

            <DialogFooter>
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  loading={isSubmitting}
                  loadingText="Creating..."
                  disabled={!customerId || !poolId || !date}
                >
                  Create Job
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </>
  );
}

// Floating action button variant for mobile
export function AddJobFAB({ onJobCreated }: { onJobCreated?: () => void }) {
  return (
    <AddJobModal
      onJobCreated={onJobCreated}
      trigger={
        <button
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-green-700 active:scale-95 transition-all lg:hidden z-40"
          aria-label="Add new job"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      }
    />
  );
}
