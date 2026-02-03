'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Card, Toast, useToast } from '@/components/ui';
import { useSchedule, Job, formatTime, formatDate } from '@/lib/schedule-context';
import { JobForm, JobCard, techColors } from '@/components/schedule';
import { useTechnicians, getTechColors } from '@/lib/technicians-context';

// Generate dates for the current week (Mon-Fri)
const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i],
      fullDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i],
      date: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      fullDate: date,
      isoDate: date.toISOString().split('T')[0],
      isToday: date.toDateString() === today.toDateString(),
    };
  });
};

// Weather data mock
const weatherData = [
  { day: 0, condition: 'sunny', temp: 78, icon: 'sun' },
  { day: 1, condition: 'sunny', temp: 82, icon: 'sun' },
  { day: 2, condition: 'partly-cloudy', temp: 76, icon: 'cloud-sun' },
  { day: 3, condition: 'rain', temp: 68, icon: 'cloud-rain', alert: true },
  { day: 4, condition: 'sunny', temp: 75, icon: 'sun' },
];

// Weather icons
function WeatherIcon({ type, className = '' }: { type: string; className?: string }) {
  switch (type) {
    case 'sun':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'cloud-sun':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case 'cloud-rain':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19v2M12 19v2M16 19v2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SchedulePage() {
  const { jobs, updateJob, getJobsForDate, getJobsForTechnician } = useSchedule();
  const { getActiveTechnicians } = useTechnicians();
  const technicians = getActiveTechnicians();
  const weekDates = useMemo(() => getWeekDates(), []);
  const todayIndex = weekDates.findIndex(d => d.isToday);

  const [selectedDay, setSelectedDay] = useState(todayIndex >= 0 ? todayIndex : 0);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [draggingJobId, setDraggingJobId] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const { messages, addToast, dismissToast } = useToast();

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  const [createForDate, setCreateForDate] = useState<string | undefined>();
  const [createForTech, setCreateForTech] = useState<string | undefined>();

  // Calculate capacity for a day
  const getCapacity = useCallback((dayIndex: number) => {
    const maxJobsPerTech = 10;
    const maxCapacity = technicians.length * maxJobsPerTech;
    const dateStr = weekDates[dayIndex].isoDate;
    const dayJobs = getJobsForDate(dateStr);
    return Math.round((dayJobs.length / maxCapacity) * 100);
  }, [technicians.length, weekDates, getJobsForDate]);

  // Calculate daily capacities
  const capacities = useMemo(() =>
    weekDates.map((_, i) => getCapacity(i)),
    [weekDates, getCapacity]
  );

  // Get jobs at risk due to weather
  const jobsAtRisk = useMemo(() => {
    const rainDay = weatherData.find(w => w.alert);
    if (!rainDay) return 0;
    const dateStr = weekDates[rainDay.day]?.isoDate;
    if (!dateStr) return 0;
    return getJobsForDate(dateStr).length;
  }, [weekDates, getJobsForDate]);

  // Get jobs for a specific tech and day
  const getJobsForCell = (techId: string, dateStr: string) => {
    return jobs.filter(j =>
      j.technicianId === techId &&
      j.date === dateStr &&
      j.status !== 'cancelled'
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Open create modal
  const handleCreateJob = (date?: string, techId?: string) => {
    setEditingJob(undefined);
    setCreateForDate(date || weekDates[selectedDay].isoDate);
    setCreateForTech(techId);
    setIsFormOpen(true);
  };

  // Open edit modal
  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setCreateForDate(undefined);
    setCreateForTech(undefined);
    setIsFormOpen(true);
  };

  // Close modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(undefined);
    setCreateForDate(undefined);
    setCreateForTech(undefined);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingJobId(jobId);
  };

  const handleDragEnd = () => {
    setDraggingJobId(null);
    setDragOverCell(null);
  };

  const handleDragOver = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell(cellId);
  };

  const handleDrop = (e: React.DragEvent, targetTechId: string, targetDate: string) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (!jobId) return;

    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Don't do anything if dropped in same cell
    if (job.technicianId === targetTechId && job.date === targetDate) {
      setDragOverCell(null);
      setDraggingJobId(null);
      return;
    }

    const targetTech = technicians.find(t => t.id === targetTechId);
    if (!targetTech) return;

    // Update job
    updateJob(jobId, {
      technicianId: targetTechId,
      technicianName: targetTech.name,
      date: targetDate,
    });

    addToast(`Moved ${job.customerName} to ${targetTech.name} on ${formatDate(targetDate)}`, 'success');

    setDragOverCell(null);
    setDraggingJobId(null);
  };

  return (
    <div className="space-y-6" onDragEnd={handleDragEnd}>
      <Toast messages={messages} onDismiss={dismissToast} />

      {/* Job Form Modal */}
      <JobForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        job={editingJob}
        initialDate={createForDate}
        initialTechId={createForTech}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weekly Schedule</h1>
          <p className="text-slate-500 mt-1">
            {weekDates[0].month} {weekDates[0].date} - {weekDates[4].month} {weekDates[4].date}, {weekDates[0].fullDate.getFullYear()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all min-h-[44px] ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all min-h-[44px] ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day
            </button>
          </div>

          <Button variant="outline" onClick={() => handleCreateJob()}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Job
          </Button>

          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Auto-Optimize
          </Button>
        </div>
      </div>

      {/* Weather Alert Banner */}
      {jobsAtRisk > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <WeatherIcon type="cloud-rain" className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900">Rain Expected Thursday</p>
              <p className="text-sm text-amber-700">
                {jobsAtRisk} jobs may need rescheduling. Consider moving outdoor-only services.
              </p>
            </div>
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              Review Jobs
            </Button>
          </div>
        </motion.div>
      )}

      {/* Capacity Overview */}
      <div className="grid grid-cols-5 gap-3">
        {weekDates.map((day, index) => {
          const capacity = capacities[index];
          const weather = weatherData[index];
          const isSelected = index === selectedDay;

          return (
            <motion.button
              key={day.fullDay}
              onClick={() => setSelectedDay(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : day.isToday
                    ? 'border-blue-200 bg-white hover:border-blue-300'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
            >
              {day.isToday && (
                <span className="absolute -top-2 left-3 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                  Today
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-slate-500'}`}>
                    {day.day}
                  </p>
                  <p className={`text-2xl font-bold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                    {day.date}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <WeatherIcon
                    type={weather.icon}
                    className={`w-5 h-5 ${weather.alert ? 'text-amber-500' : 'text-slate-400'}`}
                  />
                  <span className="text-xs text-slate-400 mt-0.5">{weather.temp}</span>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={isSelected ? 'text-blue-700' : 'text-slate-500'}>Capacity</span>
                  <span className={`font-semibold ${
                    capacity >= 90 ? 'text-red-600' :
                    capacity >= 70 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>{capacity}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${capacity}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      capacity >= 90 ? 'bg-red-500' :
                      capacity >= 70 ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main Schedule Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {viewMode === 'week' ? (
          // Week view
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="sticky left-0 z-20 bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-48 border-r border-slate-200">
                    Technician
                  </th>
                  {weekDates.map((day, index) => (
                    <th
                      key={day.fullDay}
                      className={`px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider min-w-[160px] ${
                        index === selectedDay ? 'bg-blue-50 text-blue-700' :
                        day.isToday ? 'bg-blue-50/50 text-slate-600' :
                        'bg-slate-50 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{day.day} {day.date}</span>
                        {day.isToday && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {technicians.map((tech) => {
                  const colors = getTechColors(tech.color);

                  return (
                    <tr key={tech.id} className="group">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-slate-100 group-hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center text-white font-semibold text-sm`}>
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{tech.name}</p>
                            <p className="text-xs text-slate-500">{tech.phone}</p>
                          </div>
                        </div>
                      </td>
                      {weekDates.map((day, dayIndex) => {
                        const cellJobs = getJobsForCell(tech.id, day.isoDate);
                        const cellId = `${tech.id}-${day.isoDate}`;
                        const isDragOver = dragOverCell === cellId;

                        return (
                          <td
                            key={day.fullDay}
                            onDragOver={(e) => handleDragOver(e, cellId)}
                            onDragLeave={() => setDragOverCell(null)}
                            onDrop={(e) => handleDrop(e, tech.id, day.isoDate)}
                            className={`px-2 py-2 align-top transition-colors ${
                              dayIndex === selectedDay ? 'bg-blue-50/30' :
                              day.isToday ? 'bg-blue-50/20' : ''
                            } ${isDragOver ? 'bg-blue-100' : ''}`}
                          >
                            <div className={`min-h-[120px] rounded-lg p-1.5 transition-all ${
                              isDragOver ? 'ring-2 ring-blue-400 ring-offset-1 bg-blue-50' : ''
                            }`}>
                              {/* Job count and add button */}
                              <div className="flex items-center justify-between mb-2 px-1">
                                <Badge
                                  variant={cellJobs.length >= 7 ? 'danger' : cellJobs.length >= 5 ? 'warning' : 'primary'}
                                  size="sm"
                                >
                                  {cellJobs.length} jobs
                                </Badge>
                                <button
                                  onClick={() => handleCreateJob(day.isoDate, tech.id)}
                                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-100 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors min-w-[36px]"
                                  title="Add job"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>

                              {/* Jobs list (compact) */}
                              <div className="space-y-1.5">
                                <AnimatePresence mode="popLayout">
                                  {cellJobs.slice(0, 4).map((job) => (
                                    <JobCard
                                      key={job.id}
                                      job={job}
                                      compact
                                      onClick={() => handleEditJob(job)}
                                      onDragStart={handleDragStart}
                                      isDragging={draggingJobId === job.id}
                                    />
                                  ))}
                                </AnimatePresence>
                                {cellJobs.length > 4 && (
                                  <button
                                    onClick={() => {
                                      setSelectedDay(dayIndex);
                                      setViewMode('day');
                                    }}
                                    className={`w-full py-1.5 text-xs font-medium rounded-md transition-colors ${colors.text} ${colors.light} hover:opacity-80`}
                                  >
                                    +{cellJobs.length - 4} more jobs
                                  </button>
                                )}
                              </div>

                              {/* Empty state */}
                              {cellJobs.length === 0 && !isDragOver && (
                                <button
                                  onClick={() => handleCreateJob(day.isoDate, tech.id)}
                                  className="h-20 w-full border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-lg flex items-center justify-center transition-colors group/empty"
                                >
                                  <span className="text-xs text-slate-400 group-hover/empty:text-blue-500">
                                    + Add job
                                  </span>
                                </button>
                              )}

                              {/* Drop indicator */}
                              {isDragOver && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="h-10 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex items-center justify-center mt-1.5"
                                >
                                  <span className="text-xs text-blue-600 font-medium">Drop here</span>
                                </motion.div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // Day view (detailed)
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                  disabled={selectedDay === 0}
                  className="p-3 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-slate-900">
                    {weekDates[selectedDay].fullDay}, {weekDates[selectedDay].month} {weekDates[selectedDay].date}
                  </h2>
                  {weekDates[selectedDay].isToday && (
                    <Badge variant="primary" className="mt-1">Today</Badge>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDay(Math.min(4, selectedDay + 1))}
                  disabled={selectedDay === 4}
                  className="p-3 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCreateJob(weekDates[selectedDay].isoDate)}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Job
                </Button>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Day Capacity</p>
                  <p className={`text-2xl font-bold ${
                    capacities[selectedDay] >= 90 ? 'text-red-600' :
                    capacities[selectedDay] >= 70 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>{capacities[selectedDay]}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Jobs</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {getJobsForDate(weekDates[selectedDay].isoDate).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {technicians.map((tech) => {
                const techJobs = getJobsForCell(tech.id, weekDates[selectedDay].isoDate);
                const colors = getTechColors(tech.color);
                const completed = techJobs.filter(j => j.status === 'completed').length;
                const inProgress = techJobs.filter(j => j.status === 'in-progress').length;
                const revenue = techJobs.reduce((sum, j) => sum + j.rate, 0);

                return (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    {/* Tech header */}
                    <div className={`${colors.light} px-4 py-3 border-b border-slate-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center text-white font-semibold text-sm`}>
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{tech.name}</p>
                            <p className="text-xs text-slate-500">
                              {completed}/{techJobs.length} completed
                              {inProgress > 0 && <span className="text-blue-600 ml-1">(1 active)</span>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">${revenue}</p>
                          <p className="text-xs text-slate-500">projected</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {techJobs.length > 0 && (
                        <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.bg} rounded-full transition-all`}
                            style={{ width: `${(completed / techJobs.length) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Jobs list */}
                    <div
                      className="p-3 space-y-2 max-h-[400px] overflow-y-auto"
                      onDragOver={(e) => handleDragOver(e, `${tech.id}-${weekDates[selectedDay].isoDate}`)}
                      onDragLeave={() => setDragOverCell(null)}
                      onDrop={(e) => handleDrop(e, tech.id, weekDates[selectedDay].isoDate)}
                    >
                      <AnimatePresence mode="popLayout">
                        {techJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            onClick={() => handleEditJob(job)}
                            onDragStart={handleDragStart}
                            isDragging={draggingJobId === job.id}
                          />
                        ))}
                      </AnimatePresence>

                      {techJobs.length === 0 && (
                        <button
                          onClick={() => handleCreateJob(weekDates[selectedDay].isoDate, tech.id)}
                          className="h-24 w-full border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-lg flex flex-col items-center justify-center transition-colors group/empty gap-1"
                        >
                          <svg className="w-6 h-6 text-slate-300 group-hover/empty:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-sm text-slate-400 group-hover/empty:text-blue-500">
                            Add job
                          </span>
                        </button>
                      )}

                      {dragOverCell === `${tech.id}-${weekDates[selectedDay].isoDate}` && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-12 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex items-center justify-center"
                        >
                          <span className="text-sm text-blue-600 font-medium">Drop to assign</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Add job button at bottom */}
                    <div className="px-3 pb-3">
                      <button
                        onClick={() => handleCreateJob(weekDates[selectedDay].isoDate, tech.id)}
                        className="w-full py-2 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add job
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {weekDates.reduce((acc, day) => acc + getJobsForDate(day.isoDate).length, 0)}
              </p>
              <p className="text-sm text-slate-500">Total Jobs This Week</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                ${weekDates.reduce((acc, day) =>
                  acc + getJobsForDate(day.isoDate).reduce((sum, j) => sum + j.rate, 0), 0
                ).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">Projected Revenue</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{technicians.length}</p>
              <p className="text-sm text-slate-500">Active Technicians</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {Math.round(capacities.reduce((a, b) => a + b, 0) / capacities.length)}%
              </p>
              <p className="text-sm text-slate-500">Avg. Capacity</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 py-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-300" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
          <span>Drag to reschedule</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Click to edit</span>
        </div>
      </div>
    </div>
  );
}
