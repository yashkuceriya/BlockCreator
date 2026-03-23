'use client';

import { useState, useCallback, useRef } from 'react';
import { GenerationProgress, ThemePrompt, ThemeFiles } from '../types';

type GenerationState = 'idle' | 'generating' | 'previewing' | 'complete' | 'error';

interface GenerationResult {
  files: ThemeFiles;
  zipBase64: string;
  themeSlug: string;
}

export function useThemeGeneration() {
  const [state, setState] = useState<GenerationState>('idle');
  const [progress, setProgress] = useState<GenerationProgress[]>([]);
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
    setResult(null);
    setError(null);
    setStartedAt(Date.now());

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
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
              setProgress((prev) => [...prev, data]);

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

  return { state, progress, result, error, startedAt, generate, reset, loadResult };
}
