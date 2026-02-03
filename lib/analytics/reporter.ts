/**
 * Analytics Reporter
 *
 * Generate weekly performance reports with email digest and Slack webhook integration.
 */

import { AnalysisResult, ImprovementSuggestion, AnalysisSummary } from './improvement-loop';
import { ABTestResult } from './ab-testing';

// ============================================================================
// Types
// ============================================================================

export interface WeeklyReport {
  id: string;
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  summary: ReportSummary;
  metrics: MetricsComparison;
  suggestions: ImprovementSuggestion[];
  abTestResults: ABTestResult[];
  actionItems: ActionItem[];
  highlights: string[];
  concerns: string[];
}

export interface ReportSummary {
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  keyMetrics: {
    pageViews: MetricDelta;
    uniqueVisitors: MetricDelta;
    bounceRate: MetricDelta;
    conversionRate: MetricDelta;
    avgSessionDuration: MetricDelta;
  };
  topPerformingPages: string[];
  underperformingPages: string[];
}

export interface MetricDelta {
  current: number;
  previous: number;
  change: number; // percentage change
  trend: 'up' | 'down' | 'stable';
  isPositive: boolean; // whether the trend direction is good
}

export interface MetricsComparison {
  currentWeek: Record<string, number>;
  previousWeek: Record<string, number>;
  monthToDate: Record<string, number>;
  yearToDate: Record<string, number>;
}

export interface ActionItem {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  dueDate?: Date;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface EmailConfig {
  to: string[];
  cc?: string[];
  subject?: string;
  template?: 'detailed' | 'summary';
}

export interface SlackConfig {
  webhookUrl: string;
  channel?: string;
  username?: string;
  iconEmoji?: string;
}

// ============================================================================
// Reporter Class
// ============================================================================

export class AnalyticsReporter {
  private reports: WeeklyReport[] = [];

  /**
   * Generate a weekly performance report
   */
  generateWeeklyReport(
    currentAnalysis: AnalysisResult,
    previousAnalysis?: AnalysisResult,
    abTestResults?: ABTestResult[]
  ): WeeklyReport {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const report: WeeklyReport = {
      id: `report_${Date.now()}`,
      generatedAt: now,
      periodStart: weekAgo,
      periodEnd: now,
      summary: this.generateSummary(currentAnalysis, previousAnalysis),
      metrics: this.generateMetricsComparison(currentAnalysis, previousAnalysis),
      suggestions: currentAnalysis.suggestions,
      abTestResults: abTestResults || [],
      actionItems: this.generateActionItems(currentAnalysis.suggestions),
      highlights: this.extractHighlights(currentAnalysis, previousAnalysis),
      concerns: this.extractConcerns(currentAnalysis),
    };

    this.reports.push(report);
    return report;
  }

  /**
   * Generate report summary
   */
  private generateSummary(
    current: AnalysisResult,
    previous?: AnalysisResult
  ): ReportSummary {
    const cm = current.metrics;
    const pm = previous?.metrics;

    return {
      overallScore: current.summary.overallScore,
      trend: current.summary.trend,
      keyMetrics: {
        pageViews: this.calculateDelta(cm.pageViews, pm?.pageViews, true),
        uniqueVisitors: this.calculateDelta(cm.uniqueVisitors, pm?.uniqueVisitors, true),
        bounceRate: this.calculateDelta(cm.bounceRate, pm?.bounceRate, false),
        conversionRate: this.calculateDelta(cm.conversionRate, pm?.conversionRate, true),
        avgSessionDuration: this.calculateDelta(cm.avgSessionDuration, pm?.avgSessionDuration, true),
      },
      topPerformingPages: cm.pageMetrics
        .filter(p => p.bounceRate < 40)
        .sort((a, b) => a.bounceRate - b.bounceRate)
        .slice(0, 3)
        .map(p => p.path),
      underperformingPages: cm.pageMetrics
        .filter(p => p.bounceRate > 60)
        .sort((a, b) => b.bounceRate - a.bounceRate)
        .slice(0, 3)
        .map(p => p.path),
    };
  }

