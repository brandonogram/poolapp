# Claude Analytics Instructions

> Instructions for Claude Code sessions to check analytics, run monitoring scripts, and implement improvements

## Quick Start

When starting an analytics optimization session:

```bash
# 1. Check current improvement priorities
npm run analytics:check

# 2. Review the generated report
cat CURRENT_IMPROVEMENTS.md

# 3. Start implementing from Priority 1 items
```

## Available Commands

### Check Current Status

```bash
npm run analytics:check
```

This command:
- Reads current metrics from cache or simulated data
- Compares against benchmarks
- Generates prioritized improvement list
- Outputs to `CURRENT_IMPROVEMENTS.md`

### Continuous Monitoring

```bash
npm run analytics:monitor
```

This command:
- Runs in watch mode, checking every hour
- Outputs real-time health status
- Shows color-coded metric status
- Useful for long optimization sessions

For single check without watch mode:
```bash
npx ts-node scripts/analytics-monitor.ts
```

### Weekly Report

```bash
npm run analytics:report
```

This command:
- Compares current week to previous week
- Identifies wins and concerns
- Generates recommendations
- Outputs to `WEEKLY_REPORT.md`

## Understanding the Reports

### Health Status

- **[OK]** Green - Metric meets or exceeds target
- **[!!]** Yellow - Metric in warning zone, needs attention
- **[XX]** Red - Critical, prioritize immediately

### Priority Levels

1. **P1 (Critical)** - Do immediately, blocking issues
2. **P2 (High)** - This week, significant impact
3. **P3 (Medium)** - This sprint, moderate impact
4. **P4 (Low)** - Backlog, minor impact
5. **P5 (Nice to Have)** - When time permits

### Impact Ratings

- **[!] High** - Major effect on conversions/revenue
- **[~] Medium** - Moderate effect on user experience
- **[-] Low** - Minor improvements

## Implementing Improvements

### Workflow

1. Run `npm run analytics:check` to get current priorities
2. Open `CURRENT_IMPROVEMENTS.md` and review P1 items
3. Implement one improvement at a time
4. Commit changes with descriptive message
5. Re-run analytics check to verify
6. Move to next priority item

### Common Improvements by Category

#### Bounce Rate Reduction

**Files to modify:**
- `components/marketing/Hero.tsx` - Improve headline, add CTA
- `components/marketing/Header.tsx` - Improve navigation
- `app/(marketing)/page.tsx` - Page structure

**Common fixes:**
```tsx
// Add prominent CTA above the fold
<Button size="lg" className="mt-6">
  Get Your Free Demo
</Button>

// Add social proof immediately visible
<div className="flex items-center gap-2 mt-4">
  <span>Trusted by 100+ pool companies</span>
</div>
```

#### Session Duration Increase

**Files to modify:**
- `components/marketing/Features.tsx` - Make interactive
- `components/marketing/ROICalculator.tsx` - Engagement tool
- `components/marketing/Testimonials.tsx` - Social proof

**Common fixes:**
```tsx
// Add interactive elements
const [activeFeature, setActiveFeature] = useState(0);

// Add video content
<video autoPlay muted loop className="rounded-lg">
  <source src="/demo.mp4" type="video/mp4" />
</video>
```

#### Demo Request Rate

**Files to modify:**
- `components/marketing/FinalCTA.tsx` - Demo form
- All pages - Add demo CTA

**Common fixes:**
```tsx
// Reduce form fields
<form>
  <Input type="email" placeholder="Work email" required />
  <Input type="text" placeholder="Company name" />
  <Button type="submit">Get Free Demo</Button>
</form>

// Add urgency
<p className="text-sm text-muted">
  Free 30-day trial. No credit card required.
</p>
```

#### Page Load Speed

**Commands to run:**
```bash
# Check current bundle size
npm run build && ls -la .next/static/chunks

# Analyze bundle
npx @next/bundle-analyzer

# Optimize images
npx next-image-optimize
```

**Common fixes:**
- Add `loading="lazy"` to images below fold
- Use `next/image` for automatic optimization
- Move non-critical JS to dynamic imports

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

## Checklist for Optimization Sessions

### Before Starting

- [ ] Run `npm run analytics:check`
- [ ] Review `CURRENT_IMPROVEMENTS.md`
- [ ] Note top 3 priorities
- [ ] Ensure dev server runs: `npm run dev`

### During Implementation

- [ ] Focus on one improvement at a time
- [ ] Test changes locally
- [ ] Check for regressions
- [ ] Commit with clear message

### After Changes

- [ ] Run `npm run build` to verify no errors
- [ ] Run `npm run analytics:check` to re-verify
- [ ] Update CURRENT_IMPROVEMENTS.md if needed
- [ ] Deploy and monitor

## Key Files Reference

### Marketing Components

| File | Purpose |
|------|---------|
| `components/marketing/Hero.tsx` | Main landing section |
| `components/marketing/Features.tsx` | Feature showcase |
| `components/marketing/Pricing.tsx` | Pricing tiers |
| `components/marketing/ROICalculator.tsx` | Interactive calculator |
| `components/marketing/Testimonials.tsx` | Customer stories |
| `components/marketing/FAQ.tsx` | Common questions |
| `components/marketing/FinalCTA.tsx` | Conversion CTA |

### Analytics Scripts

| File | Purpose |
|------|---------|
| `scripts/analytics-monitor.ts` | Continuous monitoring |
| `scripts/check-improvements.ts` | Improvement checker |
| `scripts/weekly-report.ts` | Weekly comparison |

### Output Files

| File | Purpose |
|------|---------|
| `CURRENT_IMPROVEMENTS.md` | Priority action items |
| `WEEKLY_REPORT.md` | Weekly performance |
| `.analytics-cache.json` | Cached metrics |
| `.analytics-history.json` | Historical data |

## Troubleshooting

### "No analytics data available"

The scripts use simulated data when real API connections aren't configured. This is expected for development.

To connect real analytics:
```bash
# Set environment variables
export VERCEL_TOKEN="your-token"
export VERCEL_PROJECT_ID="your-project-id"
```

### "TypeScript errors when running scripts"

Ensure ts-node is available:
```bash
npm install -D ts-node typescript
```

### "Build fails after changes"

```bash
# Check for errors
npm run build

# Common fixes
npm run lint -- --fix
```

## Sample Optimization Session

```bash
# Start session
npm run analytics:check
# Output shows bounceRate at 62% (critical)

# Read the improvement file
cat CURRENT_IMPROVEMENTS.md
# Priority 1: Reduce bounce rate

# Make changes to Hero.tsx
# - Add clearer value prop
# - Make CTA more prominent
# - Add social proof

# Test locally
npm run dev
# Verify at localhost:3000

# Build check
npm run build

# Commit
git add -A
git commit -m "feat: Improve hero section to reduce bounce rate

- Added clearer value proposition
- Made CTA button more prominent
- Added customer count social proof"

# Re-check analytics
npm run analytics:check
# Verify improvement is tracked

# Continue with next priority
```

## Performance Targets Quick Reference

| Metric | Target | Current Check |
|--------|--------|---------------|
| Bounce Rate | <50% | `npm run analytics:check` |
| Session Duration | >2 min | `npm run analytics:check` |
| Pages/Session | >2 | `npm run analytics:check` |
| Demo Request Rate | >3% | `npm run analytics:check` |
| Pricing Conversion | >5% | `npm run analytics:check` |
| Page Load Time | <2s | Lighthouse audit |

---

*This document is for Claude Code autonomous sessions. Follow these instructions to optimize PoolApp analytics.*
