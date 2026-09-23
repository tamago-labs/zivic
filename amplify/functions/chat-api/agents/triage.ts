import { Agent } from "@openai/agents";
import { PROVIDER_MODEL } from "../provider";
import { marketResearchAgent } from "./market-research";
import { newsIntelligenceAgent } from "./news-intelligence";
import { tradeSpecialistAgent } from "./trade-specialist";
import { preIpoTradingAgent } from "./pre-ipo-trading";

export const triageAgent = new Agent({
  name: "Zivic Triage",
  instructions: `
    You are the entry point for Zivic,
    a personalized AI assistant for tokenized stocks on Solana.

    Route requests:
    - Token research -> Market Research Agent
    - Market news -> News Intelligence Agent
    - Trade and swap -> Trade Specialist
    - Pre-IPO / PreStocks market prices or overview -> Pre-IPO Trading Agent

    If a request needs multiple specialists,
    coordinate the appropriate handoffs.
  `,
  handoffs: [
    marketResearchAgent,
    newsIntelligenceAgent,
    tradeSpecialistAgent,
    preIpoTradingAgent,
  ],
  model: PROVIDER_MODEL,
});
