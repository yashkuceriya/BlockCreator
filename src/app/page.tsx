'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeForm } from '../components/ThemeForm';
import { GenerationTerminal } from '../components/GenerationTerminal';
import { PlaygroundPreview } from '../components/PlaygroundPreview';
import { SuccessCard } from '../components/SuccessCard';
import { ThemeSummary } from '../components/ThemeSummary';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { useThemeGeneration } from '../hooks/useThemeGeneration';
import { Button } from '../components/ui/button';

type MobileTab = 'form' | 'preview' | 'logs';

const STEPS = ['Analyzing Intent', 'Generating theme.json', 'Building Templates', 'Packaging ZIP'] as const;
const STEP_MAP: Record<string, number> = { 'theme-json': 1, patterns: 2, templates: 2, assembling: 3, complete: 3 };

export default function Home() {
  const { state, progress, result, error, startedAt, generate, reset } = useThemeGeneration();
  const [mobileTab, setMobileTab] = useState<MobileTab>('form');
  const formRef = useRef<HTMLFormElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentStep = progress.length > 0 ? STEP_MAP[progress[progress.length - 1].step] ?? 0 : 0;

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
    <div className="h-full flex flex-col text-[var(--color-text)]">
      {/* Header */}
      <header role="banner" className="h-12 shrink-0 flex items-center justify-between px-5 bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
        <span className="text-sm font-bold text-[var(--color-accent)]">WP Block Theme Generator</span>
        <div className="flex items-center gap-2">
          <KeyboardHint />
          {state !== 'idle' && <Button onClick={reset} variant="ghost" size="sm">Start Over</Button>}
        </div>
      </header>

      {/* Mobile tab bar */}
      <div className="lg:hidden shrink-0 flex border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <MobileTabBtn active={mobileTab === 'form'} onClick={() => setMobileTab('form')}>Create</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'preview'} onClick={() => setMobileTab('preview')}>Preview</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'logs'} onClick={() => setMobileTab('logs')} dot={progress.length > 0}>Log</MobileTabBtn>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-1 min-h-0">
        {/* Left — Form + Terminal */}
        <div className="w-[440px] shrink-0 flex flex-col border-r border-[var(--color-border)]">
          {/* Step progress */}
          {state !== 'idle' && (
            <div className="shrink-0 flex items-center border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 overflow-x-auto">
              {STEPS.map((label, i) => (
                <span key={label} className={`py-2.5 px-3 text-[11px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  i === currentStep
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                    : i < currentStep
                      ? 'border-transparent text-[var(--color-text-secondary)]'
                      : 'border-transparent text-[var(--color-text-muted)]'
                }`}>
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto bg-[var(--color-bg-page)]">
            <div className="p-6 space-y-5">
              <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} />
              {error && <ErrorDisplay message={error} onRetry={reset} />}
              {result && <ThemeSummary files={result.files} />}
              {result && <SuccessCard themeSlug={result.themeSlug} zipBase64={result.zipBase64} files={result.files} onRefine={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
            </div>
            <div ref={terminalRef}>
              <GenerationTerminal logs={progress} startedAt={startedAt} />
            </div>
          </div>
        </div>

        {/* Right — Preview */}
        <div role="region" aria-label="Theme preview" className="flex-1 min-w-0 bg-[var(--color-bg-page)]">
          <PlaygroundPreview themeFiles={result?.files} themeSlug={result?.themeSlug} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden flex-1 min-h-0 overflow-y-auto p-4">
        {mobileTab === 'form' && (
          <div className="space-y-4">
            <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} />
            {error && <ErrorDisplay message={error} onRetry={reset} />}
            {result && <ThemeSummary files={result.files} />}
            {result && <SuccessCard themeSlug={result.themeSlug} zipBase64={result.zipBase64} files={result.files} onRefine={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
          </div>
        )}
        {mobileTab === 'preview' && (
          <div className="h-[calc(100vh-120px)]"><PlaygroundPreview themeFiles={result?.files} themeSlug={result?.themeSlug} /></div>
        )}
        {mobileTab === 'logs' && <GenerationTerminal logs={progress} startedAt={startedAt} />}
      </div>
    </div>
  );
}

function MobileTabBtn({ active, onClick, children, dot }: { active: boolean; onClick: () => void; children: React.ReactNode; dot?: boolean }) {
  return (
    <button onClick={onClick} className={`flex-1 py-3 text-xs font-medium text-center relative transition-colors ${active ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>
      {children}
      {dot && <span className="absolute top-2 right-[30%] w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />}
    </button>
  );
}

function KeyboardHint() {
  const [mod, setMod] = useState('Ctrl');
  useEffect(() => { if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setMod('\u2318'); }, []);
  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
      <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-hover)] border border-[var(--color-border)] font-mono text-[9px]">{mod}+G</kbd>
      <span>Generate</span>
    </span>
  );
}
