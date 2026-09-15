"use client";

import type { Token, Asset } from "@/lib/types/token";
import { usePrices } from "@/app/contexts/PriceContext";
import TokenDetailHeader from "./TokenDetailHeader";
import TokenDetailPrice from "./TokenDetailPrice";
import TokenDetailStats from "./TokenDetailStats";
import TokenDetailAbout from "./TokenDetailAbout";
import TokenDetailInfo from "./TokenDetailInfo";
import TokenDetailLinks from "./TokenDetailLinks";
import TokenDetailOther from "./TokenDetailOther";

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

  return (
      <div className="space-y-6">
        <TokenDetailHeader token={token} asset={asset} />
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2 space-y-6">
            <TokenDetailStats token={token} price={price} />
            <TokenDetailAbout asset={asset} description={description} />
            <TokenDetailInfo token={token} asset={asset} price={price} />
            <TokenDetailLinks token={token} />
          </div>
          <div className="col-span-3">
            <TokenDetailPrice token={token} price={price} />
          </div>
        </div>
        <TokenDetailOther asset={asset} otherTokens={otherTokens} prices={prices} />
      </div>
  );
}
