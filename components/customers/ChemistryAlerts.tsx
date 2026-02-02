'use client';

import { useState, useEffect } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import {
  getCustomerChemistryAlerts,
  getChemistrySeverity,
  CustomerChemistryAlert
} from '@/lib/api/pool-chemistry';

interface ChemistryAlertsProps {
  customerId: string;
  onScheduleTreatment?: (poolId: string, issues: string[]) => void;
}

export function ChemistryAlerts({ customerId, onScheduleTreatment }: ChemistryAlertsProps) {
  const [alerts, setAlerts] = useState<CustomerChemistryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCustomerChemistryAlerts(customerId);
        setAlerts(data);
      } catch (err) {
        setError('Failed to load chemistry alerts');
        console.error('Error fetching chemistry alerts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, [customerId]);

  if (loading) {
    return (
      <Card title="Chemistry Alerts">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-slate-500">Checking chemistry levels...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Chemistry Alerts">
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card title="Chemistry Alerts">
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-2 text-sm text-green-700 font-medium">All chemistry levels normal</p>
          <p className="text-xs text-slate-500 mt-1">No action needed at this time</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Chemistry Alerts"
      action={
        <Badge variant="danger" dot>
          {alerts.reduce((sum, a) => sum + a.issues.length, 0)} Issues
        </Badge>
      }
    >
      <div className="space-y-4">
        {alerts.map((alert) => {
          const severity = getChemistrySeverity(alert.issues);

          return (
            <div
              key={alert.poolId}
              className={`rounded-lg border p-4 ${
                severity === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              {/* Pool Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                  }`}></div>
                  <span className={`font-medium ${
                    severity === 'critical' ? 'text-red-700' : 'text-amber-700'
                  }`}>
                    Pool: {alert.poolId}
                  </span>
                </div>
                <Badge
                  variant={severity === 'critical' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {severity === 'critical' ? 'Critical' : 'Warning'}
                </Badge>
              </div>

              {/* Issues List */}
              <ul className="space-y-2 mb-4">
                {alert.issues.map((issue, index) => {
                  const isCritical = issue.includes('CRITICAL');

                  return (
                    <li
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        isCritical
                          ? 'text-red-700 font-medium'
                          : severity === 'critical'
                            ? 'text-red-600'
                            : 'text-amber-700'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isCritical ? 'text-red-500' : 'text-amber-500'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {isCritical ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        )}
                      </svg>
                      <span>{issue}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Action Button */}
              <Button
                variant={severity === 'critical' ? 'danger' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => onScheduleTreatment?.(alert.poolId, alert.issues)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Treatment
              </Button>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          Chemistry data last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </Card>
  );
}

export default ChemistryAlerts;
