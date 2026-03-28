'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Intersection Observer hook for scroll-triggered animations.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}

/**
 * Helper: returns className for a reveal animation.
 * When not visible, the element is transparent and offset.
 * When visible, it animates into place.
 */
export function revealClass(
  visible: boolean,
  direction: 'up' | 'down' | 'left' | 'right' | 'scale' = 'up',
  delay: number = 0
): string {
  const base = 'transition-all duration-700 ease-out';
  const delayStyle = delay > 0 ? `[transition-delay:${delay}ms]` : '';

  const transforms: Record<string, string> = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    scale: 'scale-95',
  };

  if (!visible) {
    return `${base} ${delayStyle} opacity-0 ${transforms[direction]}`;
  }

  return `${base} ${delayStyle} opacity-100 translate-x-0 translate-y-0 scale-100`;
}
