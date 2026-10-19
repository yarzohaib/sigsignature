import fs from "fs";
import path from "path";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { getTemplateRenderer } from "../src/lib/templates/designs/index";
import { mapToValidTemplateFont, validateThemeColor } from "../src/lib/templates/designs/shared";
import { TemplateSignatureData } from "../src/types/template";

interface TestFailure {
  templateId: string;
  permutation: string;
  error: string;
}

const failures: TestFailure[] = [];

function assert(condition: boolean, templateId: string, permutation: string, message: string) {
  if (!condition) {
    failures.push({ templateId, permutation, error: message });
  }
}

// -------------------------------------------------------------
// Baseline fixtures used when generating byte-accurate snapshots
// -------------------------------------------------------------
const baselineDualColumn: TemplateSignatureData = {
  templateId: "professional-minimal",
  fullName: "Daniel Wilson",
  jobTitle: "UX/UI Designer",
  companyName: "Company Name",
  email: "daniel@company.com",
  phone: "+1 (555) 345-6789",
  website: "www.company.com",
  avatarUrl: "/daniel-wilson.png",
  companyLogoUrl: "",
  themeColor: "#245FD4",
  fontFamily: "Inter",
  layout: "two-column",
  socialIconsStyle: "filled",
  socials: {
    linkedin: "https://linkedin.com/in/danielwilson",
    twitter: "https://twitter.com/danielwilson",
    facebook: "https://facebook.com/danielwilson",
  },
  optional: {
    address: "123 Business Ave, New York, NY 10001",
    tagline: "Tagline goes here",
    disclaimer:
      "Confidentiality Notice: This email and any attachments are intended solely for the use of the individual or entity to whom it is addressed.",
  },
};

const baselineCorporate: TemplateSignatureData = {
  templateId: "executive-corporate",
  fullName: "Alexander Morgan",
  jobTitle: "Managing Director & Partner",
  companyName: "Sterling & Co.",
  email: "alexander@sterlingco.com",
  phone: "+1 (555) 234-5678",
  website: "sterlingco.com",
  avatarUrl: "",
  companyLogoUrl: "",
  themeColor: "#DCBB9A",
  fontFamily: "Montserrat",
  layout: "two-column",
  socialIconsStyle: "circle",
  socials: {
    linkedin: "https://linkedin.com/company/sterlingco",
    twitter: "",
    facebook: "",
    instagram: "https://instagram.com/sterlingandco",
  },
  optional: {
    address: "",
    tagline: "EXCELLENCE IN EVERY DETAIL.",
    disclaimer: "Proudly servicing Metropolitan & Regional Areas",
  },
};

console.log("=================================================");
console.log("  EMAIL SIGNATURE TEMPLATE VERIFICATION SUITE   ");
console.log("=================================================\n");

// -------------------------------------------------------------
// 1. BYTE-FOR-BYTE SNAPSHOT VERIFICATION
// -------------------------------------------------------------
console.log("[1/4] Verifying Byte-for-Byte Snapshots for Existing Templates...");

const scriptsDir = path.resolve(__dirname);

function checkSnapshot(filename: string, actualHtml: string, label: string) {
  const filePath = path.join(scriptsDir, filename);
  if (!fs.existsSync(filePath)) {
    failures.push({
      templateId: label,
      permutation: "snapshot",
      error: `Snapshot file not found: ${filename}`,
    });
    return;
  }
  const expectedHtml = fs.readFileSync(filePath, "utf8");
  if (expectedHtml !== actualHtml) {
    failures.push({
      templateId: label,
      permutation: "snapshot",
      error: `Byte mismatch with ${filename} (expected ${expectedHtml.length} bytes, got ${actualHtml.length} bytes)`,
    });
  } else {
    console.log(`  ✓ Snapshot match: ${label} (${actualHtml.length} bytes)`);
  }
}

// Check professional-minimal
checkSnapshot(
  "snapshot_professional-minimal.html",
  generateTemplateHtml(baselineDualColumn),
  "professional-minimal"
);

// Check executive-corporate
checkSnapshot(
  "snapshot_executive-corporate.html",
  generateTemplateHtml(baselineCorporate),
  "executive-corporate"
);

// Check layout fallbacks
checkSnapshot(
  "snapshot_layout_two-column.html",
  generateTemplateHtml({ ...baselineDualColumn, templateId: undefined, layout: "two-column" }),
  "layout: two-column"
);
checkSnapshot(
  "snapshot_layout_horizontal.html",
  generateTemplateHtml({ ...baselineDualColumn, templateId: undefined, layout: "horizontal" }),
  "layout: horizontal"
);
checkSnapshot(
  "snapshot_layout_compact.html",
  generateTemplateHtml({ ...baselineDualColumn, templateId: undefined, layout: "compact" }),
  "layout: compact"
);
checkSnapshot(
  "snapshot_layout_corporate-card.html",
  generateTemplateHtml({ ...baselineCorporate, templateId: undefined, layout: "corporate-card" }),
  "layout: corporate-card"
);

