'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Badge } from '@/components/ui';
import { Technician } from '@/lib/technicians-context';

// Predefined color options for route visualization
const colorOptions = [
  { value: '#3B82F6', name: 'Blue', class: 'bg-blue-500' },
  { value: '#10B981', name: 'Emerald', class: 'bg-emerald-500' },
  { value: '#F59E0B', name: 'Amber', class: 'bg-amber-500' },
  { value: '#EF4444', name: 'Red', class: 'bg-red-500' },
  { value: '#8B5CF6', name: 'Violet', class: 'bg-violet-500' },
  { value: '#EC4899', name: 'Pink', class: 'bg-pink-500' },
  { value: '#06B6D4', name: 'Cyan', class: 'bg-cyan-500' },
  { value: '#84CC16', name: 'Lime', class: 'bg-lime-500' },
];

interface TechFormProps {
  technician?: Technician;
  onSubmit: (data: Omit<Technician, 'id' | 'stats'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TechForm({ technician, onSubmit, onCancel, isEditing = false }: TechFormProps) {
  const [name, setName] = useState(technician?.name || '');
  const [phone, setPhone] = useState(technician?.phone || '');
  const [email, setEmail] = useState(technician?.email || '');
  const [color, setColor] = useState(technician?.color || colorOptions[0].value);
  const [startDate, setStartDate] = useState(
    technician?.startDate || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<Technician['status']>(technician?.status || 'active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when technician changes
  useEffect(() => {
    if (technician) {
      setName(technician.name);
      setPhone(technician.phone || '');
      setEmail(technician.email || '');
      setColor(technician.color);
      setStartDate(technician.startDate);
      setStatus(technician.status);
    }
  }, [technician]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (phone && !/^[\d\s()+-]+$/.test(phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      color,
      startDate,
      status,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEditing ? 'Edit Technician' : 'Add New Technician'}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {isEditing ? 'Update technician details' : 'Fill in the details to add a new technician'}
        </p>
      </div>

      {/* Form fields */}
      <div className="p-6 space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter technician name"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-slate-900 placeholder:text-slate-400`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-slate-900 placeholder:text-slate-400`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tech@company.com"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-slate-900 placeholder:text-slate-400`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Route Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                className={`w-12 h-12 rounded-full ${option.class} transition-all ${
                  color === option.value
                    ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
                title={option.name}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            This color will be used to display this technician's routes on the map
          </p>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-slate-900 min-h-[44px]"
          />
        </div>

        {/* Status (only for editing) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['active', 'on-break', 'off-duty', 'inactive'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                    status === s
                      ? s === 'active'
                        ? 'bg-green-500 text-white'
                        : s === 'on-break'
                        ? 'bg-amber-500 text-white'
                        : s === 'off-duty'
                        ? 'bg-slate-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s === 'active' ? 'Active' :
                   s === 'on-break' ? 'On Break' :
                   s === 'off-duty' ? 'Off Duty' :
                   'Inactive'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with actions */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Save Changes' : 'Add Technician'}
        </Button>
      </div>
    </motion.form>
  );
}

export default TechForm;
