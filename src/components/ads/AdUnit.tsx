"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  slotId: string;
  client?: string;
  format?: "auto" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
}

export default function AdUnit({
  slotId,
  client = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-0000000000000000",
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Only push once to avoid duplicate Google AdSense requests
    if (isPushed.current) return;

    try {
      if (typeof window !== "undefined" && adRef.current) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isPushed.current = true;
      }
    } catch (err) {
      console.warn("AdSense push notification caught:", err);
    }
  }, []);

  return (
    <div
      aria-label="Advertisement"
      className={`relative mx-auto my-6 flex min-h-[90px] w-full max-w-4xl items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-2 text-center text-xs text-slate-400 ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
