import type { TemplateSignatureData } from "./template";
import type { StudioSignatureData } from "./studio";
import type {
  BackendTeam,
  BackendTeamMember,
  BackendTeamMemberSocial,
  TeamMemberStatus,
} from "@/app/lib/api";
import type { TeamMemberSocial, TeamMemberSocialPlatform } from "@/lib/team/socials";

export type { TeamMemberStatus };
export type { TeamMemberSocial, TeamMemberSocialPlatform };

export interface TeamMember {
  id: string;
  teamId?: string;
  name: string;
  email: string;
  jobTitle: string;
  phone: string;
  photoUrl: string;
  socials: TeamMemberSocial[];
  status: TeamMemberStatus;
  sentAt: string | null;
  acceptedAt: string | null;
  tokenExpiresAt: string | null;
  sendCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TeamData = TemplateSignatureData | StudioSignatureData;

export interface Team {
  id: string;
  ownerId?: string;
  name: string;
  kind: "template" | "studio";
  templateId: string;
  templateVersion: number;
  data: TeamData;
  memberLimit: number;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

/**
 * Parses and normalizes a BackendTeam response into a frontend Team structure.
 */
export function parseBackendTeam(backend: BackendTeam): Team {
  return {
    id: backend.id,
    ownerId: backend.ownerId,
    name: backend.name,
    kind: backend.kind,
    templateId: backend.templateId,
    templateVersion: backend.templateVersion,
    data: (backend.data ?? {}) as TeamData,
    memberLimit: backend.memberLimit,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
    members: (backend.members || []).map((m: BackendTeamMember) => ({
      id: m.id,
      teamId: m.teamId,
      name: m.name,
      email: m.email,
      jobTitle: m.jobTitle || "",
      phone: m.phone || "",
      photoUrl: m.photoUrl || "",
      socials: Array.isArray(m.socials)
        ? m.socials.map((s: BackendTeamMemberSocial) => ({
            platform: s.platform as TeamMemberSocialPlatform,
            url: s.url || "",
          }))
        : [],
      status: m.status || "draft",
      sentAt: m.sentAt || null,
      acceptedAt: m.acceptedAt || null,
      tokenExpiresAt: m.tokenExpiresAt || null,
      sendCount: m.sendCount ?? 0,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    })),
  };
}
