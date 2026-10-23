"use client";

import { useMemo } from "react";
import type { Team, TeamMember } from "@/types/team";
import SignaturePreviewFrame from "@/components/studio/SignaturePreviewFrame";
import { renderTeamMemberHtml } from "@/lib/team/render";

interface TeamMemberThumbnailProps {
  team: Team;
  member: TeamMember;
}

/**
 * Renders the exact, live signature HTML for a team member's signature,
 * scaled dynamically and centered within the standard aspect-[350/174] preview container.
 */
export default function TeamMemberThumbnail({ team, member }: TeamMemberThumbnailProps) {
  const previewHtml = useMemo(
    () => renderTeamMemberHtml(team, member, { preview: true }),
    [team, member]
  );

  return (
    <div className="flex h-full w-full items-center justify-center bg-white p-3 sm:p-4 select-none">
      <div className="w-full flex items-center justify-center">
        <SignaturePreviewFrame
          html={previewHtml}
          aspectRatio="350 / 174"
          fitPadding={0.92}
        />
      </div>
    </div>
  );
}
