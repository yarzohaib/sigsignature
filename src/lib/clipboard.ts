/**
 * Helper utilities for copying rich signature content and plain text to clipboard.
 * Supports modern Clipboard API (with text/html + text/plain ClipboardItem) and
 * contenteditable / textarea execCommand fallbacks.
 */

/**
 * Strips HTML comments (<!-- ... -->) from an HTML string.
 */
function stripHtmlComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "").trim();
}

/**
 * Copies formatted rich signature (HTML + plain text fallback) to the clipboard.
 * Must be invoked directly within a user gesture handler (e.g. click).
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

    // Position off-screen and invisible
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
 * Copies plain text (e.g. raw HTML source or plain text) to the clipboard.
 * Uses navigator.clipboard.writeText with a textarea document.execCommand fallback.
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  // 1. Try modern navigator.clipboard.writeText
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

  // 2. Fallback: hidden textarea with select() + execCommand("copy")
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
