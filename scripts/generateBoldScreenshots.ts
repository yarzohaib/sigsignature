import fs from "fs";
import path from "path";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { TemplateItem } from "../src/types/template";

const artifactDir = "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4";
const tempHtmlDir = path.join(artifactDir, "scratch");
fs.mkdirSync(tempHtmlDir, { recursive: true });

const danielB64 = `data:image/png;base64,${fs.readFileSync("public/daniel-wilson.png").toString("base64")}`;
const logoB64 = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="90" height="30" viewBox="0 0 90 30"><rect width="90" height="30" rx="6" fill="#111827"/><text x="45" y="20" fill="#38BDF8" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">VANCE</text></svg>').toString("base64")}`;

function fixImages(html: string): string {
  return html.replace(/\/daniel-wilson\.png/g, danielB64);
}

function makeIframeSrcDoc(html: string): string {
  const doc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:wght@400;500;600;700;800&family=Commissioner:wght@400;500;600;700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Georgia&display=swap" rel="stylesheet">
  <style>
    html, body {
      margin: 0; padding: 0; background: transparent; overflow: hidden;
      width: max-content; height: max-content;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    #sig-root { display: inline-block; margin: 0; padding: 0; width: max-content; }
    img { border: 0; display: block; }
  </style>
</head>
<body>
  <div id="sig-root">
    ${fixImages(html)}
  </div>
</body>
</html>`;
  return doc.replace(/"/g, "&quot;");
}

function renderGalleryCard(tpl: TemplateItem): string {
  const isDefault = tpl.id === "professional-minimal";
  const previewHtml = generateTemplateHtml(tpl.defaultData);

  let badgeColor = "bg-[#EFF6FF] text-[#245FD4]";
  if (tpl.category === "Corporate") badgeColor = "bg-slate-100 text-slate-700";
  else if (tpl.category === "Creative") badgeColor = "bg-purple-50 text-purple-700";
  else if (tpl.category === "Bold") badgeColor = "bg-rose-50 text-rose-700 font-bold";

  return `
    <div style="background:#ffffff; border:1px solid #EEF0F4; border-radius:14px; overflow:hidden; box-shadow:0 1px 3px rgba(16,24,40,0.04); display:flex; flex-direction:column; justify-content:space-between;">
      <div style="background:#F8FAFC; padding:12px; min-height:190px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #EEF0F4; position:relative; overflow:hidden;">
        <div style="position:relative; width:100%; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; overflow:hidden;">
          <iframe
            srcdoc="${makeIframeSrcDoc(previewHtml)}"
            style="border:0; position:absolute; width:560px; height:200px; left:50%; top:50%; transform:translate(-50%, -50%) scale(0.62); transform-origin:center center; pointer-events:none;"
            title="${tpl.name} Preview"
          ></iframe>
        </div>
      </div>
      <div style="padding:14px 16px; display:flex; align-items:center; justify-content:space-between; background:#ffffff;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-family:'Montserrat',sans-serif; font-size:14px; font-weight:700; color:#1E293B;">${tpl.name}</span>
          <span class="${badgeColor}" style="font-size:10px; font-weight:600; padding:2px 8px; border-radius:9999px;">${tpl.category}</span>
          ${isDefault ? `<span style="background:#022977; color:#ffffff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:9999px;">Default</span>` : ""}
          ${tpl.isPopular && !isDefault ? `<span style="background:#FEF3C7; color:#D97706; font-size:10px; font-weight:700; padding:2px 8px; border-radius:9999px;">Popular</span>` : ""}
        </div>
        <div style="color:#245FD4; font-size:12px; font-weight:600;">Use Template &rarr;</div>
      </div>
    </div>
  `;
}

function buildGalleryPageHtml(activeCategory: string, templates: TemplateItem[]): string {
  const cardsHtml = templates.map(renderGalleryCard).join("\n");

  const categories = [
    { id: "All", label: "All (12)" },
    { id: "Minimal", label: "Minimal (3)" },
    { id: "Corporate", label: "Corporate (3)" },
    { id: "Creative", label: "Creative (3)" },
    { id: "Bold", label: "Bold (3)" },
  ];

  const pillsHtml = categories.map((cat) => {
    const isActive = cat.id === activeCategory;
    const style = isActive
      ? "background:#245FD4; color:#ffffff; border-color:#245FD4; font-weight:700;"
      : "background:#ffffff; color:#64748B; border:1px solid #E2E8F0; font-weight:600;";
    return `<div style="padding:7px 16px; border-radius:10px; font-size:13px; cursor:pointer; ${style}">${cat.label}</div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Templates Gallery - ${activeCategory}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Commissioner:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: 'Commissioner', -apple-system, sans-serif; background: #F8FAFC; color: #1E293B; padding: 36px 48px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .title { font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 700; color: #1E293B; }
    .subtitle { font-size: 14px; color: #64748B; margin-top: 4px; }
    .btn-scratch { background: #ffffff; border: 1px solid #CBD5E1; color: #022977; padding: 10px 18px; border-radius: 12px; font-weight: 600; font-size: 13px; }
    .filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .pills { display: flex; gap: 10px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">Choose a Template</h1>
      <p class="subtitle">Pick a signature template to customize. 12 handcrafted email-safe layouts.</p>
    </div>
    <div class="btn-scratch">Build From Scratch &rarr;</div>
  </div>
  <div class="filters">
    <div class="pills">
      ${pillsHtml}
    </div>
    <div style="font-size: 13px; color: #64748B; font-weight: 600; background:#fff; border:1px solid #E2E8F0; padding:7px 14px; border-radius:10px;">Sort: Most Popular</div>
  </div>
  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>`;
}

// 1. Full Gallery (12 cards)
fs.writeFileSync(
  path.join(tempHtmlDir, "gallery_12_cards.html"),
  buildGalleryPageHtml("All", AVAILABLE_TEMPLATES),
  "utf8"
);

// 2. Filtered Galleries (3 cards each)
const minimalTemplates = AVAILABLE_TEMPLATES.filter((t) => t.category === "Minimal");
const corporateTemplates = AVAILABLE_TEMPLATES.filter((t) => t.category === "Corporate");
const creativeTemplates = AVAILABLE_TEMPLATES.filter((t) => t.category === "Creative");
const boldTemplates = AVAILABLE_TEMPLATES.filter((t) => t.category === "Bold");

fs.writeFileSync(
  path.join(tempHtmlDir, "gallery_category_minimal.html"),
  buildGalleryPageHtml("Minimal", minimalTemplates),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "gallery_category_corporate.html"),
  buildGalleryPageHtml("Corporate", corporateTemplates),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "gallery_category_creative.html"),
  buildGalleryPageHtml("Creative", creativeTemplates),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "gallery_category_bold.html"),
  buildGalleryPageHtml("Bold", boldTemplates),
  "utf8"
);

// 3. Single Design Detail Pages (Full Data vs Minimal Collapsed)
function generateDesignPage(title: string, subtitle: string, html: string, bg = "#F1F5F9"): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Commissioner:wght@400;500;600;700&family=DM+Sans:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: 'Commissioner', -apple-system, sans-serif; background: ${bg}; color: #1E293B; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(16, 24, 40, 0.05); width: 680px; }
    .header { margin-bottom: 20px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
    .title { font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700; color: #022977; }
    .subtitle { font-size: 12px; color: #64748B; margin-top: 4px; }
    .preview { background: #ffffff; border: 1px dashed #CBD5E1; border-radius: 10px; padding: 20px; display: flex; justify-content: flex-start; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
    </div>
    <div class="preview">
      ${fixImages(html)}
    </div>
  </div>
</body>
</html>`;
}

// a) Bold Block
const boldBlockTpl = AVAILABLE_TEMPLATES.find((t) => t.id === "bold-block")!;
const boldBlockFullHtml = generateTemplateHtml({
  ...boldBlockTpl.defaultData,
  companyLogoUrl: logoB64,
});
const boldBlockMinHtml = generateTemplateHtml({
  ...boldBlockTpl.defaultData,
  avatarUrl: "",
  companyLogoUrl: "",
  socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
  optional: {},
});

fs.writeFileSync(
  path.join(tempHtmlDir, "bold_block_full.html"),
  generateDesignPage("Bold Block (Full Data)", "High-contrast dark panel (#111827), uppercase 22px extra-bold name, sky blue accents, 84px square portrait", boldBlockFullHtml),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "bold_block_minimal.html"),
  generateDesignPage("Bold Block (No Photo, No Logo, No Socials)", "Clean collapse: square photo column omitted, contact and typography adjust cleanly with full width", boldBlockMinHtml),
  "utf8"
);

// b) Big Name
const bigNameTpl = AVAILABLE_TEMPLATES.find((t) => t.id === "big-name")!;
// Full case includes optional small round photo and logo
const bigNameFullHtml = generateTemplateHtml({
  ...bigNameTpl.defaultData,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  companyLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
});
// Minimal case: default has no photo, no logo, no socials
const bigNameMinHtml = generateTemplateHtml({
  ...bigNameTpl.defaultData,
  avatarUrl: "",
  companyLogoUrl: "",
  socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
  optional: {},
});

fs.writeFileSync(
  path.join(tempHtmlDir, "big_name_full.html"),
  generateDesignPage("Big Name (Full Data with Optional Photo)", "6px top rose accent bar, 28px bold uppercase name, solid title highlight, 64px round photo, 3px company underline", bigNameFullHtml),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "big_name_minimal.html"),
  generateDesignPage("Big Name (No Photo, No Logo, No Socials)", "Default sample case: right photo collapses seamlessly, bold name and contact expand cleanly", bigNameMinHtml),
  "utf8"
);

// c) Split Banner
const splitBannerTpl = AVAILABLE_TEMPLATES.find((t) => t.id === "split-banner")!;
const splitBannerFullHtml = generateTemplateHtml({
  ...splitBannerTpl.defaultData,
  companyLogoUrl: logoB64,
});
const splitBannerMinHtml = generateTemplateHtml({
  ...splitBannerTpl.defaultData,
  avatarUrl: "",
  companyLogoUrl: "",
  socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
  optional: {},
});

fs.writeFileSync(
  path.join(tempHtmlDir, "split_banner_full.html"),
  generateDesignPage("Split Banner (Full Data with Photo)", "Solid accent column (#FACC15) with 80px photo, 3px dark line separator, crisp white info cell", splitBannerFullHtml),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "split_banner_minimal.html"),
  generateDesignPage("Split Banner (No Photo, No Logo, No Socials)", "Company monogram fallback with auto-contrast luminance calculation (#111827 text on yellow)", splitBannerMinHtml),
  "utf8"
);

console.log("HTML preview files generated successfully!");
