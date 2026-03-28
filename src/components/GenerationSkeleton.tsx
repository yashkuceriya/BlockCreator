'use client';

/**
 * Shimmer skeleton shown in the preview panel while theme is being generated.
 * Creates anticipation and makes the wait feel purposeful.
 */
export function GenerationSkeleton() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-[var(--color-bg-page)] to-[var(--color-bg-muted)] p-8">
      <div className="w-full max-w-md space-y-6 animate-[fadeIn_0.3s_ease-out]">
        {/* Header shimmer */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 rounded shimmer" />
            <div className="h-2 w-20 rounded shimmer" />
          </div>
        </div>

        {/* Hero section shimmer */}
        <div className="h-40 rounded-xl shimmer" />

        {/* Features grid shimmer */}
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 rounded-lg shimmer" />
          <div className="h-24 rounded-lg shimmer" style={{ animationDelay: '0.15s' }} />
          <div className="h-24 rounded-lg shimmer" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Content shimmer */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded shimmer" />
          <div className="h-3 w-4/5 rounded shimmer" style={{ animationDelay: '0.1s' }} />
          <div className="h-3 w-3/5 rounded shimmer" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* CTA shimmer */}
        <div className="h-28 rounded-xl shimmer" />

        {/* Footer shimmer */}
        <div className="h-16 rounded-lg shimmer" />

        {/* Status text */}
        <div className="text-center pt-4">
          <p className="text-xs text-[var(--color-text-muted)] flex items-center justify-center gap-2">
            <span className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[dot-pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </span>
            Building your theme...
          </p>
        </div>

        <style>{`
          .shimmer {
            background: linear-gradient(
              90deg,
              var(--color-bg-muted) 25%,
              var(--color-bg-hover) 50%,
              var(--color-bg-muted) 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
