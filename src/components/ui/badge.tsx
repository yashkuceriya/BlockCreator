import { ReactNode } from 'react';

type BadgeVariant = 'theme-json' | 'patterns' | 'templates' | 'assembling' | 'complete' | 'error' | 'default' | 'success';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const classes: Record<BadgeVariant, string> = {
  'theme-json': 'bg-[var(--color-badge-json)] text-white',
  patterns: 'bg-[var(--color-badge-patterns)] text-white',
  templates: 'bg-[var(--color-badge-templates)] text-white',
  assembling: 'bg-[var(--color-success)] text-white',
  complete: 'bg-[var(--color-success)] text-white',
  error: 'bg-[var(--color-error)] text-white',
  success: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20',
  default: 'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-[var(--color-border)]',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider leading-none shrink-0 ${classes[variant]} ${className}`}>
      {children}
    </span>
  );
}
