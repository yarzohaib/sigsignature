import { TemplateSignatureData } from "@/types/template";
import { render as renderProfessionalMinimal } from "./professionalMinimal";
import { render as renderExecutiveCorporate } from "./executiveCorporate";
import { render as renderCleanLine } from "./cleanLine";
import { render as renderCenteredMinimal } from "./centeredMinimal";
import { render as renderBoardroomCorporate } from "./boardroomCorporate";
import { render as renderClassicLetterhead } from "./classicLetterhead";
import { render as renderColorBlock } from "./colorBlock";
import { render as renderPhotoPop } from "./photoPop";
import { render as renderRibbon } from "./ribbon";
import { render as renderBoldBlock } from "./boldBlock";
import { render as renderBigName } from "./bigName";
import { render as renderSplitBanner } from "./splitBanner";
import { render as renderTwoColumn } from "./twoColumn";
import { render as renderHorizontal } from "./horizontal";
import { render as renderCompact } from "./compact";
import { render as renderSingle } from "./single";

export type TemplateRenderer = (data: TemplateSignatureData) => string;

/**
 * Registry mapping templateId to its specific HTML renderer.
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateRenderer> = {
  "professional-minimal": renderProfessionalMinimal,
  "executive-corporate": renderExecutiveCorporate,
  "preston-corporate": renderExecutiveCorporate,
  "clean-line": renderCleanLine,
  "centered-minimal": renderCenteredMinimal,
  "boardroom-corporate": renderBoardroomCorporate,
  "classic-letterhead": renderClassicLetterhead,
  "color-block": renderColorBlock,
  "photo-pop": renderPhotoPop,
  ribbon: renderRibbon,
  "bold-block": renderBoldBlock,
  "big-name": renderBigName,
  "split-banner": renderSplitBanner,
};

/**
 * Layout fallback mapping for legacy signatures without a recognized templateId.
 */
export const LAYOUT_FALLBACK_REGISTRY: Record<string, TemplateRenderer> = {
  "two-column": renderTwoColumn,
  "horizontal": renderHorizontal,
  "compact": renderCompact,
  "single": renderSingle,
  "corporate-card": renderExecutiveCorporate,
};

/**
 * Returns the appropriate template renderer function.
 * Matches by templateId first, falls back to layout, then defaults to two-column.
 */
export function getTemplateRenderer(
  templateId?: string | null,
  layout?: string | null
): TemplateRenderer {
  if (templateId) {
    const cleanId = templateId.toLowerCase().trim();
    if (TEMPLATE_REGISTRY[cleanId]) {
      return TEMPLATE_REGISTRY[cleanId];
    }
  }

  if (layout) {
    const cleanLayout = layout.toLowerCase().trim();
    if (LAYOUT_FALLBACK_REGISTRY[cleanLayout]) {
      return LAYOUT_FALLBACK_REGISTRY[cleanLayout];
    }
  }

  return renderTwoColumn;
}

export {
  renderProfessionalMinimal,
  renderExecutiveCorporate,
  renderCleanLine,
  renderCenteredMinimal,
  renderBoardroomCorporate,
  renderClassicLetterhead,
  renderTwoColumn,
  renderHorizontal,
  renderCompact,
  renderSingle,
};

export * from "./shared";
