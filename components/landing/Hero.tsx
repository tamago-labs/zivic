'use client';

import HeroPrompt from './HeroPrompt';
import Section from './Section';

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-36 relative grid-bg">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Section>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Everyone sees the same tokenized stocks<br />
              <span className="bg-gradient-to-r from-zenblue via-accent to-accent2 bg-clip-text text-transparent">
                Zivic makes it yours
              </span>
            </h1>
          </Section>

          <Section>
            <p className="mt-5 text-[15px] text-white/50 leading-relaxed">
              Zivic is a hyper-personalized AI dashboard for tokenized stocks on{' '}
              <a href="https://web3.okx.com/xlayer" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">X Layer</a>,{' '}
              <a href="https://www.bnbchain.org/en" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">BNB</a>,{' '}
              <a href="https://robinhood.com/us/en/crypto/chain/" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">Robinhood</a>. Tell Zivic your goals and risk appetite — it ranks, filters, and explains the xStocks that matter most to you.
            </p>
          </Section>

          <Section>
            <ul className="mt-6 space-y-2 text-[13px] text-white/35">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent2" />
                Hyper-personalized AI for tokenized stocks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent2" />
                Live market data across Web3
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent2" />
                Pay only for the AI you use
              </li>
            </ul>
          </Section>
        </div>

        <HeroPrompt />
      </div>
    </section>
  );
}
