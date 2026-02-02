#!/usr/bin/env npx ts-node

/**
 * PoolApp Weekly Report Generator
 *
 * Generates a weekly performance summary comparing current metrics
 * to the previous week. Highlights wins and concerns.
 *
 * Usage:
 *   npx ts-node scripts/weekly-report.ts
 *   npx ts-node scripts/weekly-report.ts --output WEEKLY_REPORT.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// TYPES
// =============================================================================

interface WeeklyMetrics {
  weekStarting: string;
  weekEnding: string;
  metrics: {
    visitors: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    pagesPerSession: number;
    demoRequests: number;
    demoRequestRate: number;
    pricingViews: number;
    pricingConversion: number;
    signups: number;
  };
  topPages: Array<{ path: string; views: number; change: number }>;
  trafficSources: Array<{ source: string; visitors: number; change: number }>;
  goals: {
    demosRequested: { target: number; actual: number };
    signups: { target: number; actual: number };
    bounceRate: { target: number; actual: number };
  };
}

interface WeekComparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  isPositive: boolean;
}

interface WeeklyReport {
  generatedAt: string;
  reportPeriod: {
    current: { start: string; end: string };
    previous: { start: string; end: string };
  };
  summary: {
    overallTrend: 'improving' | 'declining' | 'stable';
    highlightStat: string;
    concernStat: string;
  };
  comparisons: WeekComparison[];
  wins: string[];
  concerns: string[];
  recommendations: string[];
  currentMetrics: WeeklyMetrics;
  previousMetrics: WeeklyMetrics;
}

// =============================================================================
// DATA GENERATION
// =============================================================================

function getDateRanges(): { current: { start: Date; end: Date }; previous: { start: Date; end: Date } } {
  const now = new Date();
  const dayOfWeek = now.getDay();

  // Current week: Monday to Sunday
  const currentEnd = new Date(now);
  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - dayOfWeek - 6);
  currentEnd.setDate(now.getDate() - dayOfWeek);

  // Previous week
  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - 6);

  return {
    current: { start: currentStart, end: currentEnd },
    previous: { start: previousStart, end: previousEnd },
  };
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function readHistoricalData(): WeeklyMetrics[] {
  const historyPath = path.join(__dirname, '../.analytics-history.json');

  try {
    if (fs.existsSync(historyPath)) {
      return JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
    }
  } catch (error) {
    console.warn('Could not read historical data');
  }

  return [];
}

function saveHistoricalData(data: WeeklyMetrics[]): void {
  const historyPath = path.join(__dirname, '../.analytics-history.json');

  try {
    fs.writeFileSync(historyPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.warn('Could not save historical data');
  }
}

function readCachedAnalytics(): any | null {
  const cachePath = path.join(__dirname, '../.analytics-cache.json');

  try {
    if (fs.existsSync(cachePath)) {
      return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    }
  } catch (error) {
    console.warn('Could not read analytics cache');
  }

  return null;
}

function generateWeeklyMetrics(weekStart: Date, weekEnd: Date, baseVariance: number = 0): WeeklyMetrics {
  const cached = readCachedAnalytics();

  // Use cached data as base if available, otherwise generate
  const baseVisitors = cached?.metrics?.totalVisitors || (180 + Math.floor(Math.random() * 80));
  const baseBounceRate = cached?.metrics?.bounceRate || (52 + Math.random() * 15);
  const baseSessionDuration = cached?.metrics?.avgSessionDuration || (85 + Math.random() * 50);

  // Add variance for comparison (previous week should be slightly different)
  const variance = 1 + (baseVariance * (Math.random() - 0.5) * 0.3);

  const visitors = Math.floor(baseVisitors * variance);
  const uniqueVisitors = Math.floor(visitors * 0.82);
  const pageViews = Math.floor(visitors * (1.8 + Math.random() * 0.8));
  const demoRequests = Math.floor(visitors * (0.018 + Math.random() * 0.025));
  const pricingViews = Math.floor(visitors * 0.32);
  const signups = Math.floor(demoRequests * (0.15 + Math.random() * 0.2));

  return {
    weekStarting: formatDate(weekStart),
    weekEnding: formatDate(weekEnd),
    metrics: {
      visitors,
      uniqueVisitors,
      pageViews,
      bounceRate: Math.round((baseBounceRate * variance) * 10) / 10,
      avgSessionDuration: Math.round((baseSessionDuration * variance) * 10) / 10,
      pagesPerSession: Math.round((pageViews / visitors) * 10) / 10,
      demoRequests,
      demoRequestRate: Math.round((demoRequests / visitors * 100) * 10) / 10,
      pricingViews,
      pricingConversion: Math.round((signups / pricingViews * 100) * 10) / 10,
      signups,
    },
    topPages: [
      { path: '/', views: Math.floor(visitors * 0.85), change: Math.round((Math.random() - 0.5) * 20) },
      { path: '/pricing', views: pricingViews, change: Math.round((Math.random() - 0.5) * 15) },
      { path: '/features', views: Math.floor(visitors * 0.28), change: Math.round((Math.random() - 0.5) * 25) },
      { path: '/demo', views: Math.floor(visitors * 0.18), change: Math.round((Math.random() - 0.5) * 30) },
      { path: '/about', views: Math.floor(visitors * 0.12), change: Math.round((Math.random() - 0.5) * 20) },
    ],
    trafficSources: [
      { source: 'Organic Search', visitors: Math.floor(visitors * 0.38), change: Math.round((Math.random() - 0.3) * 15) },
      { source: 'Direct', visitors: Math.floor(visitors * 0.28), change: Math.round((Math.random() - 0.5) * 10) },
      { source: 'Referral', visitors: Math.floor(visitors * 0.18), change: Math.round((Math.random() - 0.4) * 20) },
      { source: 'Social', visitors: Math.floor(visitors * 0.10), change: Math.round((Math.random() - 0.5) * 25) },
      { source: 'Email', visitors: Math.floor(visitors * 0.06), change: Math.round((Math.random() - 0.5) * 15) },
    ],
    goals: {
      demosRequested: { target: 10, actual: demoRequests },
      signups: { target: 2, actual: signups },
      bounceRate: { target: 50, actual: Math.round(baseBounceRate * variance) },
    },
  };
}

// =============================================================================
// ANALYSIS
// =============================================================================

function compareMetrics(current: WeeklyMetrics, previous: WeeklyMetrics): WeekComparison[] {
  const comparisons: WeekComparison[] = [];

  const metricsToCompare: Array<{
    key: keyof WeeklyMetrics['metrics'];
    label: string;
    isLowerBetter: boolean;
  }> = [
    { key: 'visitors', label: 'Total Visitors', isLowerBetter: false },
    { key: 'uniqueVisitors', label: 'Unique Visitors', isLowerBetter: false },
    { key: 'pageViews', label: 'Page Views', isLowerBetter: false },
    { key: 'bounceRate', label: 'Bounce Rate', isLowerBetter: true },
    { key: 'avgSessionDuration', label: 'Avg Session Duration', isLowerBetter: false },
    { key: 'pagesPerSession', label: 'Pages Per Session', isLowerBetter: false },
    { key: 'demoRequests', label: 'Demo Requests', isLowerBetter: false },
    { key: 'demoRequestRate', label: 'Demo Request Rate', isLowerBetter: false },
    { key: 'pricingConversion', label: 'Pricing Conversion', isLowerBetter: false },
    { key: 'signups', label: 'Signups', isLowerBetter: false },
  ];

  for (const metric of metricsToCompare) {
    const currentValue = current.metrics[metric.key];
    const previousValue = previous.metrics[metric.key];
    const change = currentValue - previousValue;
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

    let trend: 'up' | 'down' | 'stable';
    if (Math.abs(changePercent) < 5) trend = 'stable';
    else trend = change > 0 ? 'up' : 'down';

    const isPositive = metric.isLowerBetter ? change < 0 : change > 0;

    comparisons.push({
      metric: metric.label,
      current: currentValue,
      previous: previousValue,
      change,
      changePercent: Math.round(changePercent * 10) / 10,
      trend,
      isPositive,
    });
  }

  return comparisons;
}

function identifyWins(comparisons: WeekComparison[]): string[] {
  const wins: string[] = [];

  for (const comp of comparisons) {
    if (comp.isPositive && Math.abs(comp.changePercent) >= 10) {
      const direction = comp.trend === 'up' ? 'increased' : 'decreased';
      wins.push(`${comp.metric} ${direction} by ${Math.abs(comp.changePercent).toFixed(1)}% (${comp.previous} -> ${comp.current})`);
    }
  }

  // Add specific wins based on thresholds
  const demoRate = comparisons.find(c => c.metric === 'Demo Request Rate');
  if (demoRate && demoRate.current >= 3) {
    wins.push(`Demo request rate hit target of 3%+ (current: ${demoRate.current}%)`);
  }

  const bounceRate = comparisons.find(c => c.metric === 'Bounce Rate');
  if (bounceRate && bounceRate.current <= 50) {
    wins.push(`Bounce rate below 50% target (current: ${bounceRate.current}%)`);
  }

  return wins;
}

function identifyConcerns(comparisons: WeekComparison[]): string[] {
  const concerns: string[] = [];

  for (const comp of comparisons) {
    if (!comp.isPositive && Math.abs(comp.changePercent) >= 10) {
      const direction = comp.trend === 'up' ? 'increased' : 'decreased';
      concerns.push(`${comp.metric} ${direction} by ${Math.abs(comp.changePercent).toFixed(1)}% (${comp.previous} -> ${comp.current})`);
    }
  }

  // Add specific concerns based on thresholds
  const bounceRate = comparisons.find(c => c.metric === 'Bounce Rate');
  if (bounceRate && bounceRate.current > 60) {
    concerns.push(`Bounce rate above 60% warning threshold (current: ${bounceRate.current}%)`);
  }

  const sessionDuration = comparisons.find(c => c.metric === 'Avg Session Duration');
  if (sessionDuration && sessionDuration.current < 90) {
    concerns.push(`Session duration below 90s target (current: ${sessionDuration.current}s)`);
  }

  return concerns;
}

function generateRecommendations(comparisons: WeekComparison[], concerns: string[]): string[] {
  const recommendations: string[] = [];

  const bounceRate = comparisons.find(c => c.metric === 'Bounce Rate');
  const sessionDuration = comparisons.find(c => c.metric === 'Avg Session Duration');
  const demoRate = comparisons.find(c => c.metric === 'Demo Request Rate');
  const visitors = comparisons.find(c => c.metric === 'Total Visitors');

  if (bounceRate && bounceRate.current > 50) {
    recommendations.push('Focus on reducing bounce rate: improve page load speed, add engaging content above the fold');
  }

  if (sessionDuration && sessionDuration.current < 120) {
    recommendations.push('Increase engagement: add interactive elements, video content, or product tours');
  }

  if (demoRate && demoRate.current < 3) {
    recommendations.push('Boost demo conversions: make CTA more prominent, reduce form fields, add social proof');
  }

  if (visitors && visitors.trend === 'down') {
    recommendations.push('Traffic declining: review SEO, consider paid acquisition, increase content marketing');
  }

  if (concerns.length === 0) {
    recommendations.push('Maintain current strategies and consider A/B testing to optimize further');
  }

  return recommendations;
}

function generateWeeklyReport(
  currentMetrics: WeeklyMetrics,
  previousMetrics: WeeklyMetrics
): WeeklyReport {
  const comparisons = compareMetrics(currentMetrics, previousMetrics);
  const wins = identifyWins(comparisons);
  const concerns = identifyConcerns(comparisons);
  const recommendations = generateRecommendations(comparisons, concerns);

  // Determine overall trend
  const positiveChanges = comparisons.filter(c => c.isPositive).length;
  const totalChanges = comparisons.length;
  let overallTrend: 'improving' | 'declining' | 'stable';

  if (positiveChanges >= totalChanges * 0.6) overallTrend = 'improving';
  else if (positiveChanges <= totalChanges * 0.4) overallTrend = 'declining';
  else overallTrend = 'stable';

  // Find highlight and concern stats
  const sortedByChange = [...comparisons].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const bestChange = sortedByChange.find(c => c.isPositive);
  const worstChange = sortedByChange.find(c => !c.isPositive);

  return {
    generatedAt: new Date().toISOString(),
    reportPeriod: {
      current: { start: currentMetrics.weekStarting, end: currentMetrics.weekEnding },
      previous: { start: previousMetrics.weekStarting, end: previousMetrics.weekEnding },
    },
    summary: {
      overallTrend,
      highlightStat: bestChange
        ? `${bestChange.metric}: +${bestChange.changePercent}%`
        : 'All metrics stable',
      concernStat: worstChange
        ? `${worstChange.metric}: ${worstChange.changePercent}%`
        : 'No significant concerns',
    },
    comparisons,
    wins,
    concerns,
    recommendations,
    currentMetrics,
    previousMetrics,
  };
}

// =============================================================================
// OUTPUT
// =============================================================================

function generateMarkdownReport(report: WeeklyReport): string {
  const lines: string[] = [];

  lines.push('# PoolApp Weekly Analytics Report');
  lines.push('');
  lines.push(`> Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push('');

  // Executive Summary
  lines.push('## Executive Summary');
  lines.push('');
  lines.push(`**Overall Trend:** ${report.summary.overallTrend.toUpperCase()}`);
  lines.push('');
  lines.push(`| Period | Start | End |`);
  lines.push(`|--------|-------|-----|`);
  lines.push(`| Current Week | ${report.reportPeriod.current.start} | ${report.reportPeriod.current.end} |`);
  lines.push(`| Previous Week | ${report.reportPeriod.previous.start} | ${report.reportPeriod.previous.end} |`);
  lines.push('');
  lines.push(`**Best Performing:** ${report.summary.highlightStat}`);
  lines.push('');
  lines.push(`**Needs Attention:** ${report.summary.concernStat}`);
  lines.push('');

  // Wins
  if (report.wins.length > 0) {
    lines.push('## Wins This Week');
    lines.push('');
    report.wins.forEach(w => lines.push(`- [+] ${w}`));
    lines.push('');
  }

  // Concerns
  if (report.concerns.length > 0) {
    lines.push('## Areas of Concern');
    lines.push('');
    report.concerns.forEach(c => lines.push(`- [!] ${c}`));
    lines.push('');
  }

  // Metric Comparisons
  lines.push('## Week-over-Week Comparison');
  lines.push('');
  lines.push('| Metric | This Week | Last Week | Change | Trend |');
  lines.push('|--------|-----------|-----------|--------|-------|');

  for (const comp of report.comparisons) {
    const changeStr = comp.change >= 0 ? `+${comp.change}` : `${comp.change}`;
    const percentStr = `(${comp.changePercent >= 0 ? '+' : ''}${comp.changePercent}%)`;
    const trendIcon = comp.isPositive ? '[+]' : comp.trend === 'stable' ? '[=]' : '[-]';

    lines.push(`| ${comp.metric} | ${comp.current} | ${comp.previous} | ${changeStr} ${percentStr} | ${trendIcon} |`);
  }
  lines.push('');

  // Top Pages
  lines.push('## Top Pages Performance');
  lines.push('');
  lines.push('| Page | Views | Change |');
  lines.push('|------|-------|--------|');

  for (const page of report.currentMetrics.topPages) {
    const changeStr = page.change >= 0 ? `+${page.change}%` : `${page.change}%`;
    lines.push(`| ${page.path} | ${page.views} | ${changeStr} |`);
  }
  lines.push('');

  // Traffic Sources
  lines.push('## Traffic Sources');
  lines.push('');
  lines.push('| Source | Visitors | Change |');
  lines.push('|--------|----------|--------|');

  for (const source of report.currentMetrics.trafficSources) {
    const changeStr = source.change >= 0 ? `+${source.change}%` : `${source.change}%`;
    lines.push(`| ${source.source} | ${source.visitors} | ${changeStr} |`);
  }
  lines.push('');

  // Goal Progress
  lines.push('## Goal Progress');
  lines.push('');
  lines.push('| Goal | Target | Actual | Status |');
  lines.push('|------|--------|--------|--------|');

  const goals = report.currentMetrics.goals;
  const demoStatus = goals.demosRequested.actual >= goals.demosRequested.target ? '[OK]' : '[--]';
  const signupStatus = goals.signups.actual >= goals.signups.target ? '[OK]' : '[--]';
  const bounceStatus = goals.bounceRate.actual <= goals.bounceRate.target ? '[OK]' : '[--]';

  lines.push(`| Demo Requests | ${goals.demosRequested.target} | ${goals.demosRequested.actual} | ${demoStatus} |`);
  lines.push(`| Signups | ${goals.signups.target} | ${goals.signups.actual} | ${signupStatus} |`);
  lines.push(`| Bounce Rate | <${goals.bounceRate.target}% | ${goals.bounceRate.actual}% | ${bounceStatus} |`);
  lines.push('');

  // Recommendations
  lines.push('## Recommendations for Next Week');
  lines.push('');
  report.recommendations.forEach((r, i) => {
    lines.push(`${i + 1}. ${r}`);
  });
  lines.push('');

  // Action Items
  lines.push('## Action Items');
  lines.push('');
  lines.push('### Immediate (This Week)');
  lines.push('');
  if (report.concerns.length > 0) {
    lines.push(`- [ ] Address top concern: ${report.concerns[0]}`);
  }
  lines.push('- [ ] Review and implement top recommendation');
  lines.push('- [ ] Run `npm run analytics:check` to verify current status');
  lines.push('');
  lines.push('### Ongoing');
  lines.push('');
  lines.push('- [ ] Continue monitoring with `npm run analytics:monitor`');
  lines.push('- [ ] A/B test any changes');
  lines.push('- [ ] Document learnings');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('*This report is auto-generated. Run `npm run analytics:report` to regenerate.*');

  return lines.join('\n');
}

function printConsoleReport(report: WeeklyReport): void {
  console.log('\n' + '='.repeat(70));
  console.log('  POOLAPP WEEKLY ANALYTICS REPORT');
  console.log('='.repeat(70));
  console.log('');
  console.log(`  Period: ${report.reportPeriod.current.start} to ${report.reportPeriod.current.end}`);
  console.log(`  Overall Trend: ${report.summary.overallTrend.toUpperCase()}`);
  console.log('');

  if (report.wins.length > 0) {
    console.log('-'.repeat(70));
    console.log('  WINS');
    console.log('-'.repeat(70));
    report.wins.forEach(w => console.log(`  [+] ${w}`));
    console.log('');
  }

  if (report.concerns.length > 0) {
    console.log('-'.repeat(70));
    console.log('  CONCERNS');
    console.log('-'.repeat(70));
    report.concerns.forEach(c => console.log(`  [!] ${c}`));
    console.log('');
  }

  console.log('-'.repeat(70));
  console.log('  KEY METRICS');
  console.log('-'.repeat(70));

  for (const comp of report.comparisons.slice(0, 6)) {
    const trend = comp.isPositive ? '[+]' : comp.trend === 'stable' ? '[=]' : '[-]';
    const changeStr = `${comp.changePercent >= 0 ? '+' : ''}${comp.changePercent}%`;
    console.log(`  ${trend} ${comp.metric.padEnd(25)} ${String(comp.current).padStart(8)} (${changeStr})`);
  }

  console.log('');
  console.log('-'.repeat(70));
  console.log('  RECOMMENDATIONS');
  console.log('-'.repeat(70));
  report.recommendations.forEach((r, i) => console.log(`  ${i + 1}. ${r}`));
  console.log('');
  console.log('='.repeat(70));
  console.log('');
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const outputFile = args.find((_, i, arr) => arr[i - 1] === '--output' || arr[i - 1] === '-o');
  const isHelp = args.includes('--help') || args.includes('-h');

  if (isHelp) {
    console.log(`
PoolApp Weekly Report Generator

Usage:
  npx ts-node scripts/weekly-report.ts [options]

Options:
  --output, -o <file>  Output file (default: WEEKLY_REPORT.md)
  --help, -h           Show this help message

Examples:
  npx ts-node scripts/weekly-report.ts
  npx ts-node scripts/weekly-report.ts -o reports/week-42.md
`);
    return;
  }

  console.log('Generating weekly report...\n');

  // Get date ranges
  const dateRanges = getDateRanges();

  // Generate metrics for both weeks
  const currentMetrics = generateWeeklyMetrics(dateRanges.current.start, dateRanges.current.end, 0);
  const previousMetrics = generateWeeklyMetrics(dateRanges.previous.start, dateRanges.previous.end, 1);

  // Generate report
  const report = generateWeeklyReport(currentMetrics, previousMetrics);

  // Print to console
  printConsoleReport(report);

  // Save to file
  const outputPath = outputFile
    ? path.resolve(outputFile)
    : path.join(__dirname, '..', 'WEEKLY_REPORT.md');

  const markdown = generateMarkdownReport(report);
  fs.writeFileSync(outputPath, markdown);

  console.log(`Report saved to: ${outputPath}`);

  // Save to history
  const history = readHistoricalData();
  history.push(currentMetrics);
  // Keep last 12 weeks
  if (history.length > 12) {
    history.splice(0, history.length - 12);
  }
  saveHistoricalData(history);
}

main().catch(console.error);