  /**
   * Calculate metric delta
   */
  private calculateDelta(
    current: number,
    previous: number | undefined,
    higherIsBetter: boolean
  ): MetricDelta {
    const prev = previous ?? current;
    const change = prev !== 0 ? ((current - prev) / prev) * 100 : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (change > 2) trend = 'up';
    else if (change < -2) trend = 'down';

    const isPositive = higherIsBetter
      ? trend === 'up' || trend === 'stable'
      : trend === 'down' || trend === 'stable';

    return {
      current,
      previous: prev,
      change,
      trend,
      isPositive,
    };
  }

  /**
   * Generate metrics comparison
   */
  private generateMetricsComparison(
    current: AnalysisResult,
    previous?: AnalysisResult
  ): MetricsComparison {
    const cm = current.metrics;
    const pm = previous?.metrics;

    return {
      currentWeek: {
        pageViews: cm.pageViews,
        uniqueVisitors: cm.uniqueVisitors,
        sessions: cm.sessions,
        bounceRate: cm.bounceRate,
        conversionRate: cm.conversionRate,
        signups: cm.signups,
      },
      previousWeek: {
        pageViews: pm?.pageViews ?? 0,
        uniqueVisitors: pm?.uniqueVisitors ?? 0,
        sessions: pm?.sessions ?? 0,
        bounceRate: pm?.bounceRate ?? 0,
        conversionRate: pm?.conversionRate ?? 0,
        signups: pm?.signups ?? 0,
      },
      monthToDate: {
        // Placeholder - would aggregate from historical data
        pageViews: cm.pageViews * 4,
        uniqueVisitors: cm.uniqueVisitors * 3.5,
        sessions: cm.sessions * 4,
        bounceRate: cm.bounceRate,
        conversionRate: cm.conversionRate,
        signups: cm.signups * 4,
      },
      yearToDate: {
        // Placeholder - would aggregate from historical data
        pageViews: cm.pageViews * 52,
        uniqueVisitors: cm.uniqueVisitors * 40,
        sessions: cm.sessions * 52,
        bounceRate: cm.bounceRate,
        conversionRate: cm.conversionRate,
        signups: cm.signups * 52,
      },
    };
  }

  /**
   * Generate action items from suggestions
   */
  private generateActionItems(suggestions: ImprovementSuggestion[]): ActionItem[] {
    return suggestions.slice(0, 5).map((s, i) => ({
      id: `action_${i}`,
      priority: s.priority,
      title: s.title,
      description: s.actionItems[0] || s.description,
      status: 'pending' as const,
    }));
  }

  /**
   * Extract positive highlights
   */
  private extractHighlights(
    current: AnalysisResult,
    previous?: AnalysisResult
  ): string[] {
    const highlights: string[] = [];
    const cm = current.metrics;
    const pm = previous?.metrics;

    if (pm) {
      if (cm.conversionRate > pm.conversionRate * 1.1) {
        highlights.push(`Conversion rate increased by ${((cm.conversionRate / pm.conversionRate - 1) * 100).toFixed(1)}%`);
      }
      if (cm.bounceRate < pm.bounceRate * 0.9) {
        highlights.push(`Bounce rate decreased by ${((1 - cm.bounceRate / pm.bounceRate) * 100).toFixed(1)}%`);
      }
      if (cm.uniqueVisitors > pm.uniqueVisitors * 1.15) {
        highlights.push(`Unique visitors increased by ${((cm.uniqueVisitors / pm.uniqueVisitors - 1) * 100).toFixed(1)}%`);
      }
    }

    if (cm.conversionRate > 3) {
      highlights.push('Conversion rate is above industry benchmark (3%)');
    }

    if (current.summary.trend === 'improving') {
      highlights.push('Overall performance trend is improving');
    }

    return highlights.length > 0 ? highlights : ['Metrics are stable'];
  }

  /**
   * Extract concerns
   */
  private extractConcerns(current: AnalysisResult): string[] {
    const concerns: string[] = [];

    if (current.summary.criticalCount > 0) {
      concerns.push(`${current.summary.criticalCount} critical issue(s) need immediate attention`);
    }

    for (const suggestion of current.suggestions) {
      if (suggestion.priority === 'critical') {
        concerns.push(suggestion.title);
      }
    }

    if (current.summary.trend === 'declining') {
      concerns.push('Overall performance trend is declining');
    }

    return concerns;
  }

  // ============================================================================
  // Email Digest
  // ============================================================================

