# Fix Image Sizing, Aspect Ratio & Spacing Bugs

> **Category:** DESIGN & TEMPLATES GUIDE • `DESIGN & TEMPLATES`  
> **Estimated Reading Time:** 3 min read  
> **Applies to:** Retina Screens, Outlook, Gmail, Webmail  
> **Author:** Sig Signature Deliverability & Rendering Lab  
> **Canonical URL:** `/help/design-templates/fix-image-sizing-spacing`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Fix Email Signature Image Sizing & Spacing Bugs | Sig Signature
* **Meta Description:** Complete diagnostic guide to solving blurry photos, giant Outlook logos, circular crop distortion, and unwanted table gaps in email signatures.
* **Primary Target Keyword:** `fix email signature image size outlook`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, Sig Signature documentation

---

## Overview: Why Email Images Break

Images in email signatures are notoriously fragile. Because email clients do not support modern CSS standards like `object-fit: cover` or responsive `aspect-ratio` properties, minor markup mistakes can cause your company logo to blow up to 1200px wide in Outlook or look blurry on iPhones.

This guide provides tested, verified fixes for the 4 most common image bugs in email signature design.

---

## Diagnostic Breakdown: 4 Common Image Issues

### Issue 1: Blurry Logos & Headshots on High-Resolution Screens
* **The Symptom:** Your profile photo looks sharp in the editor, but appears fuzzy or pixelated on iPhones, MacBooks, and high-DPI Windows laptops.
* **The Cause:** Modern smartphone and laptop displays have a device pixel ratio (DPR) of 2x or 3x. If you display an image at 65x65px and upload a 65x65px source file, the screen stretches those pixels across 130 physical hardware pixels.
* **The Fix (The 2x Retina Rule):**
  1. Always upload your headshot or logo at exactly 2x display dimensions.
  2. If the target display is 70x70px, upload a source image of 140x140px (or up to 200x200px max).
  3. Ensure your image has explicit HTML width constraints (`width="70"`). The browser will squeeze the 140px crisp image into the 70px slot, delivering razor-sharp quality on all screens.

### Issue 2: Giant Oversized Image in Outlook Desktop
* **The Symptom:** An email sent to a recipient on Outlook for Windows displays your company logo at massive, screen-filling size.
* **The Cause:** Microsoft Word's rendering engine completely ignores CSS rules such as `max-width: 100%`, `width: 70px`, or `height: auto` in `<style>` blocks. It reads strictly the physical pixel dimensions of the image file or the HTML attribute `width="..."`.
* **The Fix (Explicit HTML Attributes):**
  Sig Signature automatically injects both inline CSS styles AND hardcoded HTML tag attributes:
  `<img src="..." width="70" height="70" style="display: block; width: 70px; height: 70px; border: 0;" />`
  This forces Outlook's Word engine to constrain the image regardless of source file dimensions.

### Issue 3: Oval or Stretched Headshots (Aspect Ratio Distortion)
* **The Symptom:** A circular headshot avatar appears distorted as an egg or oval.
* **The Cause:** The uploaded image had rectangular dimensions (e.g., 400x300px), but the template enforced a 1:1 square crop. Without `object-fit`, email engines squash the unequal dimensions.
* **The Fix (Pre-Crop to 1:1 Square):**
  Always crop your headshot to an exact 1:1 square aspect ratio before uploading, or use Sig Signature’s built-in image cropper to center your face inside a perfect square bounding box.

### Issue 4: Random White Gaps or Padding Below Images
* **The Symptom:** An unwanted 3px to 5px gap appears directly underneath your logo or banner, disrupting table borders.
* **The Cause:** By default, HTML renders images as `inline` elements, allocating baseline vertical space for font descenders (like letters "y" and "g").
* **The Fix (`display: block;`):**
  Always apply `style="display: block;"` to all signature image elements. Sig Signature applies this rule natively to every image container.

---

## Image Formatting Reference Matrix

| Metric | Ideal Standard | Supported Formats | Avoid |
|---|---|---|---|
| **Avatar Display** | 65px - 80px | PNG, JPEG | SVG (stripped by Outlook & Gmail) |
| **Logo Display** | 120px - 160px max | PNG (transparent) | Uncompressed TIFF or BMP files |
| **Marketing Banner** | 600px width x 100px height | JPEG, Web-optimized PNG | Banners taller than 150px |
| **Max File Payload** | Under 50KB per image | High-compression Web | Raw 5MB camera exports |

---

## Key Takeaways
* Follow the 2x Retina formula: upload at twice the display dimensions with hardcoded HTML width attributes.
* Always crop profile photos to an exact 1:1 square before applying circular frames.
* Host all images on global HTTPS CDNs with permanent cache headers.
