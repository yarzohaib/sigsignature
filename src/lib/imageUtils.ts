/**
 * Image processing utilities for avatars and signature graphics.
 * Compresses and resizes uploads via HTML5 Canvas before uploading to storage.
 */

export type ImageKind = "avatar" | "logo";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Resizes and compresses an image file to an optimized Blob.
 * - Longest side is at most maxDimension, never upscaled.
 * - Outputs image/jpeg for photos. If PNG with transparency and kind is "logo", outputs image/png.
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

      let targetWidth = originalWidth;
      let targetHeight = originalHeight;

      // Never upscale. Resize so longest side is at most maxDimension
      const longestSide = Math.max(originalWidth, originalHeight);
      if (longestSide > maxDimension) {
        const scale = maxDimension / longestSide;
        targetWidth = Math.round(originalWidth * scale);
        targetHeight = Math.round(originalHeight * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Could not initialize 2D canvas context."));
      }

      // Smooth downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Output format:
      // Output image/jpeg for photos. If the input is a PNG with transparency and kind is "logo", output image/png.
      let outputType: "image/jpeg" | "image/png" = "image/jpeg";
      if (kind === "logo" && file.type === "image/png") {
        outputType = "image/png";
      }

      // If output is jpeg, fill background with white in case there were transparent areas
      if (outputType === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

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
