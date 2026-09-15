import listData from "@/lib/data/rwa-v1-list.json";
import TokenDetailClient from "./TokenDetailClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

export function generateStaticParams() {
  const params: { slug: string; crypto_id: string }[] = [];
  for (const asset of (listData as any).assets as Asset[]) {
    if (!asset.slug) continue;
    for (const token of asset.tokens ?? []) {
      params.push({
        slug: asset.slug,
        crypto_id: String(token.crypto_id),
      });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; crypto_id: string }>;
}) {
  const { slug, crypto_id } = await params;
  const assets = (listData as any).assets as Asset[];
  const asset = assets.find(
    (a) => a.slug === slug && a.tokens?.some((t) => String(t.crypto_id) === crypto_id)
  );
  const token = asset?.tokens?.find((t) => String(t.crypto_id) === crypto_id);

  if (!asset || !token) return { title: "Token Not Found | Zivic" };

  return {
    title: `${token.name} (${token.symbol}) on Solana | Zivic`,
    description: `Track ${token.symbol} — ${asset.name} tokenized stock on Solana. Live price, market cap, and chart.`,
  };
}

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ slug: string; crypto_id: string }>;
}) {
  const { slug, crypto_id } = await params;
  const assets = (listData as any).assets as Asset[];
  const asset = assets.find(
    (a) => a.slug === slug && a.tokens?.some((t) => String(t.crypto_id) === crypto_id)
  );
  const token = asset?.tokens?.find((t) => String(t.crypto_id) === crypto_id);

  if (!asset || !token) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-white/40 text-lg">Token not found</p>
          <Link href="/dashboard/explore" className="text-accent text-sm mt-2 inline-block hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const description = asset.description || token.description || null;
  const otherTokens = asset.tokens.filter((t) => String(t.crypto_id) !== crypto_id);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/30 mb-6">
          <Link href="/dashboard/explore" className="hover:text-white/60 transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/dashboard/token/${asset.slug}`} className="hover:text-white/60 transition-colors">
            {asset.symbol}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/70">{token.symbol}</span>
        </nav>

        <TokenDetailClient
          asset={asset}
          token={token}
          description={description}
          otherTokens={otherTokens}
        />
      </div>
    </div>
  );
}
