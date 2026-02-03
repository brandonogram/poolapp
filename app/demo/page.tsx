'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDemoStorage, setDemoMode } from '@/lib/demo-session';

type DemoTarget = 'dashboard' | 'tech/route';

export default function DemoRedirectPage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState<DemoTarget | null>(null);

  const startDemo = (target: DemoTarget, role: 'Owner' | 'Technician') => {
    setIsStarting(target);
    setDemoMode(true);
    const storage = getDemoStorage() ?? sessionStorage;
    storage.setItem('poolapp_demo_session', JSON.stringify({
      user: { email: 'demo@poolops.io', name: role === 'Owner' ? 'Demo Owner' : 'Demo Tech', role },
      company: 'Blue Wave Pool Services',
      loggedIn: true,
    }));
    storage.removeItem('poolops-demo-tour-dismissed');
    router.push(`/${target}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200/70">PoolOps Demo</p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold">Choose a demo path in 15 seconds.</h1>
            <p className="mt-3 text-white/70 max-w-2xl">
              This demo is fully interactive. Data you add will persist for this tab only and reset when the tab is closed.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M4 7h16M6 17h12" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-semibold">Owner Dashboard</h2>
                  <p className="text-sm text-white/60">Revenue, schedule, routes, and customer insights.</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Route optimization and time windows</li>
                <li>Schedule a visit and assign a tech</li>
                <li>Alerts that prevent callbacks</li>
              </ul>
              <button
                onClick={() => startDemo('dashboard', 'Owner')}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
              >
                {isStarting === 'dashboard' ? 'Starting…' : 'Start Owner Demo'}
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-semibold">Tech Mobile</h2>
                  <p className="text-sm text-white/60">Offline-ready route, stop checklists, and photos.</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Complete a stop with chemical readings</li>
                <li>Upload photos and leave notes</li>
                <li>Offline queue with sync when online</li>
              </ul>
              <button
                onClick={() => startDemo('tech/route', 'Technician')}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-300"
              >
                {isStarting === 'tech/route' ? 'Starting…' : 'Start Tech Demo'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span>Demo login is not required.</span>
            <span>Need the main site?</span>
            <Link href="/" className="text-blue-200 hover:text-blue-100">
              Back to PoolOps.io
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
