/**
 * Analytics Analysis Cron Job
 *
 * Vercel cron endpoint that runs daily analysis of website performance.
 * Generates improvement suggestions and stores recommendations.
 *
 * Schedule: Daily at 6am UTC
 * Can also be triggered manually via POST request
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getImprovementEngine,
  aggregateMetrics,
  fetchVercelAnalytics,
  suggestionsToMarkdown,
  AnalysisResult,
} from '@/lib/analytics/improvement-loop';
import { getABTestingEngine } from '@/lib/analytics/ab-testing';
import { getAnalyticsReporter } from '@/lib/analytics/reporter';
import type { WeeklyReport } from '@/lib/analytics/reporter';

// ============================================================================
// Types
// ============================================================================

interface CronResponse {
  success: boolean;
  message: string;
  data?: {
    analysisId: string;
    summary: {
      overallScore: number;
      trend: string;
      criticalCount: number;
      highCount: number;
      mediumCount: number;
      lowCount: number;
    };
    suggestionsCount: number;
    activeTestsCount: number;
    reportGenerated: boolean;
    timestamp: string;
  };
  error?: string;
}

// ============================================================================
// Analysis Storage (In-memory for demo, use database in production)
// ============================================================================

// In production, store in Supabase or similar
const analysisHistory: AnalysisResult[] = [];

// ============================================================================
// Main Analysis Function
// ============================================================================

async function runDailyAnalysis(): Promise<AnalysisResult> {
  const engine = getImprovementEngine();
  const abEngine = getABTestingEngine();
  const reporter = getAnalyticsReporter();

  // Fetch metrics from all sources
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const projectId = process.env.VERCEL_PROJECT_ID || 'poolops';

  const metrics = await aggregateMetrics([
    () => fetchVercelAnalytics(projectId, weekAgo, now),
    // Add more sources here:
    // () => fetchGoogleAnalytics(propertyId, weekAgo, now),
    // () => fetchMixpanelData(weekAgo, now),
  ]);

  // Run analysis
  const analysis = await engine.runAnalysis(metrics);

  // Store in history
  analysisHistory.push(analysis);

  // Keep only last 30 days of history
  while (analysisHistory.length > 30) {
    analysisHistory.shift();
  }

  // Generate weekly report if it's Sunday
  if (now.getDay() === 0) {
    const previousAnalysis = analysisHistory[analysisHistory.length - 8]; // Last week
    const abTestResults = abEngine.getActiveTests().map(test =>
      abEngine.getTest(test.id) ? abEngine.analyzeTest(test.id) : null
    ).filter((r): r is NonNullable<typeof r> => r !== null);

    const report = reporter.generateWeeklyReport(analysis, previousAnalysis, abTestResults);

    // Send notifications if configured
    await sendNotifications(report);
  }

  return analysis;
}

// ============================================================================
// Notification Functions
// ============================================================================

async function sendNotifications(report: WeeklyReport) {
  const reporter = getAnalyticsReporter();

  // Send email if configured
  const emailRecipients = process.env.ANALYTICS_EMAIL_RECIPIENTS?.split(',');
  if (emailRecipients && emailRecipients.length > 0) {
    await reporter.sendEmailDigest(report, {
      to: emailRecipients,
    });
  }

  // Send Slack notification if configured
  const slackWebhook = process.env.ANALYTICS_SLACK_WEBHOOK;
  if (slackWebhook) {
    await reporter.sendSlackWebhook(report, {
      webhookUrl: slackWebhook,
      channel: process.env.ANALYTICS_SLACK_CHANNEL,
    });
  }
}

// ============================================================================
// Cron Verification
// ============================================================================

function verifyCronRequest(request: NextRequest): boolean {
  // Vercel Cron sends this header
  const cronSecret = request.headers.get('x-vercel-cron-secret');
  const expectedSecret = process.env.CRON_SECRET;

  // Allow if no secret is set (development) or if it matches
  if (!expectedSecret) {
    console.warn('CRON_SECRET not set - allowing unauthenticated access');
    return true;
  }

  return cronSecret === expectedSecret;
}

// ============================================================================
// API Routes
// ============================================================================

/**
 * GET /api/cron/analyze
 * Called by Vercel Cron scheduler
 */
