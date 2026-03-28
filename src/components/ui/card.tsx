import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  header?: ReactNode;
  className?: string;
}

export function Card({ children, title, description, header, className = '' }: CardProps) {
  return (
    <div className={`bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 ${className}`}>
      {(title || description || header) && (
        <div className="px-5 py-3.5 border-b border-[var(--color-border)]">
          {header || (
            <>
              {title && <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>}
              {description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>}
            </>
          )}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
