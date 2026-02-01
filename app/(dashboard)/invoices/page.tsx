'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button, Badge, Card, Avatar, SearchInput, Toast, useToast } from '@/components/ui';
import { useInvoices, Invoice } from '@/lib/invoices-context';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  paid: { label: 'Paid', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'danger' },
};

export default function InvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid } = useInvoices();
  const { messages, addToast, dismissToast } = useToast();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editInvoice, setEditInvoice] = useState<Invoice | undefined>(undefined);

  // Calculate stats
  const stats = useMemo(() => {
    const paidInvoices = invoices.filter((i) => i.status === 'paid');
    const pendingInvoices = invoices.filter((i) => i.status === 'pending');
    const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

    const paidThisMonth = paidInvoices.reduce((sum, i) => sum + i.total, 0);
    const pendingTotal = pendingInvoices.reduce((sum, i) => sum + i.total, 0);
    const overdueTotal = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

    // Average days to payment (only paid invoices with paymentSpeed)
    const invoicesWithSpeed = paidInvoices.filter(i => i.paymentSpeed !== undefined);
    const avgDaysToPayment = invoicesWithSpeed.length > 0
      ? invoicesWithSpeed.reduce((sum, i) => sum + (i.paymentSpeed || 0), 0) / invoicesWithSpeed.length
      : 0;

    return {
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      paidThisMonth,
      pendingTotal,
      overdueTotal,
      avgDaysToPayment,
    };
  }, [invoices]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesFilter = filter === 'all' || invoice.status === filter;
      const matchesSearch = !searchQuery ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [invoices, filter, searchQuery]);

  // Currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handlers
  const handleCreateInvoice = (invoiceData: Omit<Invoice, 'id' | 'total' | 'status'>) => {
    const newInvoice = addInvoice(invoiceData);
    addToast(`Invoice ${newInvoice.id} created successfully`, 'success');
  };

  const handleUpdateInvoice = (invoiceData: Omit<Invoice, 'id' | 'total' | 'status'>) => {
    if (editInvoice) {
      updateInvoice(editInvoice.id, invoiceData);
      addToast(`Invoice ${editInvoice.id} updated successfully`, 'success');
      setEditInvoice(undefined);
    }
  };

  const handleMarkAsPaid = (id: string) => {
    markAsPaid(id);
    addToast('Invoice marked as paid!', 'success');
    setIsDetailOpen(false);
  };

  const handleSendReminder = (id: string) => {
    addToast('Payment reminder sent!', 'success');
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    addToast(`Invoice ${id} deleted`, 'info');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const handleEditFromDetail = (invoice: Invoice) => {
    setIsDetailOpen(false);
    setEditInvoice(invoice);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditInvoice(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <Toast messages={messages} onDismiss={dismissToast} />

      {/* Page header with value prop */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Same-day invoicing keeps cash flowing
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Button>
      </div>

      {/* Hero Stats - Big numbers selling the value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Main stat */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-emerald-100 text-sm font-medium uppercase tracking-wider">This Month</span>
            </div>
            <p className="text-5xl font-bold tracking-tight">{formatCurrency(stats.paidThisMonth)}</p>
            <p className="text-emerald-100 mt-1">collected from {stats.paidCount} invoices</p>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-4 lg:gap-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{stats.avgDaysToPayment.toFixed(1)}</p>
              <p className="text-emerald-100 text-sm">avg. days to payment</p>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-emerald-300 text-xs font-medium">70% faster</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-emerald-100 text-sm">same-day invoicing</p>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-300 text-xs font-medium">automated</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setFilter('paid')}
          className={`cursor-pointer transition-all ${filter === 'paid' ? 'ring-2 ring-green-500' : ''}`}
        >
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Paid ({stats.paidCount})</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidThisMonth)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setFilter('pending')}
          className={`cursor-pointer transition-all ${filter === 'pending' ? 'ring-2 ring-amber-500' : ''}`}
        >
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending ({stats.pendingCount})</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.pendingTotal)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setFilter('overdue')}
          className={`cursor-pointer transition-all ${filter === 'overdue' ? 'ring-2 ring-red-500' : ''}`}
        >
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Overdue ({stats.overdueCount})</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueTotal)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Cash flow insight banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-blue-900">Get paid 3x faster with same-day invoicing</p>
          <p className="text-sm text-blue-700 mt-0.5">
            Invoices are automatically sent when techs complete service. No more waiting to bill at the end of the month.
          </p>
        </div>
        <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
          <span className="whitespace-nowrap">Industry avg: 7-10 days</span>
          <span className="text-blue-300">|</span>
          <span className="whitespace-nowrap text-emerald-600 font-bold">You: {stats.avgDaysToPayment.toFixed(1)} days</span>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder="Search invoices..."
          className="sm:w-80"
          onSearch={setSearchQuery}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 min-h-[44px]"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        {filter !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
            Clear filter
          </Button>
        )}
      </div>

      {/* Invoice list - Mobile cards + Desktop table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-sm text-slate-500">No invoices found</p>
            <Button onClick={openCreateForm} className="mt-4">
              Create your first invoice
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile view - Cards */}
            <div className="block lg:hidden space-y-3">
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                return (
                  <div
                    key={invoice.id}
                    onClick={() => handleViewInvoice(invoice)}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={invoice.customerName} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{invoice.customerName}</p>
                          <p className="text-xs text-slate-500 font-mono">{invoice.id}</p>
                        </div>
                      </div>
                      <Badge variant={status.variant} dot>
                        {status.label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(invoice.total)}</p>
                      {invoice.paymentSpeed && (
                        <span className="text-sm text-green-600 font-medium">
                          Paid in {invoice.paymentSpeed} day{invoice.paymentSpeed > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mb-3">
                      <p>Service: {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="flex items-center gap-1 text-emerald-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Invoiced same day
                      </p>
                    </div>

                    {/* Quick actions */}
                    {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                      <div className="flex gap-2 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline" onClick={() => handleSendReminder(invoice.id)}>
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Send Reminder
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleMarkAsPaid(invoice.id)}>
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Mark Paid
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop view - Table */}
            <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Service Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Payment Speed
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredInvoices.map((invoice) => {
                      const status = statusConfig[invoice.status];
                      return (
                        <tr
                          key={invoice.id}
                          onClick={() => handleViewInvoice(invoice)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-medium text-slate-900">{invoice.id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Avatar name={invoice.customerName} size="sm" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">{invoice.customerName}</p>
                                <p className="text-xs text-slate-500">{invoice.customerEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {new Date(invoice.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {invoice.paymentSpeed !== undefined ? (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {invoice.paymentSpeed} day{invoice.paymentSpeed > 1 ? 's' : ''}
                              </span>
                            ) : invoice.status === 'overdue' ? (
                              <span className="text-sm text-red-600 font-medium">
                                Overdue
                              </span>
                            ) : (
                              <span className="text-sm text-slate-400">Awaiting payment</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(invoice.total)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Badge variant={status.variant} dot>
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewInvoice(invoice)}
                                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleSendReminder(invoice.id)}>
                                    Send Reminder
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleMarkAsPaid(invoice.id)}>
                                    Mark Paid
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Results count */}
      {filteredInvoices.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
          <p>
            Showing <span className="font-medium text-slate-700">{filteredInvoices.length}</span> of{' '}
            <span className="font-medium text-slate-700">{invoices.length}</span> invoices
          </p>
          <p className="hidden sm:block">
            Total outstanding: <span className="font-medium text-slate-700">{formatCurrency(stats.pendingTotal + stats.overdueTotal)}</span>
          </p>
        </div>
      )}

      {/* Bottom CTA - Convention selling point */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-900 rounded-2xl p-6 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            70% Faster Billing
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Stop waiting weeks to get paid
          </h3>
          <p className="text-slate-400 mb-4">
            With automatic same-day invoicing, your customers receive their invoice before they even get home.
            The result? Average payment time drops from 7-10 days to just {stats.avgDaysToPayment.toFixed(1)} days.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-300">Auto-send on job completion</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-300">One-click payment reminders</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-slate-300">Real-time cash flow tracking</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Invoice Form Modal */}
      <InvoiceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditInvoice(undefined);
        }}
        onSubmit={editInvoice ? handleUpdateInvoice : handleCreateInvoice}
        editInvoice={editInvoice}
      />

      {/* Invoice Detail Modal */}
      <InvoiceDetail
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedInvoice(null);
        }}
        onEdit={handleEditFromDetail}
        onMarkPaid={handleMarkAsPaid}
        onSendReminder={handleSendReminder}
        onDelete={handleDelete}
      />
    </div>
  );
}
