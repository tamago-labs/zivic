"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRightLeft, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import rwaList from "@/lib/data/rwa-v1-list.json";
import preIpoList from "@/lib/data/pre-ipo-list.json";
import kaminoData from "@/lib/data/kamino-apy-results.json";
import byrealData from "@/lib/data/byreal-pool-results.json";
import { formatNumber, formatPrice } from "@/lib/utils/format";

const dataClient = generateClient<Schema>();

interface TokenOption {
  symbol: string;
  name: string;
  slug: string;
  mint: string;
  type: "tokenized" | "pre-ipo";
  crypto_id?: string;
  issuer?: string;
  issuer_name?: string;
  logo?: string;
  image?: string;
  industry?: string;
  description?: string;
  website?: string;
}

interface PriceData {
  price: number | null;
  marketCap: number | null;
  volume24h: number | null;
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
  supply: number | null;
}

interface PreStockData {
  tokenPrice: number | null;
  markPrice: number | null;
  markValuation: number | null;
  impliedValuation: number | null;
  supply: number | null;
}

interface CompareData {
  token: TokenOption;
  price: number | null;
  marketCap: number | null;
  volume24h: number | null;
  change24h: number | null;
  change7d: number | null;
  supply: number | null;
  kaminoSupplyApy: number | null;
  kaminoBorrowApy: number | null;
  byrealApr: number | null;
  byrealTvl: number | null;
  markPrice: number | null;
  markValuation: number | null;
  impliedValuation: number | null;
  premium: number | null;
}

function buildTokenOptions(): TokenOption[] {
  const options: TokenOption[] = [];

  for (const asset of (rwaList as any).assets ?? []) {
    for (const token of asset.tokens ?? []) {
      if (token.mint && token.symbol) {
        options.push({
          symbol: token.symbol,
          name: token.name ?? asset.name,
          slug: asset.slug ?? "",
          mint: token.mint,
          type: "tokenized",
          crypto_id: token.crypto_id ? String(token.crypto_id) : undefined,
          issuer: token.issuer_name === "Backed Assets" ? "xStock" : token.issuer_name === "Ondo Assets" ? "Ondo" : token.issuer_name,
          issuer_name: token.issuer_name,
          logo: token.logo,
          industry: asset.industry,
          description: token.description ?? asset.description,
          website: asset.website,
        });
      }
    }
  }

  for (const asset of (preIpoList as any).assets ?? []) {
    if (asset.mint && asset.symbol) {
      options.push({
        symbol: asset.symbol,
        name: asset.name,
        slug: asset.slug ?? "",
        mint: asset.mint,
        type: "pre-ipo",
        issuer: "PreStocks",
        image: asset.image,
        industry: asset.industry,
        description: asset.description,
        website: asset.website,
      });
    }
  }

  return options;
}

function getLatestPriceBySymbol(prices: any[], symbol: string): any {
  const matches = prices.filter((p) => p.token_symbol === symbol || p.symbol === symbol);
  if (matches.length === 0) return null;
  matches.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  return matches[0];
}

function getLatestPreStockBySymbol(items: any[], symbol: string): any {
  const matches = items.filter((p) => p.symbol === symbol);
  if (matches.length === 0) return null;
  matches.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  return matches[0];
}

function getCompareData(
  token: TokenOption,
  priceMap: Map<string, any>,
  preStockMap: Map<string, any>,
): CompareData {
  const kaminoMap = new Map<string, any>();
  for (const item of (kaminoData as any).results ?? []) {
    if (item.symbol) kaminoMap.set(item.symbol.toUpperCase(), item);
  }

  const byrealMap = new Map<string, any[]>();
  for (const item of (byrealData as any).matches ?? []) {
    if (item.symbol) {
      const key = item.symbol.toUpperCase();
      if (!byrealMap.has(key)) byrealMap.set(key, []);
      byrealMap.get(key)!.push(item);
    }
  }

  let price: number | null = null;
  let marketCap: number | null = null;
  let volume24h: number | null = null;
  let change24h: number | null = null;
  let change7d: number | null = null;
  let supply: number | null = null;
  let markPrice: number | null = null;
  let markValuation: number | null = null;
  let impliedValuation: number | null = null;

  if (token.type === "tokenized") {
    const liveData = priceMap.get(token.symbol.toUpperCase());
    if (liveData) {
      price = liveData.price ?? liveData.tokenPrice ?? null;
      marketCap = liveData.market_cap ?? liveData.marketCap ?? null;
      volume24h = liveData.volume_24h ?? liveData.volume24h ?? null;
      change24h = liveData.percent_24h ?? liveData.change24h ?? null;
      change7d = liveData.percent_7d ?? liveData.change7d ?? null;
      supply = liveData.circulating_supply ?? liveData.total_supply ?? liveData.supply ?? null;
    }
  } else {
    const preStock = preStockMap.get(token.symbol.toUpperCase());
    if (preStock) {
      price = preStock.tokenPrice ?? null;
      markPrice = preStock.markPrice ?? null;
      markValuation = preStock.markValuation ?? null;
      impliedValuation = preStock.impliedValuation ?? null;
      supply = preStock.supply ?? null;
    }
  }

  const kamino = kaminoMap.get(token.symbol.toUpperCase());
  const byrealPools = byrealMap.get(token.symbol.toUpperCase()) ?? [];
  const bestByreal = byrealPools.length > 0 ? byrealPools.reduce((a, b) => (b.apr24h > a.apr24h ? b : a)) : null;

  const premium = (token.type === "pre-ipo" && price && markPrice && markPrice > 0)
    ? ((price - markPrice) / markPrice) * 100
    : null;

  return {
    token,
    price,
    marketCap,
    volume24h,
    change24h,
    change7d,
    supply,
    kaminoSupplyApy: kamino ? parseFloat(kamino.market?.supplyApy ?? "0") * 100 : null,
    kaminoBorrowApy: kamino ? parseFloat(kamino.market?.borrowApy ?? "0") * 100 : null,
    byrealApr: bestByreal ? bestByreal.apr24h : null,
    byrealTvl: bestByreal ? bestByreal.tvl : null,
    markPrice,
    markValuation,
    impliedValuation,
    premium,
  };
}

