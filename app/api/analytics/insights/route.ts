/**
 * Pool App - Analytics Insights API
 * Analyze collected data and generate improvement recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveRecommendations, getRecommendations, updateRecommendationStatus } from '@/lib/analytics/storage';
import { generateInsights } from '@/lib/analytics/monitor';
import { suggestABTests } from '@/lib/analytics/improvements';
import type {
  AnalyticsAPIResponse,
  InsightsResponse,
  Recommendation,
} from '@/lib/analytics/types';

// =============================================================================
// GET - Generate Insights and Recommendations
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('start')
      ? new Date(searchParams.get('start')!)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = searchParams.get('end')
      ? new Date(searchParams.get('end')!)
      : new Date();
    const granularity = (searchParams.get('granularity') as 'hour' | 'day' | 'week' | 'month') || 'day';
    const includeABSuggestions = searchParams.get('includeABTests') === 'true';

    // Get analytics store
    const store = await getStore();

    // Generate comprehensive insights
    const insights = generateInsights(store, {
      currentStart: startDate,
      currentEnd: endDate,
      granularity,
    });

    // Save new recommendations
    if (insights.recommendations.length > 0) {
      await saveRecommendations(insights.recommendations);
    }

    // Build response
    const response: InsightsResponse = {
      summary: insights.summary,
      recommendations: insights.recommendations,
      trends: insights.trends,
      alerts: insights.alerts,
    };

    // Optionally include A/B test suggestions
    let abTestSuggestions;
    if (includeABSuggestions && insights.recommendations.length > 0) {
      abTestSuggestions = suggestABTests(insights.recommendations);
    }

    const apiResponse: AnalyticsAPIResponse<InsightsResponse & { abTestSuggestions?: typeof abTestSuggestions }> = {
      success: true,
      data: {
        ...response,
        ...(abTestSuggestions && { abTestSuggestions }),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Insights GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate insights',
        timestamp: new Date().toISOString(),
      } as AnalyticsAPIResponse<null>,
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Update Recommendation Status
// =============================================================================

interface UpdateRecommendationRequest {
  action: 'update_status' | 'dismiss' | 'acknowledge' | 'complete';
  recommendationId: string;
  status?: Recommendation['status'];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as UpdateRecommendationRequest;

    if (!body.action || !body.recommendationId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: action and recommendationId',
          timestamp: new Date().toISOString(),
        } as AnalyticsAPIResponse<null>,
        { status: 400 }
      );
    }

    let newStatus: Recommendation['status'];

    switch (body.action) {
      case 'dismiss':
        newStatus = 'dismissed';
        break;
      case 'acknowledge':
        newStatus = 'acknowledged';
        break;
      case 'complete':
        newStatus = 'completed';
        break;
      case 'update_status':
        if (!body.status) {
          return NextResponse.json(
            {
              success: false,
              error: 'update_status action requires status field',
              timestamp: new Date().toISOString(),
            } as AnalyticsAPIResponse<null>,
            { status: 400 }
          );
        }
        newStatus = body.status;
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${body.action}`,
            timestamp: new Date().toISOString(),
          } as AnalyticsAPIResponse<null>,
          { status: 400 }
        );
    }

    const updated = await updateRecommendationStatus(body.recommendationId, newStatus);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: `Recommendation not found: ${body.recommendationId}`,
          timestamp: new Date().toISOString(),
        } as AnalyticsAPIResponse<null>,
        { status: 404 }
      );
    }

    const response: AnalyticsAPIResponse<Recommendation> = {
      success: true,
      data: updated,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Insights POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update recommendation',
        timestamp: new Date().toISOString(),
      } as AnalyticsAPIResponse<null>,
      { status: 500 }
    );
  }
}

// =============================================================================
// GET /api/analytics/insights/recommendations - Get Stored Recommendations
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    const recommendations = await getRecommendations({
      status,
      priority,
      limit,
    });

    const response: AnalyticsAPIResponse<Recommendation[]> = {
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Recommendations GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve recommendations',
        timestamp: new Date().toISOString(),
      } as AnalyticsAPIResponse<null>,
      { status: 500 }
    );
  }
}
