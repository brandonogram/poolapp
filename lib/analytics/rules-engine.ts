/**
 * Rules Engine for Automated Improvement Suggestions
 *
 * Defines rules that automatically trigger improvement suggestions based on metrics.
 * Each rule has conditions, actions, priority, and suggested A/B tests.
 */

import { AnalyticsMetrics, PageMetric } from './improvement-loop';

// ============================================================================
// Types
// ============================================================================

export interface ImprovementRule {
  id: string;
  name: string;
  description: string;
  category: 'conversion' | 'engagement' | 'ux' | 'content' | 'technical' | 'mobile';
  condition: (metrics: AnalyticsMetrics) => boolean;
  priority: (metrics: AnalyticsMetrics) => number; // 0-100
  generateResult: (metrics: AnalyticsMetrics) => RuleResult;
  enabled: boolean;
}

export interface RuleResult {
  ruleId: string;
  triggered: boolean;
  priority: number;
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  metrics: {
    current: number;
    benchmark: number;
    unit: string;
  };
  actions: string[];
  suggestedTest?: {
    name: string;
    hypothesis: string;
    variants: string[];
  };
}

// ============================================================================
// Default Rules
// ============================================================================

const defaultRules: ImprovementRule[] = [
  // ---- Bounce Rate Rules ----
  {
    id: 'high-bounce-rate',
    name: 'High Bounce Rate',
    description: 'Triggers when overall bounce rate exceeds 60%',
    category: 'engagement',
    condition: (m) => m.bounceRate > 60,
    priority: (m) => Math.min(100, 50 + (m.bounceRate - 60) * 2),
    enabled: true,
    generateResult: (m) => ({
      ruleId: 'high-bounce-rate',
      triggered: true,
      priority: Math.min(100, 50 + (m.bounceRate - 60) * 2),
      category: 'engagement',
      title: 'High Bounce Rate Detected',
      description: `Your bounce rate of ${m.bounceRate.toFixed(1)}% is above the 60% threshold. Visitors are leaving without engaging.`,
      impact: 'Reducing bounce rate by 10% could increase conversions by 15-20%',
      effort: 'medium',
      metrics: {
        current: m.bounceRate,
        benchmark: 45,
        unit: '%',
      },
      actions: [
        'Review and improve above-the-fold content',
        'Add compelling CTAs visible without scrolling',
        'Improve page load speed (target < 3 seconds)',
        'Ensure content matches visitor expectations from traffic source',
        'Add social proof elements near the top',
      ],
      suggestedTest: {
        name: 'Hero Section CTA Test',
        hypothesis: 'A more prominent CTA button will reduce bounce rate',
        variants: ['Current hero', 'Large CTA button', 'Video background with CTA'],
      },
    }),
  },

  {
    id: 'very-high-bounce-rate',
    name: 'Critical Bounce Rate',
    description: 'Triggers when bounce rate exceeds 75%',
    category: 'engagement',
    condition: (m) => m.bounceRate > 75,
    priority: () => 95,
    enabled: true,
    generateResult: (m) => ({
      ruleId: 'very-high-bounce-rate',
      triggered: true,
      priority: 95,
      category: 'engagement',
      title: 'CRITICAL: Extremely High Bounce Rate',
      description: `Bounce rate of ${m.bounceRate.toFixed(1)}% indicates a serious issue. Most visitors leave immediately.`,
      impact: 'Immediate action required - potential 30%+ conversion loss',
      effort: 'high',
      metrics: {
        current: m.bounceRate,
        benchmark: 45,
        unit: '%',
      },
      actions: [
        'URGENT: Check for broken functionality or errors',
        'Verify page loads correctly on all devices',
        'Review recent changes that may have caused this',
        'Check if traffic source expectations match landing page',
        'Consider a complete landing page redesign',
      ],
    }),
  },

  // ---- Pricing Page Rules ----
  {
    id: 'pricing-page-exits',
    name: 'High Pricing Page Exit Rate',
    description: 'Triggers when pricing page exit rate exceeds 40%',
    category: 'conversion',
    condition: (m) => {
      const pricingPage = m.pageMetrics.find(p => p.path.includes('pricing'));
      return pricingPage ? pricingPage.exitRate > 40 : false;
    },
    priority: (m) => {
      const pricingPage = m.pageMetrics.find(p => p.path.includes('pricing'));
      return pricingPage ? Math.min(100, 60 + (pricingPage.exitRate - 40)) : 0;
    },
    enabled: true,
    generateResult: (m) => {
      const pricingPage = m.pageMetrics.find(p => p.path.includes('pricing'));
      const exitRate = pricingPage?.exitRate || 0;
      return {
        ruleId: 'pricing-page-exits',
        triggered: true,
        priority: Math.min(100, 60 + (exitRate - 40)),
        category: 'conversion',
        title: 'High Exit Rate on Pricing Page',
        description: `${exitRate.toFixed(1)}% of visitors leave from the pricing page. This suggests pricing clarity or value communication issues.`,
        impact: 'Optimizing pricing page could increase trial signups by 20-30%',
        effort: 'medium',
        metrics: {
          current: exitRate,
          benchmark: 30,
          unit: '%',
        },
        actions: [
          'Add FAQ section addressing common pricing questions',
          'Include comparison table with competitors',
          'Add testimonials specific to value/ROI',
          'Simplify pricing tiers if complex',
          'Add money-back guarantee badge',
          'Include "Most Popular" badge on recommended tier',
        ],
        suggestedTest: {
          name: 'Pricing Page Value Prop Test',
          hypothesis: 'Adding ROI calculator will reduce pricing page exits',
          variants: ['Current pricing', 'With ROI calculator', 'With comparison table'],
        },
      };
    },
  },

  // ---- Mobile UX Rules ----
  {
    id: 'mobile-conversion-gap',
    name: 'Mobile Conversion Gap',
    description: 'Triggers when mobile traffic is high but conversions are disproportionately low',
    category: 'mobile',
    condition: (m) => {
      const mobileTraffic = m.deviceBreakdown.mobile;
      // If mobile is >40% of traffic but we're seeing low overall conversion
      // This is a simplified check - in production, track mobile-specific conversion
      return mobileTraffic > 40 && m.conversionRate < 2;
    },
    priority: (m) => {
      const mobileTraffic = m.deviceBreakdown.mobile;
      return Math.min(100, 50 + mobileTraffic - 40);
    },
    enabled: true,
    generateResult: (m) => ({
      ruleId: 'mobile-conversion-gap',
      triggered: true,
      priority: Math.min(100, 50 + m.deviceBreakdown.mobile - 40),
      category: 'mobile',
      title: 'Mobile UX Needs Improvement',
      description: `Mobile traffic is ${m.deviceBreakdown.mobile}% of total but conversion rate is low. Mobile experience may be suboptimal.`,
      impact: 'Mobile optimization could double mobile conversions',
      effort: 'high',
      metrics: {
        current: m.deviceBreakdown.mobile,
        benchmark: 50,
        unit: '% of traffic',
      },
      actions: [
        'Audit mobile form usability - reduce form fields',
        'Ensure CTAs are thumb-friendly (min 44x44px)',
        'Check mobile page load speed (target < 2s on 3G)',
        'Simplify navigation for mobile',
        'Test checkout/signup flow on various devices',
        'Consider mobile-first redesign',
      ],
      suggestedTest: {
        name: 'Mobile CTA Test',
        hypothesis: 'Sticky bottom CTA will increase mobile conversions',
        variants: ['Current mobile layout', 'Sticky bottom CTA', 'Simplified mobile form'],
      },
    }),
  },

  // ---- Page Performance Rules ----
  {
    id: 'underperforming-pages',
    name: 'Underperforming Pages',
    description: 'Identifies pages with poor engagement metrics',
    category: 'content',
    condition: (m) => {
      return m.pageMetrics.some(p =>
        p.bounceRate > 70 && p.pageViews > 100
      );
    },
    priority: (m) => {
      const worstPage = m.pageMetrics
        .filter(p => p.pageViews > 100)
        .sort((a, b) => b.bounceRate - a.bounceRate)[0];
      return worstPage ? Math.min(100, 40 + (worstPage.bounceRate - 50)) : 0;
    },
    enabled: true,
    generateResult: (m) => {
      const underperformingPages = m.pageMetrics
        .filter(p => p.bounceRate > 70 && p.pageViews > 100)
        .sort((a, b) => b.bounceRate - a.bounceRate)
        .slice(0, 3);

      const pageList = underperformingPages
        .map(p => `${p.path} (${p.bounceRate.toFixed(1)}% bounce rate)`)
        .join(', ');

      return {
        ruleId: 'underperforming-pages',
        triggered: true,
        priority: 60,
        category: 'content',
        title: 'Underperforming Pages Detected',
        description: `The following pages have high bounce rates: ${pageList}`,
        impact: 'Improving these pages could capture 15-25% more engaged visitors',
        effort: 'medium',
        metrics: {
          current: underperformingPages[0]?.bounceRate || 0,
          benchmark: 50,
          unit: '%',
        },
        actions: [
          'Review content relevance and quality',
          'Add internal links to related content',
          'Improve page design and readability',
          'Add engaging visuals or videos',
          'Include clear next-step CTAs',
        ],
      };
    },
  },

  // ---- Session Duration Rules ----
  {
    id: 'low-session-duration',
    name: 'Low Average Session Duration',
    description: 'Triggers when average session duration is below 2 minutes',
    category: 'engagement',
    condition: (m) => m.avgSessionDuration < 120,
    priority: (m) => Math.min(100, 40 + (120 - m.avgSessionDuration) / 2),
    enabled: true,
    generateResult: (m) => ({
      ruleId: 'low-session-duration',
      triggered: true,
      priority: Math.min(100, 40 + (120 - m.avgSessionDuration) / 2),
      category: 'engagement',
      title: 'Low Session Duration',
      description: `Average session duration of ${Math.floor(m.avgSessionDuration / 60)}m ${m.avgSessionDuration % 60}s is below the 2-minute target.`,
      impact: 'Increasing engagement time correlates with higher conversion rates',
      effort: 'medium',
      metrics: {
        current: m.avgSessionDuration,
        benchmark: 180,
        unit: ' seconds',
      },
      actions: [
        'Add more engaging content (videos, interactive elements)',
        'Improve internal linking to encourage exploration',
        'Create content series that leads users through multiple pages',
        'Add related content sections',
        'Consider exit-intent popups with valuable offers',
      ],
    }),
  },

  // ---- Conversion Rate Rules ----
  {
    id: 'low-conversion-rate',
    name: 'Low Conversion Rate',
    description: 'Triggers when conversion rate is below 2%',
    category: 'conversion',
    condition: (m) => m.conversionRate < 2,
    priority: (m) => Math.min(100, 70 + (2 - m.conversionRate) * 20),
    enabled: true,
    generateResult: (m) => ({
      ruleId: 'low-conversion-rate',
      triggered: true,
      priority: Math.min(100, 70 + (2 - m.conversionRate) * 20),
      category: 'conversion',
      title: 'Conversion Rate Below Target',
      description: `Conversion rate of ${m.conversionRate.toFixed(2)}% is below the 2% industry benchmark.`,
      impact: 'Reaching 3% conversion rate would increase signups by 50%',
      effort: 'high',
      metrics: {
        current: m.conversionRate,
        benchmark: 3,
        unit: '%',
      },
      actions: [
        'Optimize primary CTA placement and copy',
        'Add urgency elements (limited time offers)',
        'Reduce friction in signup/checkout process',
        'Add more social proof and testimonials',
        'Implement retargeting for bounced visitors',
        'Test different value propositions',
      ],
      suggestedTest: {
        name: 'CTA Copy Test',
        hypothesis: 'Action-oriented CTA copy will increase conversions',
        variants: ['Start Free Trial', 'Get Started Free', 'See It In Action'],
      },
    }),
  },

  // ---- Traffic Source Rules ----
  {
    id: 'low-organic-traffic',
    name: 'Low Organic Traffic',
    description: 'Triggers when organic traffic is below 25%',
    category: 'content',
    condition: (m) => m.trafficSources.organic < 25,
    priority: (m) => Math.min(100, 30 + (25 - m.trafficSources.organic)),
    enabled: true,
    generateResult: (m) => ({
      ruleId: 'low-organic-traffic',
      triggered: true,
      priority: Math.min(100, 30 + (25 - m.trafficSources.organic)),
      category: 'content',
      title: 'Low Organic Search Traffic',
      description: `Only ${m.trafficSources.organic}% of traffic comes from organic search. SEO improvement needed.`,
      impact: 'Increasing organic traffic reduces acquisition costs significantly',
      effort: 'high',
      metrics: {
        current: m.trafficSources.organic,
        benchmark: 40,
        unit: '%',
      },
      actions: [
        'Conduct keyword research for target audience',
        'Create SEO-optimized blog content',
        'Improve on-page SEO (titles, meta descriptions, headers)',
        'Build backlinks through guest posting and partnerships',
        'Optimize site speed and Core Web Vitals',
      ],
    }),
  },

  // ---- Pages Per Session Rules ----
  {
    id: 'low-pages-per-session',
    name: 'Low Pages Per Session',
    description: 'Triggers when pages per session is below 2.5',
    category: 'engagement',
    condition: (m) => m.pagesPerSession < 2.5,
    priority: (m) => Math.min(100, 35 + (2.5 - m.pagesPerSession) * 20),
    enabled: true,
    generateResult: (m) => ({
      ruleId: 'low-pages-per-session',
      triggered: true,
      priority: Math.min(100, 35 + (2.5 - m.pagesPerSession) * 20),
      category: 'engagement',
      title: 'Low Page Depth',
      description: `Visitors view only ${m.pagesPerSession.toFixed(1)} pages per session on average.`,
      impact: 'Higher page depth indicates more engaged visitors likely to convert',
      effort: 'low',
      metrics: {
        current: m.pagesPerSession,
        benchmark: 4,
        unit: ' pages',
      },
      actions: [
        'Add related content recommendations',
        'Improve internal linking structure',
        'Add "Next Steps" CTAs at bottom of pages',
        'Create content pathways for different user intents',
        'Add breadcrumbs for easier navigation',
      ],
    }),
  },

  // ---- Demo Page Performance ----
  {
    id: 'demo-page-performance',
    name: 'Demo Page Performance',
    description: 'Monitors demo/trial page effectiveness',
    category: 'conversion',
    condition: (m) => {
      const demoPage = m.pageMetrics.find(p =>
        p.path.includes('demo') || p.path.includes('trial')
      );
      return demoPage ? demoPage.bounceRate > 30 : false;
    },
    priority: () => 75,
    enabled: true,
    generateResult: (m) => {
      const demoPage = m.pageMetrics.find(p =>
        p.path.includes('demo') || p.path.includes('trial')
      );
      return {
        ruleId: 'demo-page-performance',
        triggered: true,
        priority: 75,
        category: 'conversion',
        title: 'Demo Page Bounce Rate High',
        description: `Demo page has ${demoPage?.bounceRate.toFixed(1)}% bounce rate. Visitors interested in demos are leaving.`,
        impact: 'Demo requests are high-intent leads - optimizing could increase sales pipeline',
        effort: 'medium',
        metrics: {
          current: demoPage?.bounceRate || 0,
          benchmark: 20,
          unit: '%',
        },
        actions: [
          'Simplify demo request form (fewer fields)',
          'Add instant demo option (self-serve)',
          'Show demo video preview',
          'Add testimonials from demo users',
          'Reduce required fields to just email',
        ],
        suggestedTest: {
          name: 'Demo Form Length Test',
          hypothesis: 'Shorter form will increase demo requests',
          variants: ['Current form', 'Email-only form', 'Progressive disclosure form'],
        },
      };
    },
  },
];

