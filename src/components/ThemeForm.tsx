'use client';

import { useState, FormEvent, forwardRef } from 'react';
import { ThemePrompt } from '../types';
import { Button } from './ui/button';

interface ThemeFormProps {
  onSubmit: (prompt: ThemePrompt) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  { label: 'Starter Blog', desc: 'A welcoming blog theme with a warm neutral palette, friendly serif typography, centered reading column, and a cozy homepage.' },
  { label: 'Portfolio', desc: 'A minimal portfolio theme with a full-width hero, project grid, dark color scheme and sans-serif typography.' },
  { label: 'Business', desc: 'A professional business theme with sticky header, CTA sections, testimonial cards, and blue-white color scheme.' },
];

export const ThemeForm = forwardRef<HTMLFormElement, ThemeFormProps>(function ThemeForm({ onSubmit, disabled }, ref) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showConstraints, setShowConstraints] = useState(false);
  const [colorPreferences, setColorPreferences] = useState('');
  const [typographyPreferences, setTypographyPreferences] = useState('');
  const [layoutPreferences, setLayoutPreferences] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({
      name: name.trim() || 'My Custom Theme',
      description: description.trim(),
      colorPreferences: colorPreferences.trim() || undefined,
      typographyPreferences: typographyPreferences.trim() || undefined,
      layoutPreferences: layoutPreferences.trim() || undefined,
    });
  };

  const input = 'w-full px-3 py-2.5 bg-[var(--color-bg-input)] border border-[var(--color-border-input)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-border-focus)] disabled:opacity-40 transition-all text-sm';

  const descLen = description.trim().length;
  const hasDescription = descLen >= 10;

  return (
    <form ref={ref} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Design Intent */}
      <h2 className="text-2xl font-bold text-[var(--color-text)]">Design Intent</h2>

      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-card)]">
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A minimalist photography portfolio with dark mode support, featuring a large masonry gallery and a sidebar menu..."
          rows={5}
          disabled={disabled}
          className="w-full bg-transparent text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-sm leading-relaxed resize-none focus:outline-none disabled:opacity-40"
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]">
          <span className={`text-[10px] font-mono ${descLen > 0 && descLen < 10 ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`}>
            {descLen > 0 ? `${descLen} chars` : ''}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)]">Natural Language Engine</span>
        </div>
      </div>

      {/* Example prompts */}
      {!disabled && descLen === 0 && (
        <div className="flex flex-wrap gap-1.5 animate-[fadeIn_0.2s_ease-out]">
          {EXAMPLES.map((ex) => (
            <button key={ex.label} type="button" onClick={() => { setDescription(ex.desc); setName(ex.label); }} className="px-3 py-1.5 text-xs rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent-soft)] transition-all">
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {/* Technical Constraints */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-card)] space-y-4">
        <button type="button" onClick={() => setShowConstraints(!showConstraints)} className="flex items-center justify-between w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">Technical Constraints</span>
          <svg className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${showConstraints ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {(showConstraints || name) && (
          <div className="space-y-3 animate-[fadeIn_0.15s_ease-out]">
            <div>
              <label htmlFor="slug" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Theme Slug</label>
              <input id="slug" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="minimalist-photo-v1" disabled={disabled} className={input} />
            </div>
            <div>
              <label htmlFor="colors" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Color Palette</label>
              <input id="colors" type="text" value={colorPreferences} onChange={(e) => setColorPreferences(e.target.value)} placeholder="Dark navy, white, blue accents, warm gray" disabled={disabled} className={input} />
            </div>
            <div>
              <label htmlFor="typo" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Typography</label>
              <input id="typo" type="text" value={typographyPreferences} onChange={(e) => setTypographyPreferences(e.target.value)} placeholder="Inter & Playfair Display" disabled={disabled} className={input} />
            </div>
            <div>
              <label htmlFor="layout" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Layout</label>
              <input id="layout" type="text" value={layoutPreferences} onChange={(e) => setLayoutPreferences(e.target.value)} placeholder="Wide content, sticky header, 3-col footer" disabled={disabled} className={input} />
            </div>
          </div>
        )}
      </div>

      {/* Generate */}
      <Button type="submit" variant="primary" size="lg" loading={disabled} disabled={disabled || !hasDescription} className={`w-full ${hasDescription && !disabled ? 'animate-[pulse-subtle_3s_ease-in-out_infinite]' : ''}`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" /></svg>
        {disabled ? 'Generating...' : hasDescription ? 'Generate Theme' : 'Describe your theme to start'}
      </Button>
    </form>
  );
});
