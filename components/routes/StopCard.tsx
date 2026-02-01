'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button } from '@/components/ui';
import { RouteStop, useRoutes } from '@/lib/routes-context';

interface StopCardProps {
  stop: RouteStop;
  technicianId: string;
  technicianColor: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function StopCard({
  stop,
  technicianId,
  technicianColor,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: StopCardProps) {
  const { updateStop, removeStop } = useRoutes();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    timeWindow: stop.timeWindow || 'morning',
    notes: stop.notes || '',
    isPriority: stop.isPriority || false,
  });

  const handleSave = () => {
    updateStop(technicianId, stop.id, {
      timeWindow: editForm.timeWindow as 'morning' | 'afternoon',
      notes: editForm.notes,
      isPriority: editForm.isPriority,
      estimatedArrival: editForm.timeWindow === 'morning' ? '10:00 AM' : '2:00 PM',
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeStop(technicianId, stop.id);
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'skipped':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative bg-white rounded-xl border-2 transition-all ${
          stop.isPriority ? 'border-orange-300 shadow-orange-100' : 'border-slate-200'
        } shadow-sm hover:shadow-md`}
      >
        {/* Priority badge */}
        {stop.isPriority && (
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PRIORITY
          </div>
        )}

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Order number */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: technicianColor }}
              >
                {stop.order}
              </div>

              {/* Customer info */}
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">{stop.customerName}</h4>
                <p className="text-sm text-slate-500 truncate">{stop.address}</p>
              </div>
            </div>

            {/* Status badge */}
            <Badge className={getStatusColor(stop.status)}>
              {stop.status.replace('-', ' ')}
            </Badge>
          </div>

          {/* Details row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{stop.estimatedArrival}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{stop.estimatedDuration} min</span>
            </div>
            {stop.timeWindow && (
              <Badge variant="default" className="bg-slate-100 text-slate-600">
                {stop.timeWindow === 'morning' ? 'AM' : 'PM'}
              </Badge>
            )}
          </div>

          {/* Notes */}
          {stop.notes && (
            <div className="mt-3 text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
              <span className="font-medium">Notes:</span> {stop.notes}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            {/* Reorder buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Move up"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Move down"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Edit/Delete buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[15%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 text-white">
                <h2 className="text-xl font-bold">Edit Stop</h2>
                <p className="text-slate-300 text-sm mt-1">{stop.customerName}</p>
              </div>

              <div className="p-6 space-y-5">
                {/* Time Window */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time Window
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditForm(f => ({ ...f, timeWindow: 'morning' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        editForm.timeWindow === 'morning'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-medium">Morning</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm(f => ({ ...f, timeWindow: 'afternoon' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        editForm.timeWindow === 'afternoon'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-medium">Afternoon</span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes for this stop
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Add any special instructions..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900 resize-none"
                  />
                </div>

                {/* Priority toggle */}
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium text-orange-900">Mark as Priority</p>
                    <p className="text-sm text-orange-700">Urgent stops are highlighted</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditForm(f => ({ ...f, isPriority: !f.isPriority }))}
                    className={`w-12 h-6 rounded-full transition-all ${
                      editForm.isPriority ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        editForm.isPriority ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[30%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Stop?</h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to remove <strong>{stop.customerName}</strong> from this route?
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
