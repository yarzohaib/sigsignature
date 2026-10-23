"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

const SCROLL_THRESHOLD = 280;

export default function ScrollToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Helper to locate any active scroll container (e.g. inside AppShell)
  const getAppContainer = useCallback((): HTMLElement | null => {
    return (
      document.getElementById("app-scroll-container") ||
      document.querySelector("[data-scroll-container]") ||
      null
    );
  }, []);

  // 1. Automatic scroll-to-top on route change
  useEffect(() => {
    // Immediate scroll reset for window
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Immediate scroll reset for AppShell canvas
    const appContainer = getAppContainer();
    if (appContainer) {
      appContainer.scrollTop = 0;
      appContainer.scrollLeft = 0;
    }
  }, [pathname, getAppContainer]);

  // 2. Capture-phase scroll listener: detects scroll on window AND nested containers
  useEffect(() => {
    const checkScroll = () => {
      const windowScroll = window.scrollY || document.documentElement.scrollTop || 0;
      const appContainer = getAppContainer();
      const containerScroll = appContainer ? appContainer.scrollTop : 0;

      setIsVisible(windowScroll > SCROLL_THRESHOLD || containerScroll > SCROLL_THRESHOLD);
    };

    const onScroll = () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      animFrameRef.current = requestAnimationFrame(checkScroll);
    };

    // Capture true intercepts scroll events from window AND any nested scrollable element
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });

    // Schedule check in next tick
    animFrameRef.current = requestAnimationFrame(checkScroll);

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [pathname, getAppContainer]);

  // 3. Smooth scroll handler for both window and AppShell container
  const handleScrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";

    // Scroll window
    window.scrollTo({ top: 0, left: 0, behavior });

    // Scroll app shell container if present
    const appContainer = getAppContainer();
    if (appContainer) {
      appContainer.scrollTo({ top: 0, left: 0, behavior });
    }
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top of page"
      title="Scroll to top"
      className={`fixed bottom-20 lg:bottom-6 right-5 sm:right-6 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#245FD4] to-[#022977] text-white border border-white/25 shadow-[0_8px_24px_rgba(36,95,212,0.35)] transition-all duration-300 ease-out hover:shadow-[0_12px_28px_rgba(36,95,212,0.5)] hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#245FD4] focus-visible:ring-offset-2 cursor-pointer ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <svg
        className="h-5 w-5 sm:h-5.5 sm:w-5.5 transition-transform duration-200"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
