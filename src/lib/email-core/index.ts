/**
 * Neutral email-safe formatting, sanitization, font resolution, and clipboard helpers.
 * Shared across Templates and Design Studio.
 */

import {
  SOCIAL_NETWORKS,
  ICON_GLYPHS,
  type SocialNetwork,
} from "./iconGlyphs";
import { buildIconSvg, type IconStyle } from "./iconSvg";

export { SOCIAL_NETWORKS, ICON_GLYPHS, buildIconSvg };
export type { SocialNetwork, IconStyle };

/**
 * Escapes special HTML characters in user text to prevent XSS and malformed markup.
 */
export function escapeHtml(text: string | null | undefined): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitizes URLs to allow only safe email schemes: http, https, mailto, and tel.
 * Returns an empty string for javascript:, data:, invalid protocols, or strings containing markup.
 */
export function safeUrl(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (/[<>]/.test(trimmed)) return "";
  if (/^(javascript:|vbscript:|data:)/i.test(trimmed)) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return "";
}

/**
 * Sanitizes image src URLs to allow only safe schemes: http, https, relative paths,
 * or safe base64/svg data URIs.
 * Returns an empty string for javascript:, vbscript:, invalid protocols, or strings containing markup.
 */
export function safeImageUrl(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (/[<>]/.test(trimmed)) return "";
  if (/^(javascript:|vbscript:|data:text\/html)/i.test(trimmed)) return "";
  if (/^(https?:\/\/|\/|data:image\/(png|jpeg|jpg|gif|webp|svg\+xml)[;,])/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return "";
}

/**
 * Adds https:// protocol to website URLs when missing, while strictly rejecting unsafe schemes.
 */
export function normalizeWebsite(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed) || /[\s<>"']/.test(trimmed)) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Sanitizes phone numbers for tel: links, retaining only digits and a single leading +.
 */
export function telHref(phone: string | null | undefined): string {
  if (!phone) return "";
  const trimmed = String(phone).trim();
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

/**
 * Builds email social icon asset URL from the site's dynamic icon rendering endpoint.
 * Format: ${SITE_URL}/api/icons/{style}/{color}/{network}.png
 */
export function emailIconUrl(
  style: IconStyle | string,
  color: string,
  network: SocialNetwork | string
): string {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sigsignature.com"
  ).replace(/\/$/, "");
  const cleanStyle = (style || "filled").toLowerCase();
  const cleanColor = (color || "245FD4").replace(/^#/, "").toLowerCase();
  const cleanNetwork = (network || "website").toLowerCase();
  return `${siteUrl}/api/icons/${cleanStyle}/${cleanColor}/${cleanNetwork}.png`;
}

/**
 * Returns a self-contained SVG Data URI for an email social icon (used in live preview).
 */
export function getSocialIconSvgDataUrl(
  style: string,
  color: string,
  network: SocialNetwork
): string {
  const svg = buildIconSvg(
    (style as IconStyle) || "filled",
    color || "#245FD4",
    network
  );
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Strips HTML comments from an HTML string.
 */
function stripHtmlComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "").trim();
}

/**
 * Builds a sanitized DocumentFragment from an HTML string using standard DOM nodes
 * (createElement, createTextNode, textContent).
 * Strictly removes executable tags (<script>, <iframe>, <object>, etc.) and all on* event handlers.
 * Restricts href and src to safe protocols.
 */
export function buildSafeDomFragment(html: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (!html) return fragment;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const ALLOWED_TAGS = new Set([
    "table", "thead", "tbody", "tfoot", "tr", "td", "th",
    "div", "span", "p", "a", "img", "strong", "b", "em", "i",
    "br", "hr", "sub", "sup"
  ]);

  const ALLOWED_ATTRS = new Set([
    "href", "src", "alt", "title", "width", "height", "style",
    "align", "valign", "bgcolor", "border", "cellpadding", "cellspacing",
    "role", "target", "rel", "class"
  ]);

  function cleanNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent || "");
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      return null;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tagName)) {
        return null;
      }

      const cleanEl = document.createElement(tagName);

      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        const name = attr.name.toLowerCase();

        // Disallow all inline event handlers (onerror, onload, onclick, etc.)
        if (name.startsWith("on")) {
          continue;
        }

        if (!ALLOWED_ATTRS.has(name)) {
          continue;
        }

        const val = attr.value;

        // Protocol restriction on href
        if (name === "href") {
          const trimmed = val.trim();
          if (!/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
            continue;
          }
        }

        // Protocol restriction on src
        if (name === "src") {
          const trimmed = val.trim();
          if (!/^(https?:\/\/|\/|data:image\/(png|jpeg|jpg|gif|webp|svg\+xml)[;,])/i.test(trimmed)) {
            continue;
          }
        }

        cleanEl.setAttribute(name, val);
      }

      Array.from(el.childNodes).forEach((child) => {
        const cleanedChild = cleanNode(child);
        if (cleanedChild) {
          cleanEl.appendChild(cleanedChild);
        }
      });

      return cleanEl;
    }
    return null;
  }

  Array.from(doc.body.childNodes).forEach((child) => {
    const cleaned = cleanNode(child);
    if (cleaned) {
      fragment.appendChild(cleaned);
    }
  });

  return fragment;
}

/**
 * Copies formatted rich signature (HTML + plain text fallback) to the clipboard.
 * Supports either (html, plainText) or options object { html, plainText }.
 */
export async function copySignatureRich(
  htmlOrOptions: string | { html: string; plainText?: string },
  maybePlainText?: string
): Promise<boolean> {
  let html = "";
  let plainText = "";

  if (typeof htmlOrOptions === "object" && htmlOrOptions !== null) {
    html = htmlOrOptions.html || "";
    plainText = htmlOrOptions.plainText || "";
  } else {
    html = htmlOrOptions || "";
    plainText = maybePlainText || "";
  }

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
      return true;
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
    container.appendChild(buildSafeDomFragment(cleanHtml));

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
      return true;
    } catch (fallbackErr) {
      console.warn(
        `Failed to copy signature to clipboard: ${
          fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)
        }`
      );
      return false;
    } finally {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  }

  return false;
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
