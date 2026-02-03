'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

export default function QRPage() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Use the deployed URL or fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                    (typeof window !== 'undefined' ? window.location.origin : 'https://poolops.io');
    setUrl(`${baseUrl}/convention`);
  }, []);

  if (!url) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-900">PoolOps</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Scan to Save $4K+/Year</h1>
          <p className="text-slate-600">Pool & Spa Show 2026 Exclusive</p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl shadow-blue-500/20 border-4 border-blue-500 inline-block mb-8">
          <QRCodeSVG
            value={url}
            size={280}
            level="H"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#0066FF"
          />
        </div>

        {/* URL Display */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-mono text-sm">
            {url}
          </div>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">38%</div>
            <div className="text-xs text-slate-500">Less driving</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">2hr</div>
            <div className="text-xs text-slate-500">Saved daily</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">$79</div>
            <div className="text-xs text-slate-500">/mo special</div>
          </div>
        </div>

        {/* Print instructions */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-slate-400 text-sm">
          <p>Print this page for the convention floor</p>
          <button
            onClick={() => window.print()}
            className="mt-2 text-blue-600 hover:underline"
          >
            Print QR Code
          </button>
        </div>
      </motion.div>
    </div>
  );
}
