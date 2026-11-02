import { TemplateSignatureData } from "@/types/template";
import { getTemplateRenderer } from "./designs";
import { getSocialIconSvgDataUrl, SocialNetwork } from "@/lib/email-core";

export * from "./designs";

export interface TemplateOptionalCapabilities {
  supportsAddress: boolean;
  supportsDisclaimer: boolean;
  supportsTagline: boolean;
  hasAnyOptional: boolean;
}

const capabilitiesCache = new Map<string, TemplateOptionalCapabilities>();

/**
 * Dynamically probes whether a given template (or layout fallback) supports
 * optional fields (address, disclaimer, tagline) by inspecting rendered HTML output.
 * Caches results per templateId/layout to run instantly with zero overhead.
 */
export function getTemplateOptionalCapabilities(
  templateId?: string | null,
  layout?: string | null
): TemplateOptionalCapabilities {
  const cacheKey = `${(templateId || "").toLowerCase().trim()}:${(layout || "").toLowerCase().trim()}`;
  const cached = capabilitiesCache.get(cacheKey);
  if (cached) return cached;

  const testData: TemplateSignatureData = {
    templateId: templateId || undefined,
    layout: (layout as any) || "two-column",
    fullName: "Test Name",
    jobTitle: "Test Title",
    companyName: "Test Company",
    email: "test@example.com",
    phone: "123456",
    website: "https://example.com",
    avatarUrl: "",
    themeColor: "#245FD4",
    fontFamily: "Arial",
    socialIconsStyle: "filled",
    socials: { linkedin: "", twitter: "", facebook: "" },
    optional: {
      address: "__ADDR_PROBE__",
      disclaimer: "__DISC_PROBE__",
      tagline: "__TAG_PROBE__",
    },
  };

  const html = generateTemplateHtml(testData);
  const supportsAddress = html.includes("__ADDR_PROBE__");
  const supportsDisclaimer = html.includes("__DISC_PROBE__");
  const supportsTagline = html.includes("__TAG_PROBE__");

  const result: TemplateOptionalCapabilities = {
    supportsAddress,
    supportsDisclaimer,
    supportsTagline,
    hasAnyOptional: supportsAddress || supportsDisclaimer,
  };

  capabilitiesCache.set(cacheKey, result);
  return result;
}

/**
 * Generates an email-safe, table-based HTML string for any template signature.
 * Strictly dispatches through the designs registry with fallback support for older saved signatures.
 * Output is an email-safe HTML fragment without <html>, <head>, <body>, or script tags.
 */
export function generateTemplateHtml(
  data: TemplateSignatureData,
  options?: { preview?: boolean }
): string {
  const renderer = getTemplateRenderer(data.templateId, data.layout);
  let html = renderer(data);

  if (options?.preview) {
    // In preview mode (e.g. template gallery cards), replace network icon URLs with crisp vector SVG Data URIs
    html = html.replace(
      /(?:https?:\/\/[^"'\s]+)?\/api\/icons\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_-]+)\.png/g,
      (_match, style, color, network) => {
        try {
          return getSocialIconSvgDataUrl(style, `#${color}`, network as SocialNetwork);
        } catch {
          return _match;
        }
      }
    );
  }

  return html;
}

/**
 * Returns a clean plain-text version of the signature data:
 * name, job title, company, phone, email, website, address, tagline, disclaimer (one per line, skipping empty values).
 */
export function generateTemplatePlainText(data: TemplateSignatureData): string {
  const lines: string[] = [];
  const caps = getTemplateOptionalCapabilities(data.templateId, data.layout);

  if (data.fullName?.trim()) {
    lines.push(data.fullName.trim());
  }
  if (data.jobTitle?.trim()) {
    lines.push(data.jobTitle.trim());
  }
  if (data.companyName?.trim()) {
    lines.push(data.companyName.trim());
  }
  if (data.phone?.trim()) {
    lines.push(data.phone.trim());
  }
  if (data.email?.trim()) {
    lines.push(data.email.trim());
  }
  if (data.website?.trim()) {
    lines.push(data.website.trim());
  }
  if (caps.supportsAddress && data.optional?.address?.trim()) {
    lines.push(data.optional.address.trim());
  }
  if (caps.supportsTagline && data.optional?.tagline?.trim()) {
    lines.push(data.optional.tagline.trim());
  }
  if (caps.supportsDisclaimer && data.optional?.disclaimer?.trim()) {
    lines.push(data.optional.disclaimer.trim());
  }

  return lines.join("\n");
}
