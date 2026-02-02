'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GTM_ID, isGTMEnabled, gtmPageView } from '@/lib/analytics';

/**
 * Inner component that handles route change tracking
 * Separated to properly handle Suspense boundary for useSearchParams
 */
function GTMTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isGTMEnabled()) return;

    // Track page view on route change
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    gtmPageView(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Google Tag Manager Component
 *
 * Alternative to direct GA4 implementation.
 * GTM allows marketing teams to manage tags without code changes.
 *
 * This component:
 * 1. Loads the GTM script in the head
 * 2. Adds the noscript iframe fallback
 * 3. Tracks page views on route changes
 *
 * Usage:
 * Add to app/layout.tsx:
 * ```tsx
 * import { GoogleTagManager, GTMNoScript } from '@/components/analytics/GoogleTagManager';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <GoogleTagManager />
 *       </head>
 *       <body>
 *         <GTMNoScript />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function GoogleTagManager() {
  // Don't render anything if GTM is not configured
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') {
    return null;
  }

  return (
    <>
      {/* Load the GTM script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />

      {/* Track route changes */}
      <Suspense fallback={null}>
        <GTMTracker />
      </Suspense>
    </>
  );
}

/**
 * GTM NoScript Fallback
 * Place this immediately after the opening <body> tag
 */
export function GTMNoScript() {
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

export default GoogleTagManager;
