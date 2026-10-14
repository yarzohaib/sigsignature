/**
 * Image processing utilities for avatars and signature graphics.
 * Compresses and resizes uploads via HTML5 Canvas before uploading to storage.
 */

export type ImageKind = "avatar" | "logo";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Resizes and compresses an image file to an optimized Blob.
 * - For kind "avatar": crops to a centered square before resizing so photos are always 1:1 (max maxDimension).
 * - For kind "logo": keeps original aspect ratio (max maxDimension wide, default 400px) and preserves PNG transparency.
 * - Never upscales.
 * - Rejects files > 10MB and unsupported formats.
 */
export function compressImageToBlob(
  file: File,
  maxDimension = 400,
  quality = 0.85,
  kind: ImageKind = "avatar"
): Promise<Blob> {
  // Reject input files over 10 MB before processing
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return Promise.reject(
      new Error("File size exceeds 10 MB limit. Please choose a smaller image.")
    );
  }

  // Reject input that is not image/jpeg, image/png or image/webp (SVG and GIF are not allowed)
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return Promise.reject(
      new Error("Invalid image format. Only JPEG, PNG, and WebP files are supported.")
    );
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      if (!originalWidth || !originalHeight) {
        return reject(new Error("Unable to read image dimensions."));
      }

      let canvasWidth: number;
      let canvasHeight: number;
      let sx = 0;
      let sy = 0;
      let sWidth = originalWidth;
      let sHeight = originalHeight;

      if (kind === "avatar") {
        // Crop to centered square (1:1)
        const minSide = Math.min(originalWidth, originalHeight);
        sx = Math.floor((originalWidth - minSide) / 2);
        sy = Math.floor((originalHeight - minSide) / 2);
        sWidth = minSide;
        sHeight = minSide;

        // Never upscale: max dimension capped at maxDimension
        const targetSize = Math.min(minSide, maxDimension);
        canvasWidth = targetSize;
        canvasHeight = targetSize;
      } else {
        // kind === "logo": keep original aspect ratio, max maxDimension wide
        if (originalWidth > maxDimension) {
          const scale = maxDimension / originalWidth;
          canvasWidth = maxDimension;
          canvasHeight = Math.round(originalHeight * scale);
        } else {
          canvasWidth = originalWidth;
          canvasHeight = originalHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Could not initialize 2D canvas context."));
      }

      // Smooth downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Output format:
      // For logo: keep PNG transparency (use image/png if input is png or webp)
      let outputType: "image/jpeg" | "image/png" = "image/jpeg";
      if (kind === "logo" && (file.type === "image/png" || file.type === "image/webp")) {
        outputType = "image/png";
      }

      // Fill white background only for JPEG to prevent transparent areas turning black
      if (outputType === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Image compression failed. Unable to create Blob."));
          }
          resolve(blob);
        },
        outputType,
        outputType === "image/jpeg" ? quality : undefined
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image file."));
    };

    img.src = objectUrl;
  });
}
