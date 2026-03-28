'use client';

import { useMemo } from 'react';
import { ThemeFiles } from '../types';

interface ThemeSummaryProps {
  files: ThemeFiles;
}

interface ParsedDesign {
  colors: { name: string; color: string }[];
  fonts: string[];
  templates: string[];
  patterns: string[];
}

export function ThemeSummary({ files }: ThemeSummaryProps) {
  const design = useMemo<ParsedDesign>(() => {
    let colors: { name: string; color: string }[] = [];
    let fonts: string[] = [];

    try {
      const tj = JSON.parse(files['theme.json']);
      colors = tj?.settings?.color?.palette?.map((c: { name: string; color: string }) => ({
        name: c.name,
        color: c.color,
      })) || [];
      fonts = tj?.settings?.typography?.fontFamilies?.map((f: { name: string }) => f.name) || [];
    } catch { /* ignore parse errors */ }

    return {
      colors,
      fonts,
      templates: Object.keys(files.templates).map(f => f.replace('.html', '')),
      patterns: Object.keys(files.patterns).map(f => f.replace('.php', '')),
    };
  }, [files]);

  if (design.colors.length === 0 && design.fonts.length === 0) return null;

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-card)] animate-[fadeIn_0.3s_ease-out] space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" /></svg>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Design Summary</span>
      </div>

      {/* Color palette */}
      {design.colors.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2.5">Color Palette</p>
          <div className="flex flex-wrap gap-2">
            {design.colors.slice(0, 8).map((c) => (
              <div key={c.name} className="group relative">
                <div
                  className="w-9 h-9 rounded-xl border-2 border-[var(--color-border)] shadow-sm cursor-default transition-all duration-200 hover:scale-110 hover:shadow-md"
                  style={{ backgroundColor: c.color }}
                  title={`${c.name}: ${c.color}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-[var(--color-text)] text-[var(--color-bg-card)] text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  <div className="font-semibold">{c.name}</div>
                  <div className="opacity-70">{c.color}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-[var(--color-text)] rotate-45" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography */}
      {design.fonts.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Typography</p>
          <div className="flex gap-2">
            {design.fonts.map(f => (
              <span key={f} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">{f}</span>
            ))}
          </div>
        </div>
      )}

      {/* Generated files */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Templates</p>
          <div className="flex flex-wrap gap-1">
            {design.templates.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-warning)]/8 text-[var(--color-warning)] border border-[var(--color-warning)]/15 font-medium">{t}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Patterns</p>
          <div className="flex flex-wrap gap-1">
            {design.patterns.map(p => (
              <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-[var(--color-accent)]/10 font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
