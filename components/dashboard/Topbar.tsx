'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';

export default function Topbar() {
  const [connected, setConnected] = useState(false);

  return (
    <header className="h-14 border-b border-border3/50 bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-[14px] font-semibold text-white/80">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setConnected(!connected)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
            connected
              ? 'bg-accent2/10 text-accent2 border border-accent2/20'
              : 'bg-accent text-white hover:bg-accent/80'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          {connected ? '0x7a3…f2d1' : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
