import { TemplateSignatureData } from "@/types/template";
import { getTemplateRenderer } from "./designs";

export * from "./designs";

/**
 * Generates an email-safe, table-based HTML string for any template signature.
 * Strictly dispatches through the designs registry with fallback support for older saved signatures.
 * Output is an email-safe HTML fragment without <html>, <head>, <body>, or script tags.
 */
export function generateTemplateHtml(data: TemplateSignatureData): string {
  const renderer = getTemplateRenderer(data.templateId, data.layout);
  return renderer(data);
}

/**
 * Returns a clean plain-text version of the signature data:
 * name, job title, company, phone, email, website, address, tagline, disclaimer (one per line, skipping empty values).
 */
export function generateTemplatePlainText(data: TemplateSignatureData): string {
  const lines: string[] = [];

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
  if (data.optional?.address?.trim()) {
    lines.push(data.optional.address.trim());
  }
  if (data.optional?.tagline?.trim()) {
    lines.push(data.optional.tagline.trim());
  }
  if (data.optional?.disclaimer?.trim()) {
    lines.push(data.optional.disclaimer.trim());
  }

  return lines.join("\n");
}
