import { toPng } from "html-to-image";
import { buildExportDocument } from "./previewDocument";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("FileReader did not produce a string"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });
}

/** Replace every <img> source with a data URL, loading through our same origin proxy. */
async function inlineImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images);
  await Promise.all(
    images.map(async (img) => {
      const src = img.getAttribute("src");
      if (!src || src.startsWith("data:") || src.startsWith("blob:")) return;
      try {
        const absolute = new URL(src, window.location.href);
        const fetchUrl =
          absolute.origin === window.location.origin
            ? absolute.toString()
            : `/api/image-proxy?url=${encodeURIComponent(absolute.toString())}`;
        const response = await fetch(fetchUrl, { credentials: "omit" });
        if (!response.ok) {
          console.warn("Image could not be inlined:", src, response.status);
          return;
        }
        const dataUrl = await readBlobAsDataUrl(await response.blob());
        img.removeAttribute("srcset");
        img.setAttribute("src", dataUrl);
      } catch (err) {
        console.warn("Image could not be inlined:", src, err);
      }
    })
  );

  await Promise.all(
    Array.from(doc.images).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
    )
  );
}

function nextFrames(win: Window, count: number): Promise<void> {
  return new Promise((resolve) => {
    const step = (left: number) => {
      if (left <= 0) resolve();
      else win.requestAnimationFrame(() => step(left - 1));
    };
    step(count);
  });
}

/**
 * Renders the signature HTML exactly like the downloaded .html file would look
 * (same fonts, same reset, no app styles) and returns a PNG data URL.
 */
export async function renderSignaturePng(signatureHtml: string): Promise<string> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("sandbox", "allow-same-origin");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:1600px;height:1200px;border:0;pointer-events:none;";

  const loaded = new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
  });
  iframe.srcdoc = buildExportDocument(signatureHtml);
  document.body.appendChild(iframe);

  try {
    await loaded;
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) throw new Error("Export frame unavailable");

    await inlineImages(doc);
    try {
      await doc.fonts.ready;
    } catch {
      // fonts are optional
    }
    await nextFrames(win, 2);

    const root = doc.getElementById("sig-export");
    if (!root) throw new Error("Export root missing");

    const rect = root.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);

    const options = {
      pixelRatio: 2,
      backgroundColor: "#FFFFFF",
      cacheBust: false,
      // If one image still cannot load, keep exporting instead of failing the whole PNG
      imagePlaceholder: TRANSPARENT_PIXEL,
      width,
      height,
    } as const;

    try {
      return await toPng(root, options);
    } catch (err) {
      console.warn("PNG export retrying without web fonts", err);
      return await toPng(root, { ...options, skipFonts: true });
    }
  } finally {
    iframe.remove();
  }
}