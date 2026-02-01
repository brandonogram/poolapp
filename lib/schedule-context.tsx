'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { technicians, customers } from './mock-data';

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  address: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // "09:00" format (24hr)
  technicianId: string;
  technicianName: string;
  serviceType: 'Regular Maintenance' | 'Chemical Balance' | 'Repair' | 'Filter Clean' | 'Equipment Check' | 'Opening' | 'Closing' | 'Emergency';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  duration: number; // minutes
  rate: number; // service rate
}

interface ScheduleContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => Job;
  updateJob: (id: string, updates: Partial<Omit<Job, 'id'>>) => boolean;
  deleteJob: (id: string) => boolean;
  getJobsForDate: (date: string) => Job[];
  getJobsForTechnician: (technicianId: string, date?: string) => Job[];
  getJobById: (id: string) => Job | undefined;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Generate initial mock data for a realistic week
function generateInitialJobs(): Job[] {
  const jobs: Job[] = [];

  // Get current week dates (Mon-Fri)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const weekDates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const todayStr = today.toISOString().split('T')[0];
  const todayIndex = weekDates.findIndex(d => d === todayStr);

  const serviceTypes: Job['serviceType'][] = [
    'Regular Maintenance', 'Chemical Balance', 'Filter Clean', 'Equipment Check', 'Repair'
  ];

  const times = ['07:00', '08:00', '08:30', '09:15', '10:00', '10:45', '11:30', '12:15', '13:00', '13:45', '14:30', '15:15', '16:00'];

  let jobId = 1;

  // For each technician, generate 6-8 jobs per day
  technicians.forEach((tech) => {
    weekDates.forEach((date, dayIndex) => {
      const jobCount = 6 + Math.floor(Math.random() * 3);

      for (let j = 0; j < jobCount; j++) {
        const customer = customers[jobId % customers.length];
        const isBeforeToday = dayIndex < todayIndex;
        const isToday = dayIndex === todayIndex;

        let status: Job['status'] = 'scheduled';
        if (isBeforeToday) {
          status = 'completed';
        } else if (isToday) {
          if (j < 4) status = 'completed';
          else if (j === 4) status = 'in-progress';
          else status = 'scheduled';
        }

        jobs.push({
          id: `job-${jobId}`,
          customerId: customer.id,
          customerName: customer.name,
          address: customer.address,
          date,
          time: times[j % times.length],
          technicianId: tech.id,
          technicianName: tech.name,
          serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
          status,
          duration: 30 + Math.floor(Math.random() * 30),
          rate: customer.rate || 150,
          notes: j % 4 === 0 ? 'Check filter pressure' : undefined,
        });

        jobId++;
      }
    });
  });

  return jobs;
}

const STORAGE_KEY = 'poolapp-schedule';

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setJobs(parsed);
      } catch (e) {
        console.error('Failed to load schedule state:', e);
        setJobs(generateInitialJobs());
      }
    } else {
      setJobs(generateInitialJobs());
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on change (but only after initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    }
  }, [jobs, isInitialized]);

  const addJob = (jobData: Omit<Job, 'id'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setJobs(prev => [...prev, newJob]);
    return newJob;
  };

  const updateJob = (id: string, updates: Partial<Omit<Job, 'id'>>): boolean => {
    let found = false;
    setJobs(prev => prev.map(job => {
      if (job.id === id) {
        found = true;
        return { ...job, ...updates };
      }
      return job;
    }));
    return found;
  };

  const deleteJob = (id: string): boolean => {
    let found = false;
    setJobs(prev => {
      const filtered = prev.filter(job => {
        if (job.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    return found;
  };

  const getJobsForDate = (date: string): Job[] => {
    return jobs.filter(job => job.date === date && job.status !== 'cancelled');
  };

  const getJobsForTechnician = (technicianId: string, date?: string): Job[] => {
    return jobs.filter(job => {
      if (job.technicianId !== technicianId) return false;
      if (job.status === 'cancelled') return false;
      if (date && job.date !== date) return false;
      return true;
    });
  };

  const getJobById = (id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  };

  return (
    <ScheduleContext.Provider value={{
      jobs,
      addJob,
      updateJob,
      deleteJob,
      getJobsForDate,
      getJobsForTechnician,
      getJobById,
    }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}

// Helper to format time for display
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Helper to format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
