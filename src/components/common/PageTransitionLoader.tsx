"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useTransition, Suspense } from "react";
import InfinityLoader from "./InfinityLoader";

// Routes that have dedicated skeleton loaders and should NOT show the full-screen infinity loader
const SKELETON_ROUTE_PREFIXES = [
  "/dashboard",
  "/signatures",
  "/team-signatures",
  "/settings",
  "/design-studio",
  "/pricing",
  "/templates",
  "/template",
];

function hasDedicatedSkeleton(path: string): boolean {
  return SKELETON_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

function NavigationTransitionHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [, startTransition] = useTransition();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset navigation loader whenever route path or search params change
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Intercept click on internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest?.("a");
      if (!target || !target.href) return;

      // Ignore if modified click (ctrl/cmd/shift/alt or middle click) or target="_blank"
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        target.target === "_blank" ||
        target.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal link
      try {
        const url = new URL(target.href);
        const currentUrl = new URL(window.location.href);

        // Same origin and different pathname/search
        if (
          url.origin === currentUrl.origin &&
          (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search) &&
          !url.hash.startsWith("#") &&
          !url.pathname.startsWith("/api")
        ) {
          // EXCLUDE routes with dedicated skeletons (dashboard, design studio, pricing, templates)
          if (hasDedicatedSkeleton(url.pathname) || hasDedicatedSkeleton(currentUrl.pathname)) {
            return;
          }

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Delay showing the loader by 120ms to prevent jitter on instantaneous/fast page transitions
          timeoutRef.current = setTimeout(() => {
            startTransition(() => {
              setIsNavigating(true);
            });
          }, 120);
        }
      } catch {
        // Ignore URL parsing errors
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  // Do not render loader if on a route with its own skeleton
  if (!isNavigating || (pathname && hasDedicatedSkeleton(pathname))) return null;

  return (
    <InfinityLoader
      fullScreen
    />
  );
}

export default function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationTransitionHandler />
    </Suspense>
  );
}

