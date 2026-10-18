import type { Team } from "@/types/team";

export interface StudioBoundFieldsStatus {
  name: boolean;
  jobTitle: boolean;
  email: boolean;
  phone: boolean;
  photo: boolean;
}

/**
 * Inspects a studio signature design's elements and returns the linked status
 * of all dynamic team fields without cross-importing from the studio folder.
 */
export function getStudioBoundFields(data: unknown): StudioBoundFieldsStatus {
  const elements = (data as { elements?: Array<{ type?: string; bind?: string }> })?.elements;
  if (!Array.isArray(elements)) {
    return {
      name: false,
      jobTitle: false,
      email: false,
      phone: false,
      photo: false,
    };
  }

  let name = false;
  let jobTitle = false;
  let email = false;
  let phone = false;
  let photo = false;

  for (const el of elements) {
    if (el.type === "text" && el.bind) {
      if (el.bind === "name") name = true;
      if (el.bind === "jobTitle") jobTitle = true;
      if (el.bind === "email") email = true;
      if (el.bind === "phone") phone = true;
    } else if (el.type === "image" && el.bind === "photo") {
      photo = true;
    }
  }

  return { name, jobTitle, email, phone, photo };
}

/**
 * Returns an array of required studio team fields ("Name", "Email", "Photo")
 * that are currently not linked. Phone and Job title are optional and omitted.
 */
export function getMissingStudioRequiredFields(data: unknown): Array<"Name" | "Email" | "Photo"> {
  const status = getStudioBoundFields(data);
  const missing: Array<"Name" | "Email" | "Photo"> = [];

  if (!status.name) missing.push("Name");
  if (!status.email) missing.push("Email");
  if (!status.photo) missing.push("Photo");

  return missing;
}

/**
 * Returns a warning message string if any of Name, Email, or Photo is unlinked
 * for a studio team design, or null if all required fields are linked.
 */
export function getStudioUnlinkedWarning(team: Team): string | null {
  if (team.kind !== "studio") return null;

  const missing = getMissingStudioRequiredFields(team.data);
  if (missing.length === 0) return null;

  const fieldText = missing.join(", ");
  const verb = missing.length === 1 ? "is" : "are";

  return `${fieldText} ${verb} not linked, so every member would show the same value. Edit the design in the Design Studio and link it.`;
}

/**
 * Returns true if a studio design is missing either Name or Email bindings.
 */
export function isStudioNameOrEmailUnlinked(data: unknown): boolean {
  const status = getStudioBoundFields(data);
  return !status.name || !status.email;
}
