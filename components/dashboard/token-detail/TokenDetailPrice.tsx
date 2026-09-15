"use client";

import type { Token } from "@/lib/types/token";
import type { PriceData } from "@/app/contexts/PriceContext";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import MockChart from "../MockChart";

export default function TokenDetailPrice({ token, price }: { token: Token; price: PriceData | undefined }) {
  const isPositive = (price?.percent_24h ?? 0) >= 0;

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
      <div className="flex items-end gap-6 flex-wrap">
        <div>
          <p className="text-4xl font-bold text-white/95 tracking-tight">
            {formatPrice(price?.price ?? null)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {price?.percent_24h != null
                ? `${price.percent_24h >= 0 ? "+" : ""}${price.percent_24h.toFixed(2)}%`
                : "—"}
            </span>
            <span className="text-xs text-white/30">24h</span>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-white/30">7d </span>
            <span className={price?.percent_7d != null ? (price.percent_7d >= 0 ? "text-emerald-400" : "text-red-400") : "text-white/30"}>
              {price?.percent_7d != null ? `${price.percent_7d >= 0 ? "+" : ""}${price.percent_7d.toFixed(2)}%` : "—"}
            </span>
          </div>
          <div>
            <span className="text-white/30">30d </span>
            <span className={price?.percent_30d != null ? (price.percent_30d >= 0 ? "text-emerald-400" : "text-red-400") : "text-white/30"}>
              {price?.percent_30d != null ? `${price.percent_30d >= 0 ? "+" : ""}${price.percent_30d.toFixed(2)}%` : "—"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <MockChart positive={isPositive} />
      </div>
    </div>
  );
}
