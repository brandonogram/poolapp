import type { Metadata } from 'next'
import { ThemeProvider } from '@/lib/theme-context'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pool App - Stop Wasting Time Driving Between Pools',
  description: 'Route optimization software for pool cleaning companies. Save $4,000+/year in fuel and service 4-6 more pools per day.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      </body>
    </html>
  )
}
