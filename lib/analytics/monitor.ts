/**
 * Pool App - Analytics Monitor
 * Functions to aggregate metrics, calculate conversion rates, and identify trends
 */

import type {
  PageView,
  AnalyticsEvent,
  Conversion,
  MetricsSummary,
  FunnelStep,
  TrendData,
  AnalyticsAlert,
  EventCategory,
  ConversionType,
  AnalyticsStore,
} from './types';
import { generateRecommendations } from './improvements';

// =============================================================================
// Time Helpers
// =============================================================================

/**
 * Get start of period based on granularity
 */
function getStartOfPeriod(date: Date, granularity: 'hour' | 'day' | 'week' | 'month'): Date {
  const d = new Date(date);
  switch (granularity) {
    case 'hour':
      d.setMinutes(0, 0, 0);
      break;
    case 'day':
      d.setHours(0, 0, 0, 0);
      break;
    case 'week':
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      break;
    case 'month':
      d.setHours(0, 0, 0, 0);
      d.setDate(1);
      break;
  }
  return d;
}

/**
 * Filter records by time range
 */
function filterByTimeRange<T extends { timestamp: string }>(
  records: T[],
  start: Date,
  end: Date
): T[] {
  return records.filter(r => {
    const timestamp = new Date(r.timestamp);
    return timestamp >= start && timestamp <= end;
  });
}

// =============================================================================
// Aggregation Functions
// =============================================================================

/**
 * Aggregate page views by path
 */
export function aggregatePageViews(pageViews: PageView[]): Record<string, number> {
  const byPath: Record<string, number> = {};
  for (const pv of pageViews) {
    byPath[pv.path] = (byPath[pv.path] || 0) + 1;
  }
  return byPath;
}

/**
 * Get top pages with average duration
 */
