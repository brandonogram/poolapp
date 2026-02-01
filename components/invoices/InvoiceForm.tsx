'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { Invoice, LineItem } from '@/lib/invoices-context';

// Mock customers for dropdown
const mockCustomers = [
  { id: 'cust-1', name: 'Johnson Family', email: 'johnson@email.com' },
  { id: 'cust-2', name: 'Martinez Residence', email: 'martinez@email.com' },
  { id: 'cust-3', name: 'Williams Estate', email: 'williams@email.com' },
  { id: 'cust-4', name: 'Thompson Home', email: 'thompson@email.com' },
  { id: 'cust-5', name: 'Scottsdale Aquatic Center', email: 'aquatics@scottsdale.gov' },
  { id: 'cust-6', name: 'Garcia Family', email: 'garcia@email.com' },
  { id: 'cust-7', name: 'Anderson Pool', email: 'anderson@email.com' },
  { id: 'cust-8', name: 'Davis Residence', email: 'davis@email.com' },
  { id: 'cust-9', name: 'Wilson Family', email: 'wilson@email.com' },
  { id: 'cust-10', name: 'Paradise Valley Resort', email: 'maintenance@pvresort.com' },
  { id: 'cust-11', name: 'Brown Pool House', email: 'brown@email.com' },
  { id: 'cust-12', name: 'Miller Residence', email: 'miller@email.com' },
  { id: 'cust-13', name: 'Rodriguez Family', email: 'rodriguez@email.com' },
  { id: 'cust-14', name: 'Phoenix Country Club', email: 'facilities@pxcc.com' },
  { id: 'cust-15', name: 'Taylor Residence', email: 'taylor@email.com' },
  { id: 'cust-16', name: 'Lee Family', email: 'lee@email.com' },
  { id: 'cust-17', name: 'Nguyen Home', email: 'nguyen@email.com' },
  { id: 'cust-18', name: 'Patel Residence', email: 'patel@email.com' },
];

// Common service presets
const servicePresets = [
  { description: 'Weekly Pool Service', amount: 165 },
  { description: 'Bi-weekly Pool Service', amount: 145 },
  { description: 'Monthly Pool Service', amount: 135 },
  { description: 'Chemical Treatment', amount: 20 },
  { description: 'Filter Cleaning', amount: 45 },
  { description: 'Equipment Check', amount: 45 },
  { description: 'Tile Cleaning', amount: 100 },
  { description: 'Algae Treatment', amount: 35 },
  { description: 'Pump Inspection', amount: 40 },
  { description: 'Leaf Removal', amount: 30 },
  { description: 'Spa Maintenance', amount: 75 },
];

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoice: Omit<Invoice, 'id' | 'total' | 'status'>) => void;
  editInvoice?: Invoice;
}

export function InvoiceForm({ isOpen, onClose, onSubmit, editInvoice }: InvoiceFormProps) {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 'new-1', description: '', amount: 0 },
  ]);
  const [notes, setNotes] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  // Set default due date to 14 days from service date
  useEffect(() => {
    if (date && !dueDate) {
      const serviceDate = new Date(date);
      serviceDate.setDate(serviceDate.getDate() + 14);
      setDueDate(serviceDate.toISOString().split('T')[0]);
    }
  }, [date, dueDate]);

  // Populate form when editing
  useEffect(() => {
    if (editInvoice) {
      setCustomerId(editInvoice.customerId);
      setCustomerName(editInvoice.customerName);
      setCustomerEmail(editInvoice.customerEmail);
      setDate(editInvoice.date);
      setDueDate(editInvoice.dueDate);
      setLineItems(editInvoice.lineItems);
      setNotes(editInvoice.notes || '');
    } else {
      resetForm();
    }
  }, [editInvoice, isOpen]);

  const resetForm = () => {
    setCustomerId('');
    setCustomerName('');
    setCustomerEmail('');
    setDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setLineItems([{ id: 'new-1', description: '', amount: 0 }]);
    setNotes('');
  };

  const handleCustomerChange = (id: string) => {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
      setCustomerId(customer.id);
      setCustomerName(customer.name);
      setCustomerEmail(customer.email);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: `new-${Date.now()}`, description: '', amount: 0 }]);
  };

  const addPreset = (preset: { description: string; amount: number }) => {
    setLineItems([...lineItems, { id: `new-${Date.now()}`, ...preset }]);
    setShowPresets(false);
  };

  const updateLineItem = (index: number, field: 'description' | 'amount', value: string | number) => {
    const updated = [...lineItems];
    if (field === 'amount') {
      updated[index][field] = typeof value === 'string' ? parseFloat(value) || 0 : value;
    } else {
      updated[index][field] = value as string;
    }
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const total = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty line items
    const validLineItems = lineItems.filter(item => item.description && item.amount > 0);

    if (!customerId || validLineItems.length === 0) {
      return;
    }

    onSubmit({
      customerId,
      customerName,
      customerEmail,
      date,
      dueDate,
      lineItems: validLineItems,
      notes: notes || undefined,
    });

    resetForm();
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editInvoice ? 'Edit Invoice' : 'Create New Invoice'}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {editInvoice ? `Editing ${editInvoice.id}` : 'Fill in the details below'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Customer</label>
              <select
                value={customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a customer...</option>
                {mockCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {customerEmail && (
                <p className="mt-1 text-sm text-slate-500">{customerEmail}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                />
              </div>
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">Line Items</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPresets(!showPresets)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Add
                    </Button>
                    {showPresets && (
                      <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                        {servicePresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => addPreset(preset)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 flex justify-between items-center min-h-[44px]"
                          >
                            <span className="text-slate-700">{preset.description}</span>
                            <span className="text-slate-500">{formatCurrency(preset.amount)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={addLineItem}>
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {lineItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      placeholder="Service description"
                      className="flex-1 px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => updateLineItem(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-7 pr-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                <div className="text-right">
                  <span className="text-sm text-slate-500 mr-4">Total:</span>
                  <span className="text-2xl font-bold text-slate-900">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Add any notes about this invoice..."
                className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={!customerId || total === 0}>
                {editInvoice ? 'Update Invoice' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
