import listData from "@/lib/data/rwa-v1-list.json";
import TokenDetailClient from "@/components/dashboard/token-detail/TokenDetailClient";
import type { Token, Asset } from "@/lib/types/token";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ slug?: string; crypto_id?: string }>;
}

export default async function TokenDataPage({ searchParams }: PageProps) {
  const { slug, crypto_id } = await searchParams;
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
        <div className="max-w-6xl mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-white/30 mb-6">
          <Link href="/dashboard/explore" className="hover:text-white/60 transition-colors">
            Explore
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
