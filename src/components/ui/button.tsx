import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] hover:from-[var(--color-accent-hover)] hover:to-[var(--color-accent)] text-white shadow-sm hover:shadow-md',
  secondary: 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] shadow-sm hover:shadow',
  success: 'bg-gradient-to-r from-[var(--color-success)] to-[#0d9c75] hover:from-[#0d9c75] hover:to-[var(--color-success)] text-white shadow-sm hover:shadow-md',
  ghost: 'bg-transparent hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]',
  danger: 'bg-[var(--color-error-soft)] hover:bg-[var(--color-error)] text-[var(--color-error)] hover:text-white border border-[var(--color-error)]/15',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25 focus:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <span className="animate-spin w-4 h-4 border-2 border-current/30 border-t-current rounded-full" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
