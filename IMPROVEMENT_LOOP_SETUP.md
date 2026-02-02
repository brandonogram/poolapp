# Automated Improvement Loop System

A comprehensive system for continuously analyzing website performance and suggesting/implementing improvements for PoolApp.

## Overview

This system provides:
- Continuous metrics collection and analysis
- Rule-based improvement suggestions
- A/B testing framework
- Automated reporting via email and Slack
- Vercel cron job for daily analysis

## Architecture

```
lib/analytics/
├── improvement-loop.ts   # Core analysis engine
├── rules-engine.ts       # Rule definitions and evaluation
├── ab-testing.ts         # A/B testing framework
└── reporter.ts           # Report generation and notifications

app/api/cron/
└── analyze/
    └── route.ts          # Cron job endpoint

vercel.json               # Cron configuration
IMPROVEMENT_SUGGESTIONS.md # Auto-updated recommendations
```

## Components

### 1. Improvement Loop (`lib/analytics/improvement-loop.ts`)

The core engine that:
- Fetches metrics from analytics APIs (Vercel, Google Analytics)
- Analyzes patterns and trends
- Generates improvement suggestions
- Maintains historical data for comparison

**Key Classes/Functions:**
- `ImprovementLoopEngine` - Main analysis engine
- `fetchVercelAnalytics()` - Vercel Analytics API integration
- `fetchGoogleAnalytics()` - Google Analytics 4 integration
- `aggregateMetrics()` - Combine metrics from multiple sources
- `suggestionsToMarkdown()` - Export suggestions as markdown

**Usage:**
```typescript
import { getImprovementEngine, aggregateMetrics, fetchVercelAnalytics } from '@/lib/analytics/improvement-loop';

const engine = getImprovementEngine();
const metrics = await aggregateMetrics([
  () => fetchVercelAnalytics(projectId, startDate, endDate),
]);
const analysis = await engine.runAnalysis(metrics);
```

### 2. Rules Engine (`lib/analytics/rules-engine.ts`)

Defines rules that automatically trigger suggestions based on metrics:

| Rule | Trigger Condition | Priority |
|------|-------------------|----------|
| High Bounce Rate | bounce_rate > 60% | High |
| Critical Bounce Rate | bounce_rate > 75% | Critical |
| Pricing Page Exits | pricing_exit_rate > 40% | High |
| Mobile Conversion Gap | mobile > 40% & conversion < 2% | High |
| Underperforming Pages | page_bounce > 70% | Medium |
| Low Session Duration | avg_session < 2min | Medium |
| Low Conversion Rate | conversion < 2% | High |
| Low Organic Traffic | organic < 25% | Medium |
| Low Pages Per Session | pages_per_session < 2.5 | Medium |
| Demo Page Performance | demo_bounce > 30% | High |

**Custom Rules:**
```typescript
import { RuleBuilder, RulesEngine } from '@/lib/analytics/rules-engine';

const customRule = new RuleBuilder()
  .id('custom-rule')
  .name('Custom Rule')
  .category('conversion')
  .condition((m) => m.conversionRate < 1.5)
  .priority((m) => 80)
  .generateResult((m) => ({
    // ... rule result
  }))
  .build();

const engine = new RulesEngine();
engine.addRule(customRule);
```

### 3. A/B Testing (`lib/analytics/ab-testing.ts`)

Simple A/B testing framework with:
- Variant selection (consistent hashing)
- Results tracking
- Statistical significance calculation
- Winner determination

**Creating a Test:**
```typescript
import { getABTestingEngine } from '@/lib/analytics/ab-testing';

const abEngine = getABTestingEngine();
const test = abEngine.createTest({
  name: 'CTA Button Test',
  description: 'Testing different CTA button colors',
  hypothesis: 'A green CTA will increase conversions',
  targetPage: '/pricing',
  targetElement: '#cta-button',
  variants: [
    { name: 'Control', description: 'Blue button', isControl: true, data: { color: 'blue' } },
    { name: 'Variant A', description: 'Green button', isControl: false, data: { color: 'green' } },
  ],
});

abEngine.startTest(test.id);
```

**Using in Components:**
```typescript
const variant = abEngine.getVariantForUser(testId, userId);
abEngine.trackImpression(testId, variant.id);
// When user converts:
abEngine.trackConversion(testId, variant.id);
```

**Analyzing Results:**
```typescript
const result = abEngine.analyzeTest(testId);
// result.status: 'inconclusive' | 'control_wins' | 'variant_wins'
// result.confidenceReached: boolean
// result.improvement: number (percentage)
```

