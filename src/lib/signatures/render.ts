import { SavedSignature } from "@/types/signature";
import {
  generateTemplateHtml,
  generateTemplatePlainText,
} from "@/lib/templates/renderTemplateHtml";
import {
  generateStudioHtml,
  generateStudioPlainText,
} from "@/lib/studio/renderStudioHtml";

export function renderSavedSignatureHtml(
  sig: SavedSignature,
  options?: { preview?: boolean }
): string {
  if (sig.kind === "studio") {
    return generateStudioHtml(sig.data, options);
  }
  return generateTemplateHtml(sig.data);
}

export function renderSavedSignaturePlainText(sig: SavedSignature): string {
  if (sig.kind === "studio") {
    return generateStudioPlainText(sig.data);
  }
  return generateTemplatePlainText(sig.data);
}
