/**
 * Pool App - Analytics API
 * GET: Retrieve current metrics
 * POST: Log events (page views, events, conversions)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getStore,
  logPageView,
  logEvent,
  logConversion,
  getPageViews,
  getEvents,
  getConversions,
} from '@/lib/analytics/storage';
import { generateMetricsSummary } from '@/lib/analytics/monitor';
import type {
  AnalyticsAPIResponse,
  MetricsSummary,
  PageView,
  AnalyticsEvent,
  Conversion,
  LogPageViewInput,
  LogEventInput,
  LogConversionInput,
} from '@/lib/analytics/types';

// =============================================================================
// GET - Retrieve Metrics
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'summary';
    const startDate = searchParams.get('start')
      ? new Date(searchParams.get('start')!)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = searchParams.get('end')
      ? new Date(searchParams.get('end')!)
      : new Date();
    const granularity = (searchParams.get('granularity') as 'hour' | 'day' | 'week' | 'month') || 'day';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    let data: unknown;

    switch (type) {
      case 'summary': {
        const store = await getStore();
        data = generateMetricsSummary(store, {
          start: startDate,
          end: endDate,
          granularity,
        });
        break;
      }

      case 'pageviews': {
        data = await getPageViews({
          startDate,
          endDate,
          limit,
          path: searchParams.get('path') || undefined,
          sessionId: searchParams.get('sessionId') || undefined,
        });
        break;
      }

      case 'events': {
        data = await getEvents({
          startDate,
          endDate,
          limit,
          category: searchParams.get('category') || undefined,
          action: searchParams.get('action') || undefined,
          sessionId: searchParams.get('sessionId') || undefined,
        });
        break;
      }

      case 'conversions': {
        data = await getConversions({
          startDate,
          endDate,
          limit,
          type: searchParams.get('conversionType') || undefined,
          sessionId: searchParams.get('sessionId') || undefined,
        });
        break;
      }

      case 'raw': {
        // Return raw store data (admin only in production)
        data = await getStore();
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown type: ${type}. Valid types: summary, pageviews, events, conversions, raw`,
            timestamp: new Date().toISOString(),
          } as AnalyticsAPIResponse<null>,
          { status: 400 }
        );
    }

    const response: AnalyticsAPIResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve analytics',
        timestamp: new Date().toISOString(),
      } as AnalyticsAPIResponse<null>,
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Log Events
// =============================================================================

interface LogRequest {
  type: 'pageview' | 'event' | 'conversion';
  data: LogPageViewInput | LogEventInput | LogConversionInput;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LogRequest;

    if (!body.type || !body.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type and data',
          timestamp: new Date().toISOString(),
        } as AnalyticsAPIResponse<null>,
        { status: 400 }
      );
    }

    let result: PageView | AnalyticsEvent | Conversion;

    switch (body.type) {
      case 'pageview': {
        const pageViewData = body.data as LogPageViewInput;
        if (!pageViewData.path || !pageViewData.sessionId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Page view requires path and sessionId',
              timestamp: new Date().toISOString(),
            } as AnalyticsAPIResponse<null>,
            { status: 400 }
          );
        }
        result = await logPageView(pageViewData);
        break;
      }

      case 'event': {
        const eventData = body.data as LogEventInput;
        if (!eventData.category || !eventData.action || !eventData.sessionId || !eventData.path) {
          return NextResponse.json(
            {
              success: false,
              error: 'Event requires category, action, sessionId, and path',
              timestamp: new Date().toISOString(),
            } as AnalyticsAPIResponse<null>,
            { status: 400 }
          );
        }
        result = await logEvent(eventData);
        break;
      }

      case 'conversion': {
        const conversionData = body.data as LogConversionInput;
        if (!conversionData.type || !conversionData.sessionId || !conversionData.path) {
          return NextResponse.json(
            {
              success: false,
              error: 'Conversion requires type, sessionId, and path',
              timestamp: new Date().toISOString(),
            } as AnalyticsAPIResponse<null>,
            { status: 400 }
          );
        }
        result = await logConversion(conversionData);
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown log type: ${body.type}. Valid types: pageview, event, conversion`,
            timestamp: new Date().toISOString(),
          } as AnalyticsAPIResponse<null>,
          { status: 400 }
        );
    }

    const response: AnalyticsAPIResponse<typeof result> = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to log analytics event',
        timestamp: new Date().toISOString(),
      } as AnalyticsAPIResponse<null>,
      { status: 500 }
    );
  }
}
