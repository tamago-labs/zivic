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
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Everyone sees the same tokenized stocks<br />
              <span className="bg-gradient-to-r from-zenblue via-accent to-accent2 bg-clip-text text-transparent">
                Zivic makes it yours
              </span>
            </h1>
          </Section>

          <Section>
            <p className="mt-5 text-[15px] text-white/50 leading-relaxed">
              Zivic is a hyper-personalized AI dashboard for tokenized stocks on{' '}
              <span className="text-accent font-semibold">X Layer</span>. Tell Zivic your goals and risk appetite — it ranks, filters, and explains the xStocks that matter most to you.
            </p>
          </Section>

          <Section>
            <div className="mt-8 flex items-center gap-4">
              <a href="#" className="text-[14px] font-medium bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors">
                Try Zivic →
              </a>
              <a href="#how-it-works" className="text-[14px] text-white/50 hover:text-white transition-colors">
                See how it works
              </a>
            </div>
          </Section>
        </div>

        <HeroPrompt />
      </div>
    </section>
  );
}
