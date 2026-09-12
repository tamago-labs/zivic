/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s2.coinmarketcap.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "coin-images.coingecko.com" },
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
    ],
  },
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },

}

module.exports = nextConfig;
