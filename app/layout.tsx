import type { Metadata } from 'next'
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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
