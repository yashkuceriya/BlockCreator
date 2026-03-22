'use client';

import { useEffect, useRef, useState } from 'react';
import { GenerationProgress } from '../types';
import { Badge } from './ui/badge';

interface GenerationTerminalProps {
  logs: GenerationProgress[];
  startedAt?: number | null;
}

interface TimestampedLog { log: GenerationProgress; time: string; }

function ts(d: Date) { return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); }

export function GenerationTerminal({ logs, startedAt }: GenerationTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const prevLenRef = useRef(0);
  const cacheRef = useRef<TimestampedLog[]>([]);

  if (logs.length > prevLenRef.current) {
    const now = ts(new Date());
    for (const log of logs.slice(prevLenRef.current)) cacheRef.current.push({ log, time: now });
    prevLenRef.current = logs.length;
  } else if (logs.length === 0 && prevLenRef.current > 0) {
    cacheRef.current = [];
    prevLenRef.current = 0;
  }

  useEffect(() => { containerRef.current && (containerRef.current.scrollTop = containerRef.current.scrollHeight); }, [logs]);
  useEffect(() => { if (!startedAt) { setElapsed(0); return; } const id = setInterval(() => setElapsed(Date.now() - startedAt), 100); return () => clearInterval(id); }, [startedAt]);

  const latest = logs.length > 0 ? logs[logs.length - 1] : null;
  const pct = latest?.progress ?? 0;
  const isEmpty = logs.length === 0;
  const step = latest?.step;
  const running = !!startedAt && step !== 'complete' && step !== 'error';
  const fmt = (ms: number) => { const s = Math.floor(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s}s`; };

  if (isEmpty) return null;

  return (
    <div role="log" aria-label="Generation log" aria-live="polite" className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-[var(--color-border)]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Generation Log</span>
        <div className="flex items-center gap-2">
          {running && <span className="text-[10px] font-mono text-[var(--color-text-muted)] tabular-nums">{fmt(elapsed)}</span>}
          <Badge variant={step === 'error' ? 'error' : step === 'complete' ? 'success' : 'default'}>
            {step === 'error' ? 'Error' : step === 'complete' ? 'Complete' : `${pct}%`}
          </Badge>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-[var(--color-border)]">
        <div className="h-full bg-[var(--color-accent)] transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <div ref={containerRef} className="px-6 py-3 font-mono text-xs max-h-44 overflow-y-auto space-y-2">
        {cacheRef.current.map(({ log, time }, i) => (
          <div key={i} className="flex items-start gap-2 animate-[fadeIn_0.15s_ease-out]">
            <span className="text-[var(--color-accent)] shrink-0">[{time}]</span>
            <Badge variant={log.step as 'theme-json' | 'patterns' | 'templates' | 'assembling' | 'complete' | 'error'}>
              {log.step === 'theme-json' ? 'JSON' : log.step}
            </Badge>
            <span className="text-[var(--color-text-secondary)] leading-relaxed">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