export async function GET(request: NextRequest): Promise<NextResponse<CronResponse>> {
  try {
    // Verify this is a legitimate cron request
    if (!verifyCronRequest(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: 'Invalid cron secret' },
        { status: 401 }
      );
    }

    console.log('Starting daily analytics analysis...');
    const startTime = Date.now();

    const analysis = await runDailyAnalysis();

    const duration = Date.now() - startTime;
    console.log(`Analysis completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Daily analysis completed successfully',
      data: {
        analysisId: `analysis_${Date.now()}`,
        summary: {
          overallScore: analysis.summary.overallScore,
          trend: analysis.summary.trend,
          criticalCount: analysis.summary.criticalCount,
          highCount: analysis.summary.highCount,
          mediumCount: analysis.summary.mediumCount,
          lowCount: analysis.summary.lowCount,
        },
        suggestionsCount: analysis.suggestions.length,
        activeTestsCount: analysis.activeTests.length,
        reportGenerated: new Date().getDay() === 0,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Daily analysis failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Analysis failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/analyze
 * Manual trigger for analysis (e.g., from admin dashboard)
 */
export async function POST(request: NextRequest): Promise<NextResponse<CronResponse>> {
  try {
    // Check for API key or admin authentication
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.ANALYTICS_API_KEY;

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Parse options from request body
    const body = await request.json().catch(() => ({}));
    const options = body as {
      generateReport?: boolean;
      sendNotifications?: boolean;
    };

    console.log('Manual analysis triggered with options:', options);
    const startTime = Date.now();

    const analysis = await runDailyAnalysis();

    // Generate report if requested
    if (options.generateReport) {
      const reporter = getAnalyticsReporter();
      const abEngine = getABTestingEngine();

      const previousAnalysis = analysisHistory[analysisHistory.length - 2];
      const abTestResults = abEngine.getActiveTests().map(test =>
        abEngine.getTest(test.id) ? abEngine.analyzeTest(test.id) : null
      ).filter((r): r is NonNullable<typeof r> => r !== null);

      const report = reporter.generateWeeklyReport(analysis, previousAnalysis, abTestResults);

      if (options.sendNotifications) {
        await sendNotifications(report);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`Manual analysis completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Manual analysis completed successfully',
      data: {
        analysisId: `analysis_${Date.now()}`,
        summary: {
          overallScore: analysis.summary.overallScore,
          trend: analysis.summary.trend,
          criticalCount: analysis.summary.criticalCount,
          highCount: analysis.summary.highCount,
          mediumCount: analysis.summary.mediumCount,
          lowCount: analysis.summary.lowCount,
        },
        suggestionsCount: analysis.suggestions.length,
        activeTestsCount: analysis.activeTests.length,
        reportGenerated: options.generateReport || false,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Manual analysis failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Analysis failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helper Functions (not exported from route, use via POST/GET)
// ============================================================================

/**
 * Get latest analysis results (internal use only)
 */
function getLatestAnalysis(): AnalysisResult | null {
  return analysisHistory[analysisHistory.length - 1] || null;
}

/**
 * Get analysis history (internal use only)
 */
function getAnalysisHistory(): AnalysisResult[] {
  return [...analysisHistory];
}

/**
 * Export suggestions to markdown (internal use only)
 */
function exportSuggestionsMarkdown(): string {
  const latest = getLatestAnalysis();
  if (!latest) {
    return '# No Analysis Data\n\nRun an analysis first.';
  }
  return suggestionsToMarkdown(latest.suggestions);
}

// Export types for consumers
export type { CronResponse };
