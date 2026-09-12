'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

const stocks = [
  { ticker: 'NVDAx', name: 'NVIDIA', price: 87.42, change: 5.2, mcap: '$2.14T', volume: '$42.8B', theme: 'AI / Tech' },
  { ticker: 'MSFTx', name: 'Microsoft', price: 378.91, change: 2.1, mcap: '$2.81T', volume: '$28.4B', theme: 'Technology' },
  { ticker: 'GOOGLx', name: 'Alphabet', price: 141.80, change: -1.3, mcap: '$1.78T', volume: '$18.2B', theme: 'AI / Tech' },
  { ticker: 'METAx', name: 'Meta', price: 528.42, change: 4.8, mcap: '$1.34T', volume: '$22.1B', theme: 'AI / Social' },
  { ticker: 'AAPLx', name: 'Apple', price: 195.89, change: 0.9, mcap: '$3.05T', volume: '$15.7B', theme: 'Technology' },
  { ticker: 'AMZNx', name: 'Amazon', price: 186.40, change: 3.1, mcap: '$1.94T', volume: '$19.8B', theme: 'Consumer / AI' },
  { ticker: 'TSLAx', name: 'Tesla', price: 248.50, change: -2.4, mcap: '$789B', volume: '$32.5B', theme: 'Auto / AI' },
  { ticker: 'JPMx', name: 'JPMorgan', price: 198.22, change: 1.5, mcap: '$571B', volume: '$8.4B', theme: 'Finance' },
];

export default function Explore() {
  const [search, setSearch] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const themes = ['All', 'AI / Tech', 'Technology', 'Consumer', 'Finance', 'Auto'];

  const filtered = stocks.filter((s) => {
    const matchSearch = s.ticker.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
    const matchTheme = !selectedTheme || selectedTheme === 'All' || s.theme.includes(selectedTheme);
    return matchSearch && matchTheme;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search xStocks by name or ticker…"
            className="w-full bg-surface border border-border3 rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTheme(t)}
            className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
              selectedTheme === t
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'text-white/40 border-border3 hover:text-white/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border3/50 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_80px_80px_100px_100px] gap-4 px-5 py-3 border-b border-border3/50 text-[11px] text-white/30 font-medium uppercase tracking-wide">
          <span>Asset</span>
          <span>Name</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h</span>
          <span className="text-right">MCap</span>
          <span className="text-right">Volume</span>
        </div>
        {filtered.map((s) => (
          <div key={s.ticker} className="grid grid-cols-[1fr_1fr_80px_80px_100px_100px] gap-4 px-5 py-3 border-b border-border3/20 hover:bg-white/[0.02] transition-colors items-center">
            <span className="font-mono text-[13px] font-semibold">{s.ticker}</span>
            <span className="text-[13px] text-white/60">{s.name}</span>
            <span className="text-[13px] text-white/70 text-right">${s.price}</span>
            <span className={`text-[13px] text-right ${s.change >= 0 ? 'text-accent2' : 'text-warn2'}`}>
              {s.change >= 0 ? '+' : ''}{s.change}%
            </span>
            <span className="text-[12px] text-white/40 text-right">{s.mcap}</span>
            <span className="text-[12px] text-white/40 text-right">{s.volume}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
