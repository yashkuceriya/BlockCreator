'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GenerationProgress } from '../types';
import { Badge } from './ui/badge';

interface GenerationTerminalProps {
  logs: GenerationProgress[];
  startedAt?: number | null;
}

function ts(d: Date) { return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); }

export function GenerationTerminal({ logs, startedAt }: GenerationTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState(0);

  const timestampedLogs = useMemo(() => {
    const now = ts(new Date());
    return logs.map((log) => ({ log, time: now }));
  }, [logs]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);
  useEffect(() => {
    if (!startedAt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on prop change
      setElapsed(0);
      return;
    }
    const id = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 100);
    return () => clearInterval(id);
  }, [startedAt]);

  const latest = logs.length > 0 ? logs[logs.length - 1] : null;
  const pct = latest?.progress ?? 0;
  const isEmpty = logs.length === 0;
  const step = latest?.step;
  const running = !!startedAt && step !== 'complete' && step !== 'error';
  const fmt = (ms: number) => { const s = Math.floor(ms / 1000); const m = Math.floor(s / 60); return m > 0 ? `${m}m ${s % 60}s` : `${s}s`; };

  if (isEmpty) return null;

  return (
    <div role="log" aria-label="Generation log" aria-live="polite" className="border-t border-[var(--color-border)] bg-[#1e1e2e] text-white/90">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f38ba8]" />
            <span className="w-2 h-2 rounded-full bg-[#f9e2af]" />
            <span className="w-2 h-2 rounded-full bg-[#a6e3a1]" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Generation Log</span>
        </div>
        <div className="flex items-center gap-3">
          {running && (
            <span className="text-[10px] font-mono text-white/30 tabular-nums">{fmt(elapsed)}</span>
          )}
          <Badge variant={step === 'error' ? 'error' : step === 'complete' ? 'success' : 'default'}>
            {step === 'error' ? 'Error' : step === 'complete' ? 'Complete' : `${pct}%`}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-white/5 relative overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out relative"
          style={{
            width: `${pct}%`,
            background: step === 'error'
              ? 'var(--color-error)'
              : step === 'complete'
                ? 'var(--color-success)'
                : 'linear-gradient(90deg, var(--color-accent), #1a9ed4)',
          }}
        >
          {running && (
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.08)_10px,rgba(255,255,255,0.08)_20px)] animate-[progress-stripe_0.8s_linear_infinite]" />
          )}
        </div>
      </div>

      {/* Log entries */}
      <div ref={containerRef} className="px-5 py-3 font-mono text-xs max-h-52 overflow-y-auto space-y-1.5">
        {timestampedLogs.map(({ log, time }, i) => (
          <div key={i} className="flex items-start gap-2.5 animate-[fadeIn_0.15s_ease-out] py-0.5">
            <span className="text-[#89b4fa]/50 shrink-0">{time}</span>
            <Badge variant={log.step as 'theme-json' | 'patterns' | 'templates' | 'assembling' | 'complete' | 'error'}>
              {log.step === 'theme-json' ? 'JSON' : log.step}
            </Badge>
            <span className="text-white/60 leading-relaxed">{log.message}</span>
          </div>
        ))}
        {running && (
          <div className="flex items-center gap-1 pt-1">
            <span className="text-[#89b4fa] animate-[typing-cursor_1s_step-end_infinite]">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
