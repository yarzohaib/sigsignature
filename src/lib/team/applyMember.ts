import type { Team, TeamMember } from "@/types/team";
import type { SavedSignature } from "@/types/signature";
import type { TemplateSignatureData } from "@/types/template";
import type { StudioSignatureData, FreeElement } from "@/types/studio";

/**
 * Applies a team member's specific details onto the team's template/studio design.
 * Returns a SavedSignature ("team-preview") safe for HTML and plain-text rendering.
 *
 * Guarantees that owner details (name, job title, email, phone, avatar) never leak.
 */
export function applyMemberToSignature(team: Team, member: TeamMember): SavedSignature {
  const memberSocials = Array.isArray(member.socials) ? member.socials : [];
  const hasSocials = memberSocials.some((s) => Boolean(s.url && s.url.trim()));

  const nextSocials: Record<string, string> = {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    github: "",
    youtube: "",
    website: "",
  };
  for (const s of memberSocials) {
    if (s.url && s.url.trim()) {
      const key = s.platform === "x" ? "twitter" : s.platform;
      nextSocials[key] = s.url.trim();
    }
  }

  if (team.kind === "template") {
    const templateData: TemplateSignatureData = JSON.parse(
      JSON.stringify(team.data || {})
    );

    templateData.fullName = member.name || "";
    templateData.jobTitle = member.jobTitle || "";
    templateData.email = member.email || "";
    templateData.phone = member.phone || "";
    templateData.avatarUrl = member.photoUrl?.trim() || "";

    // Replace the social links of the signature with the member socials.
    // With none, the social row is hidden and the owner's links are never shown.
    templateData.socials = nextSocials as unknown as TemplateSignatureData["socials"];

    return {
      id: "team-preview",
      kind: "template",
      templateId: team.templateId,
      templateVersion: team.templateVersion,
      name: team.name,
      data: templateData,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  // Kind "studio"
  const studioData: StudioSignatureData = JSON.parse(
    JSON.stringify(team.data || {})
  );

  // Blank or replace top-level fields so owner details never leak
  studioData.fullName = member.name || "";
  studioData.jobTitle = member.jobTitle || "";
  studioData.email = member.email || "";
  studioData.phone = member.phone || "";
  studioData.avatarUrl = member.photoUrl?.trim() || "";

  // Update studio signature socials with member socials
  studioData.socials = nextSocials as unknown as StudioSignatureData["socials"];

  if (Array.isArray(studioData.elements)) {
    const nextElements: FreeElement[] = [];

    for (const el of studioData.elements) {
      if (el.type === "text") {
        const textEl = { ...el };
        if (textEl.bind) {
          if (textEl.bind === "name") {
            textEl.text = member.name || "";
          } else if (textEl.bind === "jobTitle") {
            textEl.text = member.jobTitle || "";
          } else if (textEl.bind === "email") {
            textEl.text = member.email || "";
          } else if (textEl.bind === "phone") {
            textEl.text = member.phone || "";
          }
        }
        nextElements.push(textEl);
      } else if (el.type === "image") {
        const imgEl = { ...el };
        if (imgEl.bind === "photo") {
          // If member has a photo, replace url; if member has no photo, omit this element completely
          if (member.photoUrl?.trim()) {
            imgEl.url = member.photoUrl.trim();
            nextElements.push(imgEl);
          }
        } else {
          nextElements.push(imgEl);
        }
      } else if (el.type === "social") {
        // For studio kind, update the social element's links with the member socials
        // and remove the element from the output when the member has none.
        if (hasSocials) {
          nextElements.push(el);
        }
      } else {
        // Divider, Logo, Banner, CTA stay exactly as the template has them
        nextElements.push(el);
      }
    }

    studioData.elements = nextElements;
  }

  return {
    id: "team-preview",
    kind: "studio",
    templateId: team.templateId,
    templateVersion: team.templateVersion,
    name: team.name,
    data: studioData,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  };
}