function formatPercent(val: number | null, decimals = 2): string {
  if (val == null) return "—";
  return (val >= 0 ? "+" : "") + val.toFixed(decimals) + "%";
}

function ChangeBadge({ value }: { value: number | null }) {
  if (value == null) return <span className="text-white/30">—</span>;
  if (value > 0) return <span className="text-accent2 inline-flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />{formatPercent(value)}</span>;
  if (value < 0) return <span className="text-warn2 inline-flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{formatPercent(value)}</span>;
  return <span className="text-white/30"><Minus className="w-3 h-3" /></span>;
}

function TokenSelector({ selected, onSelect, options, label }: {
  selected: TokenOption | null;
  onSelect: (t: TokenOption | null) => void;
  options: TokenOption[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return options.slice(0, 50);
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.symbol.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.type.includes(q)
    ).slice(0, 50);
  }, [search, options]);

  return (
    <div className="relative">
      <p className="text-[11px] text-white/40 mb-1.5 uppercase tracking-wider">{label}</p>
      {selected ? (
        <div className="bg-surface border border-border3/50 rounded-xl p-3 flex items-center gap-3">
          {selected.logo || selected.image ? (
            <img src={selected.logo || selected.image} alt="" className="w-8 h-8 rounded-full bg-white/10" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/60">
              {selected.symbol.slice(0, 2)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-white/90">{selected.symbol}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selected.type === "tokenized" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}>
                {selected.type === "tokenized" ? "Tokenized" : "Pre-IPO"}
              </span>
            </div>
            <p className="text-[12px] text-white/50 truncate">{selected.name}</p>
          </div>
          <button onClick={() => onSelect(null)} className="p-1 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-surface border border-border3/50 rounded-xl p-4 text-center text-[13px] text-white/40 hover:text-white/60 hover:border-accent/30 transition-colors"
        >
          + Select Token
        </button>
      )}

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface border border-border3/50 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-border3/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tokens..."
                className="w-full bg-white/[0.03] border border-border3/50 rounded-lg pl-10 pr-4 py-2 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-[12px] text-white/30">No tokens found</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={`${opt.symbol}-${opt.mint}`}
                  onClick={() => { onSelect(opt); setOpen(false); setSearch(""); }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.03] transition-colors text-left"
                >
                  {opt.logo || opt.image ? (
                    <img src={opt.logo || opt.image} alt="" className="w-7 h-7 rounded-full bg-white/10" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-white/60">
                      {opt.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-white/90">{opt.symbol}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${opt.type === "tokenized" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}>
                        {opt.type === "tokenized" ? "Tokenized" : "Pre-IPO"}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 truncate">{opt.name}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, left, right, format }: { label: string; left: any; right: any; format: (v: any) => string | React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border3/20 last:border-0">
      <div className="text-[12px] text-white/50 self-center">{label}</div>
      <div className="text-[13px] text-white/80 text-right self-center">{format(left)}</div>
      <div className="text-[13px] text-white/80 text-right self-center">{format(right)}</div>
    </div>
  );
}

function TokenCard({ data, onNavigate }: { data: CompareData; onNavigate: () => void }) {
  return (
    <div className="bg-surface border border-border3/50 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        {data.token.logo || data.token.image ? (
          <img src={data.token.logo || data.token.image} alt="" className="w-10 h-10 rounded-full bg-white/10" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[12px] text-white/60">
            {data.token.symbol.slice(0, 2)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold text-white/90">{data.token.symbol}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${data.token.type === "tokenized" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}>
              {data.token.type === "tokenized" ? "Tokenized" : "Pre-IPO"}
            </span>
          </div>
          <p className="text-[12px] text-white/50 truncate">{data.token.name}</p>
        </div>
      </div>

      {data.token.website && (
        <a href={data.token.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors">
          <ExternalLink className="w-3 h-3" />
          Website
        </a>
      )}

      <div className="bg-white/[0.02] border border-border3/30 rounded-lg p-4">
        <p className="text-[11px] text-white/40 mb-1">Price</p>
        <p className="text-[20px] font-display font-bold text-white/90">{formatPrice(data.price)}</p>
        <div className="mt-1"><ChangeBadge value={data.change24h} /></div>
      </div>

      <div className="space-y-0">
        <CompareRow label="Market Cap" left={data.marketCap} right={null} format={(v) => formatNumber(v, "$")} />
        <CompareRow label="24h Volume" left={data.volume24h} right={null} format={(v) => formatNumber(v, "$")} />
        <CompareRow label="Supply" left={data.supply} right={null} format={(v) => formatNumber(v)} />
        <CompareRow label="Kamino Supply" left={data.kaminoSupplyApy} right={null} format={(v) => v != null ? `${v.toFixed(2)}%` : "—"} />
        <CompareRow label="Kamino Borrow" left={data.kaminoBorrowApy} right={null} format={(v) => v != null ? `${v.toFixed(2)}%` : "—"} />
        <CompareRow label="Byreal APR" left={data.byrealApr} right={null} format={(v) => v != null ? `${v.toFixed(2)}%` : "—"} />
        <CompareRow label="Byreal TVL" left={data.byrealTvl} right={null} format={(v) => formatNumber(v, "$")} />
        <CompareRow label="Mark Price" left={data.markPrice} right={null} format={(v) => formatPrice(v)} />
        <CompareRow label="Implied Val." left={data.impliedValuation} right={null} format={(v) => formatNumber(v, "$")} />
        <CompareRow label="Premium" left={data.premium} right={null} format={(v) => v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(2)}%` : "—"} />
      </div>

      <button
        onClick={onNavigate}
        className="w-full px-3 py-2 rounded-lg text-[12px] font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors inline-flex items-center justify-center gap-1"
      >
        View Details <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function CompareClient() {
  const router = useRouter();
  const options = useMemo(() => buildTokenOptions(), []);
  const [leftToken, setLeftToken] = useState<TokenOption | null>(null);
  const [rightToken, setRightToken] = useState<TokenOption | null>(null);
  const [priceMap, setPriceMap] = useState<Map<string, any>>(new Map());
  const [preStockMap, setPreStockMap] = useState<Map<string, any>>(new Map());
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let current = true;
    async function fetchData() {
      try {
        const [pricesRes, preStocksRes] = await Promise.all([
          dataClient.models.PriceSnapshot.list({}),
          dataClient.models.PreStock.list({}),
        ]);
        if (!current) return;

        const pMap = new Map<string, any>();
        for (const item of pricesRes.data ?? []) {
          const sym = (item.token_symbol ?? item.symbol ?? "").toUpperCase();
          if (!sym) continue;
          const existing = pMap.get(sym);
          if (!existing || new Date(item.createdAt ?? 0) > new Date(existing.createdAt ?? 0)) {
            pMap.set(sym, item);
          }
        }
        setPriceMap(pMap);

        const psMap = new Map<string, any>();
        for (const item of preStocksRes.data ?? []) {
          const sym = (item.symbol ?? "").toUpperCase();
          if (!sym) continue;
          const existing = psMap.get(sym);
          if (!existing || new Date(item.createdAt ?? 0) > new Date(existing.createdAt ?? 0)) {
            psMap.set(sym, item);
          }
        }
        setPreStockMap(psMap);
      } catch (err) {
        console.error("[Compare] data fetch failed:", err);
      } finally {
        if (current) setDataLoading(false);
      }
    }
    fetchData();
    return () => { current = false; };
  }, []);

  const leftData = useMemo(() => leftToken ? getCompareData(leftToken, priceMap, preStockMap) : null, [leftToken, priceMap, preStockMap]);
  const rightData = useMemo(() => rightToken ? getCompareData(rightToken, priceMap, preStockMap) : null, [rightToken, priceMap, preStockMap]);

  const navigateTo = (token: TokenOption) => {
    if (token.type === "tokenized" && token.crypto_id) {
      router.push(`/dashboard/token/${token.slug}/${token.crypto_id}`);
    } else {
      router.push(`/dashboard/pre-ipo/${token.slug}`);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[13px] text-white/40">Loading token data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <TokenSelector selected={leftToken} onSelect={setLeftToken} options={options} label="Token A" />
        <TokenSelector selected={rightToken} onSelect={setRightToken} options={options} label="Token B" />
      </div>

      {leftData && rightData ? (
        <div className="grid grid-cols-2 gap-6">
          <TokenCard data={leftData} onNavigate={() => navigateTo(leftData.token)} />
          <TokenCard data={rightData} onNavigate={() => navigateTo(rightData.token)} />
        </div>
      ) : (
        <div className="bg-surface border border-border3/50 rounded-xl p-12 text-center">
          <ArrowRightLeft className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-[14px] text-white/40">Select two tokens to compare</p>
          <p className="text-[12px] text-white/25 mt-1">Choose tokenized stocks or pre-IPO tokens from either side</p>
        </div>
      )}
    </div>
  );
}
