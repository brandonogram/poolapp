import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialize Stripe to avoid build-time errors
let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return stripe;
}

export async function POST(request: NextRequest) {
  try {
    const stripeClient = getStripe();

    // If Stripe is not configured, return a demo response
    if (!stripeClient) {
      const body = await request.json();
      console.log('Stripe not configured - demo mode. Body:', body);
      return NextResponse.json({
        demoMode: true,
        message: 'Stripe not configured. In production, this would create a checkout session.',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?demo=true`,
      });
    }

    const body = await request.json();
    const { priceId, email, companyName, plan } = body;

    // Define price IDs for different plans
    const priceIds: Record<string, string> = {
      'convention-special': process.env.STRIPE_CONVENTION_PRICE_ID || 'price_convention',
      'founder': process.env.STRIPE_FOUNDER_PRICE_ID || 'price_founder',
      'growth-monthly': process.env.STRIPE_GROWTH_MONTHLY_ID || 'price_growth_monthly',
      'growth-annual': process.env.STRIPE_GROWTH_ANNUAL_ID || 'price_growth_annual',
    };

    const selectedPriceId = priceIds[priceId] || priceIds['convention-special'];

    // Create a Stripe Checkout Session
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        companyName: companyName || '',
        plan: plan || 'convention-special',
        source: 'pool-spa-show-2026',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://poolapp.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://poolapp.vercel.app'}/convention`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          source: 'pool-spa-show-2026',
          companyName: companyName || '',
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
