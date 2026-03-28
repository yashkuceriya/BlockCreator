import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] shadow-sm',
  success: 'bg-[var(--color-success)] hover:brightness-110 text-white shadow-sm hover:shadow-md',
  ghost: 'bg-transparent hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]',
  danger: 'bg-[var(--color-error-soft)] hover:bg-[var(--color-error)] text-[var(--color-error)] hover:text-white border border-[var(--color-error)]/10',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm font-semibold gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-[var(--radius-lg)] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30 focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <span className="animate-spin w-3.5 h-3.5 border-2 border-current/25 border-t-current rounded-full" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