// -------------------------------------------------------------
// 2. EMAIL-SAFE RULE VALIDATOR
// -------------------------------------------------------------
function validateEmailSafeRules(html: string, templateId: string, permutation: string, isNewDesign: boolean) {
  // 1. Must be wrapped in table with presentation role
  assert(
    html.trim().startsWith("<table") && html.trim().endsWith("</table>"),
    templateId,
    permutation,
    "HTML must be enclosed within an outer <table> element"
  );
  assert(
    html.includes('role="presentation"'),
    templateId,
    permutation,
    'Outer table must specify role="presentation"'
  );

  // 2. Width constraint for new designs: outer table max 600px
  if (isNewDesign) {
    assert(
      html.includes("max-width: 600px") || html.includes('width="600"') || html.includes("max-width:600px"),
      templateId,
      permutation,
      "Signature must enforce max-width of 600px"
    );
  }

  // 3. Prohibited tags
  const prohibitedTags = [
    /<script[\s>]/i,
    /<iframe[\s>]/i,
    /<svg[\s>]/i,
    /<form[\s>]/i,
    /<input[\s>]/i,
    /<video[\s>]/i,
    /<audio[\s>]/i,
    /<button[\s>]/i,
    /<canvas[\s>]/i,
  ];
  for (const tagRegex of prohibitedTags) {
    assert(!tagRegex.test(html), templateId, permutation, `HTML contains forbidden tag matching ${tagRegex}`);
  }

  // 4. Prohibited CSS
  assert(!/display:\s*flex/i.test(html), templateId, permutation, "Forbidden CSS: display: flex");
  assert(!/display:\s*grid/i.test(html), templateId, permutation, "Forbidden CSS: display: grid");
  assert(!/position:\s*(fixed|absolute|sticky)/i.test(html), templateId, permutation, "Forbidden CSS: position");
  assert(!/float:\s*(left|right)/i.test(html), templateId, permutation, "Forbidden CSS: float");

  // For new designs, check strict no gradients, no CSS vars, and complete image attributes
  if (isNewDesign) {
    assert(!/linear-gradient/i.test(html), templateId, permutation, "New design contains linear-gradient");
    assert(!/var\(--/i.test(html), templateId, permutation, "New design contains CSS variable var(--)");

    // Image tags safety
    const imgRegex = /<img\b([^>]*)>/gi;
    let match: RegExpExecArray | null;
    while ((match = imgRegex.exec(html)) !== null) {
      const attrs = match[1];
      assert(/alt=/i.test(attrs), templateId, permutation, `<img> missing alt attribute: ${match[0]}`);
      assert(/width=/i.test(attrs), templateId, permutation, `<img> missing width attribute: ${match[0]}`);
      assert(/height=/i.test(attrs), templateId, permutation, `<img> missing height attribute: ${match[0]}`);
      assert(/display:\s*block/i.test(attrs), templateId, permutation, `<img> missing display:block style: ${match[0]}`);
      assert(/border:\s*0/i.test(attrs) || /border="0"/i.test(attrs), templateId, permutation, `<img> missing border:0: ${match[0]}`);
    }
  }

  // 5. Prohibited protocols
  assert(!/data:(image|text|application)/i.test(html), templateId, permutation, "Contains data: URI");
  assert(!/javascript:/i.test(html), templateId, permutation, "Contains javascript: URI");

  // 6. Clean collapsing: no double separators or empty spans
  assert(!/\|\s*\|/.test(html), templateId, permutation, "Contains duplicate pipe separator ||");
  assert(!/&bull;\s*&bull;/.test(html), templateId, permutation, "Contains duplicate bullet separator &bull;&bull;");
  assert(!/<td[^>]*>\s*\|\s*<\/td>/i.test(html), templateId, permutation, "Contains standalone pipe cell <td>|</td>");

  // 7. No empty link tags
  assert(!/<a\b[^>]*>\s*<\/a>/i.test(html), templateId, permutation, "Contains empty <a> tag");
}

// -------------------------------------------------------------
// 3. SEVEN PERMUTATIONS ACROSS ALL 6 TEMPLATES
// -------------------------------------------------------------
console.log(`\n[2/4] Testing 7 Permutations Across All ${AVAILABLE_TEMPLATES.length} Templates...`);

const NEW_DESIGN_IDS = new Set([
  "clean-line",
  "centered-minimal",
  "boardroom-corporate",
  "classic-letterhead",
  "color-block",
  "photo-pop",
  "ribbon",
  "bold-block",
  "big-name",
  "split-banner",
]);

for (const tpl of AVAILABLE_TEMPLATES) {
  const isNew = NEW_DESIGN_IDS.has(tpl.id);
  const base = tpl.defaultData;

  // Permutation 1: Full data
  const p1Data: TemplateSignatureData = {
    ...base,
    avatarUrl: base.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    companyLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    socials: {
      linkedin: "https://linkedin.com/in/testuser",
      twitter: "https://x.com/testuser",
      facebook: "https://facebook.com/testuser",
      instagram: "https://instagram.com/testuser",
    },
    optional: {
      address: "100 Innovation Way, Suite 400, Austin, TX 78701",
      tagline: "Building the future of digital communications",
      disclaimer: "This transmission is confidential and intended solely for the recipient.",
    },
  };
  const p1Html = generateTemplateHtml(p1Data);
  validateEmailSafeRules(p1Html, tpl.id, "p1-full-data", isNew);

  // Permutation 2: No avatar
  const p2Data: TemplateSignatureData = {
    ...p1Data,
    avatarUrl: "",
  };
  const p2Html = generateTemplateHtml(p2Data);
  validateEmailSafeRules(p2Html, tpl.id, "p2-no-avatar", isNew);
  if (tpl.id !== "executive-corporate") {
    // Should not render avatar img
    assert(
      !p2Html.includes("photo-1534528741775"),
      tpl.id,
      "p2-no-avatar",
      "Avatar image URL still found when avatarUrl was empty"
    );
  }

  // Permutation 3: No company logo
  const p3Data: TemplateSignatureData = {
    ...p1Data,
    companyLogoUrl: "",
  };
  const p3Html = generateTemplateHtml(p3Data);
  validateEmailSafeRules(p3Html, tpl.id, "p3-no-logo", isNew);

  // Permutation 4: No socials
  const p4Data: TemplateSignatureData = {
    ...p1Data,
    socials: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
  };
  const p4Html = generateTemplateHtml(p4Data);
  validateEmailSafeRules(p4Html, tpl.id, "p4-no-socials", isNew);
  assert(
    !p4Html.includes("linkedin.com") && !p4Html.includes("facebook.com"),
    tpl.id,
    "p4-no-socials",
    "Social links found when socials dictionary was cleared"
  );

  // Permutation 5: Minimal data (no avatar, no logo, no socials, no optional, no website)
  const p5Data: TemplateSignatureData = {
    ...base,
    avatarUrl: "",
    companyLogoUrl: "",
    website: "",
    socials: {
      linkedin: "",
      twitter: "",
      facebook: "",
    },
    optional: {},
  };
  const p5Html = generateTemplateHtml(p5Data);
  validateEmailSafeRules(p5Html, tpl.id, "p5-minimal-data", isNew);
  // Ensure required fields still appear cleanly
  assert(p5Html.includes(base.fullName), tpl.id, "p5-minimal-data", "Full name missing in minimal data");
  assert(p5Html.includes(base.email), tpl.id, "p5-minimal-data", "Email missing in minimal data");

  // Permutation 6: Very long strings (text wrap & layout stress)
  const p6Data: TemplateSignatureData = {
    ...p1Data,
    fullName: "Dr. Alexander Bartholomew Montgomery-Smith III, PhD, MBA, Esq.",
    jobTitle: "Senior Executive Vice President of Global Strategy, Digital Transformation & International Operations",
    companyName: "International Business Machines & Enterprise Solutions Worldwide Conglomerate Corporation Ltd",
    email: "alexander.bartholomew.montgomery-smith.the.third@very-long-enterprise-domain-name.corp.international",
    phone: "+1 (555) 987-6543 ext. 438928 / Mobile: +1 (555) 876-5432",
    website: "https://corporate-enterprise-solutions-worldwide-headquarters.example.com",
    optional: {
      address: "Suite 9400, Floor 94, The International Financial World Trade Center Tower North, 1000 Financial Boulevard, Manhattan, NY 10048-0001, United States of America",
      tagline: "Empowering next-generation multi-national enterprise connectivity through scalable cloud architecture and rigorous compliance standards.",
      disclaimer: "CONFIDENTIALITY NOTICE AND LEGAL DISCLAIMER: The contents of this electronic mail message and any attachments are intended solely for the addressee(s) and may contain confidential and/or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message or their agent, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message and any attachments. You are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited.",
    },
  };
  const p6Html = generateTemplateHtml(p6Data);
  validateEmailSafeRules(p6Html, tpl.id, "p6-long-strings", isNew);

  // Permutation 7: XSS and injection strings
  const p7Data: TemplateSignatureData = {
    ...base,
    fullName: "<script>alert('pwned')</script> Tom & Jerry",
    jobTitle: 'Director of "Security" & <Hacking> / \'<test>\'',
    companyName: "Acme & Co. <iframe src=x> \"Corp\"",
    email: 'hacker+"test"@domain.com',
    phone: '+1 (555) 000-0000"><img src=x onerror=alert(1)>',
    website: "https://example.com/search?q=1&param=2<script>",
    optional: {
      address: '123 Fake St <style>body{background:red}</style> & "Apt 4"',
      tagline: 'Always <Escaped> & "Protected" by Design',
      disclaimer: '<script>alert("disclaimer")</script> &copy; 2026',
    },
  };
  const p7Html = generateTemplateHtml(p7Data);
  validateEmailSafeRules(p7Html, tpl.id, "p7-xss-injection", isNew);
  assert(!p7Html.includes("<script>"), tpl.id, "p7-xss-injection", "Raw unescaped <script> tag found in output!");
  assert(!p7Html.includes("<iframe"), tpl.id, "p7-xss-injection", "Raw unescaped <iframe tag found in output!");
  assert(!p7Html.includes("<style>"), tpl.id, "p7-xss-injection", "Raw unescaped <style> tag found in output!");
  assert(!/<[a-z0-9]+[^>]+onerror\s*=/i.test(p7Html), tpl.id, "p7-xss-injection", "Raw unescaped onerror handler on HTML element found in output!");
  assert(p7Html.includes("&lt;script&gt;"), tpl.id, "p7-xss-injection", "Expected &lt;script&gt; escaped entity");

  console.log(`  ✓ Template passed all 7 permutations: ${tpl.id} (${tpl.name})`);
}

// -------------------------------------------------------------
// 4. FONT & COLOR RESILIENCE AND FALLBACK DISPATCHING
// -------------------------------------------------------------
console.log("\n[3/4] Testing Font, Color, and Layout Fallbacks...");

// Font mapping test
assert(
  mapToValidTemplateFont("Arimo") === "Arial",
  "font-fallback",
  "font-map",
  "Arimo from Settings must map to Arial"
);
assert(
  mapToValidTemplateFont("Times New Roman") === "Arial",
  "font-fallback",
  "font-map",
  "Times New Roman from Settings must map to Arial"
);
assert(
  mapToValidTemplateFont("Georgia") === "Georgia",
  "font-fallback",
  "font-map",
  "Allowed font Georgia must be preserved"
);
assert(
  mapToValidTemplateFont("NonExistentFont") === "Arial",
  "font-fallback",
  "font-map",
  "Unknown font must map to Arial"
);
assert(
  mapToValidTemplateFont(null) === "Arial",
  "font-fallback",
  "font-map",
  "null font must map to Arial"
);

// Color validation test
assert(
  validateThemeColor("#245FD4") === "#245FD4",
  "color-fallback",
  "color-validate",
  "Valid hex must be accepted"
);
assert(
  validateThemeColor("invalid-color") === "#245FD4",
  "color-fallback",
  "color-validate",
  "Invalid hex must fallback to default"
);

// Fallback layout dispatching
const unknownTemplateRender = getTemplateRenderer("non-existent-template-id", "single");
const fallbackHtml = unknownTemplateRender(baselineDualColumn);
assert(
  fallbackHtml.includes("table") && fallbackHtml.includes(baselineDualColumn.fullName),
  "layout-dispatcher",
  "fallback",
  "Unknown templateId must successfully fallback to layout renderer"
);
console.log("  ✓ Font mapping, color validation, and layout dispatchers verified");

// -------------------------------------------------------------
// 5. SUMMARY AND EXIT
// -------------------------------------------------------------
console.log("\n[4/4] Verification Summary");
console.log("=================================================");
if (failures.length === 0) {
  console.log("✅ ALL TEMPLATE CHECKS PASSED SUCCESSFULLY!");
  console.log(`   Total templates verified: ${AVAILABLE_TEMPLATES.length}`);
  console.log("   Permutations tested per template: 7");
  console.log("   Byte snapshots verified: 6");
  console.log("=================================================\n");
  process.exit(0);
} else {
  console.error(`❌ FAILED: ${failures.length} issue(s) detected:\n`);
  for (const f of failures) {
    console.error(`  - [${f.templateId}] (${f.permutation}): ${f.error}`);
  }
  console.log("=================================================\n");
  process.exit(1);
}
