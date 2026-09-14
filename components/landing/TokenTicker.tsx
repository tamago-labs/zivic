"use client";

import { useEffect, useState, useRef } from "react";
import { getTopTokens } from "@/lib/tokens";
import type { TokenDisplay } from "@/lib/tokens";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

interface PriceData {
  token_symbol: string;
  price: number | null;
  percent_1h: number | null;
  percent_24h: number | null;
  market_cap: number | null;
  volume_24h: number | null;
}

const issuerColor: Record<string, string> = {
  "Backed Assets": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Ondo Assets": "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

function TokenCard({ token, price }: { token: TokenDisplay; price?: PriceData }) {
  const issuerClass = issuerColor[token.issuer_name] ?? "text-white/50 bg-white/5 border-white/10";

  return (
    <div className="min-w-[200px] bg-surface border border-border3 rounded-xl p-4 flex flex-col gap-3 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-2.5">
        {token.logo ? (
          <img src={token.logo} alt={token.token_symbol} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
            {token.token_symbol.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-white/90 truncate">{token.token_symbol}</p>
          <p className="text-[10px] text-white/30 truncate">{token.symbol}</p>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[15px] font-semibold text-white/80">
          {price?.price != null ? `$${price.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
        </span>
        {price?.percent_24h != null && (
          <span className={`text-[11px] font-medium ${price.percent_24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {price.percent_24h >= 0 ? "+" : ""}{price.percent_24h.toFixed(2)}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${issuerClass}`}>
          {token.issuer_name === "Backed Assets" ? "xStock" : "Ondo"}
        </span>
        {price?.market_cap != null && (
          <span className="text-[10px] text-white/25">
            ${(price.market_cap / 1_000_000).toFixed(1)}M
          </span>
        )}
      </div>
    </div>
  );
}

export default function TokenTicker() {
  const tokens = getTopTokens(20);
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map());
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPrices() {
      const symbols = tokens.map((t) => t.token_symbol);

      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data } = await client.models.PriceSnapshot.list({
          filter: { createdAt: { gt: since } },
        });

        const priceMap = new Map<string, PriceData>();
        for (const item of data) {
          if (!item.token_symbol || !symbols.includes(item.token_symbol)) continue;
          priceMap.set(item.token_symbol, {
            token_symbol: item.token_symbol,
            price: item.price,
            percent_1h: item.percent_1h,
            percent_24h: item.percent_24h,
            market_cap: item.market_cap,
            volume_24h: item.volume_24h,
          });
        }
        setPrices(priceMap);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
      }
    }

    fetchPrices();
  }, []);

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <p className="text-[13px] text-accent uppercase tracking-wider text-center mb-2">Live on Solana</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-white/80">
          Top Tokenized Stocks
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-4 px-6 animate-[scroll_60s_linear_infinite] hover:[animation-play-state:paused] w-max"
        >
          {[...tokens, ...tokens].map((token, i) => (
            <TokenCard key={`${token.token_symbol}-${i}`} token={token} price={prices.get(token.token_symbol)} />
          ))}
        </div>
      </div>
    </section>
  );
}
