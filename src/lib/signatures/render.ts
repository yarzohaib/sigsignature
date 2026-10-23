import { SavedSignature } from "@/types/signature";
import {
  generateTemplateHtml,
  generateTemplatePlainText,
} from "@/lib/templates/renderTemplateHtml";
import {
  generateStudioHtml,
  generateStudioPlainText,
} from "@/lib/studio/renderStudioHtml";
import {
  generateFreeHtml,
  generateFreePlainText,
} from "@/lib/studio/free/renderFreeHtml";

export function renderSavedSignatureHtml(
  sig: SavedSignature,
  options?: { preview?: boolean }
): string {
  if (sig.kind === "studio") {
    if (sig.data.elements && Array.isArray(sig.data.elements)) {
      return generateFreeHtml(sig.data, options);
    }
    return generateStudioHtml(sig.data, options);
  }
  const templateId = sig.templateId || sig.data.templateId;
  const data = templateId ? { ...sig.data, templateId } : sig.data;
  return generateTemplateHtml(data, options);
}

export function renderSavedSignaturePlainText(sig: SavedSignature): string {
  if (sig.kind === "studio") {
    if (sig.data.elements && Array.isArray(sig.data.elements)) {
      return generateFreePlainText(sig.data);
    }
    return generateStudioPlainText(sig.data);
  }
  const templateId = sig.templateId || sig.data.templateId;
  const data = templateId ? { ...sig.data, templateId } : sig.data;
  return generateTemplatePlainText(data);
}
