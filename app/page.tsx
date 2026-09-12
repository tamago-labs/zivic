'use client';

import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Integrations from '@/components/landing/Integrations';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <div className="absolute w-[350px] h-[350px] -top-32 -left-32 rounded-full blur-[80px] opacity-40 bg-accent pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] top-40 -right-40 rounded-full blur-[80px] opacity-40 bg-zenpurple pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bottom-40 left-1/4 rounded-full blur-[80px] opacity-40 bg-accent pointer-events-none" />

      <Header />

      <section className="relative z-10">
        <Hero />
      </section>

      <Problem />
      <HowItWorks />
      <Features />
      <Integrations />
      <CTA />
      <Footer />
    </main>
  );
}
