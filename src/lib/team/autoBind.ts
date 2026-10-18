import type { StudioSignatureData, FreeElement, FreeTextElement, FreeImageElement } from "@/types/studio";
import { migrateFlowToFree } from "@/lib/studio/free/migrate";

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /(?:\+?\d{1,4}[-\s.]?)?\(?\d{2,4}\)?[-\s.]?\d{3,4}[-\s.]?\d{3,4}/;

/**
 * Automatically inspects a studio design's free elements and assigns `bind` tags
 * to match dynamic team member fields (name, jobTitle, email, phone, photo).
 *
 * If the design has no free elements (legacy flow design), migrateFlowToFree is run first.
 * Each dynamic field is bound at most once.
 */
export function autoBindStudioData(sourceData: StudioSignatureData): StudioSignatureData {
  let data: StudioSignatureData = JSON.parse(JSON.stringify(sourceData));

  if (!data.elements || data.elements.length === 0) {
    data = migrateFlowToFree(data);
  }

  if (!Array.isArray(data.elements) || data.elements.length === 0) {
    return data;
  }

  const elements: FreeElement[] = data.elements.map((el) => ({ ...el }));

  let boundName = false;
  let boundJobTitle = false;
  let boundEmail = false;
  let boundPhone = false;

  const targetName = data.fullName?.trim();
  const targetJobTitle = data.jobTitle?.trim();
  const targetEmail = data.email?.trim();
  const targetPhone = data.phone?.trim();
  const targetAvatar = data.avatarUrl?.trim();

  // 1. Bind text elements
  for (const el of elements) {
    if (el.type !== "text") continue;
    const textEl = el as FreeTextElement;
    const trimmed = textEl.text.trim();

    // Already bound?
    if (textEl.bind) {
      if (textEl.bind === "name") boundName = true;
      if (textEl.bind === "jobTitle") boundJobTitle = true;
      if (textEl.bind === "email") boundEmail = true;
      if (textEl.bind === "phone") boundPhone = true;
      continue;
    }

    if (!boundName && targetName && trimmed === targetName) {
      textEl.bind = "name";
      boundName = true;
      continue;
    }

    if (!boundJobTitle && targetJobTitle && trimmed === targetJobTitle) {
      textEl.bind = "jobTitle";
      boundJobTitle = true;
      continue;
    }

    if (!boundEmail && ((targetEmail && trimmed.includes(targetEmail)) || EMAIL_PATTERN.test(trimmed))) {
      textEl.bind = "email";
      boundEmail = true;
      continue;
    }

    if (!boundPhone && ((targetPhone && (trimmed === targetPhone || trimmed.includes(targetPhone))) || PHONE_PATTERN.test(trimmed))) {
      textEl.bind = "phone";
      boundPhone = true;
      continue;
    }
  }

  // 2. Bind image element (photo)
  // Check if an image already has bind === "photo"
  const photoAlreadyBound = elements.some(
    (el) => el.type === "image" && (el as FreeImageElement).bind === "photo"
  );

  if (!photoAlreadyBound) {
    let matchedPhotoIndex = -1;

    // Check if any image url equals targetAvatar
    if (targetAvatar) {
      matchedPhotoIndex = elements.findIndex(
        (el) => el.type === "image" && (el as FreeImageElement).url?.trim() === targetAvatar
      );
    }

    // Otherwise pick the first image element
    if (matchedPhotoIndex === -1) {
      matchedPhotoIndex = elements.findIndex((el) => el.type === "image");
    }

    if (matchedPhotoIndex !== -1) {
      const imgEl = elements[matchedPhotoIndex] as FreeImageElement;
      imgEl.bind = "photo";
    }
  }

  return {
    ...data,
    elements,
  };
}
