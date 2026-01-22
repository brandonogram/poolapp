'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, SearchInput, Avatar, Card } from '@/components/ui';
import { customers, technicians, getTechnicianById } from '@/lib/mock-data';

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const },
  paused: { label: 'Paused', variant: 'warning' as const },
  overdue: { label: 'Overdue', variant: 'danger' as const },
};

const poolTypeLabels = {
  'inground': 'Inground',
  'above-ground': 'Above Ground',
  'infinity': 'Infinity',
  'lap': 'Lap Pool',
};

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [techFilter, setTechFilter] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = !statusFilter || customer.status === statusFilter;

      // Technician filter
      const matchesTech = !techFilter || customer.assignedTechId === techFilter;

      return matchesSearch && matchesStatus && matchesTech;
    });
  }, [searchQuery, statusFilter, techFilter]);

  const stats = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === 'active').length,
      overdue: customers.filter((c) => c.status === 'overdue').length,
      monthlyRevenue: customers.reduce((sum, c) => sum + c.rate * 4, 0),
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-500">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your pool service customers
          </p>
        </div>
        <Button>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total Customers</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-slate-500">Active</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-sm text-slate-500">Overdue</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">${stats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-slate-500">Monthly Revenue</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder="Search customers..."
          onSearch={setSearchQuery}
          className="sm:w-80"
        />
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="overdue">Overdue</option>
          </select>
          <select
            value={techFilter || ''}
            onChange={(e) => setTechFilter(e.target.value || null)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Technicians</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
          {(statusFilter || techFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter(null);
                setTechFilter(null);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Customer list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Service Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pool Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rate
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
              {filteredCustomers.map((customer) => {
                const tech = getTechnicianById(customer.assignedTechId);
                const status = statusConfig[customer.status];

                return (
                  <tr
                    key={customer.id}
                    onClick={() => router.push(`/customers/${customer.id}`)}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{customer.name}</p>
                          <p className="text-sm text-slate-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">{customer.address}</p>
                      <p className="text-sm text-slate-500">{customer.city}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-900">{customer.serviceDay}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tech ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={tech.name} size="sm" />
                          <span className="text-sm text-slate-900">{tech.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {poolTypeLabels[customer.poolType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        ${customer.rate}
                      </span>
                      <span className="text-sm text-slate-500">/wk</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant={status.variant} dot>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Action menu would go here
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-sm text-slate-500">No customers found matching your criteria</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter(null);
                setTechFilter(null);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
              <span className="font-medium">{customers.length}</span> customers
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
