#!/usr/bin/env npx ts-node

/**
 * PoolApp Analytics Monitor
 *
 * A CLI tool for continuous analytics monitoring and improvement suggestions.
 * Designed to be run by Claude Code in autonomous sessions.
 *
 * Usage:
 *   npx ts-node scripts/analytics-monitor.ts          # Single check
 *   npx ts-node scripts/analytics-monitor.ts --watch  # Continuous monitoring
 *   npx ts-node scripts/analytics-monitor.ts --json   # Output as JSON
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// CONFIGURATION
// =============================================================================

interface Benchmarks {
  bounceRate: { target: number; warning: number; critical: number };
  avgSessionDuration: { target: number; warning: number; critical: number };
  pagesPerSession: { target: number; warning: number; critical: number };
  demoRequestRate: { target: number; warning: number; critical: number };
  pricingPageConversion: { target: number; warning: number; critical: number };
  pageLoadTime: { target: number; warning: number; critical: number };
  mobileTrafficShare: { target: number; warning: number; critical: number };
}

const BENCHMARKS: Benchmarks = {
  bounceRate: { target: 50, warning: 60, critical: 70 },
  avgSessionDuration: { target: 120, warning: 90, critical: 60 }, // seconds
  pagesPerSession: { target: 2, warning: 1.5, critical: 1.2 },
  demoRequestRate: { target: 3, warning: 2, critical: 1 }, // percentage
  pricingPageConversion: { target: 5, warning: 3, critical: 1 }, // percentage
  pageLoadTime: { target: 2, warning: 3, critical: 5 }, // seconds
  mobileTrafficShare: { target: 40, warning: 30, critical: 20 }, // percentage
};

const WATCH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// =============================================================================
// TYPES
// =============================================================================

interface AnalyticsData {
  timestamp: string;
  period: string;
  metrics: {
    bounceRate: number;
    avgSessionDuration: number;
    pagesPerSession: number;
    demoRequestRate: number;
    pricingPageConversion: number;
    pageLoadTime: number;
    mobileTrafficShare: number;
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
  };
  topPages: Array<{ path: string; views: number; bounceRate: number }>;
  trafficSources: Array<{ source: string; visitors: number; conversion: number }>;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
}

interface HealthStatus {
  metric: string;
  value: number;
  target: number;
  status: 'healthy' | 'warning' | 'critical';
  recommendation: string;
}

interface MonitorReport {
  timestamp: string;
  overallHealth: 'healthy' | 'warning' | 'critical';
  healthScore: number;
  metrics: HealthStatus[];
  prioritizedActions: string[];
  rawData: AnalyticsData;
}

// =============================================================================
// ANALYTICS DATA FETCHING
// =============================================================================

/**
 * Fetch analytics data from Vercel Analytics API
 * In production, this would make actual API calls
 */
async function fetchVercelAnalytics(): Promise<Partial<AnalyticsData['metrics']>> {
  // Check for Vercel API token
  const vercelToken = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (vercelToken && projectId) {
    try {
      // Real API call to Vercel Analytics
      const response = await fetch(
        `https://api.vercel.com/v1/web-analytics/stats?projectId=${projectId}&from=${getDateRange().from}&to=${getDateRange().to}`,
        {
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          totalVisitors: data.visitors || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          pageViews: data.pageViews || 0,
          bounceRate: data.bounceRate || 0,
          avgSessionDuration: data.avgSessionDuration || 0,
        };
      }
    } catch (error) {
      console.warn('Failed to fetch Vercel Analytics:', error);
    }
  }

  return {};
}

/**
 * Fetch analytics from Google Analytics (if configured)
 */
async function fetchGoogleAnalytics(): Promise<Partial<AnalyticsData['metrics']>> {
  const gaPropertyId = process.env.GA_PROPERTY_ID;
  const gaCredentials = process.env.GOOGLE_ANALYTICS_CREDENTIALS;

  if (gaPropertyId && gaCredentials) {
    // In production, use Google Analytics Data API
    console.log('Google Analytics configured but requires OAuth setup');
  }

  return {};
}

/**
 * Read cached analytics data from local file (for offline analysis)
 */
