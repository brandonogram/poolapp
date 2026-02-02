/**
 * Automated Improvement Loop System
 *
 * Core logic for continuous website performance analysis and improvement suggestions.
 * Fetches metrics, analyzes patterns, and generates prioritized recommendations.
 */

import { RulesEngine, ImprovementRule, RuleResult } from './rules-engine';
import { ABTestingEngine, ABTest } from './ab-testing';

// ============================================================================
// Types
// ============================================================================

export interface AnalyticsMetrics {
  // Traffic metrics
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  avgSessionDuration: number; // seconds

  // Engagement metrics
  bounceRate: number; // 0-100
  pagesPerSession: number;
  scrollDepth: number; // 0-100 average

  // Conversion metrics
  conversionRate: number; // 0-100
  goalCompletions: number;
  signups: number;

  // Device breakdown
  deviceBreakdown: {
    desktop: number; // percentage
    mobile: number;
    tablet: number;
  };

  // Page-level metrics
  pageMetrics: PageMetric[];

  // Traffic sources
  trafficSources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    paid: number;
  };

  // Timestamp
  collectedAt: Date;
  periodStart: Date;
  periodEnd: Date;
}

export interface PageMetric {
  path: string;
  pageViews: number;
  uniquePageViews: number;
  avgTimeOnPage: number; // seconds
  bounceRate: number;
  exitRate: number;
  entrances: number;
  exits: number;
}

export interface ImprovementSuggestion {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'conversion' | 'engagement' | 'ux' | 'content' | 'technical' | 'mobile';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  metrics: {
    current: number;
    benchmark: number;
    unit: string;
  };
  actionItems: string[];
  suggestedABTest?: {
    name: string;
    hypothesis: string;
    variants: string[];
  };
  createdAt: Date;
  status: 'new' | 'acknowledged' | 'in_progress' | 'implemented' | 'dismissed';
}

export interface AnalysisResult {
  metrics: AnalyticsMetrics;
  suggestions: ImprovementSuggestion[];
  ruleResults: RuleResult[];
  activeTests: ABTest[];
  summary: AnalysisSummary;
  generatedAt: Date;
}

export interface AnalysisSummary {
  overallScore: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  topIssues: string[];
  quickWins: string[];
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

// ============================================================================
// Analytics Fetchers
// ============================================================================

/**
 * Fetch metrics from Vercel Analytics API
 * Note: Requires VERCEL_ANALYTICS_TOKEN environment variable
 */
export async function fetchVercelAnalytics(
  projectId: string,
  from: Date,
  to: Date
): Promise<Partial<AnalyticsMetrics>> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;

  if (!token) {
    console.warn('VERCEL_ANALYTICS_TOKEN not set, using mock data');
    return getMockMetrics();
  }

  try {
    // Vercel Analytics API endpoints
    const baseUrl = 'https://api.vercel.com/v1/analytics';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const params = new URLSearchParams({
      projectId,
      from: from.toISOString(),
      to: to.toISOString(),
    });

    // Fetch page views
    const pageViewsRes = await fetch(`${baseUrl}/page-views?${params}`, { headers });
    const pageViewsData = await pageViewsRes.json();

    // Fetch visitors
    const visitorsRes = await fetch(`${baseUrl}/visitors?${params}`, { headers });
    const visitorsData = await visitorsRes.json();

    return {
      pageViews: pageViewsData.total || 0,
      uniqueVisitors: visitorsData.total || 0,
      collectedAt: new Date(),
      periodStart: from,
      periodEnd: to,
    };
  } catch (error) {
    console.error('Error fetching Vercel Analytics:', error);
    return getMockMetrics();
  }
}

/**
 * Fetch metrics from Google Analytics 4
 * Note: Requires GA4_PROPERTY_ID and GOOGLE_ANALYTICS_CREDENTIALS environment variables
 */
export async function fetchGoogleAnalytics(
  propertyId: string,
  from: Date,
  to: Date
): Promise<Partial<AnalyticsMetrics>> {
  // GA4 Data API integration placeholder
  // In production, use @google-analytics/data package

  console.log('Google Analytics integration placeholder');
  return {};
}

/**
 * Aggregate metrics from multiple sources
 */
