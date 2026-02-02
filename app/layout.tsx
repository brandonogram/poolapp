import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/lib/theme-context'
import { Providers } from '@/components/providers'
import { GoogleAnalytics } from '@/components/analytics'
import Hotjar from '@/components/analytics/Hotjar'
import ScrollDepthTracker from '@/components/analytics/ScrollDepthTracker'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://poolapp-tau.vercel.app'),
  title: {
    default: 'PoolApp - Pool Service Route Optimization Software | Save $4,000+/Year',
    template: '%s | PoolApp',
  },
  description: 'Pool service software with AI-powered route optimization. Save 2 hours daily, reduce callbacks 70%, and get paid faster. Trusted by 500+ pool pros. Start free trial.',
  keywords: [
    'pool service software',
    'pool route software',
    'pool service route optimization',
    'pool chemistry tracking software',
    'pool service app',
    'pool cleaning business software',
    'pool service company software',
  ],
  authors: [{ name: 'PoolApp' }],
  creator: 'PoolApp',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://poolapp-tau.vercel.app',
    siteName: 'PoolApp',
    title: 'PoolApp - Pool Service Route Optimization Software',
    description: 'Save $4,000+/year with AI-powered route optimization. Pool service software built for pool pros.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PoolApp - Pool Service Route Optimization Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PoolApp - Pool Service Route Optimization Software',
    description: 'Save $4,000+/year with AI-powered route optimization for pool service businesses.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://poolapp-tau.vercel.app" />
        {/* Structured Data - Organization & Software Application */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PoolApp",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "iOS, Android, Web",
              "description": "Pool service software with AI-powered route optimization. Save 2 hours daily and $4,000+ per year.",
              "offers": {
                "@type": "Offer",
                "price": "59.00",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "127",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "AI-powered route optimization",
                "Pool chemistry tracking",
                "Same-day invoicing",
                "Customer portal",
                "Mobile app for technicians"
              ]
            }),
          }}
        />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('poolapp-theme');
                  var contrast = localStorage.getItem('poolapp-contrast');
                  var textSize = localStorage.getItem('poolapp-text-size');
                  var reducedMotion = localStorage.getItem('poolapp-reduced-motion');

                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                  var resolvedTheme = theme === 'dark' ? 'dark' :
                                      theme === 'light' ? 'light' :
                                      prefersDark ? 'dark' : 'light';

                  document.documentElement.classList.add(resolvedTheme);

                  if (contrast === 'high') {
                    document.documentElement.classList.add('high-contrast');
                  }

                  if (textSize === 'large') {
                    document.documentElement.classList.add('text-large');
                  }

                  if (reducedMotion === 'true' || (reducedMotion === null && prefersReducedMotion)) {
                    document.documentElement.classList.add('reduced-motion');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Providers>
            {/* Skip to main content link for keyboard users */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            {children}
          </Providers>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
        <Hotjar />
        <ScrollDepthTracker />
      </body>
    </html>
  )
}