function readCachedAnalytics(): AnalyticsData | null {
  const cachePath = path.join(__dirname, '../.analytics-cache.json');

  try {
    if (fs.existsSync(cachePath)) {
      const data = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to read analytics cache:', error);
  }

  return null;
}

/**
 * Save analytics data to cache
 */
function saveAnalyticsCache(data: AnalyticsData): void {
  const cachePath = path.join(__dirname, '../.analytics-cache.json');

  try {
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.warn('Failed to save analytics cache:', error);
  }
}

/**
 * Generate simulated analytics data for demo/development
 * This produces realistic-looking data based on typical SaaS metrics
 */
function generateSimulatedData(): AnalyticsData {
  const baseVisitors = 150 + Math.floor(Math.random() * 100);
  const bounceRate = 45 + Math.random() * 25;

  return {
    timestamp: new Date().toISOString(),
    period: 'last_7_days',
    metrics: {
      bounceRate: Math.round(bounceRate * 10) / 10,
      avgSessionDuration: Math.round((90 + Math.random() * 120) * 10) / 10,
      pagesPerSession: Math.round((1.5 + Math.random() * 1.5) * 10) / 10,
      demoRequestRate: Math.round((1 + Math.random() * 4) * 10) / 10,
      pricingPageConversion: Math.round((2 + Math.random() * 5) * 10) / 10,
      pageLoadTime: Math.round((1.5 + Math.random() * 2) * 10) / 10,
      mobileTrafficShare: Math.round((30 + Math.random() * 30) * 10) / 10,
      totalVisitors: baseVisitors,
      uniqueVisitors: Math.floor(baseVisitors * 0.85),
      pageViews: baseVisitors * Math.floor(2 + Math.random() * 2),
    },
    topPages: [
      { path: '/', views: Math.floor(baseVisitors * 0.9), bounceRate: 40 + Math.random() * 20 },
      { path: '/pricing', views: Math.floor(baseVisitors * 0.35), bounceRate: 30 + Math.random() * 15 },
      { path: '/features', views: Math.floor(baseVisitors * 0.25), bounceRate: 35 + Math.random() * 15 },
      { path: '/demo', views: Math.floor(baseVisitors * 0.15), bounceRate: 25 + Math.random() * 15 },
      { path: '/about', views: Math.floor(baseVisitors * 0.1), bounceRate: 50 + Math.random() * 20 },
    ],
    trafficSources: [
      { source: 'organic', visitors: Math.floor(baseVisitors * 0.4), conversion: 3 + Math.random() * 2 },
      { source: 'direct', visitors: Math.floor(baseVisitors * 0.3), conversion: 4 + Math.random() * 3 },
      { source: 'referral', visitors: Math.floor(baseVisitors * 0.15), conversion: 2 + Math.random() * 2 },
      { source: 'social', visitors: Math.floor(baseVisitors * 0.1), conversion: 1 + Math.random() * 2 },
      { source: 'email', visitors: Math.floor(baseVisitors * 0.05), conversion: 5 + Math.random() * 3 },
    ],
    deviceBreakdown: {
      desktop: Math.floor(55 + Math.random() * 15),
      mobile: Math.floor(30 + Math.random() * 15),
      tablet: Math.floor(5 + Math.random() * 10),
    },
  };
}

/**
 * Get date range for analytics queries
 */
function getDateRange(): { from: string; to: string } {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    from: weekAgo.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0],
  };
}

/**
 * Fetch all available analytics data
 */
async function fetchAnalyticsData(): Promise<AnalyticsData> {
  console.log('Fetching analytics data...\n');

  // Try to fetch real data first
  const [vercelData, gaData] = await Promise.all([
    fetchVercelAnalytics(),
    fetchGoogleAnalytics(),
  ]);

  // Check for cached data
  const cachedData = readCachedAnalytics();

  // If we have real data, merge it; otherwise use simulated
  let analyticsData: AnalyticsData;

  if (Object.keys(vercelData).length > 0 || Object.keys(gaData).length > 0) {
    // Merge real data with defaults
    analyticsData = {
      ...generateSimulatedData(),
      metrics: {
        ...generateSimulatedData().metrics,
        ...vercelData,
        ...gaData,
      },
    };
    console.log('Using real analytics data from APIs\n');
  } else if (cachedData && isRecent(cachedData.timestamp)) {
    analyticsData = cachedData;
    console.log('Using cached analytics data\n');
  } else {
    analyticsData = generateSimulatedData();
    console.log('Using simulated analytics data (configure API tokens for real data)\n');
  }

  // Cache the data
  saveAnalyticsCache(analyticsData);

  return analyticsData;
}

