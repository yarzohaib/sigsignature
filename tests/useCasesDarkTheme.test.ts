import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe("Use Cases Dark Device Showcase Theme Consistency", () => {
  const rootDir = path.resolve(__dirname, "..");
  const previewPath = path.join(rootDir, "src/components/use-cases/UseCasePreview.tsx");
  const content = fs.readFileSync(previewPath, "utf-8");

  it("ensures isDark is determined by containerVariant === 'dark'", () => {
    assert.ok(
      content.includes('const isDark = containerVariant === "dark";'),
      "isDark should be driven by containerVariant === 'dark'"
    );
  });

  it("ensures Minimal template view conditionally renders dark styling when isDark is true", () => {
    const minimalMatch = content.match(/\{\/\* 1\. MINIMAL TEMPLATE VIEW \*\/\}[\s\S]*?\{\/\* 2\. EXECUTIVE TEMPLATE VIEW \*\/\}/);
    assert.ok(minimalMatch, "Must find Minimal template view in UseCasePreview");

    const minimalSection = minimalMatch[0];
    assert.ok(
      minimalSection.includes('border border-white/20 bg-[#062058] text-white'),
      "Minimal template must use dark container 'border border-white/20 bg-[#062058] text-white' when isDark is true"
    );
    assert.ok(
      minimalSection.includes("isDark ? \"text-white\" : \"text-slate-900\""),
      "Minimal template title must be white in dark mode"
    );
    assert.ok(
      minimalSection.includes("isDark ? \"text-white/90\" : \"text-slate-800\""),
      "Minimal template email must be white/90 in dark mode"
    );
  });

  it("ensures Compact template view conditionally renders dark styling when isDark is true", () => {
    const compactMatch = content.match(/\{\/\* 3\. COMPACT TEMPLATE VIEW \*\/\}[\s\S]*?\{\/\* Segmented Switcher \/ Tabs \*\/\}/);
    assert.ok(compactMatch, "Must find Compact template view in UseCasePreview");

    const compactSection = compactMatch[0];
    assert.ok(
      compactSection.includes('border border-white/20 bg-[#062058] text-white'),
      "Compact template must use dark container 'border border-white/20 bg-[#062058] text-white' when isDark is true"
    );
    assert.ok(
      compactSection.includes("isDark ? \"text-white\" : \"text-slate-900\""),
      "Compact template title must be white in dark mode"
    );
    assert.ok(
      compactSection.includes("isDark ? \"text-white/90\" : \"text-slate-800\""),
      "Compact template email must be white/90 in dark mode"
    );
  });

  it("ensures tab switcher renders active gradient ring across all tabs in dark container", () => {
    assert.ok(
      content.includes('activeStyle === "minimal"\n              ? "bg-gradient-to-r from-[#245FD4] to-[#1E50BA]'),
      "Minimal tab button should have uniform active gradient styling"
    );
    assert.ok(
      content.includes('activeStyle === "compact"\n              ? "bg-gradient-to-r from-[#245FD4] to-[#1E50BA]'),
      "Compact tab button should have uniform active gradient styling"
    );
  });
});
