import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("DashboardSidebar Vertical Responsiveness Suite", () => {
  const sidebarFilePath = path.resolve(
    __dirname,
    "../src/components/dashboard/DashboardSidebar.tsx"
  );
  const globalsCssPath = path.resolve(__dirname, "../src/app/globals.css");

  test("1. DashboardSidebar container includes overflow-y-auto, max-h-screen, and custom scrollbar", () => {
    assert.ok(fs.existsSync(sidebarFilePath), "DashboardSidebar.tsx must exist");
    const content = fs.readFileSync(sidebarFilePath, "utf-8");

    // Must have vertical scrolling capabilities
    assert.ok(
      content.includes("overflow-y-auto"),
      "Sidebar must have overflow-y-auto for vertical scrolling"
    );
    assert.ok(
      content.includes("overflow-x-hidden"),
      "Sidebar must have overflow-x-hidden to prevent horizontal shift"
    );
    assert.ok(
      content.includes("max-h-screen") || content.includes("h-screen"),
      "Sidebar must be bounded by screen height"
    );
    assert.ok(
      content.includes("sidebar-scrollbar"),
      "Sidebar must use custom thin sidebar-scrollbar"
    );
    assert.ok(
      content.includes("shrink-0"),
      "Sidebar container and sections must have shrink-0 to prevent layout distortion"
    );
  });

  test("2. globals.css defines modern, clean .sidebar-scrollbar utility", () => {
    assert.ok(fs.existsSync(globalsCssPath), "globals.css must exist");
    const css = fs.readFileSync(globalsCssPath, "utf-8");

    assert.ok(
      css.includes(".sidebar-scrollbar"),
      "globals.css must define .sidebar-scrollbar"
    );
    assert.ok(
      css.includes("scrollbar-width: thin"),
      "Must define thin scrollbar for Firefox/standards"
    );
    assert.ok(
      css.includes(".sidebar-scrollbar::-webkit-scrollbar"),
      "Must define WebKit scrollbar rules"
    );
  });

  test("3. Free Plan quota card and Unlock Premium card are fully preserved and optimized", () => {
    const content = fs.readFileSync(sidebarFilePath, "utf-8");

    // Verify Free Plan quota card presence
    assert.ok(
      content.includes("Free Plan"),
      "Must contain 'Free Plan' label"
    );
    assert.ok(
      content.includes("{signatureCount} / 3 Signatures"),
      "Must contain signature quota tracker"
    );
    assert.ok(
      content.includes("Upgrade Plan"),
      "Must contain 'Upgrade Plan' CTA link"
    );

    // Verify Premium Features card presence
    assert.ok(
      content.includes("Unlock Premium Features"),
      "Must contain 'Unlock Premium Features' card"
    );
    assert.ok(
      content.includes("Upgrade Now"),
      "Must contain 'Upgrade Now' CTA button"
    );

    // Verify optimized vertical spacing (avoid excessive padding like p-6 / mt-8)
    assert.ok(
      content.includes("mt-auto"),
      "Must use mt-auto to naturally pin cards to the bottom while adapting to smaller heights"
    );
  });
});
