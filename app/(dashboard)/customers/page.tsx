'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Badge, SearchInput } from '@/components/ui';
import { useCustomers, Customer, CustomerType, ChemistryStatus, CustomerFormData } from '@/lib/customers-context';
import { CustomerForm } from '@/components/customers/CustomerForm';

// Chemistry status configuration
const chemistryStatusConfig = {
  healthy: {
    label: 'Healthy',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  attention: {
    label: 'Attention',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  critical: {
    label: 'Critical',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
};

// Format date to relative time
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date('2026-01-26'); // Current date from context
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

// Get pH status
function getPhStatus(ph: number): { status: string; color: string } {
  if (ph >= 7.2 && ph <= 7.6) return { status: 'Ideal', color: 'text-green-600' };
  if (ph >= 7.0 && ph <= 7.8) return { status: 'OK', color: 'text-amber-600' };
  return { status: ph < 7.0 ? 'Low' : 'High', color: 'text-red-600' };
}

// Get chlorine status
function getChlorineStatus(cl: number): { status: string; color: string } {
  if (cl >= 2.0 && cl <= 4.0) return { status: 'Ideal', color: 'text-green-600' };
  if (cl >= 1.0 && cl <= 5.0) return { status: 'OK', color: 'text-amber-600' };
  return { status: cl < 1.0 ? 'Low' : 'High', color: 'text-red-600' };
}

export default function CustomersPage() {
  const router = useRouter();
  const { customers, loading, addCustomer } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChemistryStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'all'>('all');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        !searchQuery ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || customer.chemistryStatus === statusFilter;
      const matchesType = typeFilter === 'all' || customer.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [customers, searchQuery, statusFilter, typeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const alertsThisWeek = customers.filter(c => c.chemistryAlert).length;
    const avgCallbackCost = 165; // Average cost of a callback service
    const preventedCallbacks = alertsThisWeek;
    const moneySaved = preventedCallbacks * avgCallbackCost;

    return {
      total: customers.length,
      healthy: customers.filter(c => c.chemistryStatus === 'healthy').length,
      attention: customers.filter(c => c.chemistryStatus === 'attention').length,
      critical: customers.filter(c => c.chemistryStatus === 'critical').length,
      alertsThisWeek,
      moneySaved,
      monthlyRevenue: customers.reduce((sum, c) => sum + c.monthlyRate, 0),
    };
  }, [customers]);

  // Get customers with alerts sorted by severity
  const customersWithAlerts = useMemo(() => {
    return filteredCustomers
      .filter(c => c.chemistryAlert)
      .sort((a, b) => {
        const priority = { critical: 0, attention: 1, healthy: 2 };
        return priority[a.chemistryStatus] - priority[b.chemistryStatus];
      });
  }, [filteredCustomers]);

  const handleCreateCustomer = async (data: CustomerFormData) => {
    addCustomer(data);
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Chemistry</h1>
          <p className="mt-1 text-sm text-slate-500">
            Proactive chemistry tracking prevents callbacks
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Customer
        </Button>
      </div>

      {/* Value proposition banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 sm:p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold">
                {stats.alertsThisWeek} chemistry alerts caught this week
              </p>
              <p className="text-green-100 text-sm sm:text-base">
                Early detection prevents the 15% churn from callback complaints
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl sm:text-4xl font-bold">${stats.moneySaved.toLocaleString()}</p>
            <p className="text-green-100 text-sm">saved in prevented callbacks</p>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setStatusFilter('all')}
          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'all' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'
          }`}
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total Customers</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setStatusFilter('healthy')}
          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'healthy' ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-200'
          }`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <p className="text-3xl font-bold text-green-600">{stats.healthy}</p>
            </div>
            <p className="text-sm text-slate-500">Healthy</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setStatusFilter('attention')}
          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'attention' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'
          }`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
              <p className="text-3xl font-bold text-amber-600">{stats.attention}</p>
            </div>
            <p className="text-sm text-slate-500">Need Attention</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => setStatusFilter('critical')}
          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            statusFilter === 'critical' ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
          }`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <p className="text-sm text-slate-500">Critical</p>
          </div>
        </motion.div>
      </div>

      {/* Active Alerts Section */}
      {customersWithAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Active Chemistry Alerts</h2>
            <span className="text-sm text-slate-500">{customersWithAlerts.length} alerts</span>
          </div>
          <div className="space-y-2">
            {customersWithAlerts.map((customer, index) => {
              const statusConfig = chemistryStatusConfig[customer.chemistryStatus];
              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${statusConfig.color} rounded-full mt-2 flex-shrink-0 ${customer.chemistryStatus === 'critical' ? 'animate-pulse' : ''}`}></div>
                      <div>
                        <p className={`font-semibold ${statusConfig.textColor}`}>{customer.chemistryAlert}</p>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {customer.name} - {customer.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-5 sm:ml-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/customers/${customer.id}`)}
                      >
                        View Details
                      </Button>
                      <Button size="sm">
                        Schedule Fix
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder="Search customers..."
          onSearch={setSearchQuery}
          className="sm:w-80"
        />
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ChemistryStatus | 'all')}
            className="px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 min-h-[44px]"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="attention">Attention</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as CustomerType | 'all')}
            className="px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 min-h-[44px]"
          >
            <option value="all">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          {(statusFilter !== 'all' || typeFilter !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Customer list - mobile-friendly cards */}
      <div className="space-y-3">
        {filteredCustomers.map((customer, index) => {
          const statusConfig = chemistryStatusConfig[customer.chemistryStatus];
          const phStatus = getPhStatus(customer.chemistry.ph);
          const clStatus = getChlorineStatus(customer.chemistry.chlorine);
          const isExpanded = expandedCustomer === customer.id;

          return (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * Math.min(index, 10) }}
              className={`bg-white rounded-xl border ${
                customer.chemistryAlert ? statusConfig.borderColor : 'border-slate-200'
              } overflow-hidden hover:shadow-md transition-all`}
            >
              {/* Main row - always visible */}
              <div
                onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div className={`w-3 h-3 ${statusConfig.color} rounded-full mt-1.5 flex-shrink-0 ${customer.chemistryStatus === 'critical' ? 'animate-pulse' : ''}`}></div>

                  {/* Customer info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 truncate">{customer.name}</h3>
                          <Badge variant={customer.type === 'commercial' ? 'primary' : 'default'} size="sm">
                            {customer.type === 'commercial' ? 'Commercial' : 'Residential'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 truncate">{customer.address}, {customer.city}</p>
                      </div>

                      {/* Expand indicator */}
                      <svg
                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Quick stats row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                      {/* pH */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">pH:</span>
                        <span className={`font-semibold ${phStatus.color}`}>{customer.chemistry.ph}</span>
                      </div>

                      {/* Chlorine */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Cl:</span>
                        <span className={`font-semibold ${clStatus.color}`}>{customer.chemistry.chlorine} ppm</span>
                      </div>

                      {/* Last service */}
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatRelativeDate(customer.lastServiceDate)}</span>
                      </div>

                      {/* Service frequency */}
                      <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="capitalize">{customer.serviceFrequency}</span>
                      </div>
                    </div>

                    {/* Alert message if present */}
                    {customer.chemistryAlert && (
                      <div className={`mt-3 text-sm font-medium ${statusConfig.textColor}`}>
                        <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {customer.chemistryAlert}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100"
                >
                  <div className="p-4 bg-slate-50">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {/* pH detail */}
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">pH Level</p>
                        <p className={`text-xl font-bold ${phStatus.color}`}>{customer.chemistry.ph}</p>
                        <p className={`text-xs ${phStatus.color}`}>{phStatus.status} (7.2-7.6)</p>
                      </div>

                      {/* Chlorine detail */}
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Chlorine</p>
                        <p className={`text-xl font-bold ${clStatus.color}`}>{customer.chemistry.chlorine}</p>
                        <p className={`text-xs ${clStatus.color}`}>{clStatus.status} (2-4 ppm)</p>
                      </div>

                      {/* Alkalinity */}
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Alkalinity</p>
                        <p className="text-xl font-bold text-slate-700">{customer.chemistry.alkalinity}</p>
                        <p className="text-xs text-slate-500">ppm (80-120)</p>
                      </div>

                      {/* Last reading */}
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Last Reading</p>
                        <p className="text-xl font-bold text-slate-700">{formatRelativeDate(customer.chemistry.lastReadingDate)}</p>
                        <p className="text-xs text-slate-500">{customer.chemistry.lastReadingDate}</p>
                      </div>
                    </div>

                    {/* Additional info */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                      <div>
                        <span className="text-slate-400">Technician:</span>{' '}
                        <span className="font-medium">{customer.assignedTech}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Service:</span>{' '}
                        <span className="font-medium capitalize">{customer.serviceFrequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Monthly:</span>{' '}
                        <span className="font-medium">${customer.monthlyRate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Next Service:</span>{' '}
                        <span className="font-medium">{customer.nextServiceDate}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/customers/${customer.id}`)}
                      >
                        View Full Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        Log Service
                      </Button>
                      <Button size="sm" variant="outline">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </Button>
                      <Button size="sm" variant="ghost">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Navigate
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredCustomers.length === 0 && (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="mt-4 text-sm text-slate-500">No customers found matching your criteria</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear all filters
            </Button>
            <Button size="sm" onClick={() => setIsFormOpen(true)}>
              Add New Customer
            </Button>
          </div>
        </div>
      )}

      {/* Results count */}
      {filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
          <p>
            Showing <span className="font-medium text-slate-700">{filteredCustomers.length}</span> of{' '}
            <span className="font-medium text-slate-700">{customers.length}</span> customers
          </p>
          <p className="hidden sm:block">
            Monthly revenue: <span className="font-medium text-slate-700">${stats.monthlyRevenue.toLocaleString()}</span>
          </p>
        </div>
      )}

      {/* Customer Form Modal */}
      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateCustomer}
        mode="create"
      />
    </div>
  );
}
