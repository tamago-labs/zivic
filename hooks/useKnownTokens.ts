'use client';

import { useState, useEffect } from 'react';
import rwaList from '@/lib/data/rwa-v1-list.json';
import preIpoList from '@/lib/data/pre-ipo-list.json';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const dataClient = generateClient<Schema>();

export interface KnownToken {
  mint: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  balance: number;
  value: number;
  change: number;
}

function buildTokenIndex(): Record<string, { symbol: string; name: string; image: string }> {
  const index: Record<string, { symbol: string; name: string; image: string }> = {};

  for (const asset of (rwaList as any).assets ?? []) {
    for (const token of asset.tokens ?? []) {
      if (token.mint) {
        index[token.mint] = {
          symbol: token.symbol ?? asset.symbol,
          name: token.name ?? asset.name,
          image: token.logo ?? asset.logo ?? '',
        };
      }
    }
  }

  for (const asset of (preIpoList as any).assets ?? []) {
    if (asset.mint) {
      index[asset.mint] = {
        symbol: asset.symbol,
        name: asset.name,
        image: asset.image ?? asset.logo ?? '',
      };
    }
  }

  return index;
}

export function useKnownTokens(address: string | null) {
  const [tokens, setTokens] = useState<KnownToken[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) { setTokens([]); return; }

    let current = true;

    const fetchTokens = async () => {
      setLoading(true);
      try {
        const [balanceRes, priceRes] = await Promise.all([
          fetch(`/api/solana-balance?address=${address}`),
          dataClient.models.PreStock.list({}),
        ]);

        if (!current) return;

        const balanceData = await balanceRes.json();

        const priceMap: Record<string, number> = {};
        const changeMap: Record<string, number> = {};
        const snapshotsBySymbol: Record<string, { price: number; ts: string }[]> = {};

        for (const item of priceRes.data ?? []) {
          if (item.symbol && item.tokenPrice != null) {
            priceMap[item.symbol] = item.tokenPrice;
            if (!snapshotsBySymbol[item.symbol]) snapshotsBySymbol[item.symbol] = [];
            snapshotsBySymbol[item.symbol].push({ price: item.tokenPrice, ts: item.createdAt ?? '' });
          }
        }

        for (const [symbol, snapshots] of Object.entries(snapshotsBySymbol)) {
          if (snapshots.length >= 2) {
            snapshots.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
            const latest = snapshots[0].price;
            const prev = snapshots[1].price;
            changeMap[symbol] = prev > 0 ? ((latest - prev) / prev) * 100 : 0;
          }
        }

        const rwaPriceMap: Record<string, number> = {};
        for (const asset of (rwaList as any).assets ?? []) {
          for (const token of asset.tokens ?? []) {
            if (token.symbol && token.price != null) {
              rwaPriceMap[token.symbol] = token.price;
            }
          }
        }

        const index = buildTokenIndex();
        const result: KnownToken[] = [];

        for (const [mint, amount] of Object.entries(balanceData?.spl ?? {})) {
          const meta = index[mint];
          const bal = amount as number;
          if (meta && bal > 0) {
            const price = priceMap[meta.symbol] ?? rwaPriceMap[meta.symbol] ?? 0;
            const change = changeMap[meta.symbol] ?? 0;
            result.push({
              mint,
              symbol: meta.symbol,
              name: meta.name,
              image: meta.image,
              price,
              balance: bal,
              value: bal * price,
              change,
            });
          }
        }

        result.sort((a, b) => b.value - a.value);
        if (current && (result.length > 0 || Object.keys(balanceData?.spl ?? {}).length > 0)) {
          setTokens(result);
        }
      } catch (err) {
        if (current) {
          console.error('[useKnownTokens] fetch failed:', err);
        }
      } finally {
        if (current) {
          setLoading(false);
        }
      }
    };

    fetchTokens();

    return () => { current = false; };
  }, [address]);

  return { tokens, loading };
}
