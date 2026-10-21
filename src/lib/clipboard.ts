/**
 * Clipboard utilities for rich signature copying.
 * Uses safe DOM building with createElement and textContent to prevent innerHTML injection vulnerabilities.
 */
export {
  copySignatureRich,
  copyTextToClipboard,
  buildSafeDomFragment,
} from "@/lib/email-core";