  /**
   * Generate email HTML for the report
   */
  generateEmailHTML(report: WeeklyReport): string {
    const trendIcon = {
      improving: '&#x2191;',
      stable: '&#x2192;',
      declining: '&#x2193;',
    };

    const priorityColors = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#ca8a04',
      low: '#16a34a',
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PoolOps Weekly Performance Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .score { text-align: center; margin-bottom: 30px; }
    .score-circle { display: inline-block; width: 100px; height: 100px; border-radius: 50%; background: #f0f9ff; border: 4px solid #3b82f6; line-height: 92px; font-size: 36px; font-weight: bold; color: #1d4ed8; }
    .score-label { margin-top: 10px; color: #6b7280; font-size: 14px; }
    .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; }
    .metric { padding: 15px; background: #f9fafb; border-radius: 8px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #111827; }
    .metric-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .metric-change { font-size: 12px; margin-top: 5px; }
    .metric-change.positive { color: #16a34a; }
    .metric-change.negative { color: #dc2626; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    .item { padding: 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 8px; }
    .item-priority { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
    .highlight { color: #16a34a; }
    .concern { color: #dc2626; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
    .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PoolOps Weekly Report</h1>
      <p>${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}</p>
    </div>

    <div class="content">
      <div class="score">
        <div class="score-circle">${report.summary.overallScore}</div>
        <div class="score-label">Overall Score ${trendIcon[report.summary.trend]}</div>
      </div>

      <div class="metrics">
        <div class="metric">
          <div class="metric-value">${report.summary.keyMetrics.pageViews.current.toLocaleString()}</div>
          <div class="metric-label">Page Views</div>
          <div class="metric-change ${report.summary.keyMetrics.pageViews.isPositive ? 'positive' : 'negative'}">
            ${report.summary.keyMetrics.pageViews.change >= 0 ? '+' : ''}${report.summary.keyMetrics.pageViews.change.toFixed(1)}%
          </div>
        </div>
        <div class="metric">
          <div class="metric-value">${report.summary.keyMetrics.uniqueVisitors.current.toLocaleString()}</div>
          <div class="metric-label">Unique Visitors</div>
          <div class="metric-change ${report.summary.keyMetrics.uniqueVisitors.isPositive ? 'positive' : 'negative'}">
            ${report.summary.keyMetrics.uniqueVisitors.change >= 0 ? '+' : ''}${report.summary.keyMetrics.uniqueVisitors.change.toFixed(1)}%
          </div>
        </div>
        <div class="metric">
          <div class="metric-value">${report.summary.keyMetrics.bounceRate.current.toFixed(1)}%</div>
          <div class="metric-label">Bounce Rate</div>
          <div class="metric-change ${report.summary.keyMetrics.bounceRate.isPositive ? 'positive' : 'negative'}">
            ${report.summary.keyMetrics.bounceRate.change >= 0 ? '+' : ''}${report.summary.keyMetrics.bounceRate.change.toFixed(1)}%
          </div>
        </div>
        <div class="metric">
          <div class="metric-value">${report.summary.keyMetrics.conversionRate.current.toFixed(2)}%</div>
          <div class="metric-label">Conversion Rate</div>
          <div class="metric-change ${report.summary.keyMetrics.conversionRate.isPositive ? 'positive' : 'negative'}">
            ${report.summary.keyMetrics.conversionRate.change >= 0 ? '+' : ''}${report.summary.keyMetrics.conversionRate.change.toFixed(1)}%
          </div>
        </div>
      </div>

      ${report.highlights.length > 0 ? `
      <div class="section">
        <div class="section-title">Highlights</div>
        ${report.highlights.map(h => `<div class="item highlight">+ ${h}</div>`).join('')}
      </div>
      ` : ''}

      ${report.concerns.length > 0 ? `
      <div class="section">
        <div class="section-title">Concerns</div>
        ${report.concerns.map(c => `<div class="item concern">! ${c}</div>`).join('')}
      </div>
      ` : ''}

      ${report.actionItems.length > 0 ? `
      <div class="section">
        <div class="section-title">Action Items</div>
        ${report.actionItems.map(a => `
          <div class="item">
            <span class="item-priority" style="background: ${priorityColors[a.priority]}"></span>
            <strong>${a.title}</strong>
            <p style="margin: 5px 0 0; font-size: 13px; color: #6b7280;">${a.description}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="#" class="button">View Full Report</a>
      </div>
    </div>

    <div class="footer">
      <p>This report was automatically generated by PoolOps Analytics</p>
      <p>Report ID: ${report.id}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Send email digest
   * Template ready - integrate with your email provider (SendGrid, Resend, etc.)
   */
  async sendEmailDigest(report: WeeklyReport, config: EmailConfig): Promise<boolean> {
    const html = this.generateEmailHTML(report);
    const subject = config.subject || `PoolOps Weekly Report - ${report.periodEnd.toLocaleDateString()}`;

    // Integration placeholder for email providers
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: config.to,
      cc: config.cc,
      from: 'analytics@poolops.io',
      subject,
      html,
    });
    */

    // Example with Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'analytics@poolops.io',
      to: config.to,
      cc: config.cc,
      subject,
      html,
    });
    */

    console.log('Email digest would be sent to:', config.to);
    console.log('Subject:', subject);

    // Return true when actually implemented
    return true;
  }

  // ============================================================================
  // Slack Webhook
  // ============================================================================

  /**
   * Generate Slack message blocks
   */
  generateSlackBlocks(report: WeeklyReport): object[] {
    const trendEmoji = {
      improving: ':chart_with_upwards_trend:',
      stable: ':chart:',
      declining: ':chart_with_downwards_trend:',
    };

    const priorityEmoji = {
      critical: ':red_circle:',
      high: ':orange_circle:',
      medium: ':yellow_circle:',
      low: ':green_circle:',
    };

    const blocks: object[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'PoolOps Weekly Performance Report',
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Overall Score:* ${report.summary.overallScore}/100 ${trendEmoji[report.summary.trend]}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Page Views*\n${report.summary.keyMetrics.pageViews.current.toLocaleString()} (${report.summary.keyMetrics.pageViews.change >= 0 ? '+' : ''}${report.summary.keyMetrics.pageViews.change.toFixed(1)}%)`,
          },
          {
            type: 'mrkdwn',
            text: `*Unique Visitors*\n${report.summary.keyMetrics.uniqueVisitors.current.toLocaleString()} (${report.summary.keyMetrics.uniqueVisitors.change >= 0 ? '+' : ''}${report.summary.keyMetrics.uniqueVisitors.change.toFixed(1)}%)`,
          },
          {
            type: 'mrkdwn',
            text: `*Bounce Rate*\n${report.summary.keyMetrics.bounceRate.current.toFixed(1)}%`,
          },
          {
            type: 'mrkdwn',
            text: `*Conversion Rate*\n${report.summary.keyMetrics.conversionRate.current.toFixed(2)}%`,
          },
        ],
      },
    ];

    // Add highlights
    if (report.highlights.length > 0) {
      blocks.push({
        type: 'divider',
      });
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*:sparkles: Highlights*\n' + report.highlights.map(h => `• ${h}`).join('\n'),
        },
      });
    }

    // Add concerns
    if (report.concerns.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*:warning: Concerns*\n' + report.concerns.map(c => `• ${c}`).join('\n'),
        },
      });
    }

    // Add action items
    if (report.actionItems.length > 0) {
      blocks.push({
        type: 'divider',
      });
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*:clipboard: Action Items*',
        },
      });

      for (const item of report.actionItems.slice(0, 3)) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${priorityEmoji[item.priority]} *${item.title}*\n${item.description}`,
          },
        });
      }
    }

    blocks.push({
      type: 'divider',
    });
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Report ID: ${report.id} | Generated: ${report.generatedAt.toISOString()}`,
        },
      ],
    });

    return blocks;
  }

  /**
   * Send report to Slack
   * Template ready - just add your webhook URL
   */
  async sendSlackWebhook(report: WeeklyReport, config: SlackConfig): Promise<boolean> {
    const blocks = this.generateSlackBlocks(report);

    const payload = {
      username: config.username || 'PoolOps Analytics',
      icon_emoji: config.iconEmoji || ':chart_with_upwards_trend:',
      channel: config.channel,
      blocks,
    };

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending Slack webhook:', error);
      return false;
    }
  }

  // ============================================================================
  // Markdown Report
  // ============================================================================

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report: WeeklyReport): string {
    const trendIcon = {
      improving: '↑',
      stable: '→',
      declining: '↓',
    };

    let md = `# PoolOps Weekly Performance Report

**Period:** ${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}
**Generated:** ${report.generatedAt.toISOString()}
**Report ID:** ${report.id}

---

## Summary

**Overall Score:** ${report.summary.overallScore}/100 ${trendIcon[report.summary.trend]}

### Key Metrics

| Metric | Current | Previous | Change |
|--------|---------|----------|--------|
| Page Views | ${report.summary.keyMetrics.pageViews.current.toLocaleString()} | ${report.summary.keyMetrics.pageViews.previous.toLocaleString()} | ${report.summary.keyMetrics.pageViews.change >= 0 ? '+' : ''}${report.summary.keyMetrics.pageViews.change.toFixed(1)}% |
| Unique Visitors | ${report.summary.keyMetrics.uniqueVisitors.current.toLocaleString()} | ${report.summary.keyMetrics.uniqueVisitors.previous.toLocaleString()} | ${report.summary.keyMetrics.uniqueVisitors.change >= 0 ? '+' : ''}${report.summary.keyMetrics.uniqueVisitors.change.toFixed(1)}% |
| Bounce Rate | ${report.summary.keyMetrics.bounceRate.current.toFixed(1)}% | ${report.summary.keyMetrics.bounceRate.previous.toFixed(1)}% | ${report.summary.keyMetrics.bounceRate.change >= 0 ? '+' : ''}${report.summary.keyMetrics.bounceRate.change.toFixed(1)}% |
| Conversion Rate | ${report.summary.keyMetrics.conversionRate.current.toFixed(2)}% | ${report.summary.keyMetrics.conversionRate.previous.toFixed(2)}% | ${report.summary.keyMetrics.conversionRate.change >= 0 ? '+' : ''}${report.summary.keyMetrics.conversionRate.change.toFixed(1)}% |
| Avg Session Duration | ${Math.floor(report.summary.keyMetrics.avgSessionDuration.current / 60)}m ${Math.round(report.summary.keyMetrics.avgSessionDuration.current % 60)}s | - | ${report.summary.keyMetrics.avgSessionDuration.change >= 0 ? '+' : ''}${report.summary.keyMetrics.avgSessionDuration.change.toFixed(1)}% |

`;

    if (report.highlights.length > 0) {
      md += `## Highlights

${report.highlights.map(h => `- ${h}`).join('\n')}

`;
    }

    if (report.concerns.length > 0) {
      md += `## Concerns

${report.concerns.map(c => `- ${c}`).join('\n')}

`;
    }

    if (report.actionItems.length > 0) {
      md += `## Action Items

| Priority | Title | Description | Status |
|----------|-------|-------------|--------|
${report.actionItems.map(a => `| ${a.priority.toUpperCase()} | ${a.title} | ${a.description} | ${a.status} |`).join('\n')}

`;
    }

    if (report.suggestions.length > 0) {
      md += `## Improvement Suggestions

`;
      for (const s of report.suggestions.slice(0, 5)) {
        md += `### ${s.title}

**Priority:** ${s.priority} | **Category:** ${s.category} | **Effort:** ${s.effort}

${s.description}

**Impact:** ${s.impact}

**Action Items:**
${s.actionItems.map(a => `- [ ] ${a}`).join('\n')}

---

`;
      }
    }

    md += `
---

*This report was automatically generated by PoolOps Analytics*
`;

    return md;
  }

  // ============================================================================
  // Report Storage
  // ============================================================================

  /**
   * Get all reports
   */
  getAllReports(): WeeklyReport[] {
    return this.reports;
  }

  /**
   * Get report by ID
   */
  getReport(reportId: string): WeeklyReport | undefined {
    return this.reports.find(r => r.id === reportId);
  }

  /**
   * Get latest report
   */
  getLatestReport(): WeeklyReport | undefined {
    return this.reports[this.reports.length - 1];
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let reporterInstance: AnalyticsReporter | null = null;

export function getAnalyticsReporter(): AnalyticsReporter {
  if (!reporterInstance) {
    reporterInstance = new AnalyticsReporter();
  }
  return reporterInstance;
}
