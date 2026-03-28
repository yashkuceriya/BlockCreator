'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeForm } from '../../components/ThemeForm';
import { GenerationTerminal } from '../../components/GenerationTerminal';
import { PlaygroundPreview } from '../../components/PlaygroundPreview';
import { SuccessCard } from '../../components/SuccessCard';
import { ThemeSummary } from '../../components/ThemeSummary';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { Sidebar } from '../../components/Sidebar';
import { useThemeGeneration } from '../../hooks/useThemeGeneration';
import { Confetti } from '../../components/Confetti';
import { GenerationSkeleton } from '../../components/GenerationSkeleton';
import { DEMO_THEME_FILES, DEMO_THEME_SLUG } from '../../lib/demo-theme';

type MobileTab = 'form' | 'preview' | 'logs';

const STEPS = [
  { label: 'Concept', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z' },
  { label: 'Engine', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75' },
  { label: 'Assemble', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
  { label: 'Export', icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' },
] as const;
const STEP_MAP: Record<string, number> = { 'theme-json': 1, patterns: 2, templates: 2, assembling: 3, complete: 3 };

export default function Home() {
  const { state, progress, result, error, startedAt, generate, refine, reset, loadResult } = useThemeGeneration();
  const [mobileTab, setMobileTab] = useState<MobileTab>('form');
  const formRef = useRef<HTMLFormElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentStep = progress.length > 0 ? STEP_MAP[progress[progress.length - 1].step] ?? 0 : 0;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (state !== 'complete' || !result) return;
    const showTimer = setTimeout(() => setShowConfetti(true), 50);
    const hideTimer = setTimeout(() => setShowConfetti(false), 3500);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [state, result]);

  const loadDemo = useCallback(async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const dir = zip.folder(DEMO_THEME_SLUG)!;
    dir.file('style.css', DEMO_THEME_FILES['style.css']);
    dir.file('theme.json', DEMO_THEME_FILES['theme.json']);
    dir.file('functions.php', DEMO_THEME_FILES['functions.php']);
    dir.file('readme.txt', DEMO_THEME_FILES['readme.txt']);
    for (const [name, content] of Object.entries(DEMO_THEME_FILES.templates)) dir.folder('templates')!.file(name, content);
    for (const [name, content] of Object.entries(DEMO_THEME_FILES.parts)) dir.folder('parts')!.file(name, content);
    for (const [name, content] of Object.entries(DEMO_THEME_FILES.patterns)) dir.folder('patterns')!.file(name, content);
    const buf = await zip.generateAsync({ type: 'base64' });
    loadResult({ files: DEMO_THEME_FILES, zipBase64: buf, themeSlug: DEMO_THEME_SLUG });
  }, [loadResult]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (state === 'generating' && terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state]);

  return (
    <div className="h-full overflow-hidden flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text)]">
      <Confetti active={showConfetti} />

      {/* Top Nav */}
      <nav className="h-14 shrink-0 flex items-center justify-between px-6 bg-[var(--color-bg-page)]/70 backdrop-blur-xl border-b border-[var(--color-border)]/10 z-30">
        <a href="/landing" className="text-lg font-bold tracking-tight text-[var(--color-primary-container)] italic font-serif">
          The Editorial Engine
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="/landing" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary-container)] transition-colors">Product</a>
          <a href="#" className="text-[var(--color-primary-container)] font-semibold border-b-2 border-[var(--color-primary-container)] pb-0.5">Generator</a>
        </div>
        <div className="flex items-center gap-3">
          <KeyboardHint />
          {state !== 'idle' && (
            <button onClick={reset} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary-container)] transition-colors font-medium">Start Over</button>
          )}
          <button onClick={() => state === 'idle' ? loadDemo() : undefined} className="px-4 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-container)] transition-colors">Try Demo</button>
          <a href="/create" className="px-4 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition-all active:scale-[0.98]">Get Started</a>
        </div>
      </nav>

      {/* Mobile tab bar */}
      <div className="lg:hidden shrink-0 flex border-b border-[var(--color-border)]/20 bg-[var(--color-bg-page)]">
        <MobileTabBtn active={mobileTab === 'form'} onClick={() => setMobileTab('form')}>Create</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'preview'} onClick={() => setMobileTab('preview')}>Preview</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'logs'} onClick={() => setMobileTab('logs')} dot={progress.length > 0}>Log</MobileTabBtn>
      </div>

      {/* Desktop layout */}
      <div id="main-content" className="hidden lg:flex flex-1 min-h-0">
        <Sidebar
          currentResult={result}
          onLoadProject={(p) => loadResult({ files: p.files, zipBase64: p.zipBase64, themeSlug: p.slug })}
          onReset={reset}
        />

        {/* Main workspace */}
        <section className="flex-1 overflow-y-auto bg-[var(--color-bg-page)] p-8">
          <div className="max-w-5xl mx-auto space-y-10">

            {/* Step progress */}
            {state !== 'idle' && (
              <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
                {STEPS.map((step, i) => {
                  const isActive = i === currentStep;
                  const isDone = i < currentStep;
                  return (
                    <div key={step.label} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isDone ? 'bg-[var(--color-success)] text-white shadow-lg' :
                          isActive ? 'bg-[var(--color-primary)] text-white shadow-lg ring-4 ring-[var(--color-primary)]/10' :
                          'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]'
                        }`}>
                          {isDone ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          ) : (
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={step.icon} /></svg>
                          )}
                        </div>
                        <span className={`text-[9px] font-mono uppercase tracking-[0.15em] mt-2 ${
                          isActive ? 'text-[var(--color-primary)] font-bold' : isDone ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'
                        }`}>{step.label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`h-[2px] w-16 mx-2 mb-6 transition-colors duration-500 ${
                          isDone ? 'bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success)]/30' :
                          isActive ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-bg-muted)]' :
                          'bg-[var(--color-bg-muted)]'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Main grid: form + preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form side */}
              <div className="lg:col-span-7 space-y-8">
                {/* Header */}
                <header>
                  <h1 className="font-serif italic text-4xl xl:text-5xl font-light tracking-tight text-[var(--color-text)] mb-3">The Editorial Engine</h1>
                  <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-lg">
                    Transform a simple thought into a sophisticated WordPress block theme. No code, just curation.
                  </p>
                </header>

                <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} onLoadDemo={state === 'idle' ? loadDemo : undefined} />
                {error && <ErrorDisplay message={error} onRetry={reset} />}
              </div>

              {/* Preview side */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[var(--color-bg-muted)] rounded-2xl overflow-hidden shadow-[var(--shadow-xl)] border border-[var(--color-border)]/10 aspect-[4/5] relative">
                  {state === 'generating' && !result ? (
                    <GenerationSkeleton />
                  ) : result ? (
                    <PlaygroundPreview themeFiles={result.files} themeSlug={result.themeSlug} />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-[var(--color-primary)]/5 rounded-full blur-2xl absolute -inset-4 animate-[float_4s_ease-in-out_infinite]" />
                        <svg className="w-16 h-16 text-[var(--color-text-muted)]/20 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                      </div>
                      <h3 className="font-serif italic text-xl text-[var(--color-text-secondary)]">The Canvas Awaits</h3>
                      <p className="text-sm text-[var(--color-text-muted)] max-w-xs">Input your theme directive to witness the real-time synthesis of editorial excellence.</p>
                    </div>
                  )}
                </div>

                {result && <ThemeSummary files={result.files} />}
                {result && <SuccessCard themeSlug={result.themeSlug} zipBase64={result.zipBase64} files={result.files} onRefine={(instruction) => refine(instruction)} />}
              </div>
            </div>

            {/* Terminal — full width */}
            <div ref={terminalRef}>
              <GenerationTerminal logs={progress} startedAt={startedAt} />
            </div>
          </div>
        </section>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 min-h-0 overflow-y-auto p-4 bg-[var(--color-bg-page)]">
        {mobileTab === 'form' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} onLoadDemo={state === 'idle' ? loadDemo : undefined} />
            {error && <ErrorDisplay message={error} onRetry={reset} />}
            {result && <ThemeSummary files={result.files} />}
            {result && <SuccessCard themeSlug={result.themeSlug} zipBase64={result.zipBase64} files={result.files} onRefine={(instruction) => refine(instruction)} />}
          </div>
        )}
        {mobileTab === 'preview' && (
          <div className="h-[calc(100vh-120px)] animate-[fadeIn_0.2s_ease-out]"><PlaygroundPreview themeFiles={result?.files} themeSlug={result?.themeSlug} /></div>
        )}
        {mobileTab === 'logs' && (
          <div className="animate-[fadeIn_0.2s_ease-out]"><GenerationTerminal logs={progress} startedAt={startedAt} /></div>
        )}
      </div>
    </div>
  );
}

function MobileTabBtn({ active, onClick, children, dot }: { active: boolean; onClick: () => void; children: React.ReactNode; dot?: boolean }) {
  return (
    <button onClick={onClick} className={`flex-1 py-3 text-xs font-mono uppercase tracking-[0.1em] text-center relative transition-all ${active ? 'text-[var(--color-primary-container)] font-semibold' : 'text-[var(--color-text-muted)]'}`}>
      {children}
      {dot && <span className="absolute top-2 right-[30%] w-1.5 h-1.5 rounded-full bg-[var(--color-primary-container)] animate-[dot-pulse_1.5s_ease-in-out_infinite]" />}
      {active && <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--color-primary-container)]" />}
    </button>
  );
}

function KeyboardHint() {
  const [mod, setMod] = useState('Ctrl');
  useEffect(() => {
    const timer = setTimeout(() => {
      if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setMod('\u2318');
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
      <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-muted)] border border-[var(--color-border)]/20 font-mono text-[9px]">{mod}+G</kbd>
    </span>
  );
}