export async function aggregateMetrics(
  sources: Array<() => Promise<Partial<AnalyticsMetrics>>>
): Promise<AnalyticsMetrics> {
  const results = await Promise.all(sources.map(fn => fn().catch(() => ({} as Partial<AnalyticsMetrics>))));

  // Start with mock/baseline metrics
  const baseline = getMockMetrics();

  // Merge all results
  const merged = results.reduce<AnalyticsMetrics>((acc, result) => {
    const partialResult = result as Partial<AnalyticsMetrics>;
    return {
      ...acc,
      ...partialResult,
      // Deep merge for nested objects
      deviceBreakdown: {
        ...(acc.deviceBreakdown || {}),
        ...(partialResult.deviceBreakdown || {}),
      },
      trafficSources: {
        ...(acc.trafficSources || {}),
        ...(partialResult.trafficSources || {}),
      },
      pageMetrics: [
        ...(acc.pageMetrics || []),
        ...(partialResult.pageMetrics || []),
      ],
    } as AnalyticsMetrics;
  }, baseline);

  return merged;
}

// ============================================================================
// Analysis Engine
// ============================================================================

export class ImprovementLoopEngine {
  private rulesEngine: RulesEngine;
  private abTestingEngine: ABTestingEngine;
  private historicalData: AnalyticsMetrics[] = [];

  constructor() {
    this.rulesEngine = new RulesEngine();
    this.abTestingEngine = new ABTestingEngine();
  }

  /**
   * Run full analysis cycle
   */
  async runAnalysis(metrics: AnalyticsMetrics): Promise<AnalysisResult> {
    // Store for historical comparison
    this.historicalData.push(metrics);

    // Run rules engine
    const ruleResults = this.rulesEngine.evaluate(metrics);

    // Generate suggestions from rule results
    const suggestions = this.generateSuggestions(ruleResults, metrics);

    // Get active A/B tests
    const activeTests = this.abTestingEngine.getActiveTests();

    // Generate summary
    const summary = this.generateSummary(suggestions, metrics);

    return {
      metrics,
      suggestions,
      ruleResults,
      activeTests,
      summary,
      generatedAt: new Date(),
    };
  }

  /**
   * Generate improvement suggestions from rule results
   */
  private generateSuggestions(
    ruleResults: RuleResult[],
    metrics: AnalyticsMetrics
  ): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    for (const result of ruleResults) {
      if (result.triggered) {
        suggestions.push({
          id: `${result.ruleId}-${Date.now()}`,
          priority: this.mapPriority(result.priority),
          category: result.category as ImprovementSuggestion['category'],
          title: result.title,
          description: result.description,
          impact: result.impact,
          effort: result.effort,
          metrics: result.metrics,
          actionItems: result.actions,
          suggestedABTest: result.suggestedTest,
          createdAt: new Date(),
          status: 'new',
        });
      }
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions;
  }

  private mapPriority(priority: number): ImprovementSuggestion['priority'] {
    if (priority >= 90) return 'critical';
    if (priority >= 70) return 'high';
    if (priority >= 40) return 'medium';
    return 'low';
  }

  /**
   * Generate analysis summary
   */
  private generateSummary(
    suggestions: ImprovementSuggestion[],
    metrics: AnalyticsMetrics
  ): AnalysisSummary {
    const criticalCount = suggestions.filter(s => s.priority === 'critical').length;
    const highCount = suggestions.filter(s => s.priority === 'high').length;
    const mediumCount = suggestions.filter(s => s.priority === 'medium').length;
    const lowCount = suggestions.filter(s => s.priority === 'low').length;

    // Calculate overall score (simple heuristic)
    let score = 100;
    score -= criticalCount * 15;
    score -= highCount * 8;
    score -= mediumCount * 3;
    score -= lowCount * 1;
    score = Math.max(0, Math.min(100, score));

    // Determine trend from historical data
    const trend = this.calculateTrend();

    // Extract top issues (critical + high priority)
    const topIssues = suggestions
      .filter(s => s.priority === 'critical' || s.priority === 'high')
      .slice(0, 3)
      .map(s => s.title);

    // Find quick wins (low effort, high impact)
    const quickWins = suggestions
      .filter(s => s.effort === 'low' && (s.priority === 'high' || s.priority === 'medium'))
      .slice(0, 3)
      .map(s => s.title);

    return {
      overallScore: score,
      trend,
      topIssues,
      quickWins,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
    };
  }

  private calculateTrend(): 'improving' | 'stable' | 'declining' {
    if (this.historicalData.length < 2) return 'stable';

    const recent = this.historicalData.slice(-7);
    if (recent.length < 2) return 'stable';

    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const avgFirst = firstHalf.reduce((sum, m) => sum + m.conversionRate, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, m) => sum + m.conversionRate, 0) / secondHalf.length;

    const change = ((avgSecond - avgFirst) / avgFirst) * 100;

    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  }

  /**
   * Get historical data for reporting
   */
  getHistoricalData(): AnalyticsMetrics[] {
    return this.historicalData;
  }

  /**
   * Load historical data (e.g., from database)
   */
  loadHistoricalData(data: AnalyticsMetrics[]): void {
    this.historicalData = data;
  }
}

