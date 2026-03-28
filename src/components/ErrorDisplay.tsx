'use client';

import { useMemo } from 'react';
import { Button } from './ui/button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

function humanizeError(raw: string): string {
  if (raw.includes('authentication_error') || raw.includes('invalid') && raw.includes('api-key')) {
    return 'API key is missing or invalid. Check your .env file and make sure ANTHROPIC_API_KEY is set correctly.';
  }
  if (raw.includes('rate_limit') || raw.includes('429')) {
    return 'Rate limit reached. Please wait a moment and try again.';
  }
  if (raw.includes('overloaded') || raw.includes('529')) {
    return 'The AI service is temporarily overloaded. Try again in a few seconds.';
  }
  if (raw.includes('timeout') || raw.includes('ETIMEDOUT')) {
    return 'Request timed out. Check your internet connection and try again.';
  }
  if (raw.includes('fetch failed') || raw.includes('ECONNREFUSED')) {
    return 'Could not connect to the AI service. Check your internet connection.';
  }
  if (raw.startsWith('Server error')) {
    return raw;
  }
  // If it looks like raw JSON, don't show it
  if (raw.startsWith('{') || raw.startsWith('401 {') || raw.startsWith('500 {')) {
    return 'Something went wrong on the server. Please try again.';
  }
  return raw;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const friendlyMessage = useMemo(() => humanizeError(message), [message]);

  return (
    <div className="relative overflow-hidden bg-[var(--color-error-soft)] border border-[var(--color-error)]/15 rounded-[var(--radius-xl)] p-4 animate-[fadeInScale_0.3s_ease-out]">
      {/* Error accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-error)]" />

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-error)]/10 flex items-center justify-center shrink-0">
          <svg className="w-4.5 h-4.5 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[var(--color-error)] text-sm font-semibold">Generation failed</p>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1 leading-relaxed">{friendlyMessage}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-3 ml-12">
          <Button onClick={onRetry} variant="danger" size="sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
