import type { Area } from "react-easy-crop";

/**
 * Creates an HTMLImageElement from a URL and resolves once loaded.
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

/**
 * Generates a cropped File from an image source and pixel crop coordinates.
 *
 * @param imageSrc Object URL or base64 URL of the source image.
 * @param pixelCrop The exact crop rectangle in source image pixel coordinates.
 * @param originalFileName The original file name to preserve extension and MIME type.
 * @returns A File containing the cropped image.
 */
export async function getCroppedImageFile(
  imageSrc: string,
  pixelCrop: Area,
  originalFileName: string = "avatar.png"
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not initialize 2D canvas context for image cropping.");
  }

  // Set canvas size to the cropped area dimensions
  const targetWidth = Math.round(pixelCrop.width);
  const targetHeight = Math.round(pixelCrop.height);

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Check if original was jpg or png
  const isJpg = originalFileName.toLowerCase().endsWith(".jpg") || originalFileName.toLowerCase().endsWith(".jpeg");
  const outputType = isJpg ? "image/jpeg" : "image/png";
  const outputName = isJpg ? "avatar.jpg" : "avatar.png";

  // Fill white background for JPEG to prevent transparent regions from turning black
  if (outputType === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Draw the cropped region onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image cropping failed: canvas is empty."));
          return;
        }
        const file = new File([blob], outputName, { type: outputType });
        resolve(file);
      },
      outputType,
      outputType === "image/jpeg" ? 0.92 : undefined
    );
  });
}
