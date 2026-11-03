import { describe, it } from "node:test";
import assert from "node:assert";
import {
  TEAM_SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  SOCIAL_PLATFORM_EXAMPLES,
  validateSocialUrl,
  teamHasSocialElement,
} from "../src/lib/team/socials";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { renderTeamMemberHtml } from "../src/lib/team/render";
import { generateFreeHtml } from "../src/lib/studio/free/renderFreeHtml";
import { INITIAL_STUDIO_DATA } from "../src/lib/studio/types";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import type { Team, TeamMember } from "@/types/team";
import type { StudioSignatureData } from "@/types/studio";

describe("GitHub Social Link, Icon & Validation System", () => {
  describe("validateSocialUrl for GitHub", () => {
    it("accepts valid GitHub URLs", () => {
      assert.strictEqual(validateSocialUrl("github", "https://github.com/torvalds"), null);
      assert.strictEqual(validateSocialUrl("github", "https://www.github.com/username"), null);
      assert.strictEqual(validateSocialUrl("github", "https://github.com/company/project"), null);
      assert.strictEqual(validateSocialUrl("github", "https://gist.github.com/snippet"), null);
    });

    it("rejects invalid GitHub URLs", () => {
      assert.ok(validateSocialUrl("github", ""));
      assert.ok(validateSocialUrl("github", "torvalds"));
      assert.ok(validateSocialUrl("github", "http//github.com/torvalds"));
      assert.ok(validateSocialUrl("github", "https://gitlab.com/torvalds"));
      assert.ok(validateSocialUrl("github", "https://google.com/torvalds"));
      assert.ok(validateSocialUrl("github", "https://x.com/torvalds"));
    });

    it("registers github in TEAM_SOCIAL_PLATFORMS and label constants", () => {
      assert.ok(TEAM_SOCIAL_PLATFORMS.includes("github"));
      assert.strictEqual(SOCIAL_PLATFORM_LABELS.github, "GitHub");
      assert.strictEqual(SOCIAL_PLATFORM_EXAMPLES.github, "https://github.com/username");
    });
  });

  describe("Templates with GitHub Support", () => {
    const templatesWithSocials = [
      "bold-gradient",
      "corporate-elegant",
      "minimal-clean",
      "pastel-creative",
      "modern-dark",
      "big-name",
      "bold-block",
      "split-banner",
    ];

    for (const tplId of templatesWithSocials) {
      it(`renders github icon for template: ${tplId}`, () => {
        const tpl = AVAILABLE_TEMPLATES.find((t) => t.id === tplId);
        assert.ok(tpl, `Template ${tplId} must exist`);

        const html = generateTemplateHtml(
          {
            ...tpl.defaultData,
            templateId: tplId,
            socials: {
              ...tpl.defaultData.socials,
              github: "https://github.com/sigsignature",
            },
          },
          { preview: true }
        );

        assert.match(
          html,
          /github\.com\/sigsignature/i,
          `Template ${tplId} should render github link in output HTML`
        );
        assert.match(
          html,
          /github/i,
          `Template ${tplId} should render github icon reference`
        );
      });
    }
  });

  describe("Team Signatures GitHub Integration", () => {
    it("renders valid GitHub link and icon in team member signature preview", () => {
      const template = AVAILABLE_TEMPLATES.find((t) => t.id === "bold-gradient")!;
      const team: Team = {
        id: "team-github-1",
        ownerId: "owner-1",
        name: "Dev Team",
        kind: "template",
        templateId: "bold-gradient",
        templateVersion: 1,
        memberLimit: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          ...template.defaultData,
          templateId: "bold-gradient",
          fullName: "Lead Dev",
          email: "lead@acme.com",
        },
        members: [],
      };

      const member: TeamMember = {
        id: "mem-gh-1",
        name: "Linus Torvalds",
        email: "linus@linux.org",
        jobTitle: "Kernel Architect",
        phone: "+1 555 019 2834",
        photoUrl: "",
        socials: [
          { platform: "github", url: "https://github.com/torvalds" },
          { platform: "linkedin", url: "https://linkedin.com/in/linus" },
        ],
        status: "accepted",
        sentAt: null,
        acceptedAt: null,
        tokenExpiresAt: null,
        sendCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const html = renderTeamMemberHtml(team, member, { preview: true });
      assert.match(html, /github\.com\/torvalds/i, "Team preview must contain member's GitHub URL");
      assert.match(html, /github/i, "Team preview must render GitHub icon");
    });

    it("filters out invalid GitHub link in team signatures", () => {
      const template = AVAILABLE_TEMPLATES.find((t) => t.id === "bold-gradient")!;
      const team: Team = {
        id: "team-github-2",
        name: "Dev Team",
        kind: "template",
        templateId: "bold-gradient",
        templateVersion: 1,
        memberLimit: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: {
          ...template.defaultData,
          templateId: "bold-gradient",
        },
        members: [],
      };

      const member: TeamMember = {
        id: "mem-gh-2",
        name: "Dev",
        email: "dev@acme.com",
        jobTitle: "Developer",
        phone: "+1 555 019 2834",
        photoUrl: "",
        socials: [
          { platform: "github", url: "invalid-github-url" },
        ],
        status: "accepted",
        sentAt: null,
        acceptedAt: null,
        tokenExpiresAt: null,
        sendCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const html = renderTeamMemberHtml(team, member, { preview: true });
      assert.strictEqual(
        html.includes("invalid-github-url"),
        false,
        "Invalid GitHub URL must NOT be rendered in HTML"
      );
    });

    it("teamHasSocialElement recognizes github as an active social link", () => {
      const teamWithGhOnly: Team = {
        id: "t-1",
        name: "T",
        kind: "template",
        templateId: "bold-gradient",
        templateVersion: 1,
        memberLimit: 10,
        createdAt: "",
        updatedAt: "",
        data: {
          ...AVAILABLE_TEMPLATES[0].defaultData,
          socials: {
            linkedin: "",
            twitter: "",
            facebook: "",
            instagram: "",
            github: "https://github.com/myteam",
          },
        },
        members: [],
      };

      assert.strictEqual(teamHasSocialElement(teamWithGhOnly), true);
    });
  });

  describe("Design Studio GitHub Integration", () => {
    it("renders GitHub icon when github URL is configured in studio data", async () => {
      const studioData: StudioSignatureData = {
        ...INITIAL_STUDIO_DATA,
        elements: [
          {
            id: "soc-gh",
            type: "social",
            x: 20,
            y: 50,
            w: 120,
            h: 24,
          },
        ],
        socials: {
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
          github: "https://github.com/octocat",
        },
      };

      const html = generateFreeHtml(studioData);
      assert.match(html, /github\.com\/octocat/i, "Design Studio export must include GitHub URL");
      assert.match(html, /github/i, "Design Studio export must include GitHub icon");

      const { generateFreePlainText } = await import("../src/lib/studio/free/renderFreeHtml");
      const plain = generateFreePlainText(studioData);
      assert.match(plain, /GitHub:\s*https:\/\/github\.com\/octocat/i, "Design Studio plain text must include GitHub");
    });
  });
});
