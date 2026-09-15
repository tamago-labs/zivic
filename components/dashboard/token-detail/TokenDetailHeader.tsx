import type { Token, Asset } from "@/lib/types/token";

export default function TokenDetailHeader({ token, asset }: { token: Token; asset: Asset }) {
  return (
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
  );
}
