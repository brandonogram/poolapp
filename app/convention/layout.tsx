import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pool & Spa Show Special - Pool Service Software Pricing',
  description: 'Exclusive pool service software pricing for Pool & Spa Show attendees. Save $480/year with our Founder Rate. Route optimization, chemistry tracking, and invoicing.',
  openGraph: {
    title: 'Pool & Spa Show Special - PoolApp',
    description: 'Exclusive convention pricing for pool service route optimization software. Save $480/year.',
    type: 'website',
  },
};

export default function ConventionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
