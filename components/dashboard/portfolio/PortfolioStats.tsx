'use client';

import { useClient } from '@solana/react';
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react';
import { useBaseTokenPrices } from '../../../app/contexts/BaseTokenPriceProvider';
import { BASE_TOKENS } from '@/lib/tokens/base-tokens';
import type { AppClient } from '@/components/SolanaWalletProvider';
import type { KnownToken } from '@/hooks/useKnownTokens';

interface PortfolioStatsProps {
  balances: Record<string, string>;
  knownTokens: KnownToken[];
  loading: boolean;
  knownLoading: boolean;
}

export default function PortfolioStats({ balances, knownTokens, loading, knownLoading }: PortfolioStatsProps) {
  const { getPrice, getChange24h } = useBaseTokenPrices();

  if (loading || knownLoading) {
    return (
      <div className="w-72 shrink-0 bg-surface border border-border3/50 rounded-xl p-5 flex flex-col gap-4">
        <div>
          <p className="text-[12px] text-white/40 mb-1">Portfolio Value</p>
          <div className="h-6 w-24 bg-white/[0.05] rounded animate-pulse" />
          <div className="h-3 w-16 bg-white/[0.05] rounded animate-pulse mt-2" />
        </div>
        <div>
          <p className="text-[12px] text-white/40 mb-1">Risk Score</p>
          <div className="h-5 w-20 bg-white/[0.05] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const baseValue = BASE_TOKENS.reduce((sum, token) => {
    const balance = parseFloat(balances[token.symbol] ?? '0');
    return sum + balance * getPrice(token.symbol);
  }, 0);

  const knownValue = knownTokens.reduce((sum, t) => sum + (t.value ?? 0), 0);
  const totalValue = baseValue + knownValue;

  const baseChange = BASE_TOKENS.reduce((sum, token) => {
    const balance = parseFloat(balances[token.symbol] ?? '0');
    return sum + balance * getChange24h(token.symbol);
  }, 0);

  const knownChange = knownTokens.reduce((sum, t) => sum + (t.value ?? 0) * (t.change ?? 0) / 100, 0);

  const portfolioChange = totalValue > 0
    ? (baseChange + knownChange) / totalValue * 100
    : 0;

  return (
    <div className="w-72 shrink-0 bg-surface border border-border3/50 rounded-xl p-5 flex flex-col gap-4">
      <div>
        <p className="text-[12px] text-white/40 mb-1">Portfolio Value</p>
        <p className="text-[24px] font-display font-bold">
          ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <p className={`text-[13px] mt-1 ${portfolioChange >= 0 ? 'text-accent2' : 'text-warn2'}`}>
          {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% today
        </p>
      </div>
      <div>
        <p className="text-[12px] text-white/40 mb-1">Risk Score</p>
        <p className="text-[20px] font-display font-bold">
          {riskScore}<span className="text-[14px] text-white/30">/100</span>
        </p>
        <p className="text-[12px] text-white/40 mt-0.5">Balanced</p>
      </div>
      <div className="mt-auto">
        <p className="text-[12px] text-white/40 mb-3">Theme Exposure</p>
        <div className="space-y-3">
          {themes.map((theme) => (
            <div key={theme.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-white/60">{theme.name}</span>
                <span className="text-[12px] font-medium text-white/80">{theme.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${theme.pct}%`, backgroundColor: theme.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const riskScore = 68;

const themes = [
  { name: 'AI / Tech', pct: 70, color: '#6C5CE7' },
  { name: 'Finance', pct: 15, color: '#3B82F6' },
  { name: 'Consumer', pct: 15, color: '#00D2A0' },
];
