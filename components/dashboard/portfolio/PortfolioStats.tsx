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
import RebalanceDrawer from '../../portfolio/RebalanceDrawer';
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
  const [rebalanceDrawerOpen, setRebalanceDrawerOpen] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    dataClient.models.RiskEvaluation.get({ id: walletAddress }).then((res) => {
      if (res.data) {
        const report = typeof res.data.report === "string" ? JSON.parse(res.data.report) : res.data.report;
        if (res.data.rebalanceSuggestions) {
          try {
            report.rebalanceSuggestions = typeof res.data.rebalanceSuggestions === "string" ? JSON.parse(res.data.rebalanceSuggestions) : res.data.rebalanceSuggestions;
          } catch {}
        }
        setRiskReport({ ...report, updatedAt: res.data.updatedAt });
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
        rebalanceSuggestions: typeof (data as any).rebalanceSuggestions === "string" ? JSON.parse((data as any).rebalanceSuggestions) : (data as any).rebalanceSuggestions,
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

  const industryMap = new Map<string, number>();
  for (const t of knownTokens) {
    if (t.value > 0 && t.industry) {
      const current = industryMap.get(t.industry) ?? 0;
      industryMap.set(t.industry, current + t.value);
    }
  }
  const knownTokensTotalValue = knownTokens.reduce((sum, t) => sum + (t.value ?? 0), 0);
  const industries = Array.from(industryMap.entries())
    .map(([name, value]) => ({ name, pct: knownTokensTotalValue > 0 ? Math.round((value / knownTokensTotalValue) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

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
          <div className="flex items-center justify-between mb-1">
            <p className="text-[12px] text-white/40">Risk Score</p>
            {!riskReport && (
              <button
                onClick={handleEvaluate}
                disabled={riskLoading}
                className="text-[10px] text-accent hover:text-accent/80 transition-colors"
              >
                {riskLoading ? 'Evaluating...' : 'Evaluate'}
              </button>
            )}
          </div>
          <p className="text-[20px] font-display font-bold">
            {riskReport ? riskReport.overallScore : '--'}<span className="text-[14px] text-white/30">/100</span>
          </p>
          {riskReport ? (
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-[12px] text-accent hover:text-accent/80 transition-colors mt-1 inline-flex items-center gap-1"
            >
              View Risk Analysis <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <p className="text-[11px] text-white/30 mt-1">
              Evaluate your portfolio to see risk insights. Requires AI credits.
            </p>
          )}
        </div>
          {industries.length > 0 && (
          <div className="mt-auto">
            <p className="text-[12px] text-white/40 mb-3">Underlying Exposure</p>
            <div className="space-y-3">
              {industries.map((ind) => (
                <div key={ind.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-white/60">{ind.name}</span>
                    <span className="text-[12px] font-medium text-white/80">{ind.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${ind.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {riskReport?.rebalanceSuggestions && (
          <div className="mt-3">
            <button
              onClick={() => setRebalanceDrawerOpen(true)}
              className="w-full px-3 py-2 rounded-lg text-[12px] font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
            >
              Rebalance Suggestions
            </button>
          </div>
        )}
      </div>

      <RiskDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        report={riskReport}
        loading={riskLoading}
        evalError={evalError}
        onEvaluate={handleEvaluate}
      />
      <RebalanceDrawer
        open={rebalanceDrawerOpen}
        onClose={() => setRebalanceDrawerOpen(false)}
        suggestions={riskReport?.rebalanceSuggestions ?? null}
      />
    </>
  );
}


