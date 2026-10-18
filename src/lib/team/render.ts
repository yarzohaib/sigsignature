import type { Team, TeamMember } from "@/types/team";
import { applyMemberToSignature } from "./applyMember";
import {
  renderSavedSignatureHtml,
  renderSavedSignaturePlainText,
} from "@/lib/signatures/render";

/**
 * Renders the HTML markup for a team member's signature.
 */
export function renderTeamMemberHtml(
  team: Team,
  member: TeamMember,
  options?: { preview?: boolean }
): string {
  const savedSig = applyMemberToSignature(team, member);
  return renderSavedSignatureHtml(savedSig, options);
}

/**
 * Renders the plain text version of a team member's signature.
 */
export function renderTeamMemberPlainText(
  team: Team,
  member: TeamMember
): string {
  const savedSig = applyMemberToSignature(team, member);
  return renderSavedSignaturePlainText(savedSig);
}
