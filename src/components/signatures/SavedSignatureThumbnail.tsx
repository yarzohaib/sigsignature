"use client";

import { useMemo } from "react";
import { SavedSignature } from "@/types/signature";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";
import { renderSavedSignatureHtml } from "@/lib/signatures/render";

interface SavedSignatureThumbnailProps {
  signature: SavedSignature;
}

/**
 * Renders the exact, live signature HTML for a saved signature
 * (for both template-based and studio-based signatures),
 * scaled dynamically and centered within the standard aspect-[350/174] preview container.
 */
export default function SavedSignatureThumbnail({ signature }: SavedSignatureThumbnailProps) {
  const previewHtml = useMemo(
    () => renderSavedSignatureHtml(signature, { preview: true }),
    [signature]
  );

  return (
    <div className="flex h-full w-full items-center justify-center bg-white p-3 sm:p-4 select-none">
      <div className="w-full flex items-center justify-center">
        <SignaturePreviewFrame
          html={previewHtml}
          aspectRatio="350 / 174"
          fitPadding={0.92}
        />
      </div>
    </div>
  );
}
