'use client';

import Section from './Section';

const steps = [
  {
    num: '01',
    title: 'Define your goal',
    description: (
      <>
        Choose from <span className="text-white/70 font-medium">Growth, Lower Risk, Diversification, Income, Technology/AI</span> — or describe what you want in natural language.
      </>
    ),
    example: '"I want long-term exposure to AI but don\'t want to take extreme risk."',
  },
  {
    num: '02',
    title: 'Set risk appetite',
    description: (
      <>
        Simple profile: <span className="text-white/70 font-medium">Conservative, Balanced,</span> or <span className="text-white/70 font-medium">Aggressive</span>. No complicated questionnaire.
      </>
    ),
    example: null,
  },
  {
    num: '03',
    title: 'Zivic analyzes',
    description: (
      <>
        Evaluates xStocks using <span className="text-white/70 font-medium">CoinMarketCap RWA data</span> — price, market cap, volume, liquidity, risk characteristics — combined with your preferences.
      </>
    ),
    example: null,
  },
  {
    num: '04',
    title: 'Personalized ranking',
    description: (
      <>
        Each xStock gets a <span className="text-white/70 font-medium">Zivic Score</span> = Market Signals × Personal Fit. Every recommendation is explained.
      </>
    ),
    example: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 grid-bg scroll-mt-14">
      <div className="max-w-3xl mx-auto px-6">
        <Section>
          <p className="text-[13px] text-accent uppercase tracking-wider text-center mb-4">How it works</p>
        </Section>

        <Section>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center tracking-tight mb-12">
            Set preferences. Get your market.
          </h2>
        </Section>

        <Section>
          <div className="relative pl-16">
            <div className="absolute left-[18px] top-4 bottom-4 w-px bg-border3" />

            <div className="space-y-10">
              {steps.map((step) => (
                <div key={step.num} className="relative">
                  <div className="absolute -left-16 top-1 w-9 h-9 flex items-center justify-center">
                    <span className="text-[18px] font-mono text-accent">{step.num}</span>
                  </div>

                  <h3 className="text-[16px] font-semibold mb-1">{step.title}</h3>
                  <p className="text-[14px] text-white/45 leading-relaxed">{step.description}</p>
                  {step.example && (
                    <p className="mt-2 text-[13px] text-accent/70 italic">{step.example}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
}
