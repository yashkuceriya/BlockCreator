'use client';

import { useEffect, useMemo, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const COLORS = ['#1a6eaa', '#00a67d', '#dba617', '#8b5cf6', '#f43f5e', '#06b6d4', '#f97316'];
const PARTICLE_COUNT = 50;

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  drift: number;
  duration: number;
  shape: 'circle' | 'rect' | 'triangle';
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 600,
    size: 4 + Math.random() * 6,
    drift: (Math.random() - 0.5) * 120,
    duration: 1200 + Math.random() * 1500,
    shape: (['circle', 'rect', 'triangle'] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const [key, setKey] = useState(0);
  const [visible, setVisible] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- key intentionally triggers new particles
  const particles = useMemo(() => createParticles(), [key]);

  useEffect(() => {
    if (!active) return;
    const initTimer = setTimeout(() => {
      setKey((k) => k + 1);
      setVisible(true);
    }, 10);
    const hideTimer = setTimeout(() => setVisible(false), duration);
    return () => { clearTimeout(initTimer); clearTimeout(hideTimer); };
  }, [active, duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.shape === 'circle' ? p.size : p.size * 0.7,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0' : '2px',
            clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
            animation: `confetti-drop ${p.duration}ms ease-out ${p.delay}ms forwards`,
            opacity: 0,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-drop {
          0% {
            opacity: 1;
            transform: translateY(-20px) translateX(0px) rotate(0deg) scale(1);
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) translateX(var(--drift, 60px)) rotate(720deg) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}
