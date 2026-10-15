"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from "react";

interface SignaturePreviewFrameProps {
  html: string;
  className?: string;
  minHeight?: number;
}

export interface SignaturePreviewFrameHandle {
  getIframe: () => HTMLIFrameElement | null;
  getDocument: () => Document | null;
}

export const SignaturePreviewFrame = forwardRef<
  SignaturePreviewFrameHandle,
  SignaturePreviewFrameProps
>(function SignaturePreviewFrame({ html, className = "", minHeight = 120 }, ref) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(minHeight);

  useImperativeHandle(ref, () => ({
    getIframe: () => iframeRef.current,
    getDocument: () => iframeRef.current?.contentDocument || null,
  }));

  const srcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Georgia&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="sig-root" style="display:block;width:100%;min-width:100%;">
    ${html}
  </div>
</body>
</html>`;

  const updateHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    try {
      const doc = iframe.contentDocument;
      const root = doc.getElementById("sig-root");
      const height = root ? root.scrollHeight : doc.body.scrollHeight;
      if (height > 0) {
        setIframeHeight(Math.max(height + 4, minHeight));
      }
    } catch {
      // Ignore cross-origin sandbox restrictions if any
    }
  }, [minHeight]);

  useEffect(() => {
    updateHeight();
    const timer = setTimeout(updateHeight, 150);
    return () => clearTimeout(timer);
  }, [html, minHeight, updateHeight]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin"
      srcDoc={srcDoc}
      onLoad={updateHeight}
      className={`w-full border-0 transition-all ${className}`}
      style={{
        height: `${iframeHeight}px`,
        display: "block",
        overflow: "hidden",
      }}
      title="Email Signature Preview"
    />
  );
});

export default SignaturePreviewFrame;