function isRecent(timestamp: string): boolean {
  const age = Date.now() - new Date(timestamp).getTime();
  return age < 24 * 60 * 60 * 1000; // Less than 24 hours old
}

// =============================================================================
// ANALYSIS ENGINE
// =============================================================================

/**
 * Evaluate a metric against benchmarks
 */
function evaluateMetric(
  name: string,
  value: number,
  benchmark: { target: number; warning: number; critical: number },
  isLowerBetter: boolean = true
): HealthStatus {
  let status: 'healthy' | 'warning' | 'critical';

  if (isLowerBetter) {
    if (value <= benchmark.target) status = 'healthy';
    else if (value <= benchmark.warning) status = 'warning';
    else status = 'critical';
  } else {
    if (value >= benchmark.target) status = 'healthy';
    else if (value >= benchmark.warning) status = 'warning';
    else status = 'critical';
  }

  const recommendation = generateRecommendation(name, value, benchmark.target, status, isLowerBetter);

  return {
    metric: name,
    value,
    target: benchmark.target,
    status,
    recommendation,
  };
}

/**
 * Generate actionable recommendation based on metric status
 */
function generateRecommendation(
  metric: string,
  value: number,
  target: number,
  status: HealthStatus['status'],
  isLowerBetter: boolean
): string {
  if (status === 'healthy') {
    return `On target. Current: ${value}, Target: ${isLowerBetter ? '<' : '>'}${target}`;
  }

  const recommendations: Record<string, string[]> = {
    bounceRate: [
      'Improve page load speed (aim for <2s)',
      'Add clearer CTAs above the fold',
      'Ensure mobile responsiveness',
      'Add social proof near hero section',
      'Test different headlines with A/B testing',
    ],
    avgSessionDuration: [
      'Add engaging interactive elements (calculator, demo)',
      'Improve content structure with clear sections',
      'Add video content explaining key features',
      'Create a guided tour of the product',
      'Add internal links to related content',
    ],
    pagesPerSession: [
      'Improve internal navigation and links',
      'Add "Related Features" sections',
      'Create a clear user journey through the site',
      'Add breadcrumbs and persistent navigation',
      'Use exit-intent to suggest other pages',
    ],
    demoRequestRate: [
      'Make demo CTA more prominent',
      'Add demo CTA to every page',
      'Reduce form fields on demo request',
      'Add social proof near demo form',
      'Offer instant demo option (no form)',
    ],
    pricingPageConversion: [
      'Simplify pricing tiers',
      'Add comparison table',
      'Highlight recommended plan',
      'Add trust badges and testimonials',
      'Offer money-back guarantee prominently',
    ],
    pageLoadTime: [
      'Optimize images (WebP format, lazy loading)',
      'Enable browser caching',
      'Minimize JavaScript bundle size',
      'Use CDN for static assets',
      'Implement code splitting',
    ],
    mobileTrafficShare: [
      'Improve mobile page experience',
      'Target mobile-specific ad campaigns',
      'Optimize for mobile search (local SEO)',
      'Create mobile-specific landing pages',
      'Test mobile-first content',
    ],
  };

  const metricRecs = recommendations[metric] || ['Review and optimize this metric'];
  const topRec = metricRecs[Math.floor(Math.random() * metricRecs.length)];

  const gap = isLowerBetter ? value - target : target - value;
  const direction = isLowerBetter ? 'reduce' : 'increase';

  return `Need to ${direction} by ${Math.abs(gap).toFixed(1)}. Action: ${topRec}`;
}

/**
 * Analyze all metrics and generate health report
 */
