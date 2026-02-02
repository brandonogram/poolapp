'use client';

import Script from 'next/script';

/**
 * Hotjar tracking component for heatmaps and session recordings
 *
 * To set up Hotjar:
 * 1. Create an account at https://www.hotjar.com
 * 2. Add your site and get your Site ID
 * 3. Add NEXT_PUBLIC_HOTJAR_ID to your .env.local
 *
 * Features enabled:
 * - Heatmaps (click, move, scroll)
 * - Session recordings
 * - Feedback widgets
 * - Surveys
 */
export default function Hotjar() {
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;
  const hotjarVersion = process.env.NEXT_PUBLIC_HOTJAR_VERSION || '6';

  // Don't render if Hotjar ID is not configured
  if (!hotjarId) {
    return null;
  }

  return (
    <Script
      id="hotjar-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjarId},hjsv:${hotjarVersion}};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
      }}
    />
  );
}

/**
 * Hotjar event tracking helper
 * Use this to track custom events in Hotjar
 */
export function trackHotjarEvent(eventName: string) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('event', eventName);
  }
}

/**
 * Hotjar state tag helper
 * Use this to tag sessions with state information
 */
export function tagHotjarSession(tags: string[]) {
  if (typeof window !== 'undefined' && window.hj) {
    const hj = window.hj;
    hj('stateChange', window.location.pathname);
    tags.forEach((tag) => {
      hj('tagRecording', [tag]);
    });
  }
}

/**
 * Hotjar user identification helper
 * Use this to identify users in session recordings
 */
export function identifyHotjarUser(userId: string, attributes?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('identify', userId, attributes || {});
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hj?: (command: string, ...args: unknown[]) => void;
  }
}
