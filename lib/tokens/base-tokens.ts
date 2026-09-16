export interface BaseToken {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logo: string;
}

export const BASE_TOKENS: BaseToken[] = [
  {
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    address: "11111111111111111111111111111111",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
  },
  {
    symbol: "USDG",
    name: "Global Dollar",
    decimals: 6,
    address: "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/33793.png",
  },
];
