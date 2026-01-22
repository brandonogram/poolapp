'use client';

import { Button, Badge, Card, Avatar, SearchInput } from '@/components/ui';

// Mock invoice data
const invoices = [
  {
    id: 'INV-001',
    customer: 'Johnson Family',
    amount: 660,
    status: 'paid',
    date: '2026-01-15',
    dueDate: '2026-01-22',
  },
  {
    id: 'INV-002',
    customer: 'Martinez Residence',
    amount: 580,
    status: 'paid',
    date: '2026-01-15',
    dueDate: '2026-01-22',
  },
  {
    id: 'INV-003',
    customer: 'Williams Estate',
    amount: 900,
    status: 'pending',
    date: '2026-01-18',
    dueDate: '2026-01-25',
  },
  {
    id: 'INV-004',
    customer: 'Thompson Home',
    amount: 620,
    status: 'pending',
    date: '2026-01-18',
    dueDate: '2026-01-25',
  },
  {
    id: 'INV-005',
    customer: 'Garcia Family',
    amount: 540,
    status: 'overdue',
    date: '2026-01-08',
    dueDate: '2026-01-15',
  },
  {
    id: 'INV-006',
    customer: 'Anderson Pool',
    amount: 700,
    status: 'draft',
    date: '2026-01-22',
    dueDate: '2026-01-29',
  },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  paid: { label: 'Paid', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'danger' },
  draft: { label: 'Draft', variant: 'default' },
};

export default function InvoicesPage() {
  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pending = invoices.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage billing and payments
          </p>
        </div>
        <Button>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Paid This Month</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">${pending.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">${overdue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput placeholder="Search invoices..." className="sm:w-80" />
        <select className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Invoice list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Due Date
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
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                return (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-slate-900">{invoice.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar name={invoice.customer} size="sm" />
                        <span className="text-sm text-slate-900">{invoice.customer}</span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        ${invoice.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant={status.variant} dot>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        {invoice.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            Send Reminder
                          </Button>
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
    </div>
  );
}