### 4. Reporter (`lib/analytics/reporter.ts`)

Generates reports and sends notifications:

**Weekly Report:**
```typescript
import { getAnalyticsReporter } from '@/lib/analytics/reporter';

const reporter = getAnalyticsReporter();
const report = reporter.generateWeeklyReport(currentAnalysis, previousAnalysis, abTestResults);

// Get HTML email
const html = reporter.generateEmailHTML(report);

// Get Slack blocks
const blocks = reporter.generateSlackBlocks(report);

// Get Markdown
const md = reporter.generateMarkdownReport(report);
```

**Email Integration:**
```typescript
// SendGrid example
await reporter.sendEmailDigest(report, {
  to: ['team@company.com'],
  subject: 'Weekly Performance Report',
});
```

**Slack Integration:**
```typescript
await reporter.sendSlackWebhook(report, {
  webhookUrl: process.env.SLACK_WEBHOOK_URL,
  channel: '#analytics',
});
```

### 5. Cron Job (`app/api/cron/analyze/route.ts`)

Vercel cron endpoint that:
- Runs daily at 6am UTC
- Aggregates metrics from all sources
- Runs rules engine
- Generates weekly reports (on Sundays)
- Sends notifications

**Manual Trigger:**
```bash
curl -X POST https://your-domain.com/api/cron/analyze \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"generateReport": true, "sendNotifications": true}'
```

## Setup

### 1. Environment Variables

Add to `.env.local`:

```env
# Analytics APIs
VERCEL_ANALYTICS_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_project_id

# Google Analytics (optional)
GA4_PROPERTY_ID=your_ga4_property
GOOGLE_ANALYTICS_CREDENTIALS=base64_encoded_credentials

# Cron Security
CRON_SECRET=your_cron_secret
ANALYTICS_API_KEY=your_api_key

# Notifications
ANALYTICS_EMAIL_RECIPIENTS=email1@example.com,email2@example.com
ANALYTICS_SLACK_WEBHOOK=https://hooks.slack.com/services/xxx
ANALYTICS_SLACK_CHANNEL=#analytics
```

### 2. Vercel Configuration

The `vercel.json` includes:
- Cron schedule: Daily at 6am UTC
- Extended function timeout (60s) for analysis

```json
{
  "crons": [
    {
      "path": "/api/cron/analyze",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### 3. Email Provider Setup

Choose and configure an email provider:

**SendGrid:**
```typescript
// In reporter.ts sendEmailDigest()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send({ to, from, subject, html });
```

**Resend:**
```typescript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({ from, to, subject, html });
```

### 4. Slack Webhook Setup

1. Go to [Slack App Directory](https://slack.com/apps)
2. Create an "Incoming Webhook"
3. Copy the webhook URL
4. Add to environment variables

## Usage Examples

### Viewing Current Suggestions

Check `IMPROVEMENT_SUGGESTIONS.md` for the latest auto-generated recommendations.

### Running Manual Analysis

```typescript
// In a server action or API route
import { getImprovementEngine, aggregateMetrics } from '@/lib/analytics/improvement-loop';

async function analyzeNow() {
  const engine = getImprovementEngine();
  const metrics = await aggregateMetrics([/* sources */]);
  const analysis = await engine.runAnalysis(metrics);

  console.log('Score:', analysis.summary.overallScore);
  console.log('Critical issues:', analysis.summary.criticalCount);
  console.log('Suggestions:', analysis.suggestions);
}
```

### Creating Custom Rules

```typescript
import { RuleBuilder, RulesEngine } from '@/lib/analytics/rules-engine';

const engine = new RulesEngine();

// Add a custom rule for specific page performance
engine.addRule(
  new RuleBuilder()
    .id('signup-page-bounce')
    .name('Signup Page Bounce')
    .category('conversion')
    .condition((m) => {
      const signupPage = m.pageMetrics.find(p => p.path === '/signup');
      return signupPage ? signupPage.bounceRate > 50 : false;
    })
    .priority(() => 85)
    .generateResult((m) => ({
      // ... result configuration
    }))
    .build()
);
```

### Running A/B Tests

```typescript
// 1. Create test
const test = abEngine.createTest({
  name: 'Pricing Layout',
  description: 'Test horizontal vs vertical pricing cards',
  hypothesis: 'Horizontal layout will improve comparison and increase conversions',
  targetPage: '/pricing',
  targetElement: '.pricing-cards',
  variants: [
    { name: 'Vertical', isControl: true, data: { layout: 'vertical' } },
    { name: 'Horizontal', isControl: false, data: { layout: 'horizontal' } },
  ],
  minimumSampleSize: 1000,
  confidenceLevel: 95,
});

