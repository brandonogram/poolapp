# CLI Monitor Setup Documentation

> Complete setup guide for the PoolApp analytics monitoring CLI tools

## Overview

This document describes the CLI monitoring system created for PoolApp. These tools are designed to be run by Claude Code in autonomous sessions to continuously monitor analytics and implement improvements.

## Components Created

### 1. Analytics Monitor (`scripts/analytics-monitor.ts`)

A Node.js script that fetches analytics data, analyzes metrics, and outputs recommendations.

**Features:**
- Single-run mode for quick checks
- Watch mode for continuous monitoring (checks every hour)
- JSON output mode for programmatic use
- Color-coded console output for quick status assessment
- Supports Vercel Analytics API (when configured)
- Fallback to simulated data for development

**Usage:**
```bash
# Single check
npx ts-node scripts/analytics-monitor.ts

# Continuous monitoring
npx ts-node scripts/analytics-monitor.ts --watch

# JSON output
npx ts-node scripts/analytics-monitor.ts --json
```

**Output includes:**
- Overall health status (healthy/warning/critical)
- Health score (0-100)
- Traffic summary
- Metric-by-metric health assessment
- Top pages performance
- Prioritized action list

### 2. Improvement Checker (`scripts/check-improvements.ts`)

Reads current metrics, compares to benchmarks, and outputs a prioritized improvement list.

**Features:**
- Analyzes 10 key metrics against benchmarks
- Calculates priority based on impact and effort
- Identifies quick wins vs long-term initiatives
- Generates actionable strategies for each metric

**Usage:**
```bash
# Default output to CURRENT_IMPROVEMENTS.md
npx ts-node scripts/check-improvements.ts

# Custom output file
npx ts-node scripts/check-improvements.ts --output custom-report.md
```

**Output includes:**
- Overall health score
- Quick wins section (low effort, high impact)
- All improvements sorted by priority
- Long-term initiatives
- Specific action items with checkboxes

### 3. Weekly Report Generator (`scripts/weekly-report.ts`)

Generates weekly performance summaries comparing current to previous week.

**Features:**
- Week-over-week metric comparison
- Automatic trend detection
- Win/concern identification
- Recommendation generation
- Goal progress tracking
- Historical data storage (last 12 weeks)

**Usage:**
```bash
# Default output to WEEKLY_REPORT.md
npx ts-node scripts/weekly-report.ts

# Custom output file
npx ts-node scripts/weekly-report.ts --output reports/week-5.md
```

**Output includes:**
- Executive summary
- Week-over-week comparison table
- Wins and concerns
- Top pages and traffic sources
- Goal progress
- Recommendations for next week

## Documentation Files Created

### 1. ANALYTICS_BENCHMARKS.md

Contains all target metrics for PoolApp:

| Category | Metrics |
|----------|---------|
| Engagement | Bounce rate, session duration, pages/session |
| Conversion | Demo request rate, pricing conversion, trial signup |
| Performance | Page load time, Core Web Vitals |
| Traffic | Mobile share, organic share |

Also includes:
- Industry benchmarks for comparison
- B2B SaaS averages
- Field service management industry data
- Goal setting framework
- Optimization priority matrix

### 2. CLAUDE_ANALYTICS_INSTRUCTIONS.md

Instructions for future Claude Code sessions:

- How to check analytics
- How to run monitoring scripts
- How to implement suggested improvements
- Checklists for optimization work
- Common improvements by category
- Key files reference
- Troubleshooting guide

## Package.json Scripts Added

The following scripts were added to package.json:

```json
{
  "scripts": {
    "analytics:check": "npx ts-node scripts/check-improvements.ts",
    "analytics:report": "npx ts-node scripts/weekly-report.ts",
    "analytics:monitor": "npx ts-node scripts/analytics-monitor.ts --watch"
  }
}
```

## File Structure

