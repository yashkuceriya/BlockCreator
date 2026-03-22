'use client';

import { useMemo } from 'react';
import { ThemeFiles } from '../types';
import { Button } from './ui/button';

interface SuccessCardProps {
  themeSlug: string;
  zipBase64: string;
  files: ThemeFiles;
  onRefine?: () => void;
}

export function SuccessCard({ themeSlug, zipBase64, files, onRefine }: SuccessCardProps) {
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

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)] animate-[fadeIn_0.3s_ease-out] space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">Theme ready!</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stats.totalFiles} files &middot; {stats.templateCount} templates &middot; {stats.patternCount} patterns &middot; ~{stats.sizeKB} KB</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDownload} variant="primary" size="md" className="flex-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Download .zip
        </Button>
        {onRefine && (
          <Button onClick={onRefine} variant="secondary" size="md">
            Retry/Refine
          </Button>
        )}
      </div>
    </div>
  );
}
