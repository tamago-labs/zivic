import type { EventBridgeHandler } from "aws-lambda";
import type { Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/price-tracker";
import { readFileSync } from "fs";
import { join } from "path";

const CMC_API_KEY = env.CMC_API_KEY;
const BASE_URL = "https://pro-api.coinmarketcap.com";
const BATCH_SIZE = 25;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Token {
  symbol: string;
  name: string;
  price: number | null;
  crypto_id: string;
  issuer_id: string;
  issuer_name: string;
  market_cap: number | null;
  volume_24h: number | null;
}

interface ActiveAsset {
  symbol: string;
  name: string;
  slug: string;
  rwa_id: number;
  rwa_rank: number;
  tokens: Token[];
  website: string | null;
  industry: string | null;
  founded: string | null;
  employees: number | null;
  exchange: string | null;
  description: string | null;
}

async function fetchQuotes(symbols: string[]) {
  const url = new URL(`${BASE_URL}/v5/real-world-assets/quotes/latest`);
  url.searchParams.set("symbol", symbols.join(","));
  url.searchParams.set("convert", "USD");

  const res = await fetch(url.toString(), {
    headers: {
      "X-CMC_PRO_API_KEY": CMC_API_KEY!,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${await res.text()}`);
    return [];
  }

  const data = await res.json();
  return data.data?.rwa_assets ?? [];
}

export const handler: EventBridgeHandler<"Scheduled Event", null, void> = async (event) => {
  console.log("Price tracker started:", JSON.stringify(event.time));

  const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
  Amplify.configure(resourceConfig, libraryOptions);

  const client = generateClient<Schema>();

  const listPath = join(__dirname, "..", "..", "..", "lib", "data", "rwa-v1-list.json");
  const raw = readFileSync(listPath, "utf-8");
  const { assets } = JSON.parse(raw) as { assets: ActiveAsset[] };

  const symbols = assets.map((a) => a.symbol);
  console.log(`Tracking ${symbols.length} stocks...`);

  let saved = 0;
  const errors: string[] = [];

  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const batch = symbols.slice(i, i + BATCH_SIZE);
    const progress = Math.min(i + BATCH_SIZE, symbols.length);
    console.log(`  Fetching ${progress}/${symbols.length}`);

    try {
      const quotes = await fetchQuotes(batch);
      const quoteMap = new Map(quotes.map((q: any) => [q.symbol, q]));

      for (const asset of assets.filter((a) => batch.includes(a.symbol))) {
        const quote = quoteMap.get(asset.symbol);
        if (!quote) {
          errors.push(asset.symbol);
          continue;
        }

        try {
          await client.models.PriceSnapshot.create({
            symbol: asset.symbol,
            rwa_id: asset.rwa_id,
            price: quote.average_tokenized_price ?? null,
            market_cap: quote.tokenized_market_cap ?? null,
            volume_24h: quote.tokenized_volume_24h ?? null,
            tokens: quote.tokens ?? asset.tokens,
          });
          saved++;
        } catch (err) {
          console.error(`\nError saving ${asset.symbol}: ${err}`);
          errors.push(asset.symbol);
        }
      }
    } catch (err) {
      console.error(`\nBatch error: ${err}`);
    }

    if (i + BATCH_SIZE < symbols.length) {
      await sleep(2500);
    }
  }

  console.log(`\nDone. Saved: ${saved}, Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log(`Failed: ${errors.join(", ")}`);
  }
};
