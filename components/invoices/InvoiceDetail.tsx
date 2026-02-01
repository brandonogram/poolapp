'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '@/components/ui';
import { Invoice } from '@/lib/invoices-context';

interface InvoiceDetailProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onMarkPaid: (id: string) => void;
  onSendReminder: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  paid: { label: 'Paid', variant: 'success' as const, bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
  pending: { label: 'Pending', variant: 'warning' as const, bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
  overdue: { label: 'Overdue', variant: 'danger' as const, bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
};

export function InvoiceDetail({
  invoice,
  isOpen,
  onClose,
  onEdit,
  onMarkPaid,
  onSendReminder,
  onDelete,
}: InvoiceDetailProps) {
  if (!isOpen || !invoice) return null;

  const status = statusConfig[invoice.status];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}? This action cannot be undone.`)) {
      onDelete(invoice.id);
      onClose();
    }
  };

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
          <div className={`${status.bgColor} ${status.borderColor} border-b rounded-t-2xl px-6 py-4`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{invoice.id}</h2>
                  <Badge variant={status.variant} dot>
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mt-1">{invoice.customerName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Customer & Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
                <p className="font-semibold text-slate-900">{invoice.customerName}</p>
                <p className="text-sm text-slate-600">{invoice.customerEmail}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Service Date</h3>
                  <p className="text-sm text-slate-900">{formatDate(invoice.date)}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Due Date</h3>
                  <p className={`text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-slate-900'}`}>
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
                {invoice.paidDate && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Paid Date</h3>
                    <p className="text-sm text-green-600 font-semibold">{formatDate(invoice.paidDate)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Speed Badge */}
            {invoice.status === 'paid' && invoice.paymentSpeed !== undefined && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-green-700 font-medium">
                  Paid in {invoice.paymentSpeed} day{invoice.paymentSpeed !== 1 ? 's' : ''} - Fast payment!
                </span>
              </div>
            )}

            {/* Line Items */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Services</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.lineItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-slate-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50">
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">Total</td>
                      <td className="px-4 py-3 text-lg font-bold text-slate-900 text-right">
                        {formatCurrency(invoice.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-3">{invoice.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
              {invoice.status !== 'paid' && (
                <>
                  <Button onClick={() => onMarkPaid(invoice.id)}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mark as Paid
                  </Button>
                  <Button variant="outline" onClick={() => onSendReminder(invoice.id)}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Reminder
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => onEdit(invoice)}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
              <Button variant="ghost" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
