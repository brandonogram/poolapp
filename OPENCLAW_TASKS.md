# Tasks for OpenClaw (BrandonBot)
**Created by:** Claude Code
**Date:** 2026-02-02
**Priority:** HIGH - Activate Analytics System

---

## Context

Claude Code has built a complete analytics and continuous improvement system for PoolApp. The code is done and the build passes. Now we need to activate it with real credentials and deploy.

---

## Tasks To Complete

### 1. Create Google Analytics 4 Property
**Status:** NEEDS DOING
**Difficulty:** Easy (5 min)

1. Go to https://analytics.google.com
2. Create new GA4 property for "PoolApp"
3. Get the Measurement ID (format: `G-XXXXXXXXXX`)
4. Save it - we need this for the env vars

---

### 2. Create Hotjar Account
**Status:** NEEDS DOING
**Difficulty:** Easy (5 min)

1. Go to https://hotjar.com
2. Create free account
3. Add site: `poolapp-tau.vercel.app`
4. Get Site ID (numeric, like `1234567`)
5. Save it - we need this for the env vars

---

### 3. Set Environment Variables on Vercel
**Status:** NEEDS DOING
**Difficulty:** Easy (5 min)

Go to Vercel Dashboard → PoolApp → Settings → Environment Variables

Add these:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  (from step 1)
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX               (from step 2)
NEXT_PUBLIC_HOTJAR_VERSION=6
```

Optional (for notifications):
```
CRON_SECRET=generate-a-random-string
ANALYTICS_SLACK_WEBHOOK=https://hooks.slack.com/xxx  (if you want Slack alerts)
```

---

### 4. Deploy to Vercel
**Status:** ✅ DONE BY CLAUDE CODE
**Difficulty:** N/A

Claude Code already pushed the code:
- Commit: 1b0f821
- 105 files changed, 29,314 insertions
- Vercel auto-deploying now

Just need to add the env vars (steps 1-3) and redeploy if needed.

---

### 5. Verify Analytics Working
**Status:** AFTER DEPLOY
**Difficulty:** Easy (5 min)

1. Visit https://poolapp-tau.vercel.app
2. Check GA4 Real-Time reports - should see your visit
3. Check Vercel Analytics dashboard
4. Visit `/admin/analytics` to see internal dashboard
5. Click around to generate some events

---

### 6. Set Up GA4 Conversions (Optional but Recommended)
**Status:** AFTER DEPLOY
**Difficulty:** Medium (10 min)

In GA4 Admin → Events → Mark as conversions:
- `demo_request`
- `trial_signup`
- `checkout_start`
- `purchase_complete`

---

## What Claude Code Already Built

### Analytics Stack:
- ✅ Vercel Analytics + Speed Insights installed
- ✅ Google Analytics 4 integration ready
- ✅ Hotjar/heatmap tracking ready
- ✅ Custom event tracking (CTAs, demos, trials, checkout)
- ✅ Scroll depth tracking
- ✅ Session/funnel tracking
- ✅ Behavior analytics (rage clicks, form interactions)

### Continuous Improvement Loop:
- ✅ Rules engine with 10 auto-detection rules
- ✅ A/B testing framework
- ✅ Daily cron job (6am UTC) for analysis
- ✅ Email/Slack reporting ready
- ✅ CLI tools for monitoring

### Admin Dashboard:
- ✅ `/admin/analytics` - Visual metrics dashboard
- ✅ Recommendations tab with priority-sorted suggestions
- ✅ Trend analysis and alerts

### CLI Commands:
```bash
npm run analytics:check   # Check improvement priorities
npm run analytics:report  # Generate weekly report
npm run analytics:monitor # Continuous monitoring
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `lib/analytics/` | All analytics code |
| `components/analytics/` | React components |
| `app/api/analytics/` | API endpoints |
| `app/api/cron/analyze/` | Daily cron job |
| `app/(dashboard)/admin/analytics/` | Dashboard UI |
| `scripts/` | CLI monitoring scripts |
| `ANALYTICS_BENCHMARKS.md` | Target metrics |
| `CLAUDE_ANALYTICS_INSTRUCTIONS.md` | How to use the system |

---

## After Everything is Done

Tell Claude Code to:
1. Run `npm run analytics:check` to verify system works
2. Check the admin dashboard at `/admin/analytics`
3. Start continuous improvement work

---

**Questions?** Check `CLAUDE_ANALYTICS_INSTRUCTIONS.md` for detailed usage guide.
