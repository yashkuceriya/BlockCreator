'use client';

import { useState, useCallback, useRef } from 'react';
import { ThemeFiles } from '../types';
import { mountTheme, PlaygroundClient } from '../playground/mount-theme';

interface PlaygroundState {
  ready: boolean;
  loading: boolean;
  error: string | null;
}

export function usePlayground() {
  const [state, setState] = useState<PlaygroundState>({
    ready: false,
    loading: false,
    error: null,
  });
  const clientRef = useRef<PlaygroundClient | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bootedRef = useRef(false);

  const boot = useCallback(async () => {
    // Only boot once — lazy initialization
    if (bootedRef.current || typeof window === 'undefined') return;
    bootedRef.current = true;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const { startPlaygroundWeb } = await import('@wp-playground/client');

      if (!iframeRef.current) {
        setState((s) => ({ ...s, loading: false, error: 'No iframe element' }));
        bootedRef.current = false;
        return;
      }

      const bootTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Playground boot timed out after 30 seconds')), 30000)
      );

      const client = await Promise.race([
        startPlaygroundWeb({
          iframe: iframeRef.current,
          remoteUrl: 'https://playground.wordpress.net/remote.html',
        }),
        bootTimeout,
      ]);

      clientRef.current = client as unknown as PlaygroundClient;
      setState({ ready: true, loading: false, error: null });
    } catch (err) {
      bootedRef.current = false;
      setState({
        ready: false,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to boot Playground',
      });
    }
  }, []);

  const loadTheme = useCallback(async (themeFiles: ThemeFiles, themeSlug: string) => {
    const client = clientRef.current;
    if (!client) {
      // Playground not booted yet — boot first, then load
      await boot();
      // After boot, client might be ready
      if (!clientRef.current) return;
      await mountTheme(clientRef.current, themeSlug, themeFiles);
      return;
    }

    try {
      await mountTheme(client, themeSlug, themeFiles);
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : 'Failed to load theme',
      }));
    }
  }, [boot]);

  return { ...state, iframeRef, boot, loadTheme };
}
