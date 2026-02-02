#!/usr/bin/env npx ts-node

/**
 * PoolApp Improvement Checker
 *
 * Reads current metrics, compares to benchmarks, and outputs a prioritized
 * improvement list. Saves results to CURRENT_IMPROVEMENTS.md
 *
 * Usage:
 *   npx ts-node scripts/check-improvements.ts
 *   npx ts-node scripts/check-improvements.ts --output report.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// CONFIGURATION
// =============================================================================

interface Benchmark {
  name: string;
  target: number;
  unit: string;
  isLowerBetter: boolean;
  category: 'engagement' | 'conversion' | 'performance' | 'traffic';
  impact: 'high' | 'medium' | 'low';
}

const BENCHMARKS: Benchmark[] = [
  { name: 'Bounce Rate', target: 50, unit: '%', isLowerBetter: true, category: 'engagement', impact: 'high' },
  { name: 'Avg Session Duration', target: 120, unit: 's', isLowerBetter: false, category: 'engagement', impact: 'high' },
  { name: 'Pages Per Session', target: 2, unit: '', isLowerBetter: false, category: 'engagement', impact: 'medium' },
  { name: 'Demo Request Rate', target: 3, unit: '%', isLowerBetter: false, category: 'conversion', impact: 'high' },
  { name: 'Pricing Page Conversion', target: 5, unit: '%', isLowerBetter: false, category: 'conversion', impact: 'high' },
  { name: 'Page Load Time', target: 2, unit: 's', isLowerBetter: true, category: 'performance', impact: 'high' },
  { name: 'Mobile Traffic Share', target: 40, unit: '%', isLowerBetter: false, category: 'traffic', impact: 'medium' },
  { name: 'Organic Traffic Share', target: 40, unit: '%', isLowerBetter: false, category: 'traffic', impact: 'medium' },
  { name: 'Return Visitor Rate', target: 20, unit: '%', isLowerBetter: false, category: 'engagement', impact: 'medium' },
  { name: 'Exit Rate (Pricing)', target: 30, unit: '%', isLowerBetter: true, category: 'conversion', impact: 'high' },
];

const IMPROVEMENT_STRATEGIES: Record<string, string[]> = {
  'Bounce Rate': [
    'Add compelling hero section with clear value proposition',
    'Implement sticky header with navigation',
    'Add social proof above the fold',
    'Reduce page load time below 2 seconds',
    'Ensure mobile responsiveness is perfect',
    'Add exit-intent popup with lead magnet',
    'Test different headlines with A/B testing',
    'Add video content explaining core value',
  ],
  'Avg Session Duration': [
    'Add interactive ROI calculator',
    'Create in-depth feature comparison pages',
    'Add customer success stories with data',
    'Implement product tour or walkthrough',
    'Add FAQ section with expandable answers',
    'Create educational blog content',
    'Add video demos on feature pages',
    'Implement live chat for engagement',
  ],
  'Pages Per Session': [
    'Add related content links on each page',
    'Implement clear navigation breadcrumbs',
    'Add "Next steps" CTAs at page bottoms',
    'Create a logical content journey',
    'Add sticky sidebar navigation',
    'Use internal linking strategy',
    'Add "You might also like" sections',
  ],
  'Demo Request Rate': [
    'Add demo CTA to every page header',
    'Create dedicated demo landing page',
    'Reduce demo form fields to minimum',
    'Add instant demo option (no signup)',
    'Show demo availability/scheduling',
    'Add video preview of demo experience',
    'Use urgency messaging for demos',
    'Add testimonials about demo experience',
  ],
  'Pricing Page Conversion': [
    'Simplify pricing to 3 clear tiers',
    'Highlight "Most Popular" plan',
    'Add feature comparison table',
    'Show annual savings prominently',
    'Add money-back guarantee badge',
    'Include customer logos/trust signals',
    'Add FAQ about pricing/billing',
    'Implement pricing calculator',
  ],
  'Page Load Time': [
    'Optimize and compress all images',
    'Enable lazy loading for images',
    'Minimize JavaScript bundle size',
    'Enable browser caching',
    'Use CDN for static assets',
    'Implement code splitting',
    'Defer non-critical JavaScript',
    'Optimize web fonts loading',
  ],
  'Mobile Traffic Share': [
    'Improve mobile page experience',
    'Create mobile-specific ad campaigns',
    'Optimize for mobile search (local SEO)',
    'Add click-to-call buttons',
    'Test mobile-specific landing pages',
    'Improve mobile form experience',
    'Add mobile app deep links',
  ],
  'Organic Traffic Share': [
    'Create SEO-optimized blog content',
    'Build backlinks through guest posting',
    'Optimize meta titles and descriptions',
    'Create location-specific landing pages',
    'Add structured data markup',
    'Improve internal linking',
    'Create comparison/alternative pages',
    'Target long-tail keywords',
  ],
  'Return Visitor Rate': [
    'Implement email newsletter signup',
    'Create valuable downloadable resources',
    'Add remarketing campaigns',
    'Send personalized follow-up emails',
    'Create members-only content area',
    'Add browser push notifications',
    'Develop loyalty/referral program',
  ],
  'Exit Rate (Pricing)': [
    'Add exit-intent popup with discount',
    'Show comparison with competitors',
    'Add live chat on pricing page',
    'Display trust signals and guarantees',
    'Offer free trial option prominently',
    'Add customer ROI testimonials',
    'Create urgency with limited offers',
  ],
};

// =============================================================================
// DATA TYPES
// =============================================================================

interface MetricData {
  name: string;
  currentValue: number;
  target: number;
  unit: string;
  status: 'exceeds' | 'meets' | 'below' | 'critical';
  gap: number;
  gapPercent: number;
}

interface Improvement {
  metric: string;
  priority: 1 | 2 | 3 | 4 | 5;
  impact: 'high' | 'medium' | 'low';
  category: string;
  currentValue: number;
  targetValue: number;
  gap: string;
  strategies: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
}

interface ImprovementReport {
  generatedAt: string;
  overallScore: number;
  metricsAnalyzed: number;
  needsImprovement: number;
  critical: number;
  improvements: Improvement[];
  quickWins: Improvement[];
  longTermInitiatives: Improvement[];
}

// =============================================================================
// ANALYTICS DATA
// =============================================================================

function readCachedAnalytics(): Record<string, number> | null {
  const cachePath = path.join(__dirname, '../.analytics-cache.json');

  try {
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      return {
        'Bounce Rate': data.metrics?.bounceRate || 55,
        'Avg Session Duration': data.metrics?.avgSessionDuration || 95,
        'Pages Per Session': data.metrics?.pagesPerSession || 1.8,
        'Demo Request Rate': data.metrics?.demoRequestRate || 2.2,
        'Pricing Page Conversion': data.metrics?.pricingPageConversion || 3.5,
        'Page Load Time': data.metrics?.pageLoadTime || 2.5,
        'Mobile Traffic Share': data.metrics?.mobileTrafficShare || 35,
        'Organic Traffic Share': 38, // Simulated
        'Return Visitor Rate': 18, // Simulated
        'Exit Rate (Pricing)': 45, // Simulated
      };
    }
  } catch (error) {
    console.warn('Could not read analytics cache, using defaults');
  }

  return null;
}

function getCurrentMetrics(): Record<string, number> {
  const cached = readCachedAnalytics();

  if (cached) {
    return cached;
  }

  // Default simulated values (realistic for early-stage SaaS)
  return {
    'Bounce Rate': 58,
    'Avg Session Duration': 85,
    'Pages Per Session': 1.6,
    'Demo Request Rate': 1.8,
    'Pricing Page Conversion': 2.8,
    'Page Load Time': 2.8,
    'Mobile Traffic Share': 32,
    'Organic Traffic Share': 35,
    'Return Visitor Rate': 15,
    'Exit Rate (Pricing)': 48,
  };
}

// =============================================================================
// ANALYSIS
// =============================================================================

function analyzeMetric(benchmark: Benchmark, currentValue: number): MetricData {
  const { target, isLowerBetter, name, unit } = benchmark;

  let gap: number;
  let status: MetricData['status'];
  let gapPercent: number;

  if (isLowerBetter) {
    gap = currentValue - target;
    gapPercent = (gap / target) * 100;

    if (currentValue <= target * 0.9) status = 'exceeds';
    else if (currentValue <= target) status = 'meets';
    else if (currentValue <= target * 1.3) status = 'below';
    else status = 'critical';
  } else {
    gap = target - currentValue;
    gapPercent = (gap / target) * 100;

    if (currentValue >= target * 1.1) status = 'exceeds';
    else if (currentValue >= target) status = 'meets';
    else if (currentValue >= target * 0.7) status = 'below';
    else status = 'critical';
  }

  return {
    name,
    currentValue,
    target,
    unit,
    status,
    gap,
    gapPercent,
  };
}

function determineEffort(metric: string): 'low' | 'medium' | 'high' {
  const lowEffort = ['Bounce Rate', 'Pricing Page Conversion', 'Exit Rate (Pricing)'];
  const highEffort = ['Page Load Time', 'Organic Traffic Share', 'Return Visitor Rate'];

  if (lowEffort.includes(metric)) return 'low';
  if (highEffort.includes(metric)) return 'high';
  return 'medium';
}

function calculatePriority(
  status: MetricData['status'],
  impact: 'high' | 'medium' | 'low',
  effort: 'low' | 'medium' | 'high'
): 1 | 2 | 3 | 4 | 5 {
  const impactScore = { high: 3, medium: 2, low: 1 };
  const effortScore = { low: 3, medium: 2, high: 1 }; // Lower effort = higher score
  const statusScore = { critical: 4, below: 2, meets: 0, exceeds: 0 };

  const totalScore = impactScore[impact] + effortScore[effort] + statusScore[status];

  if (totalScore >= 9) return 1;
  if (totalScore >= 7) return 2;
  if (totalScore >= 5) return 3;
  if (totalScore >= 3) return 4;
  return 5;
}

function generateReport(currentMetrics: Record<string, number>): ImprovementReport {
  const improvements: Improvement[] = [];
  let criticalCount = 0;
  let needsImprovementCount = 0;
  let totalScore = 0;

  for (const benchmark of BENCHMARKS) {
    const currentValue = currentMetrics[benchmark.name] ?? 0;
    const analysis = analyzeMetric(benchmark, currentValue);

    // Calculate score contribution
    if (analysis.status === 'exceeds') totalScore += 100;
    else if (analysis.status === 'meets') totalScore += 80;
    else if (analysis.status === 'below') totalScore += 50;
    else totalScore += 20;

    // Track counts
    if (analysis.status === 'critical') criticalCount++;
    if (analysis.status === 'below' || analysis.status === 'critical') {
      needsImprovementCount++;

      const effort = determineEffort(benchmark.name);
      const priority = calculatePriority(analysis.status, benchmark.impact, effort);

      const strategies = IMPROVEMENT_STRATEGIES[benchmark.name] || [];

      improvements.push({
        metric: benchmark.name,
        priority,
        impact: benchmark.impact,
        category: benchmark.category,
        currentValue: analysis.currentValue,
        targetValue: benchmark.target,
        gap: `${analysis.gap > 0 ? '+' : ''}${analysis.gap.toFixed(1)}${benchmark.unit}`,
        strategies: strategies.slice(0, 5),
        estimatedEffort: effort,
      });
    }
  }

  // Sort improvements by priority
  improvements.sort((a, b) => a.priority - b.priority);

  // Categorize improvements
  const quickWins = improvements.filter(i => i.estimatedEffort === 'low' && i.impact !== 'low');
  const longTermInitiatives = improvements.filter(i => i.estimatedEffort === 'high');

  return {
    generatedAt: new Date().toISOString(),
    overallScore: Math.round(totalScore / BENCHMARKS.length),
    metricsAnalyzed: BENCHMARKS.length,
    needsImprovement: needsImprovementCount,
    critical: criticalCount,
    improvements,
    quickWins,
    longTermInitiatives,
  };
}

// =============================================================================
// OUTPUT GENERATION
// =============================================================================

function generateMarkdown(report: ImprovementReport): string {
  const lines: string[] = [];

  lines.push('# PoolApp Current Improvements');
  lines.push('');
  lines.push(`> Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Overall Health Score | ${report.overallScore}/100 |`);
  lines.push(`| Metrics Analyzed | ${report.metricsAnalyzed} |`);
  lines.push(`| Needs Improvement | ${report.needsImprovement} |`);
  lines.push(`| Critical Issues | ${report.critical} |`);
  lines.push('');

  // Quick Wins
  if (report.quickWins.length > 0) {
    lines.push('## Quick Wins (Low Effort, High Impact)');
    lines.push('');
    lines.push('These improvements can be implemented quickly and will have immediate impact:');
    lines.push('');

    for (const improvement of report.quickWins) {
      lines.push(`### ${improvement.metric}`);
      lines.push('');
      lines.push(`- **Current**: ${improvement.currentValue}${getUnit(improvement.metric)}`);
      lines.push(`- **Target**: ${improvement.targetValue}${getUnit(improvement.metric)}`);
      lines.push(`- **Gap**: ${improvement.gap}`);
      lines.push(`- **Priority**: P${improvement.priority}`);
      lines.push('');
      lines.push('**Action Items:**');
      improvement.strategies.forEach(s => lines.push(`- [ ] ${s}`));
      lines.push('');
    }
  }

  // All Improvements by Priority
  lines.push('## All Improvements by Priority');
  lines.push('');

  const priorities = [1, 2, 3, 4, 5] as const;
  for (const p of priorities) {
    const prioImprovements = report.improvements.filter(i => i.priority === p);
    if (prioImprovements.length === 0) continue;

    lines.push(`### Priority ${p} ${getPriorityLabel(p)}`);
    lines.push('');

    for (const improvement of prioImprovements) {
      const statusEmoji = improvement.impact === 'high' ? '[!]' : improvement.impact === 'medium' ? '[~]' : '[-]';
      lines.push(`#### ${statusEmoji} ${improvement.metric}`);
      lines.push('');
      lines.push(`| Property | Value |`);
      lines.push(`|----------|-------|`);
      lines.push(`| Category | ${improvement.category} |`);
      lines.push(`| Current | ${improvement.currentValue}${getUnit(improvement.metric)} |`);
      lines.push(`| Target | ${improvement.targetValue}${getUnit(improvement.metric)} |`);
      lines.push(`| Gap | ${improvement.gap} |`);
      lines.push(`| Effort | ${improvement.estimatedEffort} |`);
      lines.push(`| Impact | ${improvement.impact} |`);
      lines.push('');
      lines.push('**Recommended Actions:**');
      lines.push('');
      improvement.strategies.forEach((s, i) => {
        lines.push(`${i + 1}. [ ] ${s}`);
      });
      lines.push('');
    }
  }

  // Long-term Initiatives
  if (report.longTermInitiatives.length > 0) {
    lines.push('## Long-term Initiatives');
    lines.push('');
    lines.push('These improvements require more effort but will have lasting impact:');
    lines.push('');

    for (const improvement of report.longTermInitiatives) {
      lines.push(`### ${improvement.metric}`);
      lines.push('');
      lines.push(`- **Current**: ${improvement.currentValue}${getUnit(improvement.metric)}`);
      lines.push(`- **Target**: ${improvement.targetValue}${getUnit(improvement.metric)}`);
      lines.push(`- **Gap**: ${improvement.gap}`);
      lines.push(`- **Estimated Effort**: High`);
      lines.push('');
      lines.push('**Strategy:**');
      improvement.strategies.forEach(s => lines.push(`- ${s}`));
      lines.push('');
    }
  }

  // Implementation Notes
  lines.push('## Implementation Notes');
  lines.push('');
  lines.push('### For Claude Code Sessions');
  lines.push('');
  lines.push('When implementing these improvements:');
  lines.push('');
  lines.push('1. Start with Quick Wins for immediate impact');
  lines.push('2. Focus on one Priority 1 item at a time');
  lines.push('3. Run `npm run analytics:check` after changes');
  lines.push('4. Commit improvements incrementally');
  lines.push('5. Document changes in git commit messages');
  lines.push('');
  lines.push('### Commands');
  lines.push('');
  lines.push('```bash');
  lines.push('# Check current improvement status');
  lines.push('npm run analytics:check');
  lines.push('');
  lines.push('# Monitor analytics continuously');
  lines.push('npm run analytics:monitor');
  lines.push('');
  lines.push('# Generate weekly report');
  lines.push('npm run analytics:report');
  lines.push('```');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*This file is auto-generated. Do not edit manually.*');

  return lines.join('\n');
}

function getUnit(metric: string): string {
  const benchmark = BENCHMARKS.find(b => b.name === metric);
  return benchmark?.unit || '';
}

function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1: return '(Critical - Do Now)';
    case 2: return '(High - This Week)';
    case 3: return '(Medium - This Sprint)';
    case 4: return '(Low - Backlog)';
    case 5: return '(Nice to Have)';
    default: return '';
  }
}

function printConsoleReport(report: ImprovementReport): void {
  console.log('\n='.repeat(70));
  console.log('  POOLAPP IMPROVEMENT CHECK');
  console.log('='.repeat(70));
  console.log('');
  console.log(`  Overall Score: ${report.overallScore}/100`);
  console.log(`  Metrics Analyzed: ${report.metricsAnalyzed}`);
  console.log(`  Needs Improvement: ${report.needsImprovement}`);
  console.log(`  Critical Issues: ${report.critical}`);
  console.log('');

  if (report.quickWins.length > 0) {
    console.log('-'.repeat(70));
    console.log('  QUICK WINS');
    console.log('-'.repeat(70));
    report.quickWins.forEach(i => {
      console.log(`  [P${i.priority}] ${i.metric}: ${i.currentValue} -> ${i.targetValue} (${i.gap})`);
    });
    console.log('');
  }

  console.log('-'.repeat(70));
  console.log('  ALL IMPROVEMENTS BY PRIORITY');
  console.log('-'.repeat(70));

  report.improvements.forEach(i => {
    const impact = i.impact === 'high' ? '[!]' : i.impact === 'medium' ? '[~]' : '[-]';
    console.log(`  P${i.priority} ${impact} ${i.metric.padEnd(25)} ${String(i.currentValue).padStart(6)} -> ${String(i.targetValue).padStart(6)}`);
  });

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
PoolApp Improvement Checker

Usage:
  npx ts-node scripts/check-improvements.ts [options]

Options:
  --output, -o <file>  Output file (default: CURRENT_IMPROVEMENTS.md)
  --help, -h           Show this help message

Examples:
  npx ts-node scripts/check-improvements.ts
  npx ts-node scripts/check-improvements.ts -o custom-report.md
`);
    return;
  }

  console.log('Analyzing current metrics...\n');

  // Get current metrics
  const currentMetrics = getCurrentMetrics();

  // Generate report
  const report = generateReport(currentMetrics);

  // Print to console
  printConsoleReport(report);

  // Save to file
  const outputPath = outputFile
    ? path.resolve(outputFile)
    : path.join(__dirname, '..', 'CURRENT_IMPROVEMENTS.md');

  const markdown = generateMarkdown(report);
  fs.writeFileSync(outputPath, markdown);

  console.log(`Report saved to: ${outputPath}`);
}

main().catch(console.error);
