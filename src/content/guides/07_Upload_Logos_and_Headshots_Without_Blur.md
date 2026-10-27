# Upload Logos & Headshots Without Blur or Distortion

> **Category:** DESIGN & TEMPLATES GUIDE • `DESIGN & TEMPLATES`  
> **Estimated Reading Time:** 3 min read  
> **Applies to:** All Plans & Templates  
> **Author:** SigSignature Assets & Delivery Team  
> **Canonical URL:** `/help/design-templates/upload-logo-headshot-retina`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Crisp Retina Logos & Headshots for Email Signatures | SigSignature
* **Meta Description:** How to upload headshots and company logos at 2x Retina resolution with explicit HTML width/height attributes so they never appear blurry or oversized.
* **Primary Target Keyword:** `crisp email signature logo retina`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, SigSignature documentation

---

## Overview: The Retina Display Challenge

Most modern laptops, iPhones, and Android smartphones feature high-DPI displays (Retina, OLED, 4K). These displays pack 2x to 3x more physical hardware pixels into every square inch.

If you upload an image cropped to exactly 70x70px and display it at 70x70px, high-DPI screens must stretch that image across 140 or 210 physical hardware pixels. The result is a blurry, fuzzy headshot or logo that undermines your professional image.

This guide outlines how to format, compress, and upload images that look razor-sharp on every high-DPI screen without triggering spam filters.

---

## The 2x Retina Golden Rule

To achieve crisp rendering on high-DPI screens:
> **Upload an image whose physical pixel dimensions are exactly double (2x) the target display dimensions.**

* **Example for Headshots:**  
  Target Display Size in Signature: `75px x 75px`  
  Upload Source Dimensions: `150px x 150px`
* **Example for Company Logos:**  
  Target Display Size in Signature: `140px width x 40px height`  
  Upload Source Dimensions: `280px width x 80px height`

SigSignature automatically sets the explicit HTML attribute `width="75"` while serving the 150px source asset. The browser squeezes the crisp image into the smaller slot, achieving pixel-perfect clarity.

---

## File Format Selection: PNG vs. JPEG vs. SVG

### 1. Company Logos: Transparent PNG
* **Format:** PNG-24 with alpha transparency.
* **Why:** Transparent backgrounds ensure your logo renders cleanly whether the recipient uses Light Mode, Dark Mode, or a tinted background.
* **Warning:** Never use solid white background boxes around your logo, as they turn into ugly white squares in Dark Mode.

### 2. Personal Headshots: Web-Optimized JPEG or PNG
* **Format:** JPEG (quality 85%) or PNG.
* **Why:** JPEG provides superior compression for photographic gradients, keeping file weight under 30KB.

### 3. Why SVG is Strictly Forbidden in Email
While SVGs are the gold standard for web design, **email clients strictly block or sanitize SVG images**. Both Microsoft Outlook and Gmail treat SVGs as security risks (potential XML injection vulnerabilities) and replace them with broken image icons. Always export SVGs to high-resolution transparent PNGs before uploading.

---

## Step-by-Step Upload Walkthrough

1. In the SigSignature editor, click on **Images** in the left sidebar.
2. Select whether you are uploading an **Avatar (Headshot)** or a **Company Logo**.
3. Drag and drop your 2x image file into the upload zone.
4. Use the interactive cropping modal:
   * **Circle:** Best for headshots; centers the face with balanced padding.
   * **Rounded Rect (8px):** Clean modern corner rounding for square logos.
   * **Sharp Square (0px):** Architectural corporate standard.
5. Click **Apply Image**. SigSignature instantly optimizes the file and pushes it to our global HTTPS CDN.

---

## Image File Weight & Deliverability Limits

| Parameter | Recommended Standard | Maximum Hard Limit | Consequence of Exceeding |
|---|---|---|---|
| **Avatar File Size** | 20KB - 35KB | 80KB | Slow loading on mobile data connections |
| **Logo File Size** | 15KB - 30KB | 60KB | Increases total email payload |
| **Total Signature Images** | Under 100KB combined | 150KB | Spam score penalty on enterprise firewalls |
| **CDN Protocol** | HTTPS strictly | HTTPS strictly | Mixed content security warnings in Gmail |

---

## Key Takeaways
* Always export your images at 2x resolution and let HTML constraints handle the scaling.
* Never use SVGs in email signatures; always upload transparent PNGs.
* Keep individual image file sizes under 50KB to maintain top deliverability scores.
