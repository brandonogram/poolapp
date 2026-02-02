/**
 * A/B Testing Framework
 *
 * Simple A/B testing system for PoolApp.
 * Handles variant selection, results tracking, and winner determination.
 */

// ============================================================================
// Types
// ============================================================================

export interface ABTest {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date | null;
  endDate: Date | null;
  targetPage: string;
  targetElement: string;
  variants: ABVariant[];
  trafficAllocation: number; // 0-100, percentage of traffic to include in test
  minimumSampleSize: number;
  confidenceLevel: number; // 0-100, typically 95
  primaryMetric: 'conversion' | 'clicks' | 'engagement' | 'custom';
  customMetricName?: string;
  winner: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ABVariant {
  id: string;
  name: string;
  description: string;
  isControl: boolean;
  weight: number; // 0-100, percentage of test traffic
  data: Record<string, unknown>; // Variant-specific data (copy, colors, etc.)
  metrics: VariantMetrics;
}

export interface VariantMetrics {
  impressions: number;
  conversions: number;
  clicks: number;
  totalEngagementTime: number; // seconds
  customMetricValue: number;
}

export interface ABTestResult {
  testId: string;
  testName: string;
  status: 'inconclusive' | 'control_wins' | 'variant_wins';
  confidenceReached: boolean;
  confidenceLevel: number;
  winningVariant: string | null;
  improvement: number; // percentage improvement over control
  statisticalSignificance: number; // p-value
  summary: string;
  variantResults: VariantResult[];
}

export interface VariantResult {
  variantId: string;
  variantName: string;
  isControl: boolean;
  impressions: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
}

// ============================================================================
// A/B Testing Engine
// ============================================================================

export class ABTestingEngine {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId

  constructor() {
    // Load any persisted tests
    this.loadTests();
  }

  // ---- Test Management ----

  /**
   * Create a new A/B test
   */
  createTest(config: {
    name: string;
    description: string;
    hypothesis: string;
    targetPage: string;
    targetElement: string;
    variants: Array<{
      name: string;
      description: string;
      isControl: boolean;
      data: Record<string, unknown>;
    }>;
    trafficAllocation?: number;
    minimumSampleSize?: number;
    confidenceLevel?: number;
    primaryMetric?: ABTest['primaryMetric'];
  }): ABTest {
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate equal weight distribution
    const variantCount = config.variants.length;
    const weight = Math.floor(100 / variantCount);

    const test: ABTest = {
      id: testId,
      name: config.name,
      description: config.description,
      hypothesis: config.hypothesis,
      status: 'draft',
      startDate: null,
      endDate: null,
      targetPage: config.targetPage,
      targetElement: config.targetElement,
      variants: config.variants.map((v, i) => ({
        id: `variant_${i}`,
        name: v.name,
        description: v.description,
        isControl: v.isControl,
        weight: weight,
        data: v.data,
        metrics: {
          impressions: 0,
          conversions: 0,
          clicks: 0,
          totalEngagementTime: 0,
          customMetricValue: 0,
        },
      })),
      trafficAllocation: config.trafficAllocation ?? 100,
      minimumSampleSize: config.minimumSampleSize ?? 1000,
      confidenceLevel: config.confidenceLevel ?? 95,
      primaryMetric: config.primaryMetric ?? 'conversion',
      winner: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tests.set(testId, test);
    this.saveTests();

    return test;
  }

  /**
   * Start a test
   */
  startTest(testId: string): ABTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.status = 'running';
    test.startDate = new Date();
    test.updatedAt = new Date();

    this.saveTests();
    return test;
  }

  /**
   * Pause a test
   */
  pauseTest(testId: string): ABTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.status = 'paused';
    test.updatedAt = new Date();

    this.saveTests();
    return test;
  }

  /**
   * Complete a test
   */
  completeTest(testId: string, winnerId?: string): ABTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.status = 'completed';
    test.endDate = new Date();
    test.winner = winnerId || null;
    test.updatedAt = new Date();

