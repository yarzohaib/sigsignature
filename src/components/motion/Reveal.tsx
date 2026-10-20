"use client";

import React, { useSyncExternalStore } from "react";
import { useInView } from "./useInView";

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  staggerIndex?: number;
  y?: number;
  blur?: number;
  duration?: number;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    () => false
  );
}

function useIsMobile(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(max-width: 1023px)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false),
    () => false
  );
}

/**
 * Scroll reveal component with native IntersectionObserver.
 * - Fades in while moving up 16px (12px on mobile < 1024px)
 * - Sharpens from 6px blur to none over 600ms with ease-out curve
 * - Staggers siblings by 80ms
 * - Content is 100% visible without JavaScript
 * - Disables animation when prefers-reduced-motion is active
 * - Zero layout shift and zero horizontal scroll
 */
export function Reveal({
  children,
  delay = 0,
  staggerIndex = 0,
  y,
  blur = 6,
  duration = 600,
  as: Component = "div",
  className = "",
  style = {},
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1, once: true });
  const mounted = useIsMounted();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const totalDelayMs = delay > 0 ? delay * 1000 : staggerIndex * 80;
  const distanceY = y !== undefined ? y : isMobile ? 12 : 16;

  // SSR fallback: Before mount or with reduced motion, content is 100% visible with 0 blur / 0 shift
  if (!mounted || reducedMotion) {
    return (
      <Component ref={ref} className={className} style={style} data-reveal>
        {children}
      </Component>
    );
  }

  const animationStyle: React.CSSProperties = {
    ...style,
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0, 0, 0)" : `translate3d(0, ${distanceY}px, 0)`,
    filter: inView ? "blur(0px)" : `blur(${blur}px)`,
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${totalDelayMs}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${totalDelayMs}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${totalDelayMs}ms`,
    willChange: inView ? "auto" : "opacity, transform, filter",
  };

  return (
    <Component ref={ref} className={className} style={animationStyle} data-reveal>
      {children}
    </Component>
  );
}

export default Reveal;
