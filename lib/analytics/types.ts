/**
 * Pool App - Analytics Types
 * Type definitions for the internal analytics monitoring system
 */

// =============================================================================
// Core Event Types
// =============================================================================

/** Unique identifier for analytics records */
export type AnalyticsId = string;

/** ISO timestamp string */
export type AnalyticsTimestamp = string;

/** Page view event - tracks user navigation */
export interface PageView {
  id: AnalyticsId;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  sessionId: string;
  userId: string | null;
  companyId: string | null;
  timestamp: AnalyticsTimestamp;
  duration: number | null; // milliseconds spent on page
  scrollDepth: number | null; // percentage 0-100
  metadata: Record<string, unknown>;
}

/** Generic event - tracks user actions */
export interface AnalyticsEvent {
  id: AnalyticsId;
  category: EventCategory;
  action: string;
  label: string | null;
  value: number | null;
  sessionId: string;
  userId: string | null;
  companyId: string | null;
  path: string;
  timestamp: AnalyticsTimestamp;
  metadata: Record<string, unknown>;
}

/** Conversion event - tracks goal completions */
export interface Conversion {
  id: AnalyticsId;
  type: ConversionType;
  value: number; // monetary value or score
  sessionId: string;
  userId: string | null;
  companyId: string | null;
  path: string;
  timestamp: AnalyticsTimestamp;
  funnelStep: number | null;
  attributionSource: string | null;
  metadata: Record<string, unknown>;
}

// =============================================================================
// Event Categories and Types
// =============================================================================

/** Categories for analytics events */
export type EventCategory =
  | 'navigation'
  | 'interaction'
  | 'form'
  | 'error'
  | 'performance'
  | 'engagement'
  | 'feature_usage'
  | 'onboarding'
  | 'billing';

/** Types of conversion events */
export type ConversionType =
  | 'signup_started'
  | 'signup_completed'
  | 'trial_started'
  | 'subscription_started'
  | 'subscription_upgraded'
  | 'first_customer_added'
  | 'first_job_completed'
  | 'first_invoice_sent'
  | 'onboarding_completed'
  | 'referral_sent'
  | 'demo_requested';

// =============================================================================
// Aggregated Metrics
// =============================================================================

/** Summary of metrics over a time period */
export interface MetricsSummary {
  period: {
    start: AnalyticsTimestamp;
    end: AnalyticsTimestamp;
    granularity: 'hour' | 'day' | 'week' | 'month';
  };
  pageViews: {
    total: number;
    unique: number;
    byPath: Record<string, number>;
    topPages: Array<{ path: string; views: number; avgDuration: number }>;
    avgSessionDuration: number;
    bounceRate: number;
  };
  events: {
    total: number;
    byCategory: Record<EventCategory, number>;
    topEvents: Array<{ action: string; count: number }>;
  };
  conversions: {
    total: number;
    totalValue: number;
    byType: Record<ConversionType, number>;
    funnelAnalysis: FunnelStep[];
    conversionRate: number;
  };
  users: {
    totalSessions: number;
    uniqueUsers: number;
    newUsers: number;
    returningUsers: number;
    userRetention: number;
  };
  performance: {
    avgPageLoadTime: number;
    avgTimeToInteractive: number;
    errorRate: number;
    topErrors: Array<{ message: string; count: number }>;
  };
}

/** Funnel step analysis */
export interface FunnelStep {
  step: number;
  name: string;
  entered: number;
  completed: number;
  dropOffRate: number;
}

// =============================================================================
// Recommendations
// =============================================================================

/** AI-generated recommendation for improvement */
export interface Recommendation {
  id: AnalyticsId;
  type: RecommendationType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  metrics: {
    current: number;
    target: number;
    unit: string;
  };
  actions: string[];
  relatedPages: string[];
  status: 'new' | 'acknowledged' | 'in_progress' | 'completed' | 'dismissed';
  createdAt: AnalyticsTimestamp;
  updatedAt: AnalyticsTimestamp;
}

/** Types of recommendations */
export type RecommendationType =
  | 'conversion_optimization'
  | 'engagement_improvement'
  | 'performance_fix'
  | 'ux_enhancement'
  | 'content_update'
  | 'feature_adoption'
  | 'error_resolution'
  | 'a_b_test_suggestion';

// =============================================================================
// A/B Testing
// =============================================================================

/** A/B test configuration */
export interface ABTest {
  id: AnalyticsId;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ABTestVariant[];
  targetPath: string;
  targetAudience: string | null;
  startDate: AnalyticsTimestamp;
  endDate: AnalyticsTimestamp | null;
  primaryMetric: string;
  sampleSize: number;
  currentSampleSize: number;
  winner: string | null;
  statisticalSignificance: number | null;
  createdAt: AnalyticsTimestamp;
  updatedAt: AnalyticsTimestamp;
}

/** A/B test variant */
export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage allocation
  conversions: number;
  views: number;
  conversionRate: number;
}

// =============================================================================
// Storage Types
// =============================================================================

/** Structure for file-based analytics storage */
export interface AnalyticsStore {
  pageViews: PageView[];
  events: AnalyticsEvent[];
  conversions: Conversion[];
  recommendations: Recommendation[];
  abTests: ABTest[];
  lastUpdated: AnalyticsTimestamp;
}

/** Input types for logging */
export interface LogPageViewInput {
  path: string;
  referrer?: string;
  userAgent?: string;
  sessionId: string;
  userId?: string;
  companyId?: string;
  duration?: number;
  scrollDepth?: number;
  metadata?: Record<string, unknown>;
}

export interface LogEventInput {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  sessionId: string;
  userId?: string;
  companyId?: string;
  path: string;
  metadata?: Record<string, unknown>;
}

export interface LogConversionInput {
  type: ConversionType;
  value?: number;
  sessionId: string;
  userId?: string;
  companyId?: string;
  path: string;
  funnelStep?: number;
  attributionSource?: string;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface AnalyticsAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: AnalyticsTimestamp;
}

export interface InsightsResponse {
  summary: MetricsSummary;
  recommendations: Recommendation[];
  trends: TrendData[];
  alerts: AnalyticsAlert[];
}

export interface TrendData {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  percentageChange: number;
  comparison: 'previous_period' | 'previous_week' | 'previous_month';
}

export interface AnalyticsAlert {
  id: AnalyticsId;
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: AnalyticsTimestamp;
}