// ============================================================================
// Mock Data (for development/testing)
// ============================================================================

function getMockMetrics(): AnalyticsMetrics {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    pageViews: 12500,
    uniqueVisitors: 4200,
    sessions: 5800,
    avgSessionDuration: 185,
    bounceRate: 52,
    pagesPerSession: 3.2,
    scrollDepth: 68,
    conversionRate: 2.8,
    goalCompletions: 162,
    signups: 89,
    deviceBreakdown: {
      desktop: 45,
      mobile: 48,
      tablet: 7,
    },
    pageMetrics: [
      {
        path: '/',
        pageViews: 4500,
        uniquePageViews: 3200,
        avgTimeOnPage: 45,
        bounceRate: 48,
        exitRate: 25,
        entrances: 2800,
        exits: 1125,
      },
      {
        path: '/pricing',
        pageViews: 2100,
        uniquePageViews: 1800,
        avgTimeOnPage: 120,
        bounceRate: 35,
        exitRate: 42,
        entrances: 450,
        exits: 882,
      },
      {
        path: '/features',
        pageViews: 1800,
        uniquePageViews: 1500,
        avgTimeOnPage: 90,
        bounceRate: 40,
        exitRate: 30,
        entrances: 380,
        exits: 540,
      },
      {
        path: '/demo',
        pageViews: 950,
        uniquePageViews: 820,
        avgTimeOnPage: 180,
        bounceRate: 25,
        exitRate: 55,
        entrances: 200,
        exits: 522,
      },
      {
        path: '/contact',
        pageViews: 680,
        uniquePageViews: 580,
        avgTimeOnPage: 60,
        bounceRate: 45,
        exitRate: 65,
        entrances: 150,
        exits: 442,
      },
    ],
    trafficSources: {
      organic: 35,
      direct: 28,
      referral: 18,
      social: 12,
      paid: 7,
    },
    collectedAt: now,
    periodStart: weekAgo,
    periodEnd: now,
  };
}

// ============================================================================
// Singleton Instance
// ============================================================================

let engineInstance: ImprovementLoopEngine | null = null;

export function getImprovementEngine(): ImprovementLoopEngine {
  if (!engineInstance) {
    engineInstance = new ImprovementLoopEngine();
  }
  return engineInstance;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format suggestion for display
 */
export function formatSuggestion(suggestion: ImprovementSuggestion): string {
  const priorityEmoji = {
    critical: '[!]',
    high: '[H]',
    medium: '[M]',
    low: '[L]',
  };

  return `${priorityEmoji[suggestion.priority]} ${suggestion.title}
  Category: ${suggestion.category}
  Impact: ${suggestion.impact}
  Effort: ${suggestion.effort}

  ${suggestion.description}

  Action Items:
  ${suggestion.actionItems.map(a => `  - ${a}`).join('\n')}

  Current: ${suggestion.metrics.current}${suggestion.metrics.unit} | Benchmark: ${suggestion.metrics.benchmark}${suggestion.metrics.unit}
`;
}

/**
 * Export suggestions to markdown format
 */
export function suggestionsToMarkdown(suggestions: ImprovementSuggestion[]): string {
  const sections = {
    critical: suggestions.filter(s => s.priority === 'critical'),
    high: suggestions.filter(s => s.priority === 'high'),
    medium: suggestions.filter(s => s.priority === 'medium'),
    low: suggestions.filter(s => s.priority === 'low'),
  };

  let md = `# Improvement Suggestions\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `---\n\n`;

  for (const [priority, items] of Object.entries(sections)) {
    if (items.length === 0) continue;

    md += `## ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority\n\n`;

    for (const item of items) {
      md += `### ${item.title}\n\n`;
      md += `**Category:** ${item.category} | **Effort:** ${item.effort}\n\n`;
      md += `${item.description}\n\n`;
      md += `**Impact:** ${item.impact}\n\n`;
      md += `**Current Metric:** ${item.metrics.current}${item.metrics.unit} (Benchmark: ${item.metrics.benchmark}${item.metrics.unit})\n\n`;
      md += `**Action Items:**\n`;
      for (const action of item.actionItems) {
        md += `- [ ] ${action}\n`;
      }
      if (item.suggestedABTest) {
        md += `\n**Suggested A/B Test:**\n`;
        md += `- Name: ${item.suggestedABTest.name}\n`;
        md += `- Hypothesis: ${item.suggestedABTest.hypothesis}\n`;
        md += `- Variants: ${item.suggestedABTest.variants.join(', ')}\n`;
      }
      md += `\n---\n\n`;
    }
  }

  return md;
}