export function getTopPages(
  pageViews: PageView[],
  limit = 10
): Array<{ path: string; views: number; avgDuration: number }> {
  const pageStats: Record<string, { views: number; totalDuration: number }> = {};

  for (const pv of pageViews) {
    if (!pageStats[pv.path]) {
      pageStats[pv.path] = { views: 0, totalDuration: 0 };
    }
    pageStats[pv.path].views++;
    if (pv.duration) {
      pageStats[pv.path].totalDuration += pv.duration;
    }
  }

  return Object.entries(pageStats)
    .map(([path, stats]) => ({
      path,
      views: stats.views,
      avgDuration: stats.views > 0 ? stats.totalDuration / stats.views : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/**
 * Calculate bounce rate (single page sessions / total sessions)
 */
export function calculateBounceRate(pageViews: PageView[]): number {
  const sessionPageCounts: Record<string, number> = {};

  for (const pv of pageViews) {
    sessionPageCounts[pv.sessionId] = (sessionPageCounts[pv.sessionId] || 0) + 1;
  }

  const totalSessions = Object.keys(sessionPageCounts).length;
  if (totalSessions === 0) return 0;

  const singlePageSessions = Object.values(sessionPageCounts).filter(count => count === 1).length;
  return singlePageSessions / totalSessions;
}

/**
 * Calculate average session duration
 */
export function calculateAvgSessionDuration(pageViews: PageView[]): number {
  const sessionDurations: Record<string, number> = {};

  for (const pv of pageViews) {
    if (pv.duration) {
      sessionDurations[pv.sessionId] = (sessionDurations[pv.sessionId] || 0) + pv.duration;
    }
  }

  const durations = Object.values(sessionDurations);
  if (durations.length === 0) return 0;

  return durations.reduce((sum, d) => sum + d, 0) / durations.length;
}

/**
 * Aggregate events by category
 */
export function aggregateEventsByCategory(events: AnalyticsEvent[]): Record<EventCategory, number> {
  const byCategory: Partial<Record<EventCategory, number>> = {};
  for (const event of events) {
    byCategory[event.category] = (byCategory[event.category] || 0) + 1;
  }
  return byCategory as Record<EventCategory, number>;
}

/**
 * Get top events by action
 */
export function getTopEvents(
  events: AnalyticsEvent[],
  limit = 10
): Array<{ action: string; count: number }> {
  const actionCounts: Record<string, number> = {};

  for (const event of events) {
    actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
  }

  return Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Aggregate conversions by type
 */
export function aggregateConversionsByType(conversions: Conversion[]): Record<ConversionType, number> {
  const byType: Partial<Record<ConversionType, number>> = {};
  for (const conv of conversions) {
    byType[conv.type] = (byType[conv.type] || 0) + 1;
  }
  return byType as Record<ConversionType, number>;
}

/**
 * Calculate overall conversion rate
 */
export function calculateConversionRate(
  pageViews: PageView[],
  conversions: Conversion[]
): number {
  const uniqueSessions = new Set(pageViews.map(pv => pv.sessionId)).size;
  if (uniqueSessions === 0) return 0;

  const convertedSessions = new Set(conversions.map(c => c.sessionId)).size;
  return convertedSessions / uniqueSessions;
}

/**
 * Analyze funnel progression
 */
export function analyzeFunnel(conversions: Conversion[]): FunnelStep[] {
  const funnelSteps: Record<number, { name: string; count: number }> = {};

  // Define funnel stages
  const stageNames: Record<number, string> = {
    1: 'Landing Page Visit',
    2: 'Pricing Page View',
    3: 'Signup Started',
    4: 'Account Created',
    5: 'Onboarding Started',
    6: 'First Feature Used',
    7: 'Subscription Started',
  };

  // Count conversions at each stage
  for (const conv of conversions) {
    const step = conv.funnelStep || 0;
    if (step > 0) {
      if (!funnelSteps[step]) {
        funnelSteps[step] = { name: stageNames[step] || `Step ${step}`, count: 0 };
      }
      funnelSteps[step].count++;
    }
  }

  // Calculate drop-off rates
  const sortedSteps = Object.entries(funnelSteps)
    .map(([step, data]) => ({ step: parseInt(step), ...data }))
    .sort((a, b) => a.step - b.step);

  return sortedSteps.map((current, index) => {
    const entered = index === 0 ? current.count : sortedSteps[index - 1].count;
    const dropOffRate = entered > 0 ? 1 - (current.count / entered) : 0;

    return {
      step: current.step,
      name: current.name,
      entered,
      completed: current.count,
      dropOffRate: Math.max(0, dropOffRate),
    };
  });
}

/**
 * Calculate user metrics
 */
export function calculateUserMetrics(pageViews: PageView[]): {
  totalSessions: number;
  uniqueUsers: number;
  newUsers: number;
  returningUsers: number;
  userRetention: number;
} {
  const sessions = new Set(pageViews.map(pv => pv.sessionId));
  const users = new Set(pageViews.filter(pv => pv.userId).map(pv => pv.userId));

  // Simplified new vs returning calculation
  const userSessionCounts: Record<string, number> = {};
  for (const pv of pageViews) {
    if (pv.userId) {
      userSessionCounts[pv.userId] = (userSessionCounts[pv.userId] || 0) + 1;
    }
  }

  const newUsers = Object.values(userSessionCounts).filter(count => count === 1).length;
  const returningUsers = users.size - newUsers;

  return {
    totalSessions: sessions.size,
    uniqueUsers: users.size,
    newUsers,
    returningUsers,
    userRetention: users.size > 0 ? returningUsers / users.size : 0,
  };
}

/**
 * Calculate performance metrics
 */
export function calculatePerformanceMetrics(events: AnalyticsEvent[]): {
  avgPageLoadTime: number;
  avgTimeToInteractive: number;
  errorRate: number;
  topErrors: Array<{ message: string; count: number }>;
} {
  const performanceEvents = events.filter(e => e.category === 'performance');
  const errorEvents = events.filter(e => e.category === 'error');

  // Calculate average load times
  const loadTimeEvents = performanceEvents.filter(e => e.action === 'page_load');
  const avgPageLoadTime = loadTimeEvents.length > 0
    ? loadTimeEvents.reduce((sum, e) => sum + (e.value || 0), 0) / loadTimeEvents.length
    : 0;

  const ttiEvents = performanceEvents.filter(e => e.action === 'time_to_interactive');
  const avgTimeToInteractive = ttiEvents.length > 0
    ? ttiEvents.reduce((sum, e) => sum + (e.value || 0), 0) / ttiEvents.length
    : 0;

  // Calculate error rate
  const errorRate = events.length > 0 ? errorEvents.length / events.length : 0;

  // Get top errors
  const errorCounts: Record<string, number> = {};
  for (const error of errorEvents) {
    const message = error.label || 'Unknown error';
    errorCounts[message] = (errorCounts[message] || 0) + 1;
  }

  const topErrors = Object.entries(errorCounts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    avgPageLoadTime,
    avgTimeToInteractive,
    errorRate,
    topErrors,
  };
}

// =============================================================================
// Main Metrics Summary
// =============================================================================

/**
 * Generate comprehensive metrics summary
 */
export function generateMetricsSummary(
  store: AnalyticsStore,
  options: {
    start?: Date;
    end?: Date;
    granularity?: 'hour' | 'day' | 'week' | 'month';
  } = {}
): MetricsSummary {
  const end = options.end || new Date();
  const start = options.start || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000); // Default 7 days
  const granularity = options.granularity || 'day';

  // Filter by time range
  const pageViews = filterByTimeRange(store.pageViews, start, end);
  const events = filterByTimeRange(store.events, start, end);
  const conversions = filterByTimeRange(store.conversions, start, end);

  const uniquePageViews = new Set(
    pageViews.map(pv => `${pv.sessionId}_${pv.path}`)
  ).size;

  return {
    period: {
      start: start.toISOString(),
      end: end.toISOString(),
      granularity,
    },
    pageViews: {
      total: pageViews.length,
      unique: uniquePageViews,
      byPath: aggregatePageViews(pageViews),
      topPages: getTopPages(pageViews),
      avgSessionDuration: calculateAvgSessionDuration(pageViews),
      bounceRate: calculateBounceRate(pageViews),
    },
    events: {
      total: events.length,
      byCategory: aggregateEventsByCategory(events),
      topEvents: getTopEvents(events),
    },
    conversions: {
      total: conversions.length,
      totalValue: conversions.reduce((sum, c) => sum + c.value, 0),
      byType: aggregateConversionsByType(conversions),
      funnelAnalysis: analyzeFunnel(conversions),
      conversionRate: calculateConversionRate(pageViews, conversions),
    },
    users: calculateUserMetrics(pageViews),
    performance: calculatePerformanceMetrics(events),
  };
}

// =============================================================================
// Trend Analysis
// =============================================================================

/**
 * Calculate trends by comparing current period to previous
 */
export function calculateTrends(
  currentSummary: MetricsSummary,
  previousSummary: MetricsSummary
): TrendData[] {
  const trends: TrendData[] = [];

  // Page views trend
  const pvChange = previousSummary.pageViews.total > 0
    ? ((currentSummary.pageViews.total - previousSummary.pageViews.total) / previousSummary.pageViews.total) * 100
    : 0;
  trends.push({
    metric: 'Page Views',
    direction: pvChange > 0 ? 'up' : pvChange < 0 ? 'down' : 'stable',
    percentageChange: Math.round(pvChange * 10) / 10,
    comparison: 'previous_period',
  });

  // Conversion rate trend
  const crChange = previousSummary.conversions.conversionRate > 0
    ? ((currentSummary.conversions.conversionRate - previousSummary.conversions.conversionRate) / previousSummary.conversions.conversionRate) * 100
    : 0;
  trends.push({
    metric: 'Conversion Rate',
    direction: crChange > 0 ? 'up' : crChange < 0 ? 'down' : 'stable',
    percentageChange: Math.round(crChange * 10) / 10,
    comparison: 'previous_period',
  });

  // Session duration trend
  const sdChange = previousSummary.pageViews.avgSessionDuration > 0
    ? ((currentSummary.pageViews.avgSessionDuration - previousSummary.pageViews.avgSessionDuration) / previousSummary.pageViews.avgSessionDuration) * 100
    : 0;
  trends.push({
    metric: 'Session Duration',
    direction: sdChange > 0 ? 'up' : sdChange < 0 ? 'down' : 'stable',
    percentageChange: Math.round(sdChange * 10) / 10,
    comparison: 'previous_period',
  });

  // Bounce rate trend (negative is good)
  const brChange = previousSummary.pageViews.bounceRate > 0
    ? ((currentSummary.pageViews.bounceRate - previousSummary.pageViews.bounceRate) / previousSummary.pageViews.bounceRate) * 100
    : 0;
  trends.push({
    metric: 'Bounce Rate',
    direction: brChange < 0 ? 'up' : brChange > 0 ? 'down' : 'stable', // Inverted because lower is better
    percentageChange: Math.round(brChange * 10) / 10,
    comparison: 'previous_period',
  });

  // Unique users trend
  const uuChange = previousSummary.users.uniqueUsers > 0
    ? ((currentSummary.users.uniqueUsers - previousSummary.users.uniqueUsers) / previousSummary.users.uniqueUsers) * 100
    : 0;
  trends.push({
    metric: 'Unique Users',
    direction: uuChange > 0 ? 'up' : uuChange < 0 ? 'down' : 'stable',
    percentageChange: Math.round(uuChange * 10) / 10,
    comparison: 'previous_period',
  });

  return trends;
}

// =============================================================================
// Alerts
// =============================================================================

/**
 * Check for alert conditions and generate alerts
 */
export function checkAlerts(summary: MetricsSummary): AnalyticsAlert[] {
  const alerts: AnalyticsAlert[] = [];
  const now = new Date().toISOString();

  // High bounce rate alert
  if (summary.pageViews.bounceRate > 0.7) {
    alerts.push({
      id: `alert_bounce_${Date.now()}`,
      severity: 'warning',
      title: 'High Bounce Rate',
      message: `Bounce rate is ${Math.round(summary.pageViews.bounceRate * 100)}%, which is above the 70% threshold.`,
      metric: 'bounceRate',
      threshold: 0.7,
      currentValue: summary.pageViews.bounceRate,
      timestamp: now,
    });
  }

  // Low conversion rate alert
  if (summary.conversions.conversionRate < 0.01) {
    alerts.push({
      id: `alert_conversion_${Date.now()}`,
      severity: 'error',
      title: 'Low Conversion Rate',
      message: `Conversion rate is ${Math.round(summary.conversions.conversionRate * 100 * 10) / 10}%, which is below the 1% threshold.`,
      metric: 'conversionRate',
      threshold: 0.01,
      currentValue: summary.conversions.conversionRate,
      timestamp: now,
    });
  }

  // High error rate alert
  if (summary.performance.errorRate > 0.02) {
    alerts.push({
      id: `alert_errors_${Date.now()}`,
      severity: 'error',
      title: 'Elevated Error Rate',
      message: `Error rate is ${Math.round(summary.performance.errorRate * 100 * 10) / 10}%, which is above the 2% threshold.`,
      metric: 'errorRate',
      threshold: 0.02,
      currentValue: summary.performance.errorRate,
      timestamp: now,
    });
  }

  // Slow page load alert
  if (summary.performance.avgPageLoadTime > 4000) {
    alerts.push({
      id: `alert_performance_${Date.now()}`,
      severity: 'warning',
      title: 'Slow Page Load Time',
      message: `Average page load time is ${Math.round(summary.performance.avgPageLoadTime / 100) / 10}s, which is above the 4s threshold.`,
      metric: 'avgPageLoadTime',
      threshold: 4000,
      currentValue: summary.performance.avgPageLoadTime,
      timestamp: now,
    });
  }

  // Traffic drop alert
  if (summary.pageViews.total < 10 && summary.period.granularity === 'day') {
    alerts.push({
      id: `alert_traffic_${Date.now()}`,
      severity: 'info',
      title: 'Low Traffic',
      message: `Only ${summary.pageViews.total} page views recorded. Consider checking tracking implementation.`,
      metric: 'pageViews',
      threshold: 10,
      currentValue: summary.pageViews.total,
      timestamp: now,
    });
  }

  return alerts;
}

// =============================================================================
// Full Insights Generation
// =============================================================================

/**
 * Generate comprehensive insights report
 */
export function generateInsights(
  store: AnalyticsStore,
  options: {
    currentStart?: Date;
    currentEnd?: Date;
    granularity?: 'hour' | 'day' | 'week' | 'month';
  } = {}
) {
  const currentEnd = options.currentEnd || new Date();
  const currentStart = options.currentStart || new Date(currentEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
  const granularity = options.granularity || 'day';

  // Calculate previous period
  const periodLength = currentEnd.getTime() - currentStart.getTime();
  const previousEnd = new Date(currentStart.getTime());
  const previousStart = new Date(previousEnd.getTime() - periodLength);

  // Generate summaries
  const currentSummary = generateMetricsSummary(store, {
    start: currentStart,
    end: currentEnd,
    granularity,
  });

  const previousSummary = generateMetricsSummary(store, {
    start: previousStart,
    end: previousEnd,
    granularity,
  });

  // Generate insights
  const recommendations = generateRecommendations(currentSummary);
  const trends = calculateTrends(currentSummary, previousSummary);
  const alerts = checkAlerts(currentSummary);

  return {
    summary: currentSummary,
    recommendations,
    trends,
    alerts,
  };
}