```
poolapp/
├── scripts/
│   ├── analytics-monitor.ts    # Continuous monitoring script
│   ├── check-improvements.ts   # Improvement checker script
│   └── weekly-report.ts        # Weekly report generator
├── ANALYTICS_BENCHMARKS.md     # Target metrics & benchmarks
├── CLAUDE_ANALYTICS_INSTRUCTIONS.md  # Instructions for Claude
├── CLI_MONITOR_SETUP.md        # This setup document
├── CURRENT_IMPROVEMENTS.md     # Generated improvement list
├── WEEKLY_REPORT.md            # Generated weekly report
├── .analytics-cache.json       # Cached metrics (auto-generated)
└── .analytics-history.json     # Historical data (auto-generated)
```

## Configuration

### Environment Variables

For real analytics data (optional):

```bash
# Vercel Analytics
VERCEL_TOKEN=your-vercel-api-token
VERCEL_PROJECT_ID=your-project-id

# Google Analytics (future support)
GA_PROPERTY_ID=your-ga4-property
GOOGLE_ANALYTICS_CREDENTIALS=path-to-credentials.json
```

### Benchmark Customization

Edit the benchmarks in each script's configuration section or in `ANALYTICS_BENCHMARKS.md`.

## Workflow for Claude Code Sessions

### Starting a Session

1. Run `npm run analytics:check` to assess current state
2. Review `CURRENT_IMPROVEMENTS.md` for priorities
3. Focus on P1 (Critical) items first
4. Implement changes one at a time
5. Re-run check to verify progress

### During Development

```bash
# Keep monitor running in background (optional)
npm run analytics:monitor &

# Make changes to codebase
# ...

# Verify changes don't break build
npm run build

# Commit with descriptive message
git add -A
git commit -m "feat: Implement improvement X"
```

### Weekly Review

```bash
# Generate weekly report
npm run analytics:report

# Review WEEKLY_REPORT.md for trends
# Adjust priorities based on what worked
```

## Technical Details

### Dependencies

These scripts use only Node.js built-ins:
- `fs` - File system operations
- `path` - Path utilities
- `fetch` - HTTP requests (for API calls)

No additional npm packages required.

### TypeScript Configuration

Scripts are designed to run with ts-node using the project's existing tsconfig.json. They use CommonJS-compatible imports.

### Data Storage

- `.analytics-cache.json` - Stores latest metrics (auto-created)
- `.analytics-history.json` - Stores weekly history for trending (auto-created)

Both files are auto-generated and should be added to `.gitignore` for production.

### Error Handling

All scripts include:
- Graceful fallback to simulated data
- Cache reading with error recovery
- API timeout handling
- Console warnings for non-critical issues

## Extending the System

### Adding New Metrics

1. Add benchmark definition to scripts
2. Add to ANALYTICS_BENCHMARKS.md
3. Add improvement strategies for the metric
4. Update reports to include new metric

### Connecting New Data Sources

1. Add fetch function in analytics-monitor.ts
2. Merge data in `fetchAnalyticsData()`
3. Add environment variable documentation

### Custom Reports

Create new scripts following the pattern:
1. Read from cache/API
2. Analyze against benchmarks
3. Generate output (console + markdown)
4. Save to file

## Troubleshooting

### "Module not found" errors

```bash
npm install -D ts-node typescript @types/node
```

### Scripts not running

Ensure scripts have execute permission:
```bash
chmod +x scripts/*.ts
```

### Build errors after running scripts

Scripts are standalone and shouldn't affect the build. Check for syntax errors in modified component files.

---

## Summary

This CLI monitoring system provides:

1. **Continuous Monitoring** - Watch mode for long sessions
2. **Improvement Tracking** - Prioritized action lists
3. **Weekly Reporting** - Progress comparison
4. **Clear Documentation** - Instructions for Claude Code
5. **Easy Integration** - npm scripts for quick access

The system is designed for autonomous operation by Claude Code, enabling continuous optimization of PoolApp's marketing performance without human intervention.
