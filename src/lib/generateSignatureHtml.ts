import { TemplateSignatureData } from "@/types/template";
import { SavedSignature } from "@/types/signature";
import {
  generateTemplateHtml,
  generateTemplatePlainText,
} from "@/lib/templates/renderTemplateHtml";
import {
  renderSavedSignatureHtml,
  renderSavedSignaturePlainText,
} from "@/lib/signatures/render";
import {
  escapeHtml,
  safeUrl,
  safeImageUrl,
  normalizeWebsite,
  telHref,
  resolveEmailFont,
  emailIconUrl,
} from "@/lib/email-core";

export {
  escapeHtml,
  safeUrl,
  safeImageUrl,
  normalizeWebsite,
  telHref,
  resolveEmailFont,
  emailIconUrl,
  generateTemplateHtml,
  generateTemplatePlainText,
  renderSavedSignatureHtml,
  renderSavedSignaturePlainText,
};

/**
 * Primary signature HTML generation function.
 * Supports both TemplateSignatureData and SavedSignature.
 * Strictly guarantees that every user-supplied value is escaped via escapeHtml,
 * and href/src are restricted to http, https, mailto, and tel.
 */
export function generateSignatureHtml(
  sig: SavedSignature | TemplateSignatureData,
  options?: { preview?: boolean }
): string {
  if ("kind" in sig) {
    return renderSavedSignatureHtml(sig, options);
  }
  return generateTemplateHtml(sig);
}

export function generateSignaturePlainText(
  sig: SavedSignature | TemplateSignatureData
): string {
  if ("kind" in sig) {
    return renderSavedSignaturePlainText(sig);
  }
  return generateTemplatePlainText(sig);
}

export default generateSignatureHtml;
