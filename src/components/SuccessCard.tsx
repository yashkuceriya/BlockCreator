'use client';

import { useMemo, useState } from 'react';
import { ThemeFiles } from '../types';
import { Button } from './ui/button';

interface SuccessCardProps {
  themeSlug: string;
  zipBase64: string;
  files: ThemeFiles;
  onRefine?: (instruction: string) => void;
}

const REFINE_SUGGESTIONS = [
  'Make the color palette warmer',
  'Use a darker, more dramatic color scheme',
  'Make the hero section taller with more padding',
  'Switch to a more playful, rounded typography',
];

export function SuccessCard({ themeSlug, zipBase64, files, onRefine }: SuccessCardProps) {
  const [refinementText, setRefinementText] = useState('');
  const [showRefine, setShowRefine] = useState(false);

  const stats = useMemo(() => {
    const templateCount = Object.keys(files.templates).length;
    const patternCount = Object.keys(files.patterns).length;
    const totalFiles = 4 + templateCount + Object.keys(files.parts).length + patternCount;
    const sizeKB = Math.round((zipBase64.length * 3) / 4 / 1024);
    return { templateCount, patternCount, totalFiles, sizeKB };
  }, [files, zipBase64]);

  const handleDownload = () => {
    const byteCharacters = atob(zipBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeSlug}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefineSubmit = () => {
    if (!refinementText.trim() || !onRefine) return;
    onRefine(refinementText.trim());
    setRefinementText('');
    setShowRefine(false);
  };

  return (
    <div className="relative overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-success)]/20 rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-card)] animate-[fadeInScale_0.4s_ease-out] space-y-4">
      {/* Success gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-success)] via-[#34d399] to-[var(--color-success)]" />

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-success)]/10 flex items-center justify-center shrink-0 animate-[scale-in_0.3s_ease-out_0.2s_both]">
          <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[var(--color-text)]">Theme ready!</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{themeSlug}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Files', value: stats.totalFiles, color: 'var(--color-accent)' },
          { label: 'Templates', value: stats.templateCount, color: 'var(--color-warning)' },
          { label: 'Patterns', value: stats.patternCount, color: '#8b5cf6' },
          { label: 'Size', value: `${stats.sizeKB}KB`, color: 'var(--color-success)' },
        ].map(stat => (
          <div key={stat.label} className="text-center py-2 px-1 rounded-lg bg-[var(--color-bg-muted)] border border-[var(--color-border)]/50">
            <div className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleDownload} variant="success" size="md" className="flex-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Download .zip
        </Button>
        {onRefine && (
          <Button onClick={() => setShowRefine(!showRefine)} variant="secondary" size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            Iterate
          </Button>
        )}
      </div>

      {/* Refinement input */}
      {showRefine && onRefine && (
        <div className="space-y-3 pt-2 border-t border-[var(--color-border)]/50 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">Refine this theme</span>
          </div>

          <textarea
            value={refinementText}
            onChange={(e) => setRefinementText(e.target.value)}
            placeholder="Tell me what to change... e.g., 'Make the color palette warmer' or 'Use a bolder hero section'"
            rows={2}
            className="w-full px-3.5 py-2.5 bg-[var(--color-bg-input)] border border-[var(--color-border-input)] rounded-[var(--radius-lg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/15 focus:border-[var(--color-border-focus)] transition-all text-sm resize-none"
          />

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {REFINE_SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setRefinementText(s)}
                className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)] transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          <Button onClick={handleRefineSubmit} variant="primary" size="sm" disabled={!refinementText.trim()} className="w-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            Regenerate with Changes
          </Button>
        </div>
      )}
    </div>
  );
}
