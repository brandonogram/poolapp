# Deploy Pool App Tonight - Quick Steps

## Option 1: Vercel (Recommended - 5 minutes)

### Step 1: Connect to Vercel
```bash
vercel login
vercel link  # Select your project or create new
```

### Step 2: Set Environment Variables
Go to https://vercel.com/your-project/settings/environment-variables

Add these variables:
```
STRIPE_SECRET_KEY=sk_live_xxx  (or sk_test_xxx for testing)
STRIPE_CONVENTION_PRICE_ID=price_xxx
STRIPE_FOUNDER_PRICE_ID=price_xxx
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### Step 3: Deploy
```bash
vercel --prod
```

### Step 4: Test
- Visit https://your-app.vercel.app/convention
- Visit https://your-app.vercel.app/qr (print this for tomorrow!)
- Try the demo: https://your-app.vercel.app/login (demo@poolapp.com / demo123)

---

## Option 2: Skip Stripe (Demo Only)

If you don't have time for Stripe setup:
1. Just deploy without STRIPE_SECRET_KEY
2. The app will work in "demo mode"
3. Collect emails manually at the convention
4. Set up Stripe later and follow up with customers

---

## Stripe Setup (if you have 20 minutes)

### Create Products in Stripe Dashboard
1. Go to https://dashboard.stripe.com/products
2. Create product "Pool App - Convention Special"
   - Price: $79/month, recurring
   - Copy the price ID (starts with price_)
3. Create product "Pool App - Founder Rate"
   - Price: $59/month, recurring
   - Copy the price ID

### Add Price IDs to Vercel
```
STRIPE_CONVENTION_PRICE_ID=price_xxx_convention
STRIPE_FOUNDER_PRICE_ID=price_xxx_founder
```

---

## URLs to Remember

| Page | URL | Purpose |
|------|-----|---------|
| Convention Signup | /convention | Main signup page with pricing |
| QR Code | /qr | Print this! Shows scannable QR |
| Mobile Landing | /m | Super mobile-optimized version |
| Demo Login | /login | Show dashboard (demo@poolapp.com / demo123) |
| Demo Dashboard | /dashboard | Main product demo |
| Routes Demo | /routes | Show route optimization |

---

## Quick Test Checklist

- [ ] /convention loads and shows pricing
- [ ] /qr shows QR code and prints correctly
- [ ] /login works with demo credentials
- [ ] /dashboard shows compelling mock data
- [ ] /routes shows route optimization

---

## If Something Breaks

1. The app works fine in demo mode without Stripe
2. Just collect emails and set up payments later
3. Use the /m page if regular pages look broken
4. Emergency fallback: Show screenshots from the CONVENTION_PLAYBOOK.md

Good luck tomorrow!