// ============================================================================
// Rules Engine Class
// ============================================================================

export class RulesEngine {
  private rules: ImprovementRule[] = [];

  constructor(customRules?: ImprovementRule[]) {
    this.rules = customRules || [...defaultRules];
  }

  /**
   * Add a custom rule
   */
  addRule(rule: ImprovementRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove a rule by ID
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  /**
   * Enable/disable a rule
   */
  setRuleEnabled(ruleId: string, enabled: boolean): void {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = enabled;
    }
  }

  /**
   * Evaluate all rules against metrics
   */
  evaluate(metrics: AnalyticsMetrics): RuleResult[] {
    const results: RuleResult[] = [];

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      try {
        const triggered = rule.condition(metrics);

        if (triggered) {
          const result = rule.generateResult(metrics);
          results.push(result);
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    }

    // Sort by priority (highest first)
    results.sort((a, b) => b.priority - a.priority);

    return results;
  }

  /**
   * Get all rules
   */
  getRules(): ImprovementRule[] {
    return this.rules;
  }

  /**
   * Get enabled rules only
   */
  getEnabledRules(): ImprovementRule[] {
    return this.rules.filter(r => r.enabled);
  }
}

// ============================================================================
// Custom Rule Builder
// ============================================================================

export class RuleBuilder {
  private rule: Partial<ImprovementRule> = {
    enabled: true,
  };

  id(id: string): RuleBuilder {
    this.rule.id = id;
    return this;
  }

  name(name: string): RuleBuilder {
    this.rule.name = name;
    return this;
  }

  description(description: string): RuleBuilder {
    this.rule.description = description;
    return this;
  }

  category(category: ImprovementRule['category']): RuleBuilder {
    this.rule.category = category;
    return this;
  }

  condition(fn: (metrics: AnalyticsMetrics) => boolean): RuleBuilder {
    this.rule.condition = fn;
    return this;
  }

  priority(fn: (metrics: AnalyticsMetrics) => number): RuleBuilder {
    this.rule.priority = fn;
    return this;
  }

  generateResult(fn: (metrics: AnalyticsMetrics) => RuleResult): RuleBuilder {
    this.rule.generateResult = fn;
    return this;
  }

  enabled(enabled: boolean): RuleBuilder {
    this.rule.enabled = enabled;
    return this;
  }

  build(): ImprovementRule {
    if (!this.rule.id || !this.rule.name || !this.rule.condition || !this.rule.generateResult) {
      throw new Error('Rule is missing required fields');
    }
    return this.rule as ImprovementRule;
  }
}

// ============================================================================
// Exports
// ============================================================================

export { defaultRules };