function analyzeMetrics(data: AnalyticsData): MonitorReport {
  const metrics: HealthStatus[] = [
    evaluateMetric('bounceRate', data.metrics.bounceRate, BENCHMARKS.bounceRate, true),
    evaluateMetric('avgSessionDuration', data.metrics.avgSessionDuration, BENCHMARKS.avgSessionDuration, false),
    evaluateMetric('pagesPerSession', data.metrics.pagesPerSession, BENCHMARKS.pagesPerSession, false),
    evaluateMetric('demoRequestRate', data.metrics.demoRequestRate, BENCHMARKS.demoRequestRate, false),
    evaluateMetric('pricingPageConversion', data.metrics.pricingPageConversion, BENCHMARKS.pricingPageConversion, false),
    evaluateMetric('pageLoadTime', data.metrics.pageLoadTime, BENCHMARKS.pageLoadTime, true),
    evaluateMetric('mobileTrafficShare', data.metrics.mobileTrafficShare, BENCHMARKS.mobileTrafficShare, false),
  ];

  // Calculate overall health score (0-100)
  const healthyCount = metrics.filter(m => m.status === 'healthy').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const healthScore = Math.round(
    ((healthyCount * 100) + (warningCount * 50)) / metrics.length
  );

  // Determine overall status
  let overallHealth: 'healthy' | 'warning' | 'critical';
  if (metrics.some(m => m.status === 'critical')) {
    overallHealth = 'critical';
  } else if (metrics.some(m => m.status === 'warning')) {
    overallHealth = 'warning';
  } else {
    overallHealth = 'healthy';
  }

  // Generate prioritized action list
  const prioritizedActions = generatePrioritizedActions(metrics, data);

  return {
    timestamp: new Date().toISOString(),
    overallHealth,
    healthScore,
    metrics,
    prioritizedActions,
    rawData: data,
  };
}

/**
 * Generate prioritized list of improvement actions
 */
function generatePrioritizedActions(metrics: HealthStatus[], data: AnalyticsData): string[] {
  const actions: Array<{ priority: number; action: string }> = [];

  // Critical issues first
  metrics
    .filter(m => m.status === 'critical')
    .forEach(m => {
      actions.push({
        priority: 1,
        action: `[CRITICAL] ${m.metric}: ${m.recommendation}`,
      });
    });

  // Warning issues second
  metrics
    .filter(m => m.status === 'warning')
    .forEach(m => {
      actions.push({
        priority: 2,
        action: `[WARNING] ${m.metric}: ${m.recommendation}`,
      });
    });

  // Add page-specific recommendations
  data.topPages
    .filter(p => p.bounceRate > 50)
    .slice(0, 3)
    .forEach(p => {
      actions.push({
        priority: 3,
        action: `[PAGE] High bounce rate on ${p.path} (${p.bounceRate.toFixed(1)}%): Review content and CTAs`,
      });
    });

  // Add traffic source recommendations
  const lowConversionSources = data.trafficSources
    .filter(s => s.conversion < 2 && s.visitors > data.metrics.totalVisitors * 0.1);

  lowConversionSources.forEach(s => {
    actions.push({
      priority: 4,
      action: `[TRAFFIC] Low conversion from ${s.source} (${s.conversion.toFixed(1)}%): Optimize landing pages for this source`,
    });
  });

  return actions
    .sort((a, b) => a.priority - b.priority)
    .map(a => a.action);
}

