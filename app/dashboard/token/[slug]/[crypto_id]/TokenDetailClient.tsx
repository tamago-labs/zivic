"use client";

import { useState } from "react";
import Link from "next/link";
import { usePrices } from "@/app/contexts/PriceContext";
import { ExternalLink, Copy, Check, TrendingUp, TrendingDown, Globe, AtSign, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface Token {
  symbol: string;
  name: string;
  crypto_id: string;
  issuer_name: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  twitter?: string | null;
  discord?: string | null;
  tags?: string[] | null;
  date_added?: string | null;
  mint?: string | null;
  decimals?: number | null;
  verified?: boolean | null;
}

interface Asset {
  symbol: string;
  name: string;
  slug: string;
  rwa_id: number;
  description?: string | null;
  industry?: string | null;
  tokens: Token[];
}

function formatNumber(num: number | null, prefix = "", suffix = ""): string {
  if (num == null) return "—";
  if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(2)}B${suffix}`;
  if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M${suffix}`;
  if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(2)}K${suffix}`;
  return `${prefix}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
}

function formatPrice(price: number | null): string {
  if (price == null) return "—";
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1 rounded hover:bg-white/10 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
    </button>
  );
}

function MockChart({ positive }: { positive: boolean }) {
  const points = Array.from({ length: 40 }, (_, i) => {
    const base = positive ? 40 : 60;
    const trend = positive ? i * 0.8 : -i * 0.8;
    const noise = Math.sin(i * 0.8) * 12 + Math.cos(i * 1.3) * 6;
    return Math.max(10, Math.min(90, base + trend + noise));
  });
  const w = 600;
  const h = 200;
  const step = w / (points.length - 1);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - p * (h / 100)}`).join(" ");
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
  const gid = positive ? "grad-up" : "grad-down";

  return (
    <div className="w-full h-48 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${gid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={positive ? "#34d399" : "#f87171"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={positive ? "#34d399" : "#f87171"} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${gid}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={positive ? "#34d399" : "#f87171"} stopOpacity="0.6" />
            <stop offset="100%" stopColor={positive ? "#34d399" : "#f87171"} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gid}-area)`} />
        <path d={pathD} fill="none" stroke={`url(#${gid}-line)`} strokeWidth="2" />
      </svg>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
      <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold text-white/90 mt-1">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function TokenDetailClient({
  asset,
  token,
  description,
  otherTokens,
}: {
  asset: Asset;
  token: Token;
  description: string | null;
  otherTokens: Token[];
}) {
  const { prices } = usePrices();
  const price = prices.find((p) => p.token_symbol === token.symbol);
  const isPositive = (price?.percent_24h ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        {token.logo ? (
          <img src={token.logo} alt="" className="w-14 h-14 rounded-2xl" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-lg font-bold text-white/40">
            {token.symbol.slice(0, 2)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-display font-bold text-white/95">{token.name}</h1>
            <span className="text-sm font-mono text-white/40 bg-white/[0.06] px-2 py-0.5 rounded">
              {token.symbol}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
              token.issuer_name === "Backed Assets"
                ? "text-orange-400 bg-orange-400/10 border-orange-400/20"
                : "text-purple-400 bg-purple-400/10 border-purple-400/20"
            }`}>
              {token.issuer_name === "Backed Assets" ? "xStock" : "Ondo"}
            </span>
            {token.verified && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm text-white/40 mt-1">
            {asset.name} ({asset.symbol}) {asset.industry && `· ${asset.industry}`}
          </p>
        </div>
      </div>

      {/* Price Hero */}
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

        {/* Chart */}
        <div className="mt-6">
          <MockChart positive={isPositive} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Market Cap" value={formatNumber(price?.market_cap ?? null, "$")} />
        <StatCard label="Volume (24h)" value={formatNumber(price?.volume_24h ?? null, "$")} />
        <StatCard label="Crypto ID" value={String(token.crypto_id)} />
        <StatCard
          label="Mint"
          value={token.mint ? `${token.mint.slice(0, 6)}...${token.mint.slice(-4)}` : "—"}
          sub={token.decimals != null ? `${token.decimals} decimals` : undefined}
        />
      </div>

      {/* About */}
      {description && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/70 mb-3">About {asset.name}</h2>
          <div className="text-sm text-white/50 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto pr-2">
            {description.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[#*]/g, "").trim()}
          </div>
        </div>
      )}

      {/* Token Details */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white/70 mb-4">Token Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <DetailRow label="Full Name" value={token.name} />
            <DetailRow label="Symbol" value={token.symbol} />
            <DetailRow label="Issuer" value={token.issuer_name} />
            <DetailRow label="Crypto ID" value={String(token.crypto_id)} />
            <DetailRow label="RWA ID" value={String(asset.rwa_id)} />
          </div>
          <div className="space-y-3">
            <DetailRow label="Blockchain" value="Solana" />
            <DetailRow label="Decimals" value={token.decimals != null ? String(token.decimals) : "—"} />
            <DetailRow label="Verified" value={token.verified ? "Yes" : "No"} />
            <DetailRow label="Date Added" value={token.date_added ? new Date(token.date_added).toLocaleDateString() : "—"} />
            <div className="flex items-center justify-between">
              <span className="text-white/40">Mint Address</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-white/70 text-xs">
                  {token.mint ? `${token.mint.slice(0, 8)}...${token.mint.slice(-6)}` : "—"}
                </span>
                {token.mint && <CopyButton text={token.mint} />}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {token.tags && token.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex flex-wrap gap-1.5">
              {token.tags.map((tag) => (
                <span key={tag} className="text-[11px] text-white/40 bg-white/[0.05] px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Links */}
      {(token.website || token.twitter || token.discord) && (
        <div className="flex gap-2">
          {token.website && (
            <a href={token.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all">
              <Globe className="w-4 h-4" /> Website
            </a>
          )}
          {token.twitter && (
            <a href={token.twitter} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all">
              <AtSign className="w-4 h-4" /> Twitter
            </a>
          )}
          {token.discord && (
            <a href={token.discord} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all">
              <MessageSquare className="w-4 h-4" /> Telegram
            </a>
          )}
        </div>
      )}

      {/* Other Tokens in Same Stock */}
      {otherTokens.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white/70 mb-3">Other {asset.symbol} Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherTokens.map((ot) => {
              const otPrice = prices.find((p) => p.token_symbol === ot.symbol);
              return (
                <Link
                  key={ot.crypto_id}
                  href={`/dashboard/token/${asset.slug}/${ot.crypto_id}`}
                  className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-colors"
                >
                  {ot.logo ? (
                    <img src={ot.logo} alt="" className="w-10 h-10 rounded-xl" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold text-white/40">
                      {ot.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80">{ot.symbol}</p>
                    <p className="text-xs text-white/40 truncate">{ot.issuer_name === "Backed Assets" ? "xStock" : "Ondo"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white/70">{formatPrice(otPrice?.price ?? null)}</p>
                    {otPrice?.percent_24h != null && (
                      <p className={`text-xs ${otPrice.percent_24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {otPrice.percent_24h >= 0 ? "+" : ""}{otPrice.percent_24h.toFixed(2)}%
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40">{label}</span>
      <span className="text-white/70">{value}</span>
    </div>
  );
}
