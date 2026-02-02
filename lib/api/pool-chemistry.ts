/**
 * Pool Chemistry API Utilities
 *
 * This module provides functions to fetch and analyze pool chemistry data.
 * Currently uses mock data, but is structured for easy integration with real APIs.
 */

// Chemistry thresholds for pool water quality
export const CHEMISTRY_THRESHOLDS = {
  ph: { min: 7.2, max: 7.6, criticalMin: 7.0, criticalMax: 7.8 },
  chlorine: { min: 1.0, max: 3.0, criticalMin: 0.5, criticalMax: 5.0 },
  alkalinity: { min: 80, max: 120, criticalMin: 60, criticalMax: 140 },
  cyanuricAcid: { min: 30, max: 50, criticalMin: 20, criticalMax: 100 },
  temperature: { min: 78, max: 82, criticalMin: 70, criticalMax: 90 },
};

export interface ChemistryData {
  poolId: string;
  ph: number;
  chlorine: number;
  alkalinity: number;
  cyanuricAcid: number;
  temperature: number;
  lastTested: string;
}

export interface ChemistryThresholdResult {
  isHigh: boolean;
  isLow: boolean;
  issues: string[];
}

export interface CustomerChemistryAlert {
  poolId: string;
  issues: string[];
}

// Mock chemistry data for different pools
const mockChemistryData: Record<string, ChemistryData> = {
  'pool-1': {
    poolId: 'pool-1',
    ph: 7.4,
    chlorine: 2.5,
    alkalinity: 95,
    cyanuricAcid: 45,
    temperature: 80,
    lastTested: '2026-01-30',
  },
  'pool-2': {
    poolId: 'pool-2',
    ph: 8.1, // High pH - warning
    chlorine: 1.8,
    alkalinity: 100,
    cyanuricAcid: 42,
    temperature: 79,
    lastTested: '2026-01-29',
  },
  'pool-3': {
    poolId: 'pool-3',
    ph: 7.5,
    chlorine: 0.8, // Low chlorine - critical
    alkalinity: 88,
    cyanuricAcid: 38,
    temperature: 81,
    lastTested: '2026-01-30',
  },
  'pool-4': {
    poolId: 'pool-4',
    ph: 7.3,
    chlorine: 2.2,
    alkalinity: 145, // High alkalinity - warning
    cyanuricAcid: 55, // Slightly high CYA
    temperature: 78,
    lastTested: '2026-01-28',
  },
};

// Mock customer-to-pool mapping
const customerPools: Record<string, string[]> = {
  'cust-1': ['pool-1'],
  'cust-2': ['pool-2'],
  'cust-3': ['pool-3', 'pool-4'], // Customer with multiple pools
  'cust-4': ['pool-1'], // Shared pool management
};

/**
 * Fetches pool chemistry data for a specific pool
 *
 * @param poolId - The unique identifier for the pool
 * @returns Chemistry data or null if not found
 *
 * TODO: Replace mock implementation with real API call:
 * ```typescript
 * const response = await fetch(`${process.env.POOL_CHEMISTRY_API_URL}/pools/${poolId}/chemistry`, {
 *   headers: {
 *     'Authorization': `Bearer ${process.env.POOL_CHEMISTRY_API_KEY}`,
 *     'Content-Type': 'application/json',
 *   },
 * });
 * if (!response.ok) return null;
 * return await response.json();
 * ```
 */
export async function getPoolChemistry(poolId: string): Promise<ChemistryData | null> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return mock data or generate random data for unknown pools
  if (mockChemistryData[poolId]) {
    return mockChemistryData[poolId];
  }

  // Generate realistic mock data for unknown pool IDs
  return {
    poolId,
    ph: 7.2 + Math.random() * 0.6, // 7.2 - 7.8
    chlorine: 1.0 + Math.random() * 3.0, // 1.0 - 4.0
    alkalinity: 80 + Math.random() * 40, // 80 - 120
    cyanuricAcid: 30 + Math.random() * 30, // 30 - 60
    temperature: 76 + Math.random() * 8, // 76 - 84
    lastTested: new Date().toISOString().split('T')[0],
  };
}

/**
 * Checks chemistry readings against thresholds and returns any issues
 *
 * @param data - Chemistry data to analyze
 * @returns Object containing threshold status and list of issues
 */
