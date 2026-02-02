'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_MEASUREMENT_ID, trackPageView, initGA, isGAEnabled } from '@/lib/analytics';

/**
 * Inner component that handles route change tracking
 * Separated to properly handle Suspense boundary for useSearchParams
 */
function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isGAEnabled()) return;

    // Track page view on route change
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Google Analytics 4 Component
 *
 * This component:
 * 1. Loads the GA4 gtag.js script with afterInteractive strategy
 * 2. Initializes GA4 configuration
 * 3. Tracks page views on route changes
 *
 * Usage:
 * Add to app/layout.tsx:
 * ```tsx
 * import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <GoogleAnalytics />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function GoogleAnalytics() {
  // Don't render anything if GA is not configured
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      {/* Load the GA4 gtag.js script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        id="ga4-script"
      />

      {/* Initialize GA4 */}
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />

      {/* Track route changes */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  );
}

export default GoogleAnalytics;
