"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
} from "react";

export interface SignaturePreviewFrameProps {
  html: string;
  className?: string;
  minHeight?: number;
  /**
   * Fixed aspect ratio for thumbnail/preview panel.
   * Defaults to "16 / 9". Set to false to disable scaling and render full height.
   */
  aspectRatio?: string | false;
}

export interface SignaturePreviewFrameHandle {
  getIframe: () => HTMLIFrameElement | null;
  getDocument: () => Document | null;
}

export const SignaturePreviewFrame = forwardRef<
  SignaturePreviewFrameHandle,
  SignaturePreviewFrameProps
>(function SignaturePreviewFrame(
  { html, className = "", minHeight = 120, aspectRatio = "16 / 9" },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Measured panel size
  const [panelSize, setPanelSize] = useState({ width: 0, height: 0 });

  // Measured content size inside iframe
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [measured, setMeasured] = useState(false);

  // Fallback height for non-aspectRatio mode
  const [unscaledHeight, setUnscaledHeight] = useState(minHeight);

  useImperativeHandle(ref, () => ({
    getIframe: () => iframeRef.current,
    getDocument: () => iframeRef.current?.contentDocument || null,
  }));

  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:wght@400;500;600;700&family=Commissioner:wght@400;500;600;700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Georgia&display=swap" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      overflow: hidden;
      width: max-content;
      height: max-content;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    * {
      box-sizing: border-box;
    }
    #sig-root {
      display: inline-block;
      margin: 0;
      padding: 0;
      width: max-content;
      min-width: max-content;
    }
  </style>
</head>
<body>
  <div id="sig-root">
    ${html}
  </div>
</body>
</html>`;
  }, [html]);

  // Measure content size inside the iframe
  const measureContent = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    try {
      const doc = iframe.contentDocument;
      const root = doc.getElementById("sig-root");
      if (!root) return;

      const table = root.querySelector("table");
      const rootRect = root.getBoundingClientRect();
      const tableRect = table ? table.getBoundingClientRect() : null;

      let w = Math.max(
        rootRect.width,
        root.scrollWidth,
        tableRect ? tableRect.width : 0,
        table ? table.scrollWidth : 0
      );

      const h = Math.max(
        rootRect.height,
        root.scrollHeight,
        tableRect ? tableRect.height : 0,
        table ? table.scrollHeight : 0
      );

      if (table) {
        const attrW = parseFloat(table.getAttribute("width") || "0");
        if (attrW > w) w = attrW;
      }

      if (w > 0 && h > 0) {
        setContentSize({ width: Math.ceil(w), height: Math.ceil(h) });
        setUnscaledHeight(Math.max(Math.ceil(h) + 4, minHeight));
        setMeasured(true);
      }
    } catch {
      // Ignore cross-origin issues if any
    }
  }, [minHeight]);

  // Reset measured state when HTML changes
  useEffect(() => {
    setMeasured(false);
  }, [html]);

  // Monitor panel size changes with ResizeObserver
  useEffect(() => {
    if (aspectRatio === false) return;
    const container = containerRef.current;
    if (!container) return;

    function updatePanel() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setPanelSize({ width: rect.width, height: rect.height });
      }
    }

    updatePanel();
    const ro = new ResizeObserver(updatePanel);
    ro.observe(container);
    return () => ro.disconnect();
  }, [aspectRatio]);

  // Hook up load listeners for iframe, images, fonts and inner ResizeObserver
  const setupIframeListeners = useCallback(() => {
    measureContent();

    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;

    // Listen to all image load events
    const images = Array.from(doc.images);
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", measureContent);
        img.addEventListener("error", measureContent);
      }
    });

    // Listen to font loading if supported
    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready.then(measureContent).catch(() => {});
    }

    // Inner ResizeObserver on sig-root
    const root = doc.getElementById("sig-root");
    const docWin = doc.defaultView || window;
    if (root && typeof docWin.ResizeObserver !== "undefined") {
      const innerRo = new docWin.ResizeObserver(() => {
        measureContent();
      });
      innerRo.observe(root);
    }
  }, [measureContent]);

  // Periodically check right after HTML update in case of delayed font/image layout
  useEffect(() => {
    const t1 = setTimeout(measureContent, 100);
    const t2 = setTimeout(measureContent, 300);
    const t3 = setTimeout(measureContent, 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [html, measureContent]);

  // Compute scale and centering for aspect-ratio mode
  const { scale, left, top } = useMemo(() => {
    if (
      aspectRatio === false ||
      panelSize.width <= 0 ||
      panelSize.height <= 0 ||
      contentSize.width <= 0 ||
      contentSize.height <= 0
    ) {
      return { scale: 1, left: 0, top: 0 };
    }

    const s = Math.min(
      panelSize.width / contentSize.width,
      panelSize.height / contentSize.height,
      1
    );

    const scaledWidth = contentSize.width * s;
    const scaledHeight = contentSize.height * s;
    const l = Math.max(0, (panelSize.width - scaledWidth) / 2);
    const t = Math.max(0, (panelSize.height - scaledHeight) / 2);

    return { scale: s, left: l, top: t };
  }, [aspectRatio, panelSize, contentSize]);

  // Non-aspectRatio mode (e.g. PreviewSignatureModal)
  if (aspectRatio === false) {
    return (
      <iframe
        ref={iframeRef}
        sandbox="allow-same-origin"
        srcDoc={srcDoc}
        onLoad={setupIframeListeners}
        className={`w-full border-0 transition-all ${className}`}
        style={{
          height: `${unscaledHeight}px`,
          display: "block",
          overflow: "hidden",
        }}
        title="Email Signature Preview"
      />
    );
  }

  // Fixed 16:9 Aspect Ratio Scaled Panel
  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{
        aspectRatio: typeof aspectRatio === "string" ? aspectRatio : "16 / 9",
        pointerEvents: "none",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Skeleton while measuring */}
      {!measured && (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-50/60 animate-pulse">
          <div className="flex items-center gap-3 w-4/5 max-w-xs">
            <div className="h-10 w-10 rounded-full bg-slate-200/80 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-3/4 rounded bg-slate-200/80" />
              <div className="h-2 w-1/2 rounded bg-slate-200/60" />
              <div className="h-1.5 w-2/3 rounded bg-slate-200/50" />
            </div>
          </div>
        </div>
      )}

      {/* Scaled & Centered iframe */}
      <iframe
        ref={iframeRef}
        sandbox="allow-same-origin"
        srcDoc={srcDoc}
        onLoad={setupIframeListeners}
        className="border-0 transition-opacity duration-150"
        style={{
          position: "absolute",
          width: contentSize.width > 0 ? `${contentSize.width}px` : "100%",
          height: contentSize.height > 0 ? `${contentSize.height}px` : "100%",
          left: `${left}px`,
          top: `${top}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "block",
          overflow: "hidden",
          pointerEvents: "none",
          opacity: measured ? 1 : 0,
        }}
        title="Email Signature Preview"
      />
    </div>
  );
});

export default SignaturePreviewFrame;