export function checkChemistryThresholds(data: ChemistryData): ChemistryThresholdResult {
  const issues: string[] = [];
  let isHigh = false;
  let isLow = false;

  // Check pH
  if (data.ph < CHEMISTRY_THRESHOLDS.ph.criticalMin) {
    issues.push('CRITICAL: pH dangerously low - risk of equipment corrosion');
    isLow = true;
  } else if (data.ph < CHEMISTRY_THRESHOLDS.ph.min) {
    issues.push('pH low - add pH increaser (sodium carbonate)');
    isLow = true;
  } else if (data.ph > CHEMISTRY_THRESHOLDS.ph.criticalMax) {
    issues.push('CRITICAL: pH dangerously high - risk of scale buildup');
    isHigh = true;
  } else if (data.ph > CHEMISTRY_THRESHOLDS.ph.max) {
    issues.push('pH high - add muriatic acid or pH decreaser');
    isHigh = true;
  }

  // Check chlorine
  if (data.chlorine < CHEMISTRY_THRESHOLDS.chlorine.criticalMin) {
    issues.push('CRITICAL: Chlorine dangerously low - pool not sanitized');
    isLow = true;
  } else if (data.chlorine < CHEMISTRY_THRESHOLDS.chlorine.min) {
    issues.push('Chlorine low - add chlorine or check salt cell');
    isLow = true;
  } else if (data.chlorine > CHEMISTRY_THRESHOLDS.chlorine.criticalMax) {
    issues.push('CRITICAL: Chlorine too high - do not swim, allow to dissipate');
    isHigh = true;
  } else if (data.chlorine > CHEMISTRY_THRESHOLDS.chlorine.max) {
    issues.push('Chlorine elevated - reduce chlorine output');
    isHigh = true;
  }

  // Check alkalinity
  if (data.alkalinity < CHEMISTRY_THRESHOLDS.alkalinity.criticalMin) {
    issues.push('CRITICAL: Alkalinity dangerously low - pH instability');
    isLow = true;
  } else if (data.alkalinity < CHEMISTRY_THRESHOLDS.alkalinity.min) {
    issues.push('Alkalinity low - add baking soda');
    isLow = true;
  } else if (data.alkalinity > CHEMISTRY_THRESHOLDS.alkalinity.criticalMax) {
    issues.push('CRITICAL: Alkalinity dangerously high');
    isHigh = true;
  } else if (data.alkalinity > CHEMISTRY_THRESHOLDS.alkalinity.max) {
    issues.push('Alkalinity high - add muriatic acid carefully');
    isHigh = true;
  }

  // Check cyanuric acid (stabilizer)
  if (data.cyanuricAcid < CHEMISTRY_THRESHOLDS.cyanuricAcid.criticalMin) {
    issues.push('CYA critically low - chlorine will burn off quickly');
    isLow = true;
  } else if (data.cyanuricAcid < CHEMISTRY_THRESHOLDS.cyanuricAcid.min) {
    issues.push('CYA low - add stabilizer (cyanuric acid)');
    isLow = true;
  } else if (data.cyanuricAcid > CHEMISTRY_THRESHOLDS.cyanuricAcid.criticalMax) {
    issues.push('CRITICAL: CYA too high - chlorine effectiveness reduced');
    isHigh = true;
  } else if (data.cyanuricAcid > CHEMISTRY_THRESHOLDS.cyanuricAcid.max) {
    issues.push('CYA elevated - consider partial drain and refill');
    isHigh = true;
  }

  return { isHigh, isLow, issues };
}

/**
 * Gets chemistry alerts for all pools belonging to a customer
 *
 * @param customerId - The unique identifier for the customer
 * @returns Array of alerts for each pool with issues
 *
 * TODO: Replace with real API implementation:
 * ```typescript
 * const response = await fetch(`${process.env.POOL_CHEMISTRY_API_URL}/customers/${customerId}/alerts`, {
 *   headers: {
 *     'Authorization': `Bearer ${process.env.POOL_CHEMISTRY_API_KEY}`,
 *   },
 * });
 * return await response.json();
 * ```
 */
export async function getCustomerChemistryAlerts(customerId: string): Promise<CustomerChemistryAlert[]> {
  // Get pools for this customer
  const poolIds = customerPools[customerId] || [`pool-${customerId}`];
  const alerts: CustomerChemistryAlert[] = [];

  for (const poolId of poolIds) {
    const chemistry = await getPoolChemistry(poolId);
    if (chemistry) {
      const thresholds = checkChemistryThresholds(chemistry);
      if (thresholds.issues.length > 0) {
        alerts.push({
          poolId,
          issues: thresholds.issues,
        });
      }
    }
  }

  return alerts;
}

/**
 * Determines the severity level of chemistry issues
 *
 * @param issues - Array of issue strings
 * @returns 'critical' | 'warning' | 'healthy'
 */
export function getChemistrySeverity(issues: string[]): 'critical' | 'warning' | 'healthy' {
  if (issues.length === 0) return 'healthy';
  if (issues.some((issue) => issue.includes('CRITICAL'))) return 'critical';
  return 'warning';
}

/**
 * Formats chemistry reading for display
 *
 * @param value - The chemistry value
 * @param type - Type of reading (ph, chlorine, etc.)
 * @returns Formatted string with unit
 */
export function formatChemistryReading(value: number, type: keyof typeof CHEMISTRY_THRESHOLDS): string {
  switch (type) {
    case 'ph':
      return value.toFixed(1);
    case 'chlorine':
      return `${value.toFixed(1)} ppm`;
    case 'alkalinity':
      return `${Math.round(value)} ppm`;
    case 'cyanuricAcid':
      return `${Math.round(value)} ppm`;
    case 'temperature':
      return `${Math.round(value)}°F`;
    default:
      return value.toString();
  }
}