    this.saveTests();
    return test;
  }

  /**
   * Delete a test
   */
  deleteTest(testId: string): boolean {
    const deleted = this.tests.delete(testId);
    if (deleted) {
      this.saveTests();
    }
    return deleted;
  }

  // ---- Variant Selection ----

  /**
   * Get variant for a user
   * Uses consistent hashing to ensure same user always sees same variant
   */
  getVariantForUser(testId: string, userId: string): ABVariant | null {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') return null;

    // Check if user is in traffic allocation
    const hash = this.hashString(`${testId}:${userId}:allocation`);
    const inTest = (hash % 100) < test.trafficAllocation;
    if (!inTest) return null;

    // Check for existing assignment
    const userTests = this.userAssignments.get(userId);
    if (userTests?.has(testId)) {
      const variantId = userTests.get(testId)!;
      return test.variants.find(v => v.id === variantId) || null;
    }

    // Assign variant based on weights
    const variantHash = this.hashString(`${testId}:${userId}:variant`);
    const normalizedHash = variantHash % 100;

    let cumulative = 0;
    for (const variant of test.variants) {
      cumulative += variant.weight;
      if (normalizedHash < cumulative) {
        // Store assignment
        if (!this.userAssignments.has(userId)) {
          this.userAssignments.set(userId, new Map());
        }
        this.userAssignments.get(userId)!.set(testId, variant.id);
        return variant;
      }
    }

    // Fallback to control
    return test.variants.find(v => v.isControl) || test.variants[0];
  }

  /**
   * Simple string hashing function
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // ---- Metrics Tracking ----

  /**
   * Track an impression for a variant
   */
  trackImpression(testId: string, variantId: string): void {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.impressions++;
      test.updatedAt = new Date();
      this.saveTests();
    }
  }

  /**
   * Track a conversion for a variant
   */
  trackConversion(testId: string, variantId: string): void {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.conversions++;
      test.updatedAt = new Date();
      this.saveTests();
    }
  }

  /**
   * Track a click for a variant
   */
  trackClick(testId: string, variantId: string): void {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.clicks++;
      test.updatedAt = new Date();
      this.saveTests();
    }
  }

  /**
   * Track engagement time for a variant
   */
  trackEngagement(testId: string, variantId: string, seconds: number): void {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.totalEngagementTime += seconds;
      test.updatedAt = new Date();
      this.saveTests();
    }
  }

  /**
   * Track custom metric for a variant
   */
  trackCustomMetric(testId: string, variantId: string, value: number): void {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.customMetricValue += value;
      test.updatedAt = new Date();
      this.saveTests();
    }
  }

  // ---- Results Analysis ----

  /**
   * Analyze test results
   */
  analyzeTest(testId: string): ABTestResult | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    const variantResults: VariantResult[] = test.variants.map(v => ({
      variantId: v.id,
      variantName: v.name,
      isControl: v.isControl,
      impressions: v.metrics.impressions,
      conversions: v.metrics.conversions,
      conversionRate: v.metrics.impressions > 0
        ? (v.metrics.conversions / v.metrics.impressions) * 100
        : 0,
      confidence: 0, // Will be calculated
    }));

    // Find control
    const control = variantResults.find(v => v.isControl);
    if (!control) {
      return {
        testId: test.id,
        testName: test.name,
        status: 'inconclusive',
        confidenceReached: false,
        confidenceLevel: 0,
        winningVariant: null,
        improvement: 0,
        statisticalSignificance: 1,
        summary: 'No control variant defined',
        variantResults,
      };
    }

    // Calculate statistical significance for each variant
    let bestVariant: VariantResult | null = null;
    let bestImprovement = 0;
    let significanceReached = false;

    for (const variant of variantResults) {
      if (variant.isControl) continue;

      const significance = this.calculateSignificance(
        control.impressions,
        control.conversions,
        variant.impressions,
        variant.conversions
      );

      variant.confidence = (1 - significance.pValue) * 100;

      const improvement = control.conversionRate > 0
        ? ((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100
        : 0;

      if (significance.pValue < (1 - test.confidenceLevel / 100) && improvement > bestImprovement) {
        bestVariant = variant;
        bestImprovement = improvement;
        significanceReached = true;
      }
    }

    // Check if minimum sample size reached
    const totalImpressions = variantResults.reduce((sum, v) => sum + v.impressions, 0);
    const sampleSizeReached = totalImpressions >= test.minimumSampleSize;

    // Determine status
    let status: ABTestResult['status'] = 'inconclusive';
    let winningVariant: string | null = null;

    if (significanceReached && sampleSizeReached) {
      if (bestVariant && bestImprovement > 0) {
        status = 'variant_wins';
        winningVariant = bestVariant.variantId;
      } else {
        status = 'control_wins';
        winningVariant = control.variantId;
      }
    }

    // Generate summary
    let summary = '';
    if (!sampleSizeReached) {
      summary = `Need ${test.minimumSampleSize - totalImpressions} more impressions to reach minimum sample size.`;
    } else if (status === 'inconclusive') {
      summary = 'Results are not statistically significant. Consider running the test longer.';
    } else if (status === 'variant_wins') {
      summary = `${bestVariant!.variantName} outperforms control by ${bestImprovement.toFixed(1)}% with ${bestVariant!.confidence.toFixed(1)}% confidence.`;
    } else {
      summary = 'Control variant performs best. Consider testing different variants.';
    }

    return {
      testId: test.id,
      testName: test.name,
      status,
      confidenceReached: significanceReached && sampleSizeReached,
      confidenceLevel: bestVariant?.confidence || 0,
      winningVariant,
      improvement: bestImprovement,
      statisticalSignificance: bestVariant ? (1 - bestVariant.confidence / 100) : 1,
      summary,
      variantResults,
    };
  }

  /**
   * Calculate statistical significance using chi-square test
   * Simplified implementation for demonstration
   */
  private calculateSignificance(
    controlImpressions: number,
    controlConversions: number,
    variantImpressions: number,
    variantConversions: number
  ): { significant: boolean; pValue: number } {
    // Minimum sample check
    if (controlImpressions < 100 || variantImpressions < 100) {
      return { significant: false, pValue: 1 };
    }

    const controlRate = controlConversions / controlImpressions;
    const variantRate = variantConversions / variantImpressions;

    // Pooled rate
    const totalConversions = controlConversions + variantConversions;
    const totalImpressions = controlImpressions + variantImpressions;
    const pooledRate = totalConversions / totalImpressions;

    // Standard error
    const se = Math.sqrt(
      pooledRate * (1 - pooledRate) *
      (1 / controlImpressions + 1 / variantImpressions)
    );

    // Z-score
    const z = se > 0 ? (variantRate - controlRate) / se : 0;

    // Approximate p-value using normal distribution
    const pValue = 1 - this.normalCDF(Math.abs(z));

    return {
      significant: pValue < 0.05,
      pValue: pValue * 2, // Two-tailed test
    };
  }

  /**
   * Normal cumulative distribution function approximation
   */
  private normalCDF(z: number): number {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  // ---- Getters ----

  /**
   * Get all tests
   */
  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }

  /**
   * Get active tests
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(t => t.status === 'running');
  }

  /**
   * Get test by ID
   */
  getTest(testId: string): ABTest | null {
    return this.tests.get(testId) || null;
  }

  /**
   * Get tests for a specific page
   */
  getTestsForPage(page: string): ABTest[] {
    return Array.from(this.tests.values()).filter(
      t => t.status === 'running' && t.targetPage === page
    );
  }

  // ---- Persistence ----

  /**
   * Save tests to storage
   * In production, this would use a database
   */
  private saveTests(): void {
    // Placeholder for database persistence
    // In production: await supabase.from('ab_tests').upsert(...)
    if (typeof window !== 'undefined') {
      try {
        const data = Array.from(this.tests.entries());
        localStorage.setItem('ab_tests', JSON.stringify(data));
      } catch {
        // Ignore storage errors
      }
    }
  }

  /**
   * Load tests from storage
   */
  private loadTests(): void {
    // Placeholder for database loading
    // In production: const { data } = await supabase.from('ab_tests').select(...)
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem('ab_tests');
        if (data) {
          const entries = JSON.parse(data);
          this.tests = new Map(entries);
        }
      } catch {
        // Ignore storage errors
      }
    }
  }
}

// ============================================================================
// React Hook for A/B Testing (Client-side)
// ============================================================================

/**
 * Hook for using A/B tests in React components
 * Usage:
 *   const { variant, trackConversion } = useABTest('my-test-id', userId);
 *   if (variant?.name === 'variant-a') { ... }
 */
export function createABTestHook() {
  const engine = new ABTestingEngine();

  return function useABTest(testId: string, userId: string) {
    const variant = engine.getVariantForUser(testId, userId);

    // Track impression on mount
    if (variant) {
      engine.trackImpression(testId, variant.id);
    }

    return {
      variant,
      isControl: variant?.isControl ?? true,
      trackConversion: () => {
        if (variant) engine.trackConversion(testId, variant.id);
      },
      trackClick: () => {
        if (variant) engine.trackClick(testId, variant.id);
      },
      trackEngagement: (seconds: number) => {
        if (variant) engine.trackEngagement(testId, variant.id, seconds);
      },
    };
  };
}

// ============================================================================
// Singleton Instance
// ============================================================================

let engineInstance: ABTestingEngine | null = null;

export function getABTestingEngine(): ABTestingEngine {
  if (!engineInstance) {
    engineInstance = new ABTestingEngine();
  }
  return engineInstance;
}
