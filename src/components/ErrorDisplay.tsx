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
    <div className="bg-[var(--color-error-soft)] border border-[var(--color-error)]/20 rounded-[var(--radius-lg)] p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-[var(--color-error)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-[var(--color-error)] text-sm font-medium">Generation failed</p>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1 leading-relaxed">{friendlyMessage}</p>
        </div>
      </div>
      {onRetry && <div className="mt-3"><Button onClick={onRetry} variant="danger" size="sm">Try Again</Button></div>}
    </div>
  );
}
