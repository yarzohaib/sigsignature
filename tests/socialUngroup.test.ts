import { test } from "node:test";
import assert from "node:assert/strict";
import { studioReducer, StudioSignatureData } from "../src/lib/studio/types";
import { FreeSocialElement } from "../src/types/studio";
import { generateFreeHtml, generateFreePlainText } from "../src/lib/studio/free/renderFreeHtml";

test("Design Studio Ungroup Social Icons Feature", async (t) => {
  const baseState: StudioSignatureData = {
    fullName: "Alex Rivera",
    jobTitle: "Design Director",
    companyName: "Acme Corp",
    email: "alex@acme.com",
    phone: "+1 555 123 4567",
    website: "https://acme.com",
    avatarUrl: "",
    themeColor: "#245FD4",
    fontFamily: "Inter",
    layout: "single",
    socialIconsStyle: "filled",
    socials: {
      linkedin: "https://linkedin.com/in/alex",
      twitter: "https://x.com/alex",
      facebook: "https://facebook.com/alex",
    },
    optional: {},
    canvas: { width: 600, height: 200 },
    elements: [
      {
        id: "el_social_group",
        type: "social",
        x: 40,
        y: 120,
        w: 140,
        h: 24,
        locked: false,
      },
    ],
  };

  await t.test("studioReducer UNGROUP_SOCIAL_ELEMENT splits social element into individual icons", () => {
    const nextState = studioReducer(baseState, {
      type: "UNGROUP_SOCIAL_ELEMENT",
      payload: { id: "el_social_group" },
    });

    const socialElements = nextState.elements?.filter((el) => el.type === "social") as FreeSocialElement[];
    // Active networks in baseState are 3 (linkedin, twitter, facebook)
    assert.strictEqual(socialElements.length, 3);
    assert.strictEqual(socialElements[0].platform, "linkedin");
    assert.strictEqual(socialElements[1].platform, "twitter");
    assert.strictEqual(socialElements[2].platform, "facebook");

    // All should be standalone elements with distinct x positions
    assert.strictEqual(socialElements[0].x, 40);
    assert(socialElements[1].x > socialElements[0].x);
    assert(socialElements[2].x > socialElements[1].x);
  });

  await t.test("renderFreeHtml generates valid HTML tables for ungrouped individual social icons", () => {
    const ungroupedState: StudioSignatureData = {
      ...baseState,
      elements: [
        {
          id: "soc_linkedin",
          type: "social",
          platform: "linkedin",
          x: 40,
          y: 120,
          w: 24,
          h: 24,
          locked: false,
        },
        {
          id: "soc_twitter",
          type: "social",
          platform: "twitter",
          x: 80,
          y: 120,
          w: 18,
          h: 18,
          locked: false,
        },
      ],
    };

    const html = generateFreeHtml(ungroupedState);
    assert(html.includes("linkedin.com/in/alex"));
    assert(html.includes("x.com/alex"));
    // Inspect rendered icon dimensions
    assert(html.includes('width="24" height="24"'));
    assert(html.includes('width="18" height="18"'));

    const text = generateFreePlainText(ungroupedState);
    assert(text.includes("Linkedin: https://linkedin.com/in/alex"));
    assert(text.includes("Twitter: https://x.com/alex"));
  });
});
