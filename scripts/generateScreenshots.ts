import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { AVAILABLE_TEMPLATES } from "../src/lib/templatesData";
import { generateTemplateHtml } from "../src/lib/templates/renderTemplateHtml";
import { TemplateSignatureData } from "../src/types/template";

const artifactDir = "/Users/zohaib/.gemini/antigravity/brain/43efaccf-ce6f-41ad-ba5a-5201f13ceea4";
const tempHtmlDir = path.join(artifactDir, "scratch");
fs.mkdirSync(tempHtmlDir, { recursive: true });

const danielB64 = `data:image/png;base64,${fs.readFileSync("public/daniel-wilson.png").toString("base64")}`;

function fixImages(html: string): string {
  return html.replace(/\/daniel-wilson\.png/g, danielB64);
}

// 1. Generate Gallery 9 Cards HTML
const galleryCardsHtml = AVAILABLE_TEMPLATES.map((tpl) => {
  const isDefault = tpl.id === "professional-minimal";
  const previewHtml = fixImages(generateTemplateHtml(tpl.defaultData));
  return `
    <div style="background:#ffffff; border:1px solid #EEF0F4; border-radius:14px; overflow:hidden; box-shadow:0 1px 3px rgba(16,24,40,0.04); display:flex; flex-direction:column; justify-content:space-between;">
      <div style="background:#F8FAFC; padding:16px; min-height:190px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #EEF0F4; overflow:hidden;">
        <div style="transform:scale(0.85); transform-origin:center; width:100%; display:flex; justify-content:center;">
          ${previewHtml}
        </div>
      </div>
      <div style="padding:12px 16px; display:flex; align-items:center; justify-content:space-between; background:#ffffff;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700; color:#1E293B;">${tpl.name}</span>
          <span style="background:#EFF6FF; color:#245FD4; font-size:10px; font-weight:600; padding:2px 8px; border-radius:9999px;">${tpl.category}</span>
          ${isDefault ? `<span style="background:#022977; color:#ffffff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:9999px;">Default</span>` : ""}
        </div>
        <div style="color:#94A3B8; font-size:12px; font-weight:600;">Use Template &rarr;</div>
      </div>
    </div>
  `;
}).join("\n");

const galleryPageHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Gallery 9 Templates</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Commissioner:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: 'Commissioner', -apple-system, sans-serif; background: #F8FAFC; color: #1E293B; padding: 32px 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .title { font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: #1E293B; }
    .subtitle { font-size: 14px; color: #64748B; margin-top: 4px; }
    .btn-scratch { background: #ffffff; border: 1px solid #CBD5E1; color: #022977; padding: 10px 18px; border-radius: 12px; font-weight: 600; font-size: 13px; }
    .filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .pills { display: flex; gap: 8px; }
    .pill { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid #E2E8F0; background: #ffffff; color: #64748B; }
    .pill.active { background: #245FD4; color: #ffffff; border-color: #245FD4; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">Choose a Template.</h1>
      <p class="subtitle">Pick a template to get started. You can customize everything.</p>
    </div>
    <div class="btn-scratch">Build From Scratch</div>
  </div>
  <div class="filters">
    <div class="pills">
      <div class="pill active">All (9)</div>
      <div class="pill">Minimal (3)</div>
      <div class="pill">Corporate (3)</div>
      <div class="pill">Creative (3)</div>
    </div>
    <div style="font-size: 12px; color: #64748B; font-weight: 600; background:#fff; border:1px solid #E2E8F0; padding:6px 12px; border-radius:8px;">Sort by: Most Popular</div>
  </div>
  <div class="grid">
    ${galleryCardsHtml}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(tempHtmlDir, "gallery_9_cards.html"), galleryPageHtml, "utf8");

// Helper for single design full vs minimal
function generateDesignPage(title: string, subtitle: string, html: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Commissioner:wght@400;500;600&family=Trebuchet+MS&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: 'Commissioner', -apple-system, sans-serif; background: #F1F5F9; color: #1E293B; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(16, 24, 40, 0.05); width: 680px; }
    .header { margin-bottom: 20px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
    .title { font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700; color: #022977; }
    .subtitle { font-size: 12px; color: #64748B; margin-top: 4px; }
    .preview { background: #ffffff; border: 1px dashed #CBD5E1; border-radius: 10px; padding: 24px; display: flex; justify-content: flex-start; }
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

// 2. Color Block
const colorBlockTpl = AVAILABLE_TEMPLATES.find((t) => t.id === "color-block")!;
const colorBlockFullHtml = generateTemplateHtml(colorBlockTpl.defaultData);
const colorBlockMinData: TemplateSignatureData = {
  ...colorBlockTpl.defaultData,
  avatarUrl: "",
  companyLogoUrl: "",
  socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
};
const colorBlockMinHtml = generateTemplateHtml(colorBlockMinData);

fs.writeFileSync(
  path.join(tempHtmlDir, "color_block_full.html"),
  generateDesignPage("Color Block (Full Data)", "Solid 10px accent bar, 80px rounded portrait, filled title pill, contact badges & socials", colorBlockFullHtml),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "color_block_minimal.html"),
  generateDesignPage("Color Block (No Photo, No Logo, No Socials)", "Clean collapse: avatar column removed, layout remains balanced and aligned", colorBlockMinHtml),
  "utf8"
);

// 3. Photo Pop
const photoPopTpl = AVAILABLE_TEMPLATES.find((t) => t.id === "photo-pop")!;
const photoPopFullHtml = generateTemplateHtml(photoPopTpl.defaultData);
const photoPopMinData: TemplateSignatureData = {
  ...photoPopTpl.defaultData,
  avatarUrl: "",
  companyLogoUrl: "",
  socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
};
const photoPopMinHtml = generateTemplateHtml(photoPopMinData);

fs.writeFileSync(
  path.join(tempHtmlDir, "photo_pop_full.html"),
  generateDesignPage("Photo Pop (Full Data)", "96px portrait with 4px accent ring, quote tagline, 2-line contact, circle socials & dotted divider", photoPopFullHtml),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "photo_pop_minimal.html"),
  generateDesignPage("Photo Pop (No Photo, No Logo, No Socials)", "Clean collapse: photo ring collapses, name and details shift left seamlessly", photoPopMinHtml),
  "utf8"
);

// 4. Ribbon
const ribbonTpl = AVAILABLE_TEMPLATES.find((t) => t.id === "ribbon")!;
const ribbonFullHtml = generateTemplateHtml(ribbonTpl.defaultData);
const ribbonMinData: TemplateSignatureData = {
  ...ribbonTpl.defaultData,
  avatarUrl: "",
  companyLogoUrl: "",
  socials: { linkedin: "", twitter: "", facebook: "", instagram: "" },
};
const ribbonMinHtml = generateTemplateHtml(ribbonMinData);

fs.writeFileSync(
  path.join(tempHtmlDir, "ribbon_full.html"),
  generateDesignPage("Ribbon (Full Data)", "Full-width teal top ribbon with white text, contact on left, 72px photo on right, outline icons", ribbonFullHtml),
  "utf8"
);
fs.writeFileSync(
  path.join(tempHtmlDir, "ribbon_minimal.html"),
  generateDesignPage("Ribbon (No Photo, No Logo, No Socials)", "Clean collapse: photo cell omitted, ribbon and contact details stay perfectly structured", ribbonMinHtml),
  "utf8"
);

console.log("HTML preview files generated successfully!");
