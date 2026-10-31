# Live Preview: Inspect Desktop (600px) and Mobile (360px) Views

> **Category:** GETTING STARTED GUIDE • `GETTING STARTED`  
> **Estimated Reading Time:** 2 min read  
> **Applies to:** All Plans & Templates  
> **Author:** Sig Signature QA Engineering Team  
> **Canonical URL:** `/help/getting-started/preview-desktop-mobile-signature`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Test Email Signature Mobile & Desktop Preview | Sig Signature
* **Meta Description:** Learn how to test your email signature in desktop (600px) and mobile (360px) viewports inside the Sig Signature editor before exporting.
* **Primary Target Keyword:** `test email signature mobile preview`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, Sig Signature documentation

---

## Overview: Why Desktop and Mobile Rendering Differ

Over 55% of all commercial emails are opened on mobile devices (Apple Mail for iPhone and the Gmail mobile app). Yet most professionals design their signatures on a 27-inch desktop monitor.

When an email signature designed at 600px width hits a 375px mobile screen, one of two disastrous things happens:
1. The email client scales the entire email down to fit the screen, making the body text microscopic and unreadable.
2. The columns fail to collapse, forcing the recipient to scroll horizontally to read your contact details.

Sig Signature’s built-in **Live Dual-Viewport Inspector** allows you to audit responsive behavior in real time before exporting a single line of code.

---

## How to Use the Live Preview Inspector

### 1. Activating the Preview Mode
In the Sig Signature Design Studio, locate the viewport toggle in the top-right toolbar:
* **Desktop View (600px):** Simulates wide reading panes in Outlook 365, Gmail Web, and Apple Mail on macOS.
* **Mobile View (360px):** Simulates modern iOS and Android viewport constraints.

### 2. What to Inspect in Desktop Mode (600px)
* **Horizontal Balance:** Verify that your logo, name, title, and contact columns maintain comfortable optical alignment.
* **Vertical Divider Rules:** Ensure vertical hairline separators (`|` or `1px solid border`) do not clip or create unnatural gaps.
* **Banner Width:** If you use a marketing banner, confirm it does not exceed the standard 600px maximum width.

### 3. What to Inspect in Mobile Mode (360px)
* **Column Stacking:** Sig Signature uses responsive table architecture. Inspect how horizontal modules stack vertically on narrow screens.
* **Text Wrapping:** Ensure job titles and company names do not wrap awkwardly into single-word lines (e.g., breaking "Executive" onto a new line).
* **Tap Target Spacing:** Verify that social icons and phone links have at least 8px of padding between them so users can tap them without mis-clicking.

---

## Technical Specifications: The Responsive Rulebook

| Metric | Desktop Standard | Mobile Standard | Deliverability Rationale |
|---|---|---|---|
| **Canvas Max Width** | 600px | 320px - 360px | 600px prevents horizontal overflow in default email reading panes. |
| **Logo Display Width** | 70px - 90px | 60px - 75px | Prevents oversized images from dominating small phone screens. |
| **Minimum Tap Target** | 24px x 24px | 36px x 36px | Apple Human Interface Guidelines require touchable icons. |
| **HTML Payload Weight** | <10KB | <10KB | Emails over 102KB get clipped by Gmail; signatures must stay tiny. |

---

## Pre-Export Checklist

Before clicking **Export HTML** or **Copy Visual Signature**:
* [ ] Toggle to Mobile View and confirm zero horizontal scrollbars.
* [ ] Click every link in the preview window to confirm active destinations.
* [ ] Verify that your phone number displays your international country code.
* [ ] Check that your headshot or logo renders crisply without pixelation.

---

## Key Takeaways
* Never deploy an email signature without inspecting both Desktop and Mobile viewports.
* Keep column widths flexible and text strings concise to prevent awkward mobile line wraps.
* Sig Signature automatically handles the underlying responsive table math so you never have to edit media queries manually.
