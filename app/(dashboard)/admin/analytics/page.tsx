'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  MetricsSummary,
  Recommendation,
  TrendData,
  AnalyticsAlert,
  InsightsResponse,
} from '@/lib/analytics/types';

// =============================================================================
// Types
// =============================================================================

interface DashboardState {
  isLoading: boolean;
  error: string | null;
  summary: MetricsSummary | null;
  recommendations: Recommendation[];
  trends: TrendData[];
  alerts: AnalyticsAlert[];
  lastUpdated: string | null;
}

type DateRange = '24h' | '7d' | '30d' | '90d';

// =============================================================================
// Helper Components
// =============================================================================

function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
}) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    stable: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-surface-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {trend && trendDirection && (
          <span className={`text-sm font-medium ${trendColors[trendDirection]}`}>
            {trendDirection === 'up' && '+'}
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

function AlertBanner({ alert }: { alert: AnalyticsAlert }) {
  const severityColors = {
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {alert.severity === 'error' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {alert.severity === 'warning' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {alert.severity === 'info' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{alert.title}</h4>
          <p className="mt-1 text-sm opacity-90">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
  onUpdateStatus,
}: {
  recommendation: Recommendation;
  onUpdateStatus: (id: string, action: string) => void;
}) {
  const priorityColors = {
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  };

  const effortColors = {
    low: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-surface-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[recommendation.priority]}`}>
              {recommendation.priority}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {recommendation.type.replace(/_/g, ' ')}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{recommendation.title}</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{recommendation.description}</p>

          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Impact: <span className="text-gray-900 dark:text-white">{recommendation.impact}</span>
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Effort: <span className={effortColors[recommendation.effort]}>{recommendation.effort}</span>
            </span>
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-surface-900 rounded-lg">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Current: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {recommendation.metrics.current} {recommendation.metrics.unit}
              </span>
              <span className="mx-2 text-gray-400">-&gt;</span>
              <span className="text-gray-500 dark:text-gray-400">Target: </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {recommendation.metrics.target} {recommendation.metrics.unit}
              </span>
            </div>
          </div>

          {recommendation.actions.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested Actions:</h5>
              <ul className="space-y-1">
                {recommendation.actions.slice(0, 3).map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-blue-500 mt-1">-</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {recommendation.status === 'new' && (
            <>
              <button
                onClick={() => onUpdateStatus(recommendation.id, 'acknowledge')}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Acknowledge
              </button>
              <button
                onClick={() => onUpdateStatus(recommendation.id, 'dismiss')}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </>
          )}
          {recommendation.status === 'acknowledged' && (
            <button
              onClick={() => onUpdateStatus(recommendation.id, 'complete')}
              className="px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            >
              Mark Complete
            </button>
          )}
          {recommendation.status === 'in_progress' && (
            <span className="px-3 py-1.5 text-sm font-medium text-yellow-600 dark:text-yellow-400">
              In Progress
            </span>
          )}
          {recommendation.status === 'completed' && (
            <span className="px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TopPagesTable({ pages }: { pages: Array<{ path: string; views: number; avgDuration: number }> }) {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-gray-200 dark:border-surface-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-surface-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Top Pages</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-surface-900">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Page</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-surface-700">
            {pages.map((page, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-surface-700/50">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">{page.path}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">{page.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                  {Math.round(page.avgDuration / 1000)}s
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No page view data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// Main Dashboard Component
// =============================================================================

export default function AnalyticsDashboard() {
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    error: null,
    summary: null,
    recommendations: [],
    trends: [],
    alerts: [],
    lastUpdated: null,
  });

  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'pages'>('overview');

  const fetchInsights = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const rangeMap: Record<DateRange, number> = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
      };

      const end = new Date();
      const start = new Date(end.getTime() - rangeMap[dateRange]);

      const response = await fetch(
        `/api/analytics/insights?start=${start.toISOString()}&end=${end.toISOString()}&includeABTests=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();

      if (data.success && data.data) {
        const insights = data.data as InsightsResponse;
        setState({
          isLoading: false,
          error: null,
          summary: insights.summary,
          recommendations: insights.recommendations,
          trends: insights.trends,
          alerts: insights.alerts,
          lastUpdated: new Date().toISOString(),
        });
      } else {
        throw new Error(data.error || 'Failed to parse insights');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [dateRange]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleUpdateStatus = async (id: string, action: string) => {
    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, recommendationId: id }),
      });

      if (response.ok) {
        fetchInsights();
      }
    } catch (error) {
      console.error('Failed to update recommendation:', error);
    }
  };

  const getTrendForMetric = (metricName: string): TrendData | undefined => {
    return state.trends.find(t => t.metric === metricName);
  };

  const formatTrend = (trend?: TrendData): { trend: string; direction: 'up' | 'down' | 'stable' } | undefined => {
    if (!trend) return undefined;
    return {
      trend: `${Math.abs(trend.percentageChange)}%`,
      direction: trend.direction,
    };
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{state.error}</p>
          <button
            onClick={fetchInsights}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const summary = state.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Internal monitoring and improvement recommendations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-3 py-2 bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            onClick={fetchInsights}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Alerts */}
      {state.alerts.length > 0 && (
        <div className="space-y-3">
          {state.alerts.map((alert) => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-surface-700">
        <nav className="flex gap-6">
          {(['overview', 'recommendations', 'pages'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'recommendations' && state.recommendations.filter(r => r.status === 'new').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs">
                  {state.recommendations.filter(r => r.status === 'new').length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && summary && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Page Views"
              value={summary.pageViews.total.toLocaleString()}
              subtitle={`${summary.pageViews.unique.toLocaleString()} unique`}
              {...formatTrend(getTrendForMetric('Page Views'))}
            />
            <StatCard
              title="Conversion Rate"
              value={`${(summary.conversions.conversionRate * 100).toFixed(1)}%`}
              subtitle={`${summary.conversions.total} conversions`}
              {...formatTrend(getTrendForMetric('Conversion Rate'))}
            />
            <StatCard
              title="Bounce Rate"
              value={`${(summary.pageViews.bounceRate * 100).toFixed(1)}%`}
              subtitle="Single page visits"
              {...formatTrend(getTrendForMetric('Bounce Rate'))}
            />
            <StatCard
              title="Avg. Session"
              value={`${Math.round(summary.pageViews.avgSessionDuration / 1000)}s`}
              subtitle="Time on site"
              {...formatTrend(getTrendForMetric('Session Duration'))}
            />
          </div>

          {/* User Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Unique Users"
              value={summary.users.uniqueUsers.toLocaleString()}
              {...formatTrend(getTrendForMetric('Unique Users'))}
            />
            <StatCard
              title="Total Sessions"
              value={summary.users.totalSessions.toLocaleString()}
            />
            <StatCard
              title="New Users"
              value={summary.users.newUsers.toLocaleString()}
            />
            <StatCard
              title="User Retention"
              value={`${(summary.users.userRetention * 100).toFixed(1)}%`}
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Avg. Load Time"
              value={`${(summary.performance.avgPageLoadTime / 1000).toFixed(1)}s`}
            />
            <StatCard
              title="Time to Interactive"
              value={`${(summary.performance.avgTimeToInteractive / 1000).toFixed(1)}s`}
            />
            <StatCard
              title="Error Rate"
              value={`${(summary.performance.errorRate * 100).toFixed(2)}%`}
            />
            <StatCard
              title="Total Events"
              value={summary.events.total.toLocaleString()}
            />
          </div>

          {/* Trends */}
          {state.trends.length > 0 && (
            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-surface-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trends vs. Previous Period</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {state.trends.map((trend) => (
                  <div key={trend.metric} className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{trend.metric}</p>
                    <p className={`text-lg font-semibold ${
                      trend.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                      trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {trend.direction === 'up' && '+'}
                      {trend.percentageChange}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {state.recommendations.length > 0 ? (
            state.recommendations
              .filter(r => r.status !== 'dismissed')
              .map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl border border-gray-200 dark:border-surface-700">
              <p className="text-gray-500 dark:text-gray-400">No recommendations at this time</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Collect more data to generate improvement suggestions
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && summary && (
        <TopPagesTable pages={summary.pageViews.topPages} />
      )}

      {/* Footer */}
      {state.lastUpdated && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: {new Date(state.lastUpdated).toLocaleString()}
        </p>
      )}
    </div>
  );
}
