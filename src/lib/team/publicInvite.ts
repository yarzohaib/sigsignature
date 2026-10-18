import { API_BASE_URL } from "@/app/lib/api";
import type { TeamMemberSocialPlatform } from "@/lib/team/socials";

export interface PublicInviteMember {
  name: string;
  maskedEmail: string;
  jobTitle: string;
  phone: string;
  photoUrl: string;
  socials: Array<{ platform: TeamMemberSocialPlatform; url: string }>;
  status: "sent" | "accepted";
}

export interface PublicInviteTeam {
  name: string;
  kind: "template" | "studio";
  templateId: string;
  templateVersion: number;
  data: unknown;
}

export interface PublicInviteData {
  maskedEmail?: string;
  member: PublicInviteMember;
  team: PublicInviteTeam;
  expiresAt: string | null;
  status?: string;
}

export type PublicInviteErrorCode =
  | "INVITE_NOT_FOUND"
  | "INVITE_REVOKED"
  | "INVITE_EXPIRED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export class PublicInviteError extends Error {
  code: PublicInviteErrorCode;

  constructor(code: PublicInviteErrorCode, message: string) {
    super(message);
    this.name = "PublicInviteError";
    this.code = code;
  }
}

/**
 * Fetches public invite details by token using plain fetch (no auth required).
 * Token is never logged or exposed to analytics.
 */
export async function fetchPublicInvite(token: string): Promise<PublicInviteData> {
  const encoded = encodeURIComponent(token.trim());
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/v1/public/team/invite/${encoded}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    throw new PublicInviteError(
      "NETWORK_ERROR",
      "We had trouble connecting to the server. Please check your internet connection."
    );
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  const obj = json && typeof json === "object" ? (json as Record<string, unknown>) : null;
  const code = typeof obj?.code === "string" ? obj.code : "";

  if (!res.ok) {
    if (res.status === 404 || code === "INVITE_NOT_FOUND") {
      throw new PublicInviteError("INVITE_NOT_FOUND", "This link is not valid");
    }
    if (res.status === 410 || code === "INVITE_REVOKED" || code === "INVITE_EXPIRED") {
      if (code === "INVITE_EXPIRED") {
        throw new PublicInviteError(
          "INVITE_EXPIRED",
          "This link has expired. Ask the sender to send a new one"
        );
      }
      throw new PublicInviteError(
        "INVITE_REVOKED",
        "This link was cancelled by the sender"
      );
    }
    if (res.status >= 500) {
      throw new PublicInviteError(
        "NETWORK_ERROR",
        "We had trouble connecting to the server. Please try again."
      );
    }
    throw new PublicInviteError("UNKNOWN_ERROR", "Unable to load invite.");
  }

  const data = (obj?.data || obj) as PublicInviteData;
  if (!data || !data.member || !data.team) {
    throw new PublicInviteError("INVITE_NOT_FOUND", "This link is not valid");
  }

  return data;
}

/**
 * Accepts a team invite by token (idempotent).
 */
export async function acceptPublicInvite(token: string): Promise<void> {
  const encoded = encodeURIComponent(token.trim());
  let res: Response;
  try {
    res = await fetch(
      `${API_BASE_URL}/api/v1/public/team/invite/${encoded}/accept`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );
  } catch {
    throw new PublicInviteError(
      "NETWORK_ERROR",
      "We had trouble connecting to the server. Please check your internet connection."
    );
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  const obj = json && typeof json === "object" ? (json as Record<string, unknown>) : null;
  const code = typeof obj?.code === "string" ? obj.code : "";

  if (!res.ok) {
    if (res.status === 404 || code === "INVITE_NOT_FOUND") {
      throw new PublicInviteError("INVITE_NOT_FOUND", "This link is not valid");
    }
    if (res.status === 410 || code === "INVITE_REVOKED" || code === "INVITE_EXPIRED") {
      if (code === "INVITE_EXPIRED") {
        throw new PublicInviteError(
          "INVITE_EXPIRED",
          "This link has expired. Ask the sender to send a new one"
        );
      }
      throw new PublicInviteError(
        "INVITE_REVOKED",
        "This link was cancelled by the sender"
      );
    }
    throw new PublicInviteError("UNKNOWN_ERROR", "Failed to accept invite.");
  }
}
