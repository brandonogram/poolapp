import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to PoolApp - Setup Complete',
  description: 'Your PoolApp account is ready. Start optimizing your pool service routes and saving time today.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
