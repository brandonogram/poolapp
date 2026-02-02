/**
 * Pool App - Analytics Improvements Database
 * Logic for suggesting improvements based on metrics and A/B test tracking
 */

import type {
  MetricsSummary,
  Recommendation,
  RecommendationType,
  ABTest,
  ABTestVariant,
  AnalyticsId,
} from './types';

// =============================================================================
// Improvement Templates
// =============================================================================

interface ImprovementTemplate {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  actions: string[];
  relatedPages: string[];
  condition: (metrics: MetricsSummary) => boolean;
  priority: (metrics: MetricsSummary) => 'critical' | 'high' | 'medium' | 'low';
  getMetrics: (metrics: MetricsSummary) => { current: number; target: number; unit: string };
}

/** Database of potential improvements */
export const improvementTemplates: ImprovementTemplate[] = [
  // Conversion Optimization
  {
    id: 'high-bounce-rate',
    type: 'conversion_optimization',
    title: 'High Bounce Rate on Landing Page',
    description: 'The landing page has a bounce rate above 60%, indicating visitors leave without exploring further.',
    impact: 'Reducing bounce rate by 10% could increase conversions by 15-20%',
    effort: 'medium',
    actions: [
      'Add a compelling above-the-fold value proposition',
      'Include social proof (testimonials, customer logos)',
      'Add a clear primary CTA button',
      'Optimize page load speed',
      'Test different hero images or headlines',
    ],
    relatedPages: ['/', '/convention'],
    condition: (m) => m.pageViews.bounceRate > 0.6,
    priority: (m) => (m.pageViews.bounceRate > 0.75 ? 'critical' : 'high'),
    getMetrics: (m) => ({
      current: Math.round(m.pageViews.bounceRate * 100),
      target: 45,
      unit: '% bounce rate',
    }),
  },
  {
    id: 'low-trial-conversion',
    type: 'conversion_optimization',
    title: 'Low Trial Signup Conversion Rate',
    description: 'The visitor-to-trial conversion rate is below 3%, indicating friction in the signup process.',
    impact: 'Improving trial conversion by 1% could add 50+ new trials per month',
    effort: 'medium',
    actions: [
      'Simplify the signup form (reduce fields)',
      'Add a progress indicator for multi-step signup',
      'Offer a quick demo video before signup',
      'Add trust badges and security indicators',
      'Test social login options (Google, Apple)',
    ],
    relatedPages: ['/convention', '/onboarding', '/login'],
    condition: (m) => m.conversions.conversionRate < 0.03,
    priority: (m) => (m.conversions.conversionRate < 0.01 ? 'critical' : 'high'),
    getMetrics: (m) => ({
      current: Math.round(m.conversions.conversionRate * 100 * 10) / 10,
      target: 5,
      unit: '% conversion rate',
    }),
  },

  // Engagement Improvements
  {
    id: 'low-session-duration',
    type: 'engagement_improvement',
    title: 'Low Average Session Duration',
    description: 'Users spend less than 2 minutes on average, suggesting lack of engagement.',
    impact: 'Increasing session duration correlates with 25% higher conversion rates',
    effort: 'medium',
    actions: [
      'Add interactive elements (calculators, demos)',
      'Improve content quality and relevance',
      'Add related content recommendations',
      'Implement progressive disclosure for complex features',
      'Add engaging visuals and animations',
    ],
    relatedPages: ['/dashboard', '/schedule', '/customers'],
    condition: (m) => m.pageViews.avgSessionDuration < 120000, // 2 minutes
    priority: (m) => (m.pageViews.avgSessionDuration < 60000 ? 'high' : 'medium'),
    getMetrics: (m) => ({
      current: Math.round(m.pageViews.avgSessionDuration / 1000),
      target: 180,
      unit: 'seconds avg session',
    }),
  },
  {
    id: 'low-page-depth',
    type: 'engagement_improvement',
    title: 'Low Pages Per Session',
    description: 'Users view an average of less than 3 pages per session.',
    impact: 'Users who view 5+ pages are 3x more likely to convert',
    effort: 'low',
    actions: [
      'Improve internal linking between pages',
      'Add "Related Features" sections',
      'Implement breadcrumb navigation',
      'Add a featured content carousel',
      'Improve navigation menu clarity',
    ],
    relatedPages: ['/'],
    condition: (m) => (m.pageViews.total / m.users.totalSessions) < 3,
    priority: () => 'medium',
    getMetrics: (m) => ({
      current: Math.round((m.pageViews.total / m.users.totalSessions) * 10) / 10,
      target: 5,
      unit: 'pages per session',
    }),
  },

  // Performance Fixes
  {
    id: 'slow-page-load',
    type: 'performance_fix',
    title: 'Slow Page Load Time',
    description: 'Average page load time exceeds 3 seconds, impacting user experience.',
    impact: 'Every 1 second delay reduces conversions by 7%',
    effort: 'high',
    actions: [
      'Optimize and compress images',
      'Implement lazy loading for below-fold content',
      'Enable browser caching',
      'Minify CSS and JavaScript',
      'Use a CDN for static assets',
      'Review and optimize third-party scripts',
    ],
    relatedPages: ['/', '/dashboard'],
    condition: (m) => m.performance.avgPageLoadTime > 3000,
    priority: (m) => (m.performance.avgPageLoadTime > 5000 ? 'critical' : 'high'),
    getMetrics: (m) => ({
      current: Math.round(m.performance.avgPageLoadTime / 100) / 10,
      target: 2,
      unit: 'seconds load time',
    }),
  },
  {
    id: 'high-error-rate',
    type: 'error_resolution',
    title: 'Elevated JavaScript Error Rate',
    description: 'Error rate is above 1%, indicating stability issues.',
    impact: 'Reducing errors improves user trust and completion rates',
    effort: 'medium',
    actions: [
      'Review error logs and prioritize by frequency',
      'Add error boundaries for React components',
      'Implement better null/undefined checking',
      'Add input validation',
      'Set up error monitoring alerts',
    ],
    relatedPages: [],
    condition: (m) => m.performance.errorRate > 0.01,
    priority: (m) => (m.performance.errorRate > 0.05 ? 'critical' : 'high'),
    getMetrics: (m) => ({
      current: Math.round(m.performance.errorRate * 100 * 10) / 10,
      target: 0.5,
      unit: '% error rate',
    }),
  },

  // Feature Adoption
  {
    id: 'low-feature-adoption',
    type: 'feature_adoption',
    title: 'Low Adoption of Key Features',
    description: 'Core features like route optimization and invoicing are underutilized.',
    impact: 'Users who adopt 3+ features have 80% higher retention',
    effort: 'medium',
    actions: [
      'Add feature discovery tooltips',
      'Create feature highlight tours',
      'Send feature announcement emails',
      'Add "Did you know?" prompts',
      'Improve feature visibility in navigation',
    ],
    relatedPages: ['/routes', '/invoices', '/schedule'],
    condition: (m) => {
      const featureEvents = m.events.byCategory.feature_usage || 0;
      return featureEvents < m.users.uniqueUsers * 2;
    },
    priority: () => 'medium',
    getMetrics: (m) => ({
      current: Math.round((m.events.byCategory.feature_usage || 0) / Math.max(m.users.uniqueUsers, 1)),
      target: 5,
      unit: 'features used per user',
    }),
  },

  // UX Enhancements
  {
    id: 'form-abandonment',
    type: 'ux_enhancement',
    title: 'High Form Abandonment Rate',
    description: 'Many users start forms but do not complete them.',
    impact: 'Reducing form abandonment by 20% could double form submissions',
    effort: 'low',
    actions: [
      'Reduce number of required fields',
      'Add inline validation',
      'Show progress for multi-step forms',
      'Save form progress automatically',
      'Add helpful placeholder text',
    ],
    relatedPages: ['/onboarding/setup', '/customers'],
    condition: (m) => {
      const formEvents = m.events.byCategory.form || 0;
      return formEvents > 0 && m.conversions.funnelAnalysis.some(f => f.dropOffRate > 0.4);
    },
    priority: () => 'high',
    getMetrics: () => ({
      current: 40,
      target: 20,
      unit: '% form abandonment',
    }),
  },

  // Onboarding
  {
    id: 'incomplete-onboarding',
    type: 'ux_enhancement',
    title: 'Low Onboarding Completion Rate',
    description: 'Many users do not complete the onboarding flow.',
    impact: 'Users who complete onboarding have 5x higher 30-day retention',
    effort: 'medium',
    actions: [
      'Shorten the onboarding flow',
      'Add a skip option with easy return',
      'Show clear progress indicators',
      'Celebrate milestones with micro-animations',
      'Send reminder emails for incomplete onboarding',
    ],
    relatedPages: ['/onboarding', '/welcome', '/setup'],
    condition: (m) => {
      const onboardingEvents = m.events.byCategory.onboarding || 0;
      const completedOnboarding = m.conversions.byType.onboarding_completed || 0;
      return onboardingEvents > 0 && completedOnboarding / onboardingEvents < 0.5;
    },
    priority: () => 'high',
    getMetrics: (m) => ({
      current: Math.round(((m.conversions.byType.onboarding_completed || 0) / Math.max(m.events.byCategory.onboarding || 1, 1)) * 100),
      target: 80,
      unit: '% onboarding completion',
    }),
  },

  // Content Updates
  {
    id: 'outdated-content',
    type: 'content_update',
    title: 'Low Engagement on Key Content Pages',
    description: 'Certain pages have low scroll depth and high bounce rates.',
    impact: 'Refreshing content can increase engagement by 40%',
    effort: 'low',
    actions: [
      'Update outdated information',
      'Add more visual content',
      'Break up long text blocks',
      'Add clear headings and subheadings',
      'Include customer success stories',
    ],
    relatedPages: [],
    condition: (m) => {
      const lowEngagementPages = m.pageViews.topPages.filter(
        p => p.avgDuration < 30000 && p.views > 10
      );
      return lowEngagementPages.length > 0;
    },
    priority: () => 'low',
    getMetrics: (m) => ({
      current: m.pageViews.topPages.filter(p => p.avgDuration < 30000).length,
      target: 0,
      unit: 'low-engagement pages',
    }),
  },
];

