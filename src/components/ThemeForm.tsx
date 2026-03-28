'use client';

import { useState, FormEvent, forwardRef } from 'react';
import { ThemePrompt } from '../types';
import { Button } from './ui/button';

interface ThemeFormProps {
  onSubmit: (prompt: ThemePrompt) => void;
  disabled?: boolean;
  onLoadDemo?: () => void;
}

const EXAMPLES = [
  { label: 'Starter Blog', desc: 'A welcoming personal blog with a warm neutral palette, friendly serif headings, centered reading column, and a homepage featuring recent posts with large featured images.', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { label: 'Design Portfolio', desc: 'A minimal dark-mode portfolio for a photographer with a full-bleed hero image, masonry project grid, about section with headshot, and a sans-serif typographic system.', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z' },
  { label: 'SaaS Landing', desc: 'A modern SaaS product landing page with a gradient hero, feature comparison grid, pricing tiers, testimonials from customers, and a strong call-to-action with blue/purple accents.', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
  { label: 'Food Magazine', desc: 'A vibrant culinary magazine theme with warm terracotta and cream colors, editorial serif headings, large food photography, recipe card patterns, and a newsletter signup section.', icon: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z' },
  { label: 'Tech Startup', desc: 'A bold tech startup theme with a full-width video-style hero, animated gradient backgrounds, feature grid with icons, team section, and a minimalist black/white design with neon green accents.', icon: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
  { label: 'Non-Profit', desc: 'A compassionate non-profit theme with warm, accessible colors, large imagery of community impact, donation CTA section, volunteer testimonials, and an events/news section.', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
];

export const ThemeForm = forwardRef<HTMLFormElement, ThemeFormProps>(function ThemeForm({ onSubmit, disabled, onLoadDemo }, ref) {
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

  const input = 'w-full px-3.5 py-2.5 bg-[var(--color-bg-input)] border border-[var(--color-border-input)] rounded-[var(--radius-lg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/15 focus:border-[var(--color-border-focus)] disabled:opacity-40 transition-all text-sm';

  const descLen = description.trim().length;
  const hasDescription = descLen >= 10;

  return (
    <form ref={ref} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#0d4a6e] flex items-center justify-center shadow-sm">
          <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">Design Intent</h2>
          <p className="text-[11px] text-[var(--color-text-muted)]">Describe your ideal WordPress theme</p>
        </div>
      </div>

      {/* Description textarea */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300">
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A minimalist photography portfolio with dark mode support, featuring a large masonry gallery and a sidebar menu..."
          rows={5}
          disabled={disabled}
          className="w-full bg-transparent text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-sm leading-relaxed resize-none focus:outline-none disabled:opacity-40"
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]/50">
          <div className="flex items-center gap-2">
            {descLen > 0 && (
              <span className={`text-[10px] font-mono transition-colors ${descLen < 10 ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'}`}>
                {descLen} chars
                {descLen >= 10 && (
                  <svg className="w-3 h-3 inline ml-0.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                )}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            AI-Powered
          </span>
        </div>
      </div>

      {/* Demo + Example prompts */}
      {!disabled && descLen === 0 && (
        <div className="space-y-3 animate-[fadeIn_0.3s_ease-out]">
          {/* Demo button */}
          {onLoadDemo && (
            <button
              type="button"
              onClick={onLoadDemo}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/8 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#0d4a6e] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-[var(--color-accent)]">Try the Demo</span>
                <p className="text-[10px] text-[var(--color-text-muted)]">Load a pre-built &ldquo;Aurora Studio&rdquo; theme instantly — no API key needed</p>
              </div>
              <svg className="w-4 h-4 text-[var(--color-accent)] shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
          )}

          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Quick Start</p>
          <div className="grid grid-cols-1 gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => { setDescription(ex.desc); setName(ex.label); setShowConstraints(true); }}
                className="group flex items-center gap-3 px-3.5 py-3 text-left rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)] hover:shadow-sm transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-muted)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-accent)]/10 transition-colors">
                  <svg className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={ex.icon} /></svg>
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{ex.label}</span>
                  <p className="text-[10px] text-[var(--color-text-muted)] truncate">{ex.desc.slice(0, 60)}...</p>
                </div>
                <svg className="w-4 h-4 text-[var(--color-text-muted)] ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Technical Constraints */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] overflow-hidden transition-all duration-300">
        <button type="button" onClick={() => setShowConstraints(!showConstraints)} className="flex items-center justify-between w-full p-4 hover:bg-[var(--color-bg-hover)]/50 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[var(--color-bg-muted)] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Technical Constraints</span>
          </div>
          <div className="flex items-center gap-2">
            {(colorPreferences || typographyPreferences || layoutPreferences) && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-bold">Configured</span>
            )}
            <svg className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 ${showConstraints ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </button>

        {showConstraints && (
          <div className="px-4 pb-4 space-y-3 animate-[fadeIn_0.15s_ease-out] border-t border-[var(--color-border)]/50">
            <div className="pt-3">
              <label htmlFor="slug" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Theme Slug</label>
              <input id="slug" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="minimalist-photo-v1" disabled={disabled} className={input} />
            </div>
            <div>
              <label htmlFor="colors" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Color Palette</label>
              <input id="colors" type="text" value={colorPreferences} onChange={(e) => setColorPreferences(e.target.value)} placeholder="Dark navy, white, blue accents, warm gray" disabled={disabled} className={input} />
            </div>
            <div>
              <label htmlFor="typo" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Typography</label>
              <input id="typo" type="text" value={typographyPreferences} onChange={(e) => setTypographyPreferences(e.target.value)} placeholder="Inter & Playfair Display" disabled={disabled} className={input} />
            </div>
            <div>
              <label htmlFor="layout" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Layout</label>
              <input id="layout" type="text" value={layoutPreferences} onChange={(e) => setLayoutPreferences(e.target.value)} placeholder="Wide content, sticky header, 3-col footer" disabled={disabled} className={input} />
            </div>
          </div>
        )}
      </div>

      {/* Generate */}
      <Button type="submit" variant="primary" size="lg" loading={disabled} disabled={disabled || !hasDescription} className={`w-full ${hasDescription && !disabled ? 'animate-[pulse-subtle_3s_ease-in-out_infinite]' : ''}`}>
        {disabled ? (
          <>
            <span className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white animate-[dot-pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </span>
            Generating...
          </>
        ) : hasDescription ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" /></svg>
            Generate Theme
          </>
        ) : (
          'Describe your theme to start'
        )}
      </Button>
    </form>
  );
});
