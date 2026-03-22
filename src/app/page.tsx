'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeForm } from '../components/ThemeForm';
import { GenerationTerminal } from '../components/GenerationTerminal';
import { PlaygroundPreview } from '../components/PlaygroundPreview';
import { SuccessCard } from '../components/SuccessCard';
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
      {/* ── Header ── */}
      <header role="banner" className="h-12 shrink-0 flex items-center justify-between px-5 bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[var(--color-accent)]">WP Block Architect</span>
        </div>
        <div className="flex items-center gap-2">
          {state !== 'idle' && <Button onClick={reset} variant="ghost" size="sm">Start Over</Button>}
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-[10px] font-bold">U</div>
        </div>
      </header>

      {/* ── Mobile tab bar ── */}
      <div className="lg:hidden shrink-0 flex border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <MobileTabBtn active={mobileTab === 'form'} onClick={() => setMobileTab('form')}>Create</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'preview'} onClick={() => setMobileTab('preview')}>Preview</MobileTabBtn>
        <MobileTabBtn active={mobileTab === 'logs'} onClick={() => setMobileTab('logs')} dot={progress.length > 0}>Log</MobileTabBtn>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside role="navigation" aria-label="Navigation" className="w-44 shrink-0 flex flex-col bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)]">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-xs font-bold text-[var(--color-text)]">Architect Workspace</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">v1.0.0</p>
          </div>
          <nav className="flex-1 p-2 space-y-0.5">
            <SidebarItem active icon={<ProjectIcon />}>Projects</SidebarItem>
            <SidebarItem icon={<SettingsIcon />}>Settings</SidebarItem>
            <SidebarItem icon={<HelpIcon />}>Help</SidebarItem>
          </nav>
          <div className="p-3">
            <Button onClick={reset} variant="primary" size="md" className="w-full">New Theme</Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Step progress bar */}
          {state !== 'idle' && (
            <div className="shrink-0 flex items-center border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-6">
              {STEPS.map((label, i) => (
                <button key={label} className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors ${
                  i === currentStep
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                    : i < currentStep
                      ? 'border-transparent text-[var(--color-text-secondary)]'
                      : 'border-transparent text-[var(--color-text-muted)]'
                }`}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Two-column content */}
          <div className="flex-1 min-h-0 flex">
            {/* Left — Form */}
            <div className="w-[420px] shrink-0 overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg-page)]">
              <div className="p-6 space-y-5">
                <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} />
                {error && <ErrorDisplay message={error} onRetry={reset} />}
                {result && <SuccessCard themeSlug={result.themeSlug} zipBase64={result.zipBase64} files={result.files} onRefine={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
              </div>
              <div ref={terminalRef}>
                <GenerationTerminal logs={progress} startedAt={startedAt} />
              </div>
            </div>

            {/* Right — Preview */}
            <div role="region" aria-label="Theme preview" className="flex-1 min-w-0 bg-[var(--color-bg-page)]">
              <PlaygroundPreview themeFiles={result?.files} themeSlug={result?.themeSlug} />
            </div>
          </div>

          {/* Footer */}
          <footer className="shrink-0 flex items-center justify-between px-6 py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <p className="text-[10px] text-[var(--color-text-muted)]">&copy; 2025 WP Block Architect</p>
            <div className="flex gap-4">
              <span className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer">Documentation</span>
              <span className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer">Privacy</span>
              <span className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer">Terms</span>
            </div>
          </footer>
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="lg:hidden flex-1 min-h-0 overflow-y-auto p-4">
        {mobileTab === 'form' && (
          <div className="space-y-4">
            <ThemeForm ref={formRef} onSubmit={generate} disabled={state === 'generating'} />
            {error && <ErrorDisplay message={error} onRetry={reset} />}
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

function SidebarItem({ active, icon, children }: { active?: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${active ? 'text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}>
      <span className={active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}>{icon}</span>
      {children}
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

function ProjectIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>; }
function SettingsIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function HelpIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>; }