// =============================================================================
// Suggestion Logic
// =============================================================================

/**
 * Generate recommendations based on current metrics
 */
export function generateRecommendations(metrics: MetricsSummary): Recommendation[] {
  const now = new Date().toISOString();
  const recommendations: Recommendation[] = [];

  for (const template of improvementTemplates) {
    try {
      if (template.condition(metrics)) {
        const recommendation: Recommendation = {
          id: `rec_${template.id}_${Date.now()}`,
          type: template.type,
          priority: template.priority(metrics),
          title: template.title,
          description: template.description,
          impact: template.impact,
          effort: template.effort,
          metrics: template.getMetrics(metrics),
          actions: template.actions,
          relatedPages: template.relatedPages,
          status: 'new',
          createdAt: now,
          updatedAt: now,
        };
        recommendations.push(recommendation);
      }
    } catch (error) {
      // Skip templates that throw errors due to missing data
      console.warn(`Error evaluating template ${template.id}:`, error);
    }
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

/**
 * Get improvement template by ID
 */
export function getImprovementTemplate(id: string): ImprovementTemplate | undefined {
  return improvementTemplates.find(t => t.id === id);
}

// =============================================================================
// A/B Test Management
// =============================================================================

/**
 * Create a new A/B test
 */
export function createABTest(params: {
  name: string;
  description: string;
  targetPath: string;
  variants: Array<{ name: string; description: string; weight: number }>;
  primaryMetric: string;
  sampleSize: number;
  targetAudience?: string;
}): ABTest {
  const now = new Date().toISOString();

  const variants: ABTestVariant[] = params.variants.map((v, index) => ({
    id: `variant_${index}_${Date.now()}`,
    name: v.name,
    description: v.description,
    weight: v.weight,
    conversions: 0,
    views: 0,
    conversionRate: 0,
  }));

  return {
    id: `test_${Date.now()}` as AnalyticsId,
    name: params.name,
    description: params.description,
    status: 'draft',
    variants,
    targetPath: params.targetPath,
    targetAudience: params.targetAudience || null,
    startDate: now,
    endDate: null,
    primaryMetric: params.primaryMetric,
    sampleSize: params.sampleSize,
    currentSampleSize: 0,
    winner: null,
    statisticalSignificance: null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Assign a user to an A/B test variant
 */
export function assignVariant(test: ABTest, userId: string): ABTestVariant | null {
  if (test.status !== 'running') {
    return null;
  }

  // Simple deterministic assignment based on userId
  const hash = userId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  const normalizedHash = Math.abs(hash % 100);

  let cumulativeWeight = 0;
  for (const variant of test.variants) {
    cumulativeWeight += variant.weight;
    if (normalizedHash < cumulativeWeight) {
      return variant;
    }
  }

  return test.variants[0] || null;
}

/**
 * Record a view for an A/B test variant
 */
export function recordVariantView(test: ABTest, variantId: string): ABTest {
  const updatedVariants = test.variants.map(v => {
    if (v.id === variantId) {
      const views = v.views + 1;
      return {
        ...v,
        views,
        conversionRate: v.conversions / views,
      };
    }
    return v;
  });

  return {
    ...test,
    variants: updatedVariants,
    currentSampleSize: test.currentSampleSize + 1,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Record a conversion for an A/B test variant
 */
export function recordVariantConversion(test: ABTest, variantId: string): ABTest {
  const updatedVariants = test.variants.map(v => {
    if (v.id === variantId) {
      const conversions = v.conversions + 1;
      return {
        ...v,
        conversions,
        conversionRate: conversions / v.views,
      };
    }
    return v;
  });

  return {
    ...test,
    variants: updatedVariants,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate statistical significance of A/B test results
 * Uses simplified chi-square approximation
 */
export function calculateSignificance(test: ABTest): number {
  if (test.variants.length < 2) return 0;

  const control = test.variants[0];
  const variant = test.variants[1];

  if (control.views < 100 || variant.views < 100) {
    return 0; // Not enough data
  }

  // Simplified z-test for proportions
  const p1 = control.conversions / control.views;
  const p2 = variant.conversions / variant.views;
  const pPooled = (control.conversions + variant.conversions) / (control.views + variant.views);

  const se = Math.sqrt(pPooled * (1 - pPooled) * (1/control.views + 1/variant.views));

  if (se === 0) return 0;

  const z = Math.abs(p1 - p2) / se;

  // Convert z-score to approximate confidence level
  if (z >= 2.576) return 0.99;
  if (z >= 1.96) return 0.95;
  if (z >= 1.645) return 0.90;
  if (z >= 1.282) return 0.80;

  return Math.min(0.79, z / 2);
}

/**
 * Determine if an A/B test has a winner
 */
export function determineWinner(test: ABTest): ABTest {
  const significance = calculateSignificance(test);

  if (significance < 0.95 || test.currentSampleSize < test.sampleSize) {
    return {
      ...test,
      statisticalSignificance: significance,
    };
  }

  // Find the variant with the highest conversion rate
  const sortedVariants = [...test.variants].sort((a, b) => b.conversionRate - a.conversionRate);
  const winner = sortedVariants[0];

  return {
    ...test,
    winner: winner.id,
    statisticalSignificance: significance,
    status: 'completed',
    endDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// Suggested A/B Tests Based on Recommendations
// =============================================================================

/**
 * Generate suggested A/B tests based on recommendations
 */
export function suggestABTests(recommendations: Recommendation[]): Array<{
  name: string;
  description: string;
  recommendation: Recommendation;
  hypothesis: string;
}> {
  const suggestions: Array<{
    name: string;
    description: string;
    recommendation: Recommendation;
    hypothesis: string;
  }> = [];

  for (const rec of recommendations) {
    if (rec.type === 'conversion_optimization' || rec.type === 'ux_enhancement') {
      suggestions.push({
        name: `Test: ${rec.title}`,
        description: `A/B test to address: ${rec.description}`,
        recommendation: rec,
        hypothesis: `Implementing the suggested changes will improve ${rec.metrics.unit} from ${rec.metrics.current} to ${rec.metrics.target}`,
      });
    }
  }

  return suggestions;
}
