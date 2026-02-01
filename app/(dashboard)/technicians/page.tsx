'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Card } from '@/components/ui';
import { TechForm } from '@/components/technicians';
import { useTechnicians, Technician, getTechColors } from '@/lib/technicians-context';

// Status badge component
function StatusBadge({ status }: { status: Technician['status'] }) {
  const config = {
    active: { variant: 'success' as const, label: 'Active', dot: true },
    'on-break': { variant: 'warning' as const, label: 'On Break', dot: false },
    'off-duty': { variant: 'default' as const, label: 'Off Duty', dot: false },
    inactive: { variant: 'danger' as const, label: 'Inactive', dot: false },
  };

  const { variant, label, dot } = config[status];
  return <Badge variant={variant} dot={dot}>{label}</Badge>;
}

// Confirmation modal component
function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{message}</p>
        </div>
        <div className="px-6 py-4 bg-slate-50 flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant === 'danger' ? 'outline' : 'primary'}
            className={confirmVariant === 'danger' ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TechniciansPage() {
  const {
    technicians,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    deactivateTechnician,
    activateTechnician,
  } = useTechnicians();

  const [showForm, setShowForm] = useState(false);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'deactivate' | 'activate';
    techId: string;
    techName: string;
  } | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter technicians
  const filteredTechnicians = technicians.filter((tech) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return tech.status !== 'inactive';
    return tech.status === 'inactive';
  });

  // Stats
  const activeTechs = technicians.filter(t => t.status === 'active').length;
  const onBreakTechs = technicians.filter(t => t.status === 'on-break').length;
  const inactiveTechs = technicians.filter(t => t.status === 'inactive').length;
  const totalJobsToday = technicians
    .filter(t => t.status !== 'inactive')
    .reduce((sum, t) => sum + (t.stats?.jobsToday || 0), 0);
  const totalCompleted = technicians
    .filter(t => t.status !== 'inactive')
    .reduce((sum, t) => sum + (t.stats?.jobsCompleted || 0), 0);

  const handleAddTech = (data: Omit<Technician, 'id' | 'stats'>) => {
    addTechnician(data);
    setShowForm(false);
  };

  const handleEditTech = (data: Omit<Technician, 'id' | 'stats'>) => {
    if (editingTech) {
      updateTechnician(editingTech.id, data);
      setEditingTech(null);
    }
  };

  const handleConfirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'delete') {
      deleteTechnician(confirmModal.techId);
    } else if (confirmModal.type === 'deactivate') {
      deactivateTechnician(confirmModal.techId);
    } else if (confirmModal.type === 'activate') {
      activateTechnician(confirmModal.techId);
    }

    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Technicians</h1>
          <p className="text-slate-500 mt-1">Manage your service technicians</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Technician
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeTechs}</p>
              <p className="text-sm text-slate-500">Active</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{onBreakTechs}</p>
              <p className="text-sm text-slate-500">On Break</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalJobsToday}</p>
              <p className="text-sm text-slate-500">Jobs Today</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalCompleted}</p>
              <p className="text-sm text-slate-500">Completed</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {(showForm || editingTech) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => {
              setShowForm(false);
              setEditingTech(null);
            }}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
              <TechForm
                technician={editingTech || undefined}
                isEditing={!!editingTech}
                onSubmit={editingTech ? handleEditTech : handleAddTech}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTech(null);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            isOpen={confirmModal.isOpen}
            title={
              confirmModal.type === 'delete'
                ? 'Delete Technician'
                : confirmModal.type === 'deactivate'
                ? 'Deactivate Technician'
                : 'Activate Technician'
            }
            message={
              confirmModal.type === 'delete'
                ? `Are you sure you want to permanently delete ${confirmModal.techName}? This action cannot be undone.`
                : confirmModal.type === 'deactivate'
                ? `Deactivating ${confirmModal.techName} will remove them from schedules and route assignments. They can be reactivated later.`
                : `Reactivate ${confirmModal.techName}? They will become available for scheduling again.`
            }
            confirmLabel={
              confirmModal.type === 'delete'
                ? 'Delete'
                : confirmModal.type === 'deactivate'
                ? 'Deactivate'
                : 'Activate'
            }
            confirmVariant={confirmModal.type === 'activate' ? 'primary' : 'danger'}
            onConfirm={handleConfirmAction}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {(['all', 'active', 'inactive'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterStatus(filter)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap min-h-[48px] ${
              filterStatus === filter
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {filter === 'all' ? 'All Technicians' : filter === 'active' ? 'Active' : 'Inactive'}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-xs">
              {filter === 'all'
                ? technicians.length
                : filter === 'active'
                ? technicians.filter(t => t.status !== 'inactive').length
                : inactiveTechs}
            </span>
          </button>
        ))}
      </div>

      {/* Technicians List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTechnicians.map((tech, index) => {
            const colors = getTechColors(tech.color);

            return (
              <motion.div
                key={tech.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl border-2 ${
                  tech.status === 'inactive'
                    ? 'border-slate-200 opacity-60'
                    : 'border-slate-200 hover:border-slate-300'
                } shadow-sm overflow-hidden transition-all`}
              >
                {/* Card Header with Color */}
                <div
                  className="h-2"
                  style={{ backgroundColor: tech.color }}
                />

                <div className="p-5">
                  {/* Tech Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: tech.color }}
                      >
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{tech.name}</h3>
                        <StatusBadge status={tech.status} />
                      </div>
                    </div>

                    {/* Action Menu */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTech(tech)}
                        className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 space-y-2 text-sm">
                    {tech.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {tech.phone}
                      </div>
                    )}
                    {tech.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {tech.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-500">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Started {new Date(tech.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  {tech.status !== 'inactive' && tech.stats && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className={`py-2 rounded-lg ${colors.light}`}>
                          <p className="text-lg font-bold text-slate-900">
                            {tech.stats.jobsCompleted}/{tech.stats.jobsToday}
                          </p>
                          <p className="text-xs text-slate-500">Jobs</p>
                        </div>
                        <div className={`py-2 rounded-lg ${colors.light}`}>
                          <p className="text-lg font-bold text-slate-900">
                            {tech.stats.efficiency}%
                          </p>
                          <p className="text-xs text-slate-500">Efficiency</p>
                        </div>
                        <div className={`py-2 rounded-lg ${colors.light}`}>
                          <div
                            className="w-6 h-6 rounded-full mx-auto"
                            style={{ backgroundColor: tech.color }}
                          />
                          <p className="text-xs text-slate-500 mt-1">Color</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                    {tech.status === 'inactive' ? (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => setConfirmModal({
                            isOpen: true,
                            type: 'activate',
                            techId: tech.id,
                            techName: tech.name,
                          })}
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Reactivate
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setConfirmModal({
                            isOpen: true,
                            type: 'delete',
                            techId: tech.id,
                            techName: tech.name,
                          })}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setEditingTech(tech)}
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                          onClick={() => setConfirmModal({
                            isOpen: true,
                            type: 'deactivate',
                            techId: tech.id,
                            techName: tech.name,
                          })}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTechnicians.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-xl border border-slate-200"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {filterStatus === 'inactive' ? 'No inactive technicians' : 'No technicians found'}
          </h3>
          <p className="text-slate-500 mb-6">
            {filterStatus === 'inactive'
              ? 'All your technicians are currently active'
              : 'Add your first technician to get started'}
          </p>
          {filterStatus !== 'inactive' && (
            <Button onClick={() => setShowForm(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Technician
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
