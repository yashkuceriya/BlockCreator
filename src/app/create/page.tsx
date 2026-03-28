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
import { Button } from '../../components/ui/button';
import { Confetti } from '../../components/Confetti';
import { GenerationSkeleton } from '../../components/GenerationSkeleton';

type MobileTab = 'form' | 'preview' | 'logs';

const STEPS = ['Analyzing Intent', 'Generating theme.json', 'Building Templates', 'Packaging ZIP'] as const;
const STEP_MAP: Record<string, number> = { 'theme-json': 1, patterns: 2, templates: 2, assembling: 3, complete: 3 };

export default function Home() {
  const { state, progress, result, error, startedAt, generate, refine, reset, loadResult } = useThemeGeneration();
  const [mobileTab, setMobileTab] = useState<MobileTab>('form');
  const formRef = useRef<HTMLFormElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentStep = progress.length > 0 ? STEP_MAP[progress[progress.length - 1].step] ?? 0 : 0;
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when generation completes
  useEffect(() => {
    if (state !== 'complete' || !result) return;
    const showTimer = setTimeout(() => setShowConfetti(true), 50);
    const hideTimer = setTimeout(() => setShowConfetti(false), 3500);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [state, result]);

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
    <div className="h-full overflow-hidden flex flex-col text-[var(--color-text)] bg-[var(--color-bg-page)]">
      <Confetti active={showConfetti} />
      {/* Header — gradient accent bar + frosted glass */}
      <div className="h-[2px] shrink-0 bg-gradient-to-r from-[var(--color-accent)] via-[#1a9ed4] to-[var(--color-success)]" />
      <header role="banner" className="h-12 shrink-0 flex items-center justify-between px-5 bg-[var(--color-bg-card)]/95 backdrop-blur-xl border-b border-[var(--color-border)]">
        <a href="/landing" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[#0d4a6e] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" /></svg>
          </div>
          <span className="text-sm font-bold text-[var(--color-accent)] group-hover:opacity-80 transition-opacity">The Editorial Engine</span>
        </a>
        <div className="flex items-center gap-3">
          <KeyboardHint />
          {state !== 'idle' && (
            <Button onClick={reset} variant="ghost" size="sm" className="gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
              Start Over
            </Button>
          )}
        </div>
      </header>

      {/* Mobile tab bar */}
      <div className="lg:hidden shrink-0 flex border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <MobileTabBtn active={mobileTab === 'form'} onClick={() => setMobileTab('form')} icon="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z">Create</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'preview'} onClick={() => setMobileTab('preview')} icon="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z">Preview</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'logs'} onClick={() => setMobileTab('logs')} icon="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" dot={progress.length > 0}>Log</MobileTabBtn>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-1 min-h-0 relative">
        {/* Sidebar */}
        <Sidebar
          currentResult={result}
          onLoadProject={(p) => loadResult({ files: p.files, zipBase64: p.zipBase64, themeSlug: p.slug })}
          onReset={reset}
        />

        {/* Form + Terminal */}
        <div className="w-[420px] shrink-0 flex flex-col border-r border-[var(--color-border)]">
          {/* Step progress */}
          {state !== 'idle' && (
            <div className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-1">
              <div className="flex items-center">
                {STEPS.map((label, i) => {
                  const isActive = i === currentStep;
                  const isDone = i < currentStep;
                  return (
                    <div key={label} className="flex-1 relative">
                      <div className={`py-3 px-3 text-[11px] font-medium text-center transition-all duration-300 ${
                        isActive ? 'text-[var(--color-accent)] font-semibold' : isDone ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'
                      }`}>
                        <div className="flex items-center justify-center gap-1.5">
                          {isDone ? (
                            <svg className="w-3.5 h-3.5 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          ) : isActive ? (
                            <span className="w-3.5 h-3.5 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-[dot-pulse_1.5s_ease-in-out_infinite]" />
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]/40" />
                            </span>
                          )}
                          <span className="whitespace-nowrap">{label}</span>
                        </div>
                      </div>
                      {/* Active indicator bar */}
                      <div className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-500 ${
                        isActive ? 'bg-[var(--color-accent)]' : isDone ? 'bg-[var(--color-success)]/30' : 'bg-transparent'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto bg-[var(--color-bg-page)]">
            <div className="p-6 space-y-5">
              <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} />
              {error && <ErrorDisplay message={error} onRetry={reset} />}
              {result && <ThemeSummary files={result.files} />}
              {result && <SuccessCard themeSlug={result.themeSlug} zipBase64={result.zipBase64} files={result.files} onRefine={(instruction) => refine(instruction)} />}
            </div>
            <div ref={terminalRef}>
              <GenerationTerminal logs={progress} startedAt={startedAt} />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div role="region" aria-label="Theme preview" className="flex-1 min-w-0 bg-[var(--color-bg-page)]">
          {state === 'generating' && !result ? (
            <GenerationSkeleton />
          ) : (
            <PlaygroundPreview themeFiles={result?.files} themeSlug={result?.themeSlug} />
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 min-h-0 overflow-y-auto p-4 bg-[var(--color-bg-page)]">
        {mobileTab === 'form' && (
          <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} />
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

function MobileTabBtn({ active, onClick, children, icon, dot }: { active: boolean; onClick: () => void; children: React.ReactNode; icon: string; dot?: boolean }) {
  return (
    <button onClick={onClick} className={`flex-1 py-3 text-xs font-medium text-center relative transition-all duration-200 ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>
      <div className="flex flex-col items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
        <span>{children}</span>
      </div>
      {dot && <span className="absolute top-1.5 right-[30%] w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[dot-pulse_1.5s_ease-in-out_infinite]" />}
      {active && <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[var(--color-accent)]" />}
    </button>
  );
}

function KeyboardHint() {
  const mod = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '\u2318' : 'Ctrl';
  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
      <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--color-bg-hover)] border border-[var(--color-border)] font-mono text-[9px] shadow-[0_1px_0_var(--color-border)]">{mod}+G</kbd>
      <span>Generate</span>
    </span>
  );
}
