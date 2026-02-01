'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '@/components/ui';
import { Job, useSchedule, formatTime } from '@/lib/schedule-context';
import { customers } from '@/lib/mock-data';
import { useTechnicians } from '@/lib/technicians-context';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job; // If provided, we're editing; otherwise creating
  initialDate?: string;
  initialTechId?: string;
}

const SERVICE_TYPES: Job['serviceType'][] = [
  'Regular Maintenance',
  'Chemical Balance',
  'Repair',
  'Filter Clean',
  'Equipment Check',
  'Opening',
  'Closing',
  'Emergency',
];

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

export function JobForm({ isOpen, onClose, job, initialDate, initialTechId }: JobFormProps) {
  const { addJob, updateJob, deleteJob } = useSchedule();
  const { getActiveTechnicians, getTechnicianById } = useTechnicians();
  const technicians = getActiveTechnicians();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [technicianId, setTechnicianId] = useState('');
  const [serviceType, setServiceType] = useState<Job['serviceType']>('Regular Maintenance');
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');

  // Initialize form when opening
  useEffect(() => {
    if (isOpen) {
      if (job) {
        // Editing existing job
        setCustomerId(job.customerId);
        setDate(job.date);
        setTime(job.time);
        setTechnicianId(job.technicianId);
        setServiceType(job.serviceType);
        setDuration(job.duration);
        setNotes(job.notes || '');
      } else {
        // Creating new job
        setCustomerId('');
        setDate(initialDate || new Date().toISOString().split('T')[0]);
        setTime('09:00');
        setTechnicianId(initialTechId || technicians[0]?.id || '');
        setServiceType('Regular Maintenance');
        setDuration(45);
        setNotes('');
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, job, initialDate, initialTechId, technicians]);

  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedTech = getTechnicianById(technicianId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !date || !technicianId) return;

    setIsSaving(true);

    const customer = customers.find(c => c.id === customerId);
    const tech = getTechnicianById(technicianId);

    if (!customer || !tech) {
      setIsSaving(false);
      return;
    }

    const jobData = {
      customerId,
      customerName: customer.name,
      address: customer.address,
      date,
      time,
      technicianId,
      technicianName: tech.name,
      serviceType,
      status: (job?.status || 'scheduled') as Job['status'],
      duration,
      rate: customer.rate,
      notes: notes || undefined,
    };

    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    if (job) {
      updateJob(job.id, jobData);
    } else {
      addJob(jobData);
    }

    setIsSaving(false);
    onClose();
  };

  const handleDelete = () => {
    if (job) {
      deleteJob(job.id);
      onClose();
    }
  };

  const handleCancel = () => {
    if (job) {
      updateJob(job.id, { status: 'cancelled' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {job ? 'Edit Job' : 'New Job'}
                </h2>
                {job && (
                  <Badge
                    variant={
                      job.status === 'completed' ? 'primary' :
                      job.status === 'in-progress' ? 'warning' :
                      job.status === 'cancelled' ? 'danger' : 'default'
                    }
                    className="mt-1"
                  >
                    {job.status}
                  </Badge>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-slate-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                {/* Customer */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 min-h-[44px]"
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
                      {selectedCustomer.city} | ${selectedCustomer.rate}/service
                    </p>
                  )}
                </div>

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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 min-h-[44px]"
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
                    Technician <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                            }
                          `}
                        >
                          <div
                            className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold text-sm"
                            style={{ backgroundColor: tech.color }}
                          >
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <p className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                            {tech.name.split(' ')[0]}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_TYPES.map(type => {
                      const isSelected = serviceType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setServiceType(type)}
                          className={`
                            px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px]
                            ${isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                          `}
                        >
                          {type}
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
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-900"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              {showDeleteConfirm ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-600 font-medium">Delete this job?</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      No, Keep It
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={handleDelete}
                    >
                      Yes, Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    {job && job.status !== 'cancelled' && (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                          Cancel Job
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      loading={isSaving}
                      disabled={!customerId || !date || !technicianId}
                    >
                      {job ? 'Save Changes' : 'Create Job'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
