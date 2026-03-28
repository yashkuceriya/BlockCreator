'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newsreader, Inter } from 'next/font/google';
import { useScrollReveal, revealClass } from '../../hooks/useScrollReveal';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const GITHUB_URL = 'https://github.com/yashkuceriya/BlockCreator';

export default function LandingPage() {
  return (
    <div className={`${newsreader.variable} ${inter.variable} font-[family-name:var(--font-inter)] text-[#2d3336] bg-[#fafafa] scroll-smooth`}>
      <Nav />
      <div className="pt-16">
        <Hero />
      </div>
      <Stats />
      <Workflow />
      <Features />
      <TechStack />
      <Audience />
      <CTA />
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAV — Frosted glass sticky header
   ═══════════════════════════════════════════ */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'}`}>
      <div className="flex justify-between items-center px-6 md:px-8 h-16 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#176491] to-[#0d4a6e] flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" /></svg>
          </div>
          <span className="text-lg font-bold font-[family-name:var(--font-newsreader)] text-[#176491] tracking-tight">
            The Editorial Engine
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#workflow">How It Works</NavLink>
          <NavLink href="#audience">For Teams</NavLink>
          <NavLink href={GITHUB_URL} external>GitHub</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="group relative bg-gradient-to-r from-[#176491] to-[#1a7ab5] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-[0_2px_8px_rgba(23,100,145,0.25)] hover:shadow-[0_4px_16px_rgba(23,100,145,0.35)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started Free
            <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors" aria-label="Menu">
            <svg className="w-5 h-5 text-[#596065]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'} /></svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 px-6 py-4 space-y-3 animate-[fadeIn_0.15s_ease-out]">
          <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm text-[#596065] py-2">Features</a>
          <a href="#workflow" onClick={() => setMobileOpen(false)} className="block text-sm text-[#596065] py-2">How It Works</a>
          <a href="#audience" onClick={() => setMobileOpen(false)} className="block text-sm text-[#596065] py-2">For Teams</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#596065] py-2">GitHub</a>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = 'text-sm text-[#596065] hover:text-[#176491] transition-colors relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#176491] after:transition-all hover:after:w-full font-medium';
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <a href={href} className={cls}>{children}</a>;
}

/* ═══════════════════════════════════════════
   HERO — Typing effect + animated mockup
   ═══════════════════════════════════════════ */

const TYPING_WORDS = ['Yours to Command', 'Beautifully Generated', 'Production-Ready', 'Instantly Yours'];

function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === word.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }
    if (isDeleting && charIndex === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
      }, 50);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  const currentText = TYPING_WORDS[wordIndex].slice(0, charIndex);

  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(23,100,145,0.07)_0%,transparent_70%)] animate-[float-slow_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(23,100,145,0.05)_0%,transparent_70%)] animate-[float-slow_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,166,125,0.04)_0%,transparent_70%)] animate-[float_15s_ease-in-out_infinite]" />
      </div>
      <div className="absolute inset-0 -z-10 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #176491 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="px-6 md:px-8 pt-24 md:pt-32 pb-20 md:pb-28 max-w-screen-xl mx-auto flex items-center gap-16 lg:gap-20 max-lg:flex-col max-lg:gap-12">
        {/* Left — Copy */}
        <div className="flex-[3] max-lg:w-full animate-[fadeInUp_0.6s_ease-out]">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/80 backdrop-blur-sm text-[#176491] text-[0.6rem] uppercase tracking-[0.15em] rounded-full mb-8 font-semibold border border-[#176491]/10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a67d] animate-[dot-pulse_1.5s_ease-in-out_infinite]" />
            AI-Powered &middot; WordPress Native
          </span>
          <h1 className="font-[family-name:var(--font-newsreader)] text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.03em] mb-8">
            The Future of WordPress&nbsp;is{' '}
            <span className="relative whitespace-nowrap">
              <span className="italic bg-gradient-to-r from-[#176491] to-[#1a9ed4] bg-clip-text text-transparent">{currentText}</span>
              <span className="inline-block w-[3px] h-[0.85em] bg-[#176491] ml-0.5 align-middle animate-[typing-cursor_1s_step-end_infinite]" />
            </span>
          </h1>
          <p className="text-lg text-[#5a6063] max-w-[36rem] leading-[1.8] mb-10">
            Describe your vision. Get a production-ready WordPress block theme with theme.json,
            FSE templates, and curated patterns. No custom HTML blocks, ever.
          </p>
          <div className="flex gap-4 flex-wrap items-center">
            <Link
              href="/create"
              className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-[#176491] to-[#1a7ab5] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-[0_4px_16px_rgba(23,100,145,0.3)] hover:shadow-[0_8px_30px_rgba(23,100,145,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start Building
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-[#596065] px-5 py-4 text-base font-medium hover:text-[#176491] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              View Source
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex items-center gap-5 md:gap-8 mt-12 pt-8 border-t border-[#e4e7ea]/60 flex-wrap">
            <TrustItem icon="M4.5 12.75l6 6 9-13.5" text="Zero Custom HTML" />
            <TrustItem icon="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75" text="Claude AI" />
            <TrustItem icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" text="WP 6.2+ Ready" />
            <TrustItem icon="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" text="ZIP Download" />
          </div>
        </div>

        {/* Right — Animated mockup */}
        <div className="flex-[2] relative max-lg:w-full max-w-lg animate-[fadeInScale_0.8s_ease-out_0.2s_both]">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[#7a7f82]">
      <svg className="w-4 h-4 text-[#00a67d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
      <span className="text-xs font-medium whitespace-nowrap">{text}</span>
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#176491]/10 to-[#00a67d]/5 rounded-2xl blur-3xl scale-110" />
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-[rgba(0,0,0,0.06)]">
        {/* Browser chrome */}
        <div className="h-9 bg-[#f5f5f5] border-b border-[#e5e5e5] flex items-center px-3 gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1 h-5 bg-white rounded-md border border-[#e5e5e5] flex items-center px-2">
            <svg className="w-2.5 h-2.5 text-[#ccc] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" /></svg>
            <span className="text-[9px] text-[#999]">your-theme.developer.blog</span>
          </div>
        </div>

        {/* Theme mockup content */}
        <div className="p-4 space-y-3">
          {/* Hero banner */}
          <div className="w-full h-28 rounded-lg bg-gradient-to-br from-[#176491] to-[#0d4a6e] flex items-center justify-center animate-[float_6s_ease-in-out_infinite] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
            <div className="text-center text-white relative">
              <div className="text-[8px] uppercase tracking-[0.2em] opacity-50 mb-1">Generated Theme</div>
              <div className="font-[family-name:var(--font-newsreader)] text-lg italic">Your Brand Here</div>
            </div>
          </div>
          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-2">
            {[0.15, 0.3, 0.45].map((d, i) => (
              <div key={i} className="h-14 rounded-md bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] border border-[#eee]" style={{ animation: `fadeIn 0.4s ease-out ${d}s both` }} />
            ))}
          </div>
          {/* Text lines */}
          <div className="space-y-1.5 px-1">
            <div className="h-2 w-[85%] rounded bg-[#eee]" />
            <div className="h-2 w-[65%] rounded bg-[#f0f0f0]" />
            <div className="h-2 w-[75%] rounded bg-[#f3f3f3]" />
          </div>
          {/* Two-column */}
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-md bg-[#f8f8f8] border border-[#eee]" />
            <div className="h-16 rounded-md bg-[#f8f8f8] border border-[#eee]" />
          </div>
        </div>

        {/* Floating AI overlay */}
        <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#176491] to-[#1a9ed4] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" /></svg>
            </div>
            <span className="text-[9px] uppercase tracking-[0.12em] text-[#999] font-semibold">AI Generating</span>
            <span className="ml-auto flex gap-0.5">
              {[0, 1, 2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-[#176491] animate-[dot-pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </span>
          </div>
          <p className="font-[family-name:var(--font-newsreader)] italic text-xs text-[#555] leading-relaxed">
            &ldquo;Crafting a bespoke portfolio with masonry grid and dark color scheme...&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STATS — Animated counters
   ═══════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal<HTMLSpanElement>({ threshold: 0.5 });

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [visible, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function Stats() {
  const [ref, visible] = useScrollReveal({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-16 border-y border-[#e8eaec]/80 bg-white">
      <div className={`px-6 md:px-8 max-w-screen-xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: 100, suffix: '+', label: 'Core Blocks Supported', color: '#176491' },
            { value: 6, suffix: '', label: 'Page Templates', color: '#dba617' },
            { value: 5, suffix: '', label: 'Section Patterns', color: '#8b5cf6' },
            { value: 0, suffix: '', label: 'Custom HTML Blocks', color: '#00a67d' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="font-[family-name:var(--font-newsreader)] text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight" style={{ color: stat.color }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs text-[#7a7f82] mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   WORKFLOW — Connected step cards
   ═══════════════════════════════════════════ */

const STEPS = [
  { num: '01', title: 'Describe', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10', desc: 'Write a plain-language description of your ideal site. Specify the vibe, audience, and purpose — the AI handles the rest.', color: '#176491' },
  { num: '02', title: 'Generate', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', desc: 'Claude AI crafts a complete block theme: color palettes, typography scales, layout structures, patterns, and full-page templates.', color: '#0d7c5f' },
  { num: '03', title: 'Preview', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z', desc: 'See your theme running live in WordPress Playground — a real WordPress instance right in your browser. No server needed.', color: '#8b5cf6' },
  { num: '04', title: 'Export', icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3', desc: 'Download a standard .zip file. Drop it into any WordPress site, activate, and you are live. Production-ready out of the box.', color: '#f43f5e' },
] as const;

function Workflow() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="workflow" className="py-24 md:py-28 relative scroll-mt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa]" />

      <div ref={ref} className="relative px-6 md:px-8 max-w-screen-xl mx-auto">
        <div className={`text-center mb-16 md:mb-20 ${revealClass(visible, 'up')}`}>
          <span className="inline-block px-3 py-1 bg-[#176491]/5 text-[#176491] text-[0.6rem] uppercase tracking-[0.2em] rounded-full mb-4 font-bold">How it works</span>
          <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(2rem,4vw,3.2rem)] tracking-[-0.02em]">
            Describe it. Build it. Ship it.
          </h2>
          <p className="text-[#7a7f82] mt-3 max-w-lg mx-auto text-base">Four steps from a spark of an idea to an installable WordPress theme.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-[2px]">
            <div className={`h-full bg-gradient-to-r from-[#176491]/20 via-[#0d7c5f]/20 via-[#8b5cf6]/20 to-[#f43f5e]/20 transition-all duration-1000 ${visible ? 'w-full' : 'w-0'}`} />
          </div>

          {STEPS.map((step, i) => (
            <div key={step.num} className={`group relative transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${150 + i * 120}ms` }}>
              <div className="bg-white rounded-2xl p-7 border border-[rgba(0,0,0,0.04)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-500 hover:-translate-y-1 h-full">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative transition-transform duration-500 group-hover:scale-105" style={{ background: `${step.color}0d` }}>
                  <svg className="w-5 h-5" style={{ color: step.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={step.icon} /></svg>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-white text-[9px] flex items-center justify-center font-bold shadow-sm" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)` }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-newsreader)] text-xl mb-2 tracking-[-0.01em]">{step.title}</h3>
                <p className="text-[#7a7f82] text-sm leading-[1.7]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURES — Bento grid with glass cards
   ═══════════════════════════════════════════ */

function Features() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="features" ref={ref} className="py-24 md:py-28 bg-gradient-to-b from-[#f2f4f5] to-[#eef0f2] relative scroll-mt-16">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #176491 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative px-6 md:px-8 max-w-screen-xl mx-auto">
        <div className={`text-center mb-14 md:mb-16 ${revealClass(visible, 'up')}`}>
          <span className="inline-block px-3 py-1 bg-[#176491]/5 text-[#176491] text-[0.6rem] uppercase tracking-[0.2em] rounded-full mb-4 font-bold">Capabilities</span>
          <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(2rem,4vw,3.2rem)] tracking-[-0.02em]">
            Built for WordPress Professionals
          </h2>
          <p className="text-[#7a7f82] mt-3 max-w-lg mx-auto text-base">Every feature designed to produce themes that pass review.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-5 min-h-[520px]">
          {/* theme.json — wide */}
          <div className={`md:col-span-2 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
            <BentoCard title="Complete theme.json" icon="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" tag="Core">
              Validated color palettes, typography scales, spacing presets, layout config, and global styles — all wired to CSS custom properties.
            </BentoCard>
          </div>

          {/* Performance — tall accent */}
          <div className={`md:row-span-2 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
            <div className="group relative rounded-2xl overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#176491] to-[#0d4a6e] transition-all duration-500 group-hover:from-[#1a7ab5] group-hover:to-[#176491]" />
              <div className="relative p-7 text-white h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5 backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75" /></svg>
                  </div>
                  <h4 className="font-[family-name:var(--font-newsreader)] text-2xl mb-2">Lightning-fast</h4>
                  <p className="text-white/60 text-sm leading-relaxed">Zero bloat. No jQuery. Pure block-based architecture for perfect Core Web Vitals.</p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/10">
                  <div className="font-[family-name:var(--font-newsreader)] italic text-4xl tracking-tight">100/100</div>
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] opacity-40 mt-1">Performance Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Accessible */}
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
            <BentoCard title="Fully Accessible" icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" tag="A11y">
              WCAG 2.1 compliant. Semantic markup, proper heading hierarchy, and contrast ratios baked in.
            </BentoCard>
          </div>

          {/* Block Patterns */}
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '350ms' }}>
            <BentoCard title="Rich Patterns" icon="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0L21.75 16.5 12 21.75 2.25 16.5l4.179-2.25m0 0l5.571 3 5.571-3" tag="FSE">
              Hero, features, CTA, about, and testimonial sections — pre-built and pattern-library ready.
            </BentoCard>
          </div>

          {/* Live Preview — wide */}
          <div className={`md:col-span-2 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '450ms' }}>
            <BentoCard title="Live WordPress Preview" icon="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" tag="Playground">
              Preview your theme instantly in WordPress Playground — a full WordPress instance running in the browser. No setup, no server, no waiting.
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ title, icon, children, tag }: { title: string; icon: string; children: React.ReactNode; tag?: string }) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm p-6 md:p-7 rounded-2xl border border-[rgba(0,0,0,0.04)] flex flex-col justify-between hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500 h-full">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#176491]/5 flex items-center justify-center group-hover:bg-[#176491]/10 transition-colors">
            <svg className="w-5 h-5 text-[#176491]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
          </div>
          {tag && <span className="text-[9px] uppercase tracking-[0.15em] text-[#adb3b6] font-bold">{tag}</span>}
        </div>
        <h4 className="font-[family-name:var(--font-newsreader)] text-xl mb-2">{title}</h4>
        <p className="text-[#7a7f82] text-sm leading-[1.7]">{children}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TECH STACK — Code preview
   ═══════════════════════════════════════════ */

function TechStack() {
  const [ref, visible] = useScrollReveal();

  return (
    <section ref={ref} className="py-24 md:py-28 bg-white relative overflow-hidden">
      <div className="px-6 md:px-8 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={revealClass(visible, 'right')}>
            <span className="inline-block px-3 py-1 bg-[#176491]/5 text-[#176491] text-[0.6rem] uppercase tracking-[0.2em] rounded-full mb-4 font-bold">Output Quality</span>
            <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(2rem,3.5vw,2.8rem)] tracking-[-0.02em] mb-6">
              Production-Grade,{' '}
              <span className="italic text-[#176491]">Not a Prototype</span>
            </h2>
            <p className="text-[#7a7f82] text-base leading-[1.8] mb-8">
              Every generated theme is a complete WordPress Block Theme. Proper file structure, validated block markup, and zero Custom HTML blocks. Install it, activate it, ship it.
            </p>
            <div className="space-y-3.5">
              {[
                { label: 'theme.json', desc: 'Global styles, palette, typography, spacing, layout', color: '#1a1a1a' },
                { label: 'Templates', desc: 'index, home, single, page, archive, 404', color: '#dba617' },
                { label: 'Patterns', desc: 'Hero, features, CTA, testimonials, about', color: '#176491' },
                { label: 'Parts', desc: 'Reusable header and footer template parts', color: '#00a67d' },
                { label: 'Validation', desc: 'Block markup, JSON schema, nesting balance', color: '#8b5cf6' },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-start gap-3.5 group transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`} style={{ transitionDelay: `${300 + i * 80}ms` }}>
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 transition-transform group-hover:scale-150" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="text-sm font-semibold text-[#2d3336]">{item.label}</span>
                    <span className="text-sm text-[#7a7f82] ml-2">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code preview */}
          <div className={`relative ${revealClass(visible, 'left', 200)}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#176491]/5 to-transparent rounded-3xl blur-2xl" />
            <div className="relative bg-[#1e1e2e] rounded-2xl overflow-hidden shadow-xl border border-[rgba(255,255,255,0.05)]">
              <div className="h-10 bg-[#181825] flex items-center px-4 gap-1.5 border-b border-[rgba(255,255,255,0.05)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f38ba8]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f9e2af]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#a6e3a1]" />
                <span className="ml-3 text-[10px] text-[#6c7086] font-mono">theme.json</span>
              </div>
              <pre className="p-5 text-[12px] md:text-[13px] font-mono leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-[#6c7086]">{'{'}</span>{'\n'}
                  {'  '}<span className="text-[#89b4fa]">&quot;$schema&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#a6e3a1]">&quot;https://schemas.wp.org/...&quot;</span><span className="text-[#6c7086]">,</span>{'\n'}
                  {'  '}<span className="text-[#89b4fa]">&quot;version&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#fab387]">3</span><span className="text-[#6c7086]">,</span>{'\n'}
                  {'  '}<span className="text-[#89b4fa]">&quot;settings&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#6c7086]">{'{'}</span>{'\n'}
                  {'    '}<span className="text-[#89b4fa]">&quot;color&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#6c7086]">{'{'}</span>{'\n'}
                  {'      '}<span className="text-[#89b4fa]">&quot;palette&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#6c7086]">[</span>{'\n'}
                  {'        '}<span className="text-[#6c7086]">{'{'}</span>{'\n'}
                  {'          '}<span className="text-[#89b4fa]">&quot;name&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#a6e3a1]">&quot;Primary&quot;</span><span className="text-[#6c7086]">,</span>{'\n'}
                  {'          '}<span className="text-[#89b4fa]">&quot;slug&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#a6e3a1]">&quot;primary&quot;</span><span className="text-[#6c7086]">,</span>{'\n'}
                  {'          '}<span className="text-[#89b4fa]">&quot;color&quot;</span><span className="text-[#6c7086]">:</span> <span className="text-[#a6e3a1]">&quot;#176491&quot;</span>{'\n'}
                  {'        '}<span className="text-[#6c7086]">{'}'}</span>{'\n'}
                  {'      '}<span className="text-[#6c7086]">]</span>{'\n'}
                  {'    '}<span className="text-[#6c7086]">{'}'}</span>{'\n'}
                  {'  '}<span className="text-[#6c7086]">{'}'}</span>{'\n'}
                  <span className="text-[#6c7086]">{'}'}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   AUDIENCE — Who it's for
   ═══════════════════════════════════════════ */

const AUDIENCES = [
  { tag: 'Agencies', title: 'Scale Production', desc: 'Cut custom theme development time dramatically. Deliver high-fidelity, block-editor-native WordPress sites in days, not weeks.', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
  { tag: 'Publishers', title: 'Editorial Control', desc: 'Empower editorial teams to create custom layouts without breaking brand guidelines or needing a theme developer on call.', icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z' },
  { tag: 'Creators', title: 'Bespoke Portfolios', desc: 'A theme that matches your creative vision. No generic templates. No compromise. Built specifically for your content and audience.', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
] as const;

function Audience() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="audience" ref={ref} className="py-24 md:py-28 bg-[#f2f4f5] scroll-mt-16">
      <div className="px-6 md:px-8 max-w-screen-xl mx-auto">
        <div className={`text-center mb-14 md:mb-16 ${revealClass(visible, 'up')}`}>
          <span className="inline-block px-3 py-1 bg-[#176491]/5 text-[#176491] text-[0.6rem] uppercase tracking-[0.2em] rounded-full mb-4 font-bold">Built for you</span>
          <h2 className="font-[family-name:var(--font-newsreader)] italic text-[clamp(2rem,4vw,3.2rem)] tracking-[-0.02em]">
            Built for the Curators of the Web
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {AUDIENCES.map((a, i) => (
            <div key={a.tag} className={`group bg-white p-7 md:p-8 rounded-2xl border border-[rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${200 + i * 120}ms` }}>
              <div className="w-12 h-12 rounded-2xl bg-[#176491]/5 flex items-center justify-center mb-5 group-hover:bg-[#176491]/10 transition-colors">
                <svg className="w-6 h-6 text-[#176491]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={a.icon} /></svg>
              </div>
              <div className="text-[#176491] text-[0.6rem] uppercase tracking-[0.2em] font-bold mb-2">{a.tag}</div>
              <h4 className="font-[family-name:var(--font-newsreader)] text-2xl mb-3 tracking-[-0.01em]">{a.title}</h4>
              <p className="text-[#7a7f82] text-sm leading-[1.7]">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CTA — Final call-to-action
   ═══════════════════════════════════════════ */

function CTA() {
  const [ref, visible] = useScrollReveal({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-28 md:py-36 px-6 md:px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f0f6fa] to-white" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(23,100,145,0.06)_0%,transparent_70%)]" />

      <div className={`relative max-w-3xl mx-auto ${revealClass(visible, 'scale')}`}>
        <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] mb-6 tracking-[-0.02em]">
          Ready to define your{' '}
          <span className="italic bg-gradient-to-r from-[#176491] to-[#1a9ed4] bg-clip-text text-transparent">digital presence?</span>
        </h2>
        <p className="text-[#7a7f82] text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Start generating WordPress themes in seconds. Open source. No credit card. No strings.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/create"
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#176491] to-[#1a7ab5] text-white px-10 py-5 rounded-xl text-lg md:text-xl font-semibold shadow-[0_4px_20px_rgba(23,100,145,0.3)] hover:shadow-[0_8px_30px_rgba(23,100,145,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Get Started Free
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#d4d1cb] text-[#596065] px-8 py-5 rounded-xl font-medium text-lg hover:border-[#176491] hover:text-[#176491] transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
            View Source
          </a>
        </div>
        <p className="mt-8 text-[#adb3b6] text-sm">
          WordPress.org compatible &middot; Open Source &middot; MIT Licensed
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-[#e8eaec] py-10 md:py-12 px-6 md:px-8 bg-[#fafafa]">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center flex-wrap gap-6 md:gap-8 max-md:flex-col max-md:text-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#176491] to-[#0d4a6e] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" /></svg>
          </div>
          <span className="font-[family-name:var(--font-newsreader)] italic text-[#adb3b6] text-base">
            The Editorial Engine
          </span>
        </div>
        <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
          <FooterLink href="/create">Get Started</FooterLink>
          <FooterLink href="#features">Features</FooterLink>
          <FooterLink href="#workflow">How It Works</FooterLink>
          <FooterLink href="https://wordpress.org" external>WordPress.org</FooterLink>
          <FooterLink href={GITHUB_URL} external>GitHub</FooterLink>
        </div>
        <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[#c5c8ca]">
          &copy; {new Date().getFullYear()} The Editorial Engine
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = 'text-xs text-[#adb3b6] hover:text-[#176491] transition-colors font-medium';
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <a href={href} className={cls}>{children}</a>;
}
