import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { updateConsentMode, pushDataLayerEvent } from "../src/lib/analytics/events";

describe("Google Analytics 4 & Google Tag Integration", () => {
  const rootDir = path.resolve(__dirname, "..");

  it("verifies .env.local contains active Google Tag and Measurement IDs", () => {
    const envLocalPath = path.join(rootDir, ".env.local");
    const content = fs.readFileSync(envLocalPath, "utf-8");

    assert.ok(
      content.includes("NEXT_PUBLIC_GA_ID=G-MZM2JLRVWY"),
      ".env.local should define NEXT_PUBLIC_GA_ID=G-MZM2JLRVWY"
    );
    assert.ok(
      content.includes("NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5515MKG8NL"),
      ".env.local should define NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5515MKG8NL"
    );
  });

  it("verifies GoogleAnalytics component defaults to G-MZM2JLRVWY and G-5515MKG8NL fallbacks", () => {
    const gaComponentPath = path.join(rootDir, "src/components/analytics/GoogleAnalytics.tsx");
    const content = fs.readFileSync(gaComponentPath, "utf-8");

    assert.ok(
      content.includes('gaId = process.env.NEXT_PUBLIC_GA_ID || "G-MZM2JLRVWY"'),
      "GoogleAnalytics should have default fallback for Google Tag ID G-MZM2JLRVWY"
    );
    assert.ok(
      content.includes('measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-5515MKG8NL"'),
      "GoogleAnalytics should have default fallback for Measurement Stream G-5515MKG8NL"
    );
    assert.ok(
      content.includes("gtag('config', '${gaId}')"),
      "GoogleAnalytics should configure gaId in gtag config"
    );
    assert.ok(
      content.includes("gtag('config', '${measurementId}')"),
      "GoogleAnalytics should configure measurementId in gtag config"
    );
  });

  it("verifies Google Consent Mode v2 default declaration is present", () => {
    const gaComponentPath = path.join(rootDir, "src/components/analytics/GoogleAnalytics.tsx");
    const content = fs.readFileSync(gaComponentPath, "utf-8");

    assert.ok(
      content.includes("'analytics_storage': 'denied'"),
      "Consent mode v2 should default analytics_storage to denied"
    );
    assert.ok(
      content.includes("'ad_storage': 'denied'"),
      "Consent mode v2 should default ad_storage to denied"
    );
    assert.ok(
      content.includes("'wait_for_update': 500"),
      "Consent mode v2 should specify wait_for_update"
    );
  });

  it("updates consent mode dynamically via events helper", () => {
    let consentCallArgs: unknown[] | null = null;
    (global as unknown as { window: { dataLayer: unknown[]; gtag: (...args: unknown[]) => void } }).window = {
      dataLayer: [],
      gtag: (...args: unknown[]) => {
        consentCallArgs = args;
      },
    };

    updateConsentMode(true);
    assert.strictEqual(consentCallArgs?.[0], "consent");
    assert.strictEqual(consentCallArgs?.[1], "update");
    assert.deepStrictEqual(consentCallArgs?.[2], {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });

    updateConsentMode(false);
    assert.deepStrictEqual(consentCallArgs?.[2], {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  });
});
