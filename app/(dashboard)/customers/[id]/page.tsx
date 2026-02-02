'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Badge, Card, Avatar } from '@/components/ui';
import { useCustomers, Customer, CustomerFormData } from '@/lib/customers-context';
import { CustomerForm, ConfirmDialog } from '@/components/customers/CustomerForm';
import { ChemistryAlerts } from '@/components/customers/ChemistryAlerts';

const poolTypeLabels: Record<string, string> = {
  'residential': 'Residential Pool',
  'commercial': 'Commercial Pool',
};

const serviceFrequencyLabels: Record<string, string> = {
  'weekly': 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  'monthly': 'Monthly',
};

// Mock service history - shows the VALUE STORY:
// Problem detected early -> Action taken -> Problem resolved -> Money saved
const mockServiceHistory = [
  {
    id: 'log-1',
    date: '2026-01-24',
    startTime: '8:15 AM',
    endTime: '9:00 AM',
    chemistry: {
      chlorine: 2.8,
      ph: 7.4,
      alkalinity: 95,
      cyanuricAcid: 45,
      calcium: 280,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Check filter', 'Test chemistry', 'Verify acid treatment'],
    notes: 'pH now balanced at 7.4 after last weeks acid treatment. Pool crystal clear. Customer very happy - mentioned they avoided a $500 emergency call last year with old company.',
    valueSaved: 500,
  },
  {
    id: 'log-2',
    date: '2026-01-17',
    startTime: '8:30 AM',
    endTime: '9:20 AM',
    chemistry: {
      chlorine: 2.2,
      ph: 8.1,
      alkalinity: 100,
      cyanuricAcid: 42,
      calcium: 275,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Backwash filter', 'Test chemistry', 'Add acid'],
    notes: 'ALERT: pH trending high (8.1) - caught early before water turned cloudy. Added 1.5 qt muriatic acid. Backwashed filter at 22 PSI. Scheduled follow-up check.',
    alertType: 'pH High - Caught Early',
  },
  {
    id: 'log-3',
    date: '2026-01-10',
    startTime: '8:00 AM',
    endTime: '8:45 AM',
    chemistry: {
      chlorine: 3.0,
      ph: 7.5,
      alkalinity: 90,
      cyanuricAcid: 40,
      calcium: 270,
    },
    tasks: ['Skim surface', 'Brush walls', 'Test chemistry', 'Inspect equipment'],
    notes: 'Pool in excellent condition. Salt cell producing well. Noted filter pressure creeping up - will monitor.',
  },
  {
    id: 'log-4',
    date: '2026-01-03',
    startTime: '8:15 AM',
    endTime: '9:05 AM',
    chemistry: {
      chlorine: 2.5,
      ph: 7.6,
      alkalinity: 88,
      cyanuricAcid: 38,
      calcium: 265,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Test chemistry', 'Add stabilizer'],
    notes: 'Opening season prep visit. CYA slightly low, added stabilizer. Pool winterized well - minimal debris.',
  },
];

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const { getCustomer, updateCustomer, deleteCustomer, loading } = useCustomers();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load customer from context
  useEffect(() => {
    if (!loading) {
      const found = getCustomer(customerId);
      setCustomer(found);
    }
  }, [customerId, loading, getCustomer]);

  const handleEdit = async (data: CustomerFormData) => {
    const updated = updateCustomer(customerId, data);
    if (updated) {
      setCustomer(updated);
    }
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    const success = deleteCustomer(customerId);
    setIsDeleting(false);
    if (success) {
      router.push('/customers');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading customer...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Customer not found</h2>
          <p className="mt-2 text-slate-500">The customer you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => router.push('/customers')}>
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  // Prepare form data for editing
  const editFormData: Partial<CustomerFormData> = {
    name: customer.name,
    address: customer.address,
    city: customer.city,
    phone: customer.phone,
    email: customer.email,
    type: customer.type,
    serviceFrequency: customer.serviceFrequency,
    monthlyRate: customer.monthlyRate,
    notes: customer.notes,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push('/customers')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy-500">{customer.name}</h1>
              <Badge
                variant={
                  customer.chemistryStatus === 'healthy'
                    ? 'success'
                    : customer.chemistryStatus === 'critical'
                    ? 'danger'
                    : 'warning'
                }
                dot
              >
                {customer.chemistryStatus.charAt(0).toUpperCase() + customer.chemistryStatus.slice(1)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">{customer.address}, {customer.city}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditFormOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteDialogOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Service
          </Button>
        </div>
      </div>

      {/* Chemistry Alert Banner */}
      {customer.chemistryAlert && (
        <div className={`rounded-xl p-4 ${
          customer.chemistryStatus === 'critical'
            ? 'bg-red-50 border border-red-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              customer.chemistryStatus === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
            }`}></div>
            <div>
              <p className={`font-semibold ${
                customer.chemistryStatus === 'critical' ? 'text-red-700' : 'text-amber-700'
              }`}>
                Chemistry Alert
              </p>
              <p className={`text-sm mt-0.5 ${
                customer.chemistryStatus === 'critical' ? 'text-red-600' : 'text-amber-600'
              }`}>
                {customer.chemistryAlert}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Pool profile and contact */}
        <div className="space-y-6">
          {/* Pool Profile */}
          <Card title="Pool Profile">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{poolTypeLabels[customer.type]}</p>
                  <p className="text-sm text-slate-500">{serviceFrequencyLabels[customer.serviceFrequency]} Service</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Monthly Rate</p>
                  <p className="mt-1 font-medium text-slate-900">${customer.monthlyRate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Assigned Tech</p>
                  <p className="mt-1 font-medium text-slate-900">{customer.assignedTech}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Last Service</p>
                  <p className="mt-1 font-medium text-slate-900">{customer.lastServiceDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Next Service</p>
                  <p className="mt-1 font-medium text-slate-900">{customer.nextServiceDate}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card title="Contact Information">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium text-slate-900">{customer.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{customer.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium text-slate-900">{customer.address}</p>
                  <p className="text-sm text-slate-500">{customer.city}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Chemistry Readings */}
          <Card title="Current Chemistry">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{customer.chemistry.ph}</p>
                <p className="text-xs text-slate-500">pH Level</p>
                <Badge
                  variant={customer.chemistry.ph >= 7.2 && customer.chemistry.ph <= 7.6 ? 'success' : 'warning'}
                  size="sm"
                  className="mt-1"
                >
                  {customer.chemistry.ph >= 7.2 && customer.chemistry.ph <= 7.6 ? 'Good' : 'Check'}
                </Badge>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{customer.chemistry.chlorine}</p>
                <p className="text-xs text-slate-500">Chlorine (ppm)</p>
                <Badge
                  variant={customer.chemistry.chlorine >= 2 && customer.chemistry.chlorine <= 4 ? 'success' : 'warning'}
                  size="sm"
                  className="mt-1"
                >
                  {customer.chemistry.chlorine >= 2 && customer.chemistry.chlorine <= 4 ? 'Good' : 'Check'}
                </Badge>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{customer.chemistry.alkalinity}</p>
                <p className="text-xs text-slate-500">Alkalinity</p>
                <Badge variant="success" size="sm" className="mt-1">Good</Badge>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              Last reading: {customer.chemistry.lastReadingDate}
            </p>
          </Card>

          {/* Chemistry Alerts from API */}
          <ChemistryAlerts
            customerId={customerId}
            onScheduleTreatment={(poolId, issues) => {
              // Navigate to schedule page or open scheduling modal
              console.log('Schedule treatment for pool:', poolId, 'Issues:', issues);
              router.push('/schedule');
            }}
          />
        </div>

        {/* Middle and right columns - Service info and history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes */}
          <Card
            title="Customer Notes"
            action={
              <Button variant="ghost" size="sm" onClick={() => setIsEditFormOpen(true)}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </Button>
            }
          >
            {customer.notes ? (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-amber-800">{customer.notes}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No notes added yet</p>
            )}
          </Card>

          {/* Last Service Summary */}
          <Card title="Last Service Summary" subtitle={mockServiceHistory[0]?.date || 'No services yet'}>
            {mockServiceHistory.length > 0 ? (
              <div className="space-y-6">
                {/* Chemistry readings */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Chemistry Readings</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">
                        {mockServiceHistory[0].chemistry.chlorine}
                      </p>
                      <p className="text-xs text-slate-500">Chlorine (ppm)</p>
                      <div className="mt-1">
                        <Badge variant={mockServiceHistory[0].chemistry.chlorine >= 1 && mockServiceHistory[0].chemistry.chlorine <= 3 ? 'success' : 'warning'} size="sm">
                          {mockServiceHistory[0].chemistry.chlorine >= 1 && mockServiceHistory[0].chemistry.chlorine <= 3 ? 'Good' : 'Check'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">
                        {mockServiceHistory[0].chemistry.ph}
                      </p>
                      <p className="text-xs text-slate-500">pH Level</p>
                      <div className="mt-1">
                        <Badge variant={mockServiceHistory[0].chemistry.ph >= 7.2 && mockServiceHistory[0].chemistry.ph <= 7.6 ? 'success' : 'warning'} size="sm">
                          {mockServiceHistory[0].chemistry.ph >= 7.2 && mockServiceHistory[0].chemistry.ph <= 7.6 ? 'Optimal' : 'Adjust'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">
                        {mockServiceHistory[0].chemistry.alkalinity}
                      </p>
                      <p className="text-xs text-slate-500">Alkalinity</p>
                      <div className="mt-1">
                        <Badge variant="success" size="sm">Good</Badge>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">
                        {mockServiceHistory[0].chemistry.cyanuricAcid}
                      </p>
                      <p className="text-xs text-slate-500">CYA</p>
                      <div className="mt-1">
                        <Badge variant="success" size="sm">Good</Badge>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">
                        {mockServiceHistory[0].chemistry.calcium}
                      </p>
                      <p className="text-xs text-slate-500">Calcium</p>
                      <div className="mt-1">
                        <Badge variant="success" size="sm">Good</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks completed */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Tasks Completed</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockServiceHistory[0].tasks.map((task, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-sm rounded-md"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {mockServiceHistory[0].notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Notes</h4>
                    <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                      {mockServiceHistory[0].notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No service history available</p>
            )}
          </Card>

          {/* Service History Timeline */}
          <Card title="Service History">
            <div className="space-y-4">
              {mockServiceHistory.map((service, index) => (
                <div key={service.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index < mockServiceHistory.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-200" />
                  )}

                  {/* Timeline dot */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {new Date(service.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-slate-500">
                          {service.startTime} - {service.endTime}
                        </p>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="text-slate-600">
                        <span className="font-medium">pH:</span> {service.chemistry.ph}
                      </span>
                      <span className="text-slate-600">
                        <span className="font-medium">Chlorine:</span> {service.chemistry.chlorine} ppm
                      </span>
                      <span className="text-slate-600">
                        <span className="font-medium">Tasks:</span> {service.tasks.length}
                      </span>
                    </div>

                    {service.notes && (
                      <p className="mt-2 text-sm text-slate-500 italic">"{service.notes}"</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Load more */}
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  Load more history
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Form Modal */}
      <CustomerForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleEdit}
        initialData={editFormData}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customer.name}"? This action cannot be undone. All service history and data associated with this customer will be permanently removed.`}
        confirmText="Delete Customer"
        loading={isDeleting}
      />
    </div>
  );
}