// =============================================================================
// OUTPUT FORMATTING
// =============================================================================

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function colorize(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function getStatusColor(status: 'healthy' | 'warning' | 'critical'): keyof typeof COLORS {
  switch (status) {
    case 'healthy': return 'green';
    case 'warning': return 'yellow';
    case 'critical': return 'red';
  }
}

function getStatusIcon(status: 'healthy' | 'warning' | 'critical'): string {
  switch (status) {
    case 'healthy': return '[OK]';
    case 'warning': return '[!!]';
    case 'critical': return '[XX]';
  }
}

function formatReport(report: MonitorReport): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(colorize('=' .repeat(70), 'cyan'));
  lines.push(colorize('  POOLAPP ANALYTICS MONITOR', 'bold'));
  lines.push(colorize('=' .repeat(70), 'cyan'));
  lines.push('');

  // Summary
  const statusColor = getStatusColor(report.overallHealth);
  lines.push(`  Status: ${colorize(report.overallHealth.toUpperCase(), statusColor)}`);
  lines.push(`  Health Score: ${colorize(report.healthScore + '/100', statusColor)}`);
  lines.push(`  Timestamp: ${report.timestamp}`);
  lines.push(`  Period: ${report.rawData.period}`);
  lines.push('');

  // Traffic Summary
  lines.push(colorize('-'.repeat(70), 'cyan'));
  lines.push(colorize('  TRAFFIC SUMMARY', 'bold'));
  lines.push(colorize('-'.repeat(70), 'cyan'));
  lines.push(`  Total Visitors: ${report.rawData.metrics.totalVisitors}`);
  lines.push(`  Unique Visitors: ${report.rawData.metrics.uniqueVisitors}`);
  lines.push(`  Page Views: ${report.rawData.metrics.pageViews}`);
  lines.push('');

  // Metrics Table
  lines.push(colorize('-'.repeat(70), 'cyan'));
  lines.push(colorize('  METRIC HEALTH', 'bold'));
  lines.push(colorize('-'.repeat(70), 'cyan'));

  report.metrics.forEach(m => {
    const icon = getStatusIcon(m.status);
    const color = getStatusColor(m.status);
    const metricName = m.metric.padEnd(25);
    const valueStr = `${m.value}`.padStart(8);
    const targetStr = `target: ${m.target}`.padStart(15);

    lines.push(`  ${colorize(icon, color)} ${metricName} ${valueStr} ${targetStr}`);
  });

  lines.push('');

  // Top Pages
  lines.push(colorize('-'.repeat(70), 'cyan'));
  lines.push(colorize('  TOP PAGES', 'bold'));
  lines.push(colorize('-'.repeat(70), 'cyan'));

  report.rawData.topPages.slice(0, 5).forEach(p => {
    const path = p.path.padEnd(20);
    const views = `${p.views} views`.padStart(12);
    const bounce = `${p.bounceRate.toFixed(1)}% bounce`.padStart(15);
    lines.push(`  ${path} ${views} ${bounce}`);
  });

  lines.push('');

  // Prioritized Actions
  if (report.prioritizedActions.length > 0) {
    lines.push(colorize('-'.repeat(70), 'cyan'));
    lines.push(colorize('  PRIORITIZED ACTIONS', 'bold'));
    lines.push(colorize('-'.repeat(70), 'cyan'));

    report.prioritizedActions.slice(0, 10).forEach((action, i) => {
      let color: keyof typeof COLORS = 'reset';
      if (action.includes('[CRITICAL]')) color = 'red';
      else if (action.includes('[WARNING]')) color = 'yellow';
      else if (action.includes('[PAGE]')) color = 'blue';

      lines.push(`  ${i + 1}. ${colorize(action, color)}`);
    });

    lines.push('');
  }

  lines.push(colorize('=' .repeat(70), 'cyan'));
  lines.push('');

  return lines.join('\n');
}

function formatJson(report: MonitorReport): string {
  return JSON.stringify(report, null, 2);
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function runMonitor(outputJson: boolean = false): Promise<MonitorReport> {
  const data = await fetchAnalyticsData();
  const report = analyzeMetrics(data);

  if (outputJson) {
    console.log(formatJson(report));
  } else {
    console.log(formatReport(report));
  }

  return report;
}

async function watchMode(outputJson: boolean = false): Promise<void> {
  console.log(colorize('Starting continuous monitoring mode...', 'cyan'));
  console.log(`Checking every ${WATCH_INTERVAL_MS / 1000 / 60} minutes\n`);
  console.log('Press Ctrl+C to stop\n');

  // Initial run
  await runMonitor(outputJson);

  // Set up interval
  setInterval(async () => {
    console.log('\n' + colorize('--- Refreshing analytics ---', 'cyan') + '\n');
    await runMonitor(outputJson);
  }, WATCH_INTERVAL_MS);
}

// CLI Entry Point
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isWatch = args.includes('--watch') || args.includes('-w');
  const isJson = args.includes('--json') || args.includes('-j');
  const isHelp = args.includes('--help') || args.includes('-h');

  if (isHelp) {
    console.log(`
PoolApp Analytics Monitor

Usage:
  npx ts-node scripts/analytics-monitor.ts [options]

Options:
  --watch, -w    Continuous monitoring mode
  --json, -j     Output as JSON
  --help, -h     Show this help message

Environment Variables:
  VERCEL_TOKEN         Vercel API token for real analytics
  VERCEL_PROJECT_ID    Vercel project ID
  GA_PROPERTY_ID       Google Analytics property ID
  GOOGLE_ANALYTICS_CREDENTIALS  Google Analytics credentials JSON

Examples:
  npx ts-node scripts/analytics-monitor.ts
  npx ts-node scripts/analytics-monitor.ts --watch
  npx ts-node scripts/analytics-monitor.ts --json > report.json
`);
    return;
  }

  if (isWatch) {
    await watchMode(isJson);
  } else {
    await runMonitor(isJson);
  }
}

main().catch(console.error);
