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
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-card)] animate-[fadeIn_0.3s_ease-out] space-y-3">
      {/* Color palette */}
      {design.colors.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Color Palette</p>
          <div className="flex flex-wrap gap-1.5">
            {design.colors.slice(0, 8).map((c) => (
              <div key={c.name} className="group relative">
                <div
                  className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] shadow-sm cursor-default transition-transform hover:scale-110"
                  style={{ backgroundColor: c.color }}
                  title={`${c.name}: ${c.color}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-[var(--color-text)] text-[var(--color-bg-card)] text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {c.color}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography */}
      {design.fonts.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Typography</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{design.fonts.join(' & ')}</p>
        </div>
      )}

      {/* Generated files summary */}
      <div className="flex gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Templates</p>
          <div className="flex flex-wrap gap-1">
            {design.templates.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">{t}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Patterns</p>
          <div className="flex flex-wrap gap-1">
            {design.patterns.map(p => (
              <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