// 2. Start test
abEngine.startTest(test.id);

// 3. In your component
const variant = abEngine.getVariantForUser(test.id, userId);
const layout = variant?.data.layout || 'vertical';

// 4. Track events
abEngine.trackImpression(test.id, variant.id);
abEngine.trackConversion(test.id, variant.id);

// 5. Analyze results
const results = abEngine.analyzeTest(test.id);
if (results.confidenceReached) {
  console.log('Winner:', results.winningVariant);
  console.log('Improvement:', results.improvement + '%');
}
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel Cron (6am UTC)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Aggregate Metrics                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Vercel    │  │   Google    │  │   Custom    │              │
│  │  Analytics  │  │  Analytics  │  │   Sources   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Rules Engine                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Evaluate each rule against metrics                      │    │
│  │  Generate suggestions for triggered rules                │    │
│  │  Calculate priorities                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Analysis Result                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Summary   │  │ Suggestions │  │  A/B Tests  │              │
│  │   Score     │  │   List      │  │   Status    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Outputs                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Email     │  │   Slack     │  │  Markdown   │              │
│  │   Report    │  │   Message   │  │   File      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Extending the System

### Adding New Metrics Sources

```typescript
// In improvement-loop.ts
export async function fetchCustomSource(
  startDate: Date,
  endDate: Date
): Promise<Partial<AnalyticsMetrics>> {
  const response = await fetch('https://api.custom.com/metrics');
  const data = await response.json();

  return {
    pageViews: data.views,
    uniqueVisitors: data.uniques,
    // ... map to AnalyticsMetrics
  };
}

// Use in aggregation
const metrics = await aggregateMetrics([
  () => fetchVercelAnalytics(projectId, start, end),
  () => fetchCustomSource(start, end),
]);
```

### Adding New Rules

Follow the `ImprovementRule` interface in `rules-engine.ts`:

```typescript
const newRule: ImprovementRule = {
  id: 'unique-id',
  name: 'Human Readable Name',
  description: 'What this rule checks',
  category: 'conversion', // conversion | engagement | ux | content | technical | mobile
  condition: (metrics) => /* boolean */,
  priority: (metrics) => /* 0-100 */,
  enabled: true,
  generateResult: (metrics) => ({
    ruleId: 'unique-id',
    triggered: true,
    priority: 70,
    category: 'conversion',
    title: 'Suggestion Title',
    description: 'Detailed description...',
    impact: 'Expected impact...',
    effort: 'low' | 'medium' | 'high',
    metrics: { current: 10, benchmark: 20, unit: '%' },
    actions: ['Action 1', 'Action 2'],
    suggestedTest: { name: '...', hypothesis: '...', variants: ['A', 'B'] },
  }),
};
```

### Customizing Reports

Modify `reporter.ts` to add custom sections or change formatting:

```typescript
// Add custom section to email
const customSection = `
  <div class="section">
    <h3>Custom Insights</h3>
    ${customData.map(d => `<p>${d}</p>`).join('')}
  </div>
`;
```

## Troubleshooting

### Cron Job Not Running

1. Check Vercel deployment logs
2. Verify `vercel.json` is deployed
3. Check cron secret in environment variables

### No Metrics Data

1. Verify `VERCEL_ANALYTICS_TOKEN` is set
2. Check API permissions
3. Look at mock data fallback in logs

### Notifications Not Sending

1. Verify webhook URLs are correct
2. Check email provider credentials
3. Test manually with curl

## Files Reference

| File | Description |
|------|-------------|
| `lib/analytics/improvement-loop.ts` | Core analysis engine and metrics aggregation |
| `lib/analytics/rules-engine.ts` | Rule definitions and evaluation logic |
| `lib/analytics/ab-testing.ts` | A/B testing framework |
| `lib/analytics/reporter.ts` | Report generation and notifications |
| `app/api/cron/analyze/route.ts` | Cron job API endpoint |
| `vercel.json` | Vercel configuration with cron schedule |
| `IMPROVEMENT_SUGGESTIONS.md` | Auto-updated recommendations |

---

Built for PoolApp - Automated Website Improvement System
