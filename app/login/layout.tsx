import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Pool Service Software Dashboard',
  description: 'Sign in to your PoolApp account. Access route optimization, chemistry tracking, and pool service management tools.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
