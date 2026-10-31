# Email-Safe Typography: Font Pairing & System Fallbacks

> **Category:** DESIGN & TEMPLATES GUIDE • `DESIGN & TEMPLATES`  
> **Estimated Reading Time:** 3 min read  
> **Applies to:** All Plans & Templates  
> **Author:** Sig Signature Typography Lab  
> **Canonical URL:** `/help/design-templates/email-safe-fonts-fallbacks`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Email-Safe Fonts & Fallback Stacks for Signatures | Sig Signature
* **Meta Description:** Discover which fonts render safely across Outlook, Gmail, and Apple Mail. Master multi-tier fallback stacks to prevent the Times New Roman trap.
* **Primary Target Keyword:** `email safe fonts signature fallbacks`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, Sig Signature documentation

---

## Overview: The Times New Roman Fallback Trap

In web development, you can import any custom font using Google Fonts or Adobe Typekit. In email development, attempting to use an external web font without proper defensive coding creates a notorious disaster: **The Times New Roman Trap**.

When Microsoft Outlook for Windows encounters a font that is not pre-installed on the recipient's computer (or linked via external `@import` tags), it silently fails. Instead of falling back to a clean sans-serif font like Arial, Outlook's Word engine defaults to 12pt serif Times New Roman, completely destroying your visual branding.

Sig Signature uses multi-tiered, battle-tested font stacks to ensure your typography remains clean and professional everywhere.

---

## Universal Email-Safe Fonts (Tier 1)

These fonts are pre-installed on virtually 100% of all Windows, macOS, iOS, and Android devices worldwide:

* **Arial:** Modern, neutral, highly legible. The absolute safest choice for business correspondence.
* **Calibri:** Soft, contemporary, and the default font of Microsoft Office. Renders beautifully on Outlook.
* **Helvetica / Helvetica Neue:** The gold standard of Swiss modernist design. Native on all Apple devices; falls back cleanly to Arial on Windows.
* **Trebuchet MS:** Geometric, slightly stylized sans-serif with high personality and exceptional small-size legibility.
* **Georgia:** Elegant, authoritative serif font designed specifically for screen legibility. Perfect for legal, financial, and executive signatures.
* **Verdana:** Wide letter spacing and high x-height. Ultra-readable even at tiny 10px sizes.

---

## How Sig Signature Implements Safe Fallback Stacks

When you select a modern font in Sig Signature (such as Plus Jakarta Sans or Inter), our compiler does not simply output `font-family: 'Inter';`. Instead, it writes a defensive, cascading font stack directly onto every table cell:

```html
<td style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 18px; color: #1a1a1a;">
  Sardar Muhammad Nadir
</td>
```

### How Clients Process This Stack:
1. **Apple Mail & Modern Webmail:** Detects the high-end font and renders it with full anti-aliased sharpness.
2. **Standard Windows Systems:** If the custom font is absent, it renders crisp `Segoe UI` or `Arial`.
3. **Legacy Outlook Desktop:** Safely falls back to `Arial`, completely bypassing the Times New Roman bug.

---

## Font Sizing & Line Height Hierarchy Rules

To guarantee readability across desktop monitors and mobile phone screens, adhere to these proportion standards:

| Hierarchy Level | Recommended Size | Weight | Recommended Line Height |
|---|---|---|---|
| **Full Name** | 14px - 16px | Bold (700) | 18px - 20px |
| **Job Title & Company** | 11px - 13px | Semi-Bold or Regular | 16px |
| **Contact Labels & URLs** | 11px - 12px | Regular (400) | 15px - 16px |
| **Legal Disclaimers** | 9px - 10px | Regular (400) | 13px - 14px |

> [!CAUTION]
> **Line Height Rule:** Always declare explicit pixel line heights (e.g., `line-height: 18px;`). If you omit line-height or use unitless values (`line-height: 1.2;`), Outlook Desktop often collapses lines or injects arbitrary 24px vertical white spaces.

---

## Key Takeaways
* Never rely on custom web fonts without an explicit system fallback stack.
* Stick to maximum two font sizes and one font family per signature layout.
* Always specify explicit pixel line-heights to prevent Outlook from distorting your vertical spacing.
