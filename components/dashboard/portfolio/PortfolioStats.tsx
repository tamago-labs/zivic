'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useBaseTokenPrices } from '../../../app/contexts/BaseTokenPriceProvider';
import { BASE_TOKENS } from '@/lib/tokens/base-tokens';
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react';
import { useClient } from '@solana/react';
import { useSolanaBalances } from '@/hooks/useSolanaBalances';
import { useKnownTokens } from '@/hooks/useKnownTokens';
import RiskDrawer from './RiskDrawer';
import type { AppClient } from '@/components/SolanaWalletProvider';

interface PortfolioStatsProps {
  balances: Record<string, string>;
  knownTokens: any[];
  loading: boolean;
  knownLoading: boolean;
}

const dataClient = generateClient<Schema>();

export default function PortfolioStats({ balances, knownTokens, loading, knownLoading }: PortfolioStatsProps) {
  const client = useClient<AppClient>();
  const connected = useConnectedWallet(client);
  const walletAddress = connected ? String(connected.account.address) : null;
  const { getPrice, getChange24h } = useBaseTokenPrices();
  const [riskReport, setRiskReport] = useState<any>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    dataClient.models.RiskEvaluation.get({ id: walletAddress }).then((res) => {
      if (res.data) {
        const report = typeof res.data.report === "string" ? JSON.parse(res.data.report) : res.data.report;
        setRiskReport(report);
      }
    }).catch(() => {});
  }, [walletAddress]);

  const handleEvaluate = async () => { 
    if (!walletAddress) return;
    setRiskLoading(true);
    try {
      console.log("here 1", { balances, knownTokens, loading, knownLoading });
      if (loading || knownLoading) {
        console.log("[PortfolioStats] data not loaded yet");
        return;
      }
      const holdings = [
        ...BASE_TOKENS.map((t) => {
          const balance = parseFloat(balances[t.symbol] ?? '0');
          return {
            symbol: t.symbol,
            balance,
            price: getPrice(t.symbol),
            change24h: getChange24h(t.symbol),
            type: 'base' as const,
          };
        }),
        ...knownTokens.map((t) => ({
          symbol: t.symbol,
          balance: t.balance,
          price: t.price,
          change24h: t.change,
          type: t.type,
          mint: t.mint,
        })),
      ].filter((h) => h.balance > 0);


      console.log("here 2", holdings)

      const portfolioValue = holdings.reduce((sum, h) => sum + h.balance * h.price, 0);

      console.log('[PortfolioStats] calling evaluateRisk with:', { walletAddress, holdingsCount: holdings.length, portfolioValue });
      const raw = await dataClient.mutations.evaluateRisk({
        walletAddress,
        holdings: JSON.stringify(holdings),
        portfolioValue,
      });
      console.log("raw:", raw)
      const { data } = raw
      console.log('[PortfolioStats] evaluateRisk result:', data);
      if (!data || (data as any)?.overallScore == null) {
        console.error('[PortfolioStats] evaluateRisk returned empty response');
        setEvalError('Risk evaluation returned empty response. Please try again.');
        setDrawerOpen(true);
        setRiskLoading(false);
        return;
      }
      const report = {
        ...(data as any),
        concentration: typeof (data as any).concentration === "string" ? JSON.parse((data as any).concentration) : (data as any).concentration,
        marketRisk: typeof (data as any).marketRisk === "string" ? JSON.parse((data as any).marketRisk) : (data as any).marketRisk,
        tokenRisk: typeof (data as any).tokenRisk === "string" ? JSON.parse((data as any).tokenRisk) : (data as any).tokenRisk,
      };
      setRiskReport(report);
      setDrawerOpen(true);
    } catch (err) {
      console.error('[PortfolioStats] risk eval failed:', err);
      setEvalError(err instanceof Error ? err.message : 'Unknown error');
      setDrawerOpen(true);
    } finally {
      setRiskLoading(false);
    }
  };

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
  const portfolioChange = totalValue > 0 ? (baseChange + knownChange) / totalValue * 100 : 0;

  console.log("riskReport:", riskReport)

  return (
    <>
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
            {riskReport ? riskReport.overallScore : '--'}<span className="text-[14px] text-white/30">/100</span>
          </p>
          <div className="flex items-center justify-between mt-1">
            <button
              onClick={handleEvaluate}
              disabled={riskLoading}
              className="text-[11px] text-accent hover:text-accent/80 transition-colors"
            >
              {riskLoading ? 'Evaluating...' : riskReport ? 'Evaluate Again' : 'Evaluate'}
            </button>
            {riskReport?.updatedAt && (
              <span className="text-[11px] text-white/30">
                Updated {new Date(riskReport.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
          {riskReport && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-[12px] text-accent hover:text-accent/80 transition-colors mt-1 inline-flex items-center gap-1"
            >
              View Risk Analysis <ArrowRight className="w-3 h-3" />
            </button>
          )}
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

      <RiskDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        report={riskReport}
        loading={riskLoading}
        evalError={evalError}
      />
    </>
  );
}

const themes = [
  { name: 'AI / Tech', pct: 70, color: '#6C5CE7' },
  { name: 'Finance', pct: 15, color: '#3B82F6' },
  { name: 'Consumer', pct: 15, color: '#00D2A0' },
];
