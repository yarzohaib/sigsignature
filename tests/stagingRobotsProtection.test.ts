import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import robots from "../src/app/robots";

describe("Staging & Production Robots Protection", () => {
  it("blocks all crawling when APP_ENV=staging or VERCEL_ENV=preview", async () => {
    const originalAppEnv = process.env.APP_ENV;
    process.env.APP_ENV = "staging";

    try {
      const res = await robots();
      assert.deepEqual(res.rules, {
        userAgent: "*",
        disallow: "/",
      });
      assert.equal(res.sitemap, undefined, "staging robots must not expose production sitemap");
    } finally {
      process.env.APP_ENV = originalAppEnv;
    }
  });

  it("blocks all crawling when NEXT_PUBLIC_PRE_LAUNCH=true", async () => {
    const originalPreLaunch = process.env.NEXT_PUBLIC_PRE_LAUNCH;
    process.env.NEXT_PUBLIC_PRE_LAUNCH = "true";

    try {
      const res = await robots();
      assert.deepEqual(res.rules, {
        userAgent: "*",
        disallow: "/",
      });
    } finally {
      process.env.NEXT_PUBLIC_PRE_LAUNCH = originalPreLaunch;
    }
  });

  it("serves production rules and sitemap when not on staging", async () => {
    const originalPreLaunch = process.env.NEXT_PUBLIC_PRE_LAUNCH;
    const originalAppEnv = process.env.APP_ENV;
    const originalVercelEnv = process.env.VERCEL_ENV;

    delete process.env.NEXT_PUBLIC_PRE_LAUNCH;
    delete process.env.APP_ENV;
    delete process.env.VERCEL_ENV;

    try {
      const res = await robots();
      assert.ok(Array.isArray(res.rules), "production rules should be an array of agent rules");
      assert.equal(res.sitemap, "https://www.sigsignature.com/sitemap.xml");
    } finally {
      process.env.NEXT_PUBLIC_PRE_LAUNCH = originalPreLaunch;
      process.env.APP_ENV = originalAppEnv;
      process.env.VERCEL_ENV = originalVercelEnv;
    }
  });
});
