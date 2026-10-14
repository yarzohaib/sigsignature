/**
 * Image compression utilities for avatars and signature graphics.
 * Downscales high-resolution uploads to lightweight base64 JPEG data URLs (15KB - 30KB)
 * so they easily fit inside browser localStorage and email clients without hitting QuotaExceededError.
 */

export function compressImageFile(
  file: File,
  maxDimension = 256,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        return reject(new Error("Empty data URL"));
      }
      compressDataUrl(dataUrl, maxDimension, quality)
        .then(resolve)
        .catch(() => resolve(dataUrl));
    };
    reader.readAsDataURL(file);
  });
}

export function compressDataUrl(
  dataUrl: string,
  maxDimension = 256,
  quality = 0.82
): Promise<string> {
  if (typeof window === "undefined" || !dataUrl.startsWith("data:image/")) {
    return Promise.resolve(dataUrl);
  }

  // Already tiny (< 40KB) and not an oversized data URL
  if (dataUrl.length < 40000) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width <= 0 || height <= 0) {
        return resolve(dataUrl);
      }

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(dataUrl);
      }

      // Smooth downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to efficient JPEG
      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
