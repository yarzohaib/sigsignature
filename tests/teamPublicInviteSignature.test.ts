import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { applyMemberToSignature } from "../src/lib/team/applyMember";
import { renderTeamMemberHtml, renderTeamMemberPlainText } from "../src/lib/team/render";
import type { Team, TeamMember } from "../src/types/team";
import { INITIAL_STUDIO_DATA } from "../src/lib/studio/types";

describe("Team Public Invite Signature & Unmasked Email", () => {
  const mockTeam: Team = {
    id: "team-test",
    name: "My Signature Team",
    kind: "studio",
    templateId: "design-studio",
    templateVersion: 1,
    data: {
      ...INITIAL_STUDIO_DATA,
      canvas: { width: 600, height: 250 },
      elements: [
        {
          id: "el-name",
          type: "text",
          x: 200,
          y: 50,
          w: 150,
          h: 24,
          text: "Owner Name",
          bind: "name",
          size: "md",
          bold: true,
          align: "left",
        },
        {
          id: "el-email",
          type: "text",
          x: 200,
          y: 80,
          w: 200,
          h: 20,
          text: "owner@company.com",
          bind: "email",
          size: "sm",
          bold: false,
          align: "left",
        },
      ],
    },
    memberLimit: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [],
  };

  test("applyMemberToSignature substitutes teammate's full unmasked email into bound studio element", () => {
    const member: TeamMember = {
      id: "mem-1",
      name: "maryam",
      email: "maruim1677@gmail.com",
      jobTitle: "hr",
      phone: "+1234567890",
      photoUrl: "",
      socials: [],
      status: "sent",
      tokenExpiresAt: null,
      sentAt: null,
      acceptedAt: null,
      sendCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedSig = applyMemberToSignature(mockTeam, member);
    const studioData = savedSig.data as any;
    const emailEl = studioData.elements.find((el: any) => el.bind === "email");

    assert.ok(emailEl);
    assert.equal(emailEl.text, "maruim1677@gmail.com");
    assert.notEqual(emailEl.text, "m***@gmail.com");
  });

  test("renderTeamMemberHtml and renderTeamMemberPlainText render full email and not masked email", () => {
    const member: TeamMember = {
      id: "mem-1",
      name: "maryam",
      email: "maruim1677@gmail.com",
      jobTitle: "hr",
      phone: "+1234567890",
      photoUrl: "",
      socials: [],
      status: "sent",
      tokenExpiresAt: null,
      sentAt: null,
      acceptedAt: null,
      sendCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const html = renderTeamMemberHtml(mockTeam, member, { preview: false });
    assert.ok(html.includes("maruim1677@gmail.com"));
    assert.ok(html.includes("mailto:maruim1677@gmail.com"));
    assert.equal(html.includes("m***@gmail.com"), false);

    const plainText = renderTeamMemberPlainText(mockTeam, member);
    assert.ok(plainText.includes("maruim1677@gmail.com"));
    assert.equal(plainText.includes("m***@gmail.com"), false);
  });
});
