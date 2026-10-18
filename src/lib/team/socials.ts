import type { Team } from "@/types/team";
import type { StudioSignatureData } from "@/types/studio";
import type { TemplateSignatureData } from "@/types/template";

export const TEAM_SOCIAL_PLATFORMS = [
  "linkedin",
  "x",
  "facebook",
  "instagram",
  "github",
  "youtube",
  "website",
] as const;

export type TeamMemberSocialPlatform = (typeof TEAM_SOCIAL_PLATFORMS)[number];

export interface TeamMemberSocial {
  platform: TeamMemberSocialPlatform;
  url: string;
}

export const SOCIAL_PLATFORM_LABELS: Record<TeamMemberSocialPlatform, string> = {
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  facebook: "Facebook",
  instagram: "Instagram",
  github: "GitHub",
  youtube: "YouTube",
  website: "Website",
};

/**
 * Checks if the team template/studio design contains any social element or icons.
 */
export function teamHasSocialElement(team: Team): boolean {
  if (!team || !team.data) return false;

  if (team.kind === "studio") {
    const data = team.data as StudioSignatureData;
    if (Array.isArray(data?.elements)) {
      return data.elements.some((el) => el.type === "social");
    }
    const socials = data?.socials;
    return Boolean(
      socials?.linkedin?.trim() ||
      socials?.twitter?.trim() ||
      socials?.facebook?.trim() ||
      socials?.instagram?.trim()
    );
  }

  const data = team.data as TemplateSignatureData;
  const socials = data?.socials;
  return Boolean(
    socials?.linkedin?.trim() ||
    socials?.twitter?.trim() ||
    socials?.facebook?.trim() ||
    socials?.instagram?.trim()
  );
}
