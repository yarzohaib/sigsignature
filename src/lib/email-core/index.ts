/**
 * Neutral email-safe formatting, sanitization, font resolution, and clipboard helpers.
 * Shared across Templates and Design Studio.
 */

export const SOCIAL_NETWORKS = [
  "linkedin",
  "twitter",
  "facebook",
  "instagram",
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
export type IconStyle = "filled" | "outline" | "circle" | "minimal";

/**
 * Escapes special HTML characters in user text to prevent XSS and malformed markup.
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitizes URLs to allow only safe email schemes: http, https, mailto, and tel.
 * Returns an empty string for javascript:, data:, or invalid protocols.
 */
export function safeUrl(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return "";
}

/**
 * Adds https:// protocol to website URLs when missing.
 */
export function normalizeWebsite(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Sanitizes phone numbers for tel: links, retaining only digits and a single leading +.
 */
export function telHref(phone: string): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  return `tel:${hasPlus ? "+" : ""}${digits}`;
}

/**
 * Resolves font names to cross-client, email-safe font stacks.
 */
export function resolveEmailFont(name: string): string {
  const clean = (name || "").toLowerCase().trim();
  switch (clean) {
    case "georgia":
      return "Georgia, Times, 'Times New Roman', serif";
    case "verdana":
      return "Verdana, Geneva, sans-serif";
    case "trebuchet ms":
    case "trebuchet":
      return "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
    case "tahoma":
      return "Tahoma, Geneva, Verdana, sans-serif";
    case "inter":
      return "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    case "roboto":
      return "var(--font-roboto), 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif";
    case "dm sans":
      return "var(--font-dmsans), 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";
    case "montserrat":
      return "var(--font-montserrat), 'Montserrat', Arial, Helvetica, sans-serif";
    case "commissioner":
      return "var(--font-commissioner), 'Commissioner', Arial, Helvetica, sans-serif";
    case "arial":
    default:
      return "Arial, Helvetica, sans-serif";
  }
}

export const EMAIL_SAFE_ICONS: Record<SocialNetwork, string> = {
  linkedin:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/linkedin-icon-2x.png",
  twitter:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/twitter-icon-2x.png",
  facebook:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/facebook-icon-2x.png",
  instagram:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/instagram-icon-2x.png",
};

/**
 * Builds email social icon asset URL from reliable public CDN or asset bucket.
 */
export function emailIconUrl(
  style: IconStyle | string,
  color: string,
  network: SocialNetwork | string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  if (baseUrl) {
    const cleanColor = color.replace(/^#/, "").toLowerCase();
    const normalizedBase = baseUrl.replace(/\/$/, "");
    return `${normalizedBase}/static/${style}-${cleanColor}-${network}.png`;
  }
  const net = (network || "").toLowerCase() as SocialNetwork;
  return EMAIL_SAFE_ICONS[net] || "";
}

/**
 * High-quality SVG path definitions for social icons to ensure reliable rendering.
 */
const SOCIAL_GLYPHS: Record<SocialNetwork, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z",
  twitter:
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
};

/**
 * Returns a self-contained SVG Data URI for an email social icon (used in live preview).
 */
export function getSocialIconSvgDataUrl(
  style: string,
  color: string,
  network: SocialNetwork
): string {
  const glyph = SOCIAL_GLYPHS[network] || "";
  const isWhite = color.toUpperCase() === "#FFFFFF";
  let glyphColor = "#FFFFFF";
  let backgroundShape = "";

  if (style === "outline") {
    const strokeColor = isWhite ? "#0F172A" : color;
    glyphColor = isWhite ? "#0F172A" : color;
    backgroundShape = `<rect x="1.5" y="1.5" width="37" height="37" rx="6.5" stroke="${strokeColor}" stroke-width="3" fill="none" />`;
  } else if (style === "minimal") {
    glyphColor = isWhite ? "#0F172A" : color;
  } else {
    // filled
    if (isWhite) {
      backgroundShape = `<rect x="0.5" y="0.5" width="39" height="39" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />`;
      glyphColor = "#0F172A";
    } else {
      backgroundShape = `<rect x="0" y="0" width="40" height="40" rx="8" fill="${color}" />`;
      glyphColor = "#FFFFFF";
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">${backgroundShape}<svg x="9" y="9" width="22" height="22" viewBox="0 0 24 24"><path fill="${glyphColor}" d="${glyph}"/></svg></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Strips HTML comments from an HTML string.
 */
function stripHtmlComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "").trim();
}

/**
 * Copies formatted rich signature (HTML + plain text fallback) to the clipboard.
 */
export async function copySignatureRich(html: string, plainText: string): Promise<void> {
  const cleanHtml = stripHtmlComments(html);

  // 1. Primary: modern Clipboard API with ClipboardItem (text/html + text/plain)
  if (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.clipboard?.write &&
    typeof ClipboardItem !== "undefined"
  ) {
    try {
      const htmlBlob = new Blob([cleanHtml], { type: "text/html" });
      const textBlob = new Blob([plainText], { type: "text/plain" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": textBlob,
        }),
      ]);
      return;
    } catch (clipboardErr) {
      console.warn(
        "[Clipboard] navigator.clipboard.write failed, trying execCommand fallback:",
        clipboardErr
      );
    }
  }

  // 2. Fallback: off-screen contenteditable container with document.execCommand("copy")
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    container.contentEditable = "true";
    container.innerHTML = cleanHtml;

    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = "1px";
    container.style.height = "1px";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    container.style.overflow = "hidden";

    document.body.appendChild(container);

    try {
      const range = document.createRange();
      range.selectNodeContents(container);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      const success = document.execCommand("copy");
      selection?.removeAllRanges();

      if (!success) {
        throw new Error("execCommand('copy') returned false");
      }
      return;
    } catch (fallbackErr) {
      throw new Error(
        `Failed to copy signature to clipboard: ${
          fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)
        }`
      );
    } finally {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  }

  throw new Error("Clipboard operations are not supported in this environment");
}

/**
 * Copies plain text to the clipboard.
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  if (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.clipboard?.writeText
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      console.warn("[Clipboard] writeText failed, trying textarea fallback:", err);
    }
  }

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    try {
      const success = document.execCommand("copy");
      if (!success) {
        throw new Error("execCommand('copy') failed");
      }
    } finally {
      if (textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
    return;
  }

  throw new Error("Clipboard operations are not supported in this environment");
}
