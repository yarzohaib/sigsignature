import type { Team } from "@/types/team";
import type { StudioSignatureData } from "@/types/studio";
import type { TemplateSignatureData } from "@/types/template";

export const TEAM_SOCIAL_PLATFORMS = [
  "linkedin",
  "x",
  "facebook",
  "instagram",
  "github",
] as const;

export type TeamMemberSocialPlatform = (typeof TEAM_SOCIAL_PLATFORMS)[number];

export interface TeamMemberSocial {
  platform: TeamMemberSocialPlatform;
  url: string;
}

export const SOCIAL_PLATFORM_LABELS: Record<TeamMemberSocialPlatform, string> = {
  linkedin: "LinkedIn",
  x: "Twitter / X",
  facebook: "Facebook",
  instagram: "Instagram",
  github: "GitHub",
};

export const SOCIAL_PLATFORM_EXAMPLES: Record<TeamMemberSocialPlatform, string> = {
  linkedin: "https://linkedin.com/in/username",
  x: "https://x.com/username or https://twitter.com/username",
  facebook: "https://facebook.com/username",
  instagram: "https://instagram.com/username",
  github: "https://github.com/username",
};

/**
 * Validates that a URL matches the expected domain for the given platform.
 * Returns null if valid, or an error string if invalid.
 */
export function validateSocialUrl(
  platform: TeamMemberSocialPlatform,
  url: string
): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return "URL cannot be empty";
  }

  if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://")) {
    return "URL must start with https://";
  }

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    switch (platform) {
      case "linkedin":
        if (hostname !== "linkedin.com" && !hostname.endsWith(".linkedin.com")) {
          return "Must be a valid LinkedIn URL (e.g. https://linkedin.com/in/username)";
        }
        break;
      case "x":
        if (
          hostname !== "x.com" &&
          hostname !== "twitter.com" &&
          !hostname.endsWith(".twitter.com")
        ) {
          return "Must be a valid X/Twitter URL (e.g. https://x.com/username)";
        }
        break;
      case "facebook":
        if (hostname !== "facebook.com" && !hostname.endsWith(".facebook.com")) {
          return "Must be a valid Facebook URL (e.g. https://facebook.com/username)";
        }
        break;
      case "instagram":
        if (hostname !== "instagram.com" && !hostname.endsWith(".instagram.com")) {
          return "Must be a valid Instagram URL (e.g. https://instagram.com/username)";
        }
        break;
      case "github":
        if (hostname !== "github.com" && !hostname.endsWith(".github.com")) {
          return "Must be a valid GitHub URL (e.g. https://github.com/username)";
        }
        break;
    }
  } catch {
    return "Please enter a valid URL (e.g. https://...)";
  }

  return null;
}

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
      socials?.instagram?.trim() ||
      socials?.github?.trim()
    );
  }

  const data = team.data as TemplateSignatureData;
  const socials = data?.socials;
  return Boolean(
    socials?.linkedin?.trim() ||
    socials?.twitter?.trim() ||
    socials?.facebook?.trim() ||
    socials?.instagram?.trim() ||
    socials?.github?.trim()
  );
}
