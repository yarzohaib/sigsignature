# Email Signature Template Designs & Safe Rules

This directory contains individual design renderers for SigSignature email templates. Every design exports a `render(data: TemplateSignatureData): string` function and registers in `index.ts`.

---

## 1. Email Safe HTML/CSS Rules

Email clients (Outlook for Windows, Gmail web & mobile, Apple Mail, Yahoo, Thunderbird) use divergent rendering engines, ranging from Word HTML to modern WebKit. To ensure bulletproof cross-client fidelity, every design in this directory **must strictly adhere** to the following rules:

### Layout & Structure
1. **Tables Only**: Use nested HTML `<table>` elements exclusively for alignment, spacing, and grids. Never use `<div>` tags as grid columns.
2. **Presentation Role**: Every table must declare `role="presentation"` and `cellpadding="0" cellspacing="0" border="0"`.
3. **No Modern Layout Properties**: Absolutely no `display: flex`, `display: grid`, `position: absolute / fixed / relative / sticky`, or `float: left / right`.
4. **Max Width 600px**: The outermost container table must declare `max-width: 600px` (or a fixed width $\le 600\text{px}$) to prevent horizontal overflowing across mobile and desktop clients.
5. **Inline Styles Only**: Every styling declaration must be inline via the `style="..."` attribute. Never use `<style>` blocks, CSS classes, CSS variables (`var(--...)`), or `@import` web fonts.
6. **Dual Background Color Attributes**: For background colors, always set the HTML attribute `bgcolor="..."` alongside inline `style="background-color: ...;"` for Outlook compatibility.
7. **Graceful Border-Radius Degradation**: `border-radius` is permitted on images or tiles, but designs must maintain full structural alignment and visual polish if border-radius is stripped by Outlook.

### Typography & Colors
8. **Allowed Email-Safe Fonts**: The font family must be chosen from the backend-whitelisted font list:
   `Arial`, `Georgia`, `Verdana`, `Trebuchet MS`, `Tahoma`, `Inter`, `Roboto`, `DM Sans`, `Montserrat`, `Commissioner`.
9. **Theme Accent Color**: Every design must use `data.themeColor` as its visual accent (rules, highlights, labels, badges) so custom brand colors and Settings defaults propagate cleanly.
10. **Explicit Text & Background Colors**: Always set explicit text colors (e.g. `#1E293B`, `#64748B`) and background colors to prevent automatic client inversion bugs in Dark Mode.
11. **Text Sanitization & Escaping**: All user-provided strings must be escaped through `escapeHtml()` before insertion into markup to eliminate XSS risks and broken HTML entities.

### Images & Assets
12. **Images**:
    - Absolute `https://` URLs only (or relative sample assets like `/daniel-wilson.png` for local previews). No `data:` URLs, no SVGs, no local file references.
    - Explicit `width="..."` and `height="..."` attributes on every `<img>`.
    - `display: block; border: 0; outline: none; text-decoration: none;` on all image tags.
    - Descriptive `alt` text attribute present on every image.

### Links & Interactivity
13. **Safe Protocols**: Only `https://`, `mailto:`, and `tel:` URLs are permitted. No `javascript:` or inline script handlers (`onclick`, etc.).
14. **Collapsible Optional Fields**:
    - Optional fields (`avatarUrl`, `companyLogoUrl`, `socials`, `address`, `tagline`, `disclaimer`, `phone`, `website`) must collapse cleanly when missing.
    - No empty gaps, stray pipe/bullet separators, blank table cells, or broken image icons when fields are empty.

### Data Contract & Required Fields
15. **Required Fields**: Every template must render `fullName`, `jobTitle`, `companyName`, `email`, and `phone`.
16. **Optional Fields**: `website`, `avatarUrl`, `companyLogoUrl`, `socials`, `address`, `tagline`, `disclaimer`. No template design may introduce new or arbitrary fields outside `TemplateSignatureData`.

---

## 2. Architecture & File Structure

```
src/lib/templates/designs/
├── index.ts               # Central template registry & layout fallback dispatcher
├── shared.ts              # Shared sanitizers, URL helpers, contact row builders, font validators
├── professionalMinimal.ts # Two-column standard layout (professional-minimal)
├── executiveCorporate.ts  # Executive corporate card layout (executive-corporate)
├── cleanLine.ts           # Clean Line design (clean-line)
├── centeredMinimal.ts     # Centered Minimal design (centered-minimal)
├── boardroomCorporate.ts  # Boardroom design (boardroom-corporate)
├── classicLetterhead.ts   # Classic Letterhead design (classic-letterhead)
├── twoColumn.ts           # Legacy two-column renderer
├── horizontal.ts          # Legacy horizontal renderer
├── compact.ts             # Legacy compact renderer
├── single.ts              # Legacy single-column renderer
└── README.md              # Design rules and documentation (this file)
```

---

## 3. Adding a New Template Design

1. Create `src/lib/templates/designs/myDesign.ts` exporting `render(data: TemplateSignatureData): string`.
2. Register the design in `src/lib/templates/designs/index.ts` under `TEMPLATE_REGISTRY`.
3. Add the template definition (with default data) to `AVAILABLE_TEMPLATES` in `src/lib/templatesData.ts`.
4. Run `npm run verify:templates` to ensure the design passes all email-safe rules and required field assertions.
