'use client';

import { useState, useCallback, useRef } from 'react';
import { GenerationProgress, ThemePrompt, ThemeFiles } from '../types';

export interface TimestampedProgress extends GenerationProgress {
  /** Epoch ms when this event was received by the client */
  receivedAt: number;
}

type GenerationState = 'idle' | 'generating' | 'previewing' | 'complete' | 'error';

interface GenerationResult {
  files: ThemeFiles;
  zipBase64: string;
  themeSlug: string;
}

export function useThemeGeneration() {
  const [state, setState] = useState<GenerationState>('idle');
  const [progress, setProgress] = useState<TimestampedProgress[]>([]);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (prompt: ThemePrompt) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState('generating');
    setProgress([]);
    setError(null);
    setStartedAt(Date.now());

    try {
      // Read user's provider preference from localStorage
      let providerPref: string | undefined;
      try { providerPref = localStorage.getItem('wp-theme-provider') || undefined; } catch { /* SSR safe */ }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prompt, provider: providerPref }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMsg = `Server error (${response.status})`;
        try {
          const err = await response.json();
          errMsg = err.error || errMsg;
        } catch {
          // Response body wasn't JSON — use status text
        }
        throw new Error(errMsg);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: GenerationProgress = JSON.parse(line.slice(6));
              const timestamped: TimestampedProgress = { ...data, receivedAt: Date.now() };
              setProgress((prev) => [...prev, timestamped]);

              if (data.step === 'error') {
                setError(data.message);
                setState('error');
                return;
              }

              if (data.step === 'complete' && data.data) {
                const resultData = data.data as GenerationResult;
                setResult(resultData);
                setState('previewing');
                setTimeout(() => setState('complete'), 500);
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unknown error');
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState('idle');
    setProgress([]);
    setResult(null);
    setError(null);
    setStartedAt(null);
  }, []);

  const loadResult = useCallback((data: GenerationResult) => {
    setResult(data);
    setState('complete');
    setProgress([]);
    setError(null);
    setStartedAt(null);
  }, []);

  const refine = useCallback(async (refinementPrompt: string) => {
    if (!result) return;
    // Parse the previous theme.json from the result
    const previousThemeJson = result.files['theme.json'];
    // Create a new prompt with refinement instructions
    const prompt: ThemePrompt = {
      name: result.themeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: refinementPrompt,
      refinementPrompt,
      previousThemeJson,
    };
    await generate(prompt);
  }, [result, generate]);

  return { state, progress, result, error, startedAt, generate, refine, reset, loadResult };
}
