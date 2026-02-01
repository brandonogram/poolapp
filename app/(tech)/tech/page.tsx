'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TechHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tech/route');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );
}
