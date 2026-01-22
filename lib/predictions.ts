/**
 * Predictive Route Analytics
 * Calculates estimated finish times and detects when techs are running behind
 */

export interface TechPrediction {
  technicianId: string;
  technicianName: string;
  technicianColor: string;
  totalStops: number;
  completedStops: number;
  currentStop: string | null;
  scheduledFinish: Date;
  predictedFinish: Date;
  minutesBehind: number;
  status: 'on-track' | 'at-risk' | 'behind';
  remainingStops: {
    customerName: string;
    avgServiceTime: number; // minutes
    driveTimeToNext: number; // minutes
  }[];
}

export interface PredictionSettings {
  behindThresholdMinutes: number; // default 30
  atRiskThresholdMinutes: number; // default 15
}

const DEFAULT_SETTINGS: PredictionSettings = {
  behindThresholdMinutes: 30,
  atRiskThresholdMinutes: 15,
};

// Historical average service times per customer (mock data)
// In production, this would come from ServiceLog aggregations
const CUSTOMER_AVG_SERVICE_TIMES: Record<string, number> = {
  'Johnson': 38,
  'Williams': 42,
  'Garcia': 35,
  'Chen': 40,
  'Thompson': 45,
  'Martinez': 37,
  'Davis': 50, // larger pool
  'Miller': 33,
  'Wilson': 44,
  'Anderson': 39,
};

const DEFAULT_SERVICE_TIME = 45; // minutes

/**
 * Calculate drive time between two points (simplified)
 * In production, use a routing API like Google Maps or OSRM
 */
function calculateDriveTime(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number {
  // Haversine distance in miles
  const R = 3959; // Earth's radius in miles
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLng = ((toLng - fromLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Assume average 25 mph in suburban areas with stops
  const driveTimeMinutes = (distance / 25) * 60;
  return Math.round(driveTimeMinutes);
}

/**
 * Get historical average service time for a customer
 */
function getAvgServiceTime(customerName: string): number {
  // Extract last name for lookup
  const lastName = customerName.split(' ').pop() || customerName;
  return CUSTOMER_AVG_SERVICE_TIMES[lastName] || DEFAULT_SERVICE_TIME;
}

/**
 * Calculate prediction for a single technician
 */
export function calculateTechPrediction(
  technicianId: string,
  technicianName: string,
  technicianColor: string,
  stops: {
    id: string;
    customerName: string;
    status: 'pending' | 'in-progress' | 'completed' | 'skipped';
    lat: number;
    lng: number;
  }[],
  scheduledEndTime: Date,
  currentTime: Date = new Date(),
  settings: PredictionSettings = DEFAULT_SETTINGS
): TechPrediction {
  const completedStops = stops.filter(
    (s) => s.status === 'completed' || s.status === 'skipped'
  ).length;

  const inProgressStop = stops.find((s) => s.status === 'in-progress');
  const pendingStops = stops.filter((s) => s.status === 'pending');

  // Build remaining stops with time estimates
  const remainingStops: TechPrediction['remainingStops'] = [];

  // If there's an in-progress stop, include remaining time for it
  let totalRemainingMinutes = 0;

  if (inProgressStop) {
    // Assume they're halfway through the current stop
    const avgTime = getAvgServiceTime(inProgressStop.customerName);
    totalRemainingMinutes += avgTime / 2;

    remainingStops.push({
      customerName: inProgressStop.customerName,
      avgServiceTime: avgTime,
      driveTimeToNext: pendingStops.length > 0
        ? calculateDriveTime(
            inProgressStop.lat,
            inProgressStop.lng,
            pendingStops[0].lat,
            pendingStops[0].lng
          )
        : 0,
    });
  }

  // Add pending stops
  for (let i = 0; i < pendingStops.length; i++) {
    const stop = pendingStops[i];
    const avgTime = getAvgServiceTime(stop.customerName);
    const driveToNext =
      i < pendingStops.length - 1
        ? calculateDriveTime(
            stop.lat,
            stop.lng,
            pendingStops[i + 1].lat,
            pendingStops[i + 1].lng
          )
        : 0;

    remainingStops.push({
      customerName: stop.customerName,
      avgServiceTime: avgTime,
      driveTimeToNext: driveToNext,
    });

    totalRemainingMinutes += avgTime + driveToNext;
  }

  // Calculate predicted finish time
  const predictedFinish = new Date(
    currentTime.getTime() + totalRemainingMinutes * 60 * 1000
  );

  // Calculate minutes behind
  const minutesBehind = Math.round(
    (predictedFinish.getTime() - scheduledEndTime.getTime()) / (60 * 1000)
  );

  // Determine status
  let status: TechPrediction['status'] = 'on-track';
  if (minutesBehind >= settings.behindThresholdMinutes) {
    status = 'behind';
  } else if (minutesBehind >= settings.atRiskThresholdMinutes) {
    status = 'at-risk';
  }

  return {
    technicianId,
    technicianName,
    technicianColor,
    totalStops: stops.length,
    completedStops,
    currentStop: inProgressStop?.customerName || null,
    scheduledFinish: scheduledEndTime,
    predictedFinish,
    minutesBehind: Math.max(0, minutesBehind),
    status,
    remainingStops,
  };
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get status color classes
 */
export function getStatusColors(status: TechPrediction['status']): {
  bg: string;
  text: string;
  dot: string;
  border: string;
} {
  switch (status) {
    case 'behind':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        dot: 'bg-red-500',
        border: 'border-red-200',
      };
    case 'at-risk':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        border: 'border-amber-200',
      };
    default:
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        dot: 'bg-green-500',
        border: 'border-slate-200',
      };
  }
}
