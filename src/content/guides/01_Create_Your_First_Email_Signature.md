# Create Your First Email Signature

> **Category:** GETTING STARTED GUIDE • `GETTING STARTED`  
> **Estimated Reading Time:** 3 min read  
> **Applies to:** All Plans & Templates  
> **Author:** SigSignature Deliverability Team  
> **Canonical URL:** `/help/getting-started/create-first-email-signature`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Create Your First Email Signature | SigSignature Help Center
* **Meta Description:** Step-by-step walkthrough to design, customize, and preview a bulletproof HTML email signature tailored for your personal brand or team.
* **Primary Target Keyword:** `create email signature`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, SigSignature documentation

---

## Overview & Prerequisites

An email signature is not a graphic banner; it is a critical deliverability asset. Unlike standard web pages, email clients (especially Microsoft Outlook and Gmail) use legacy HTML rendering engines. SigSignature automatically compiles your visual design into email-safe nested tables, 100% inline CSS, and Outlook MSO conditionals to guarantee consistent rendering across every inbox.

**Prerequisite:** Ensure you are logged into your SigSignature account at `sigsignature.com`. Free accounts can generate and export personal signatures immediately without any credit card required.

---

## Step-by-Step Creation Guide

### 1. Select a Foundation Template
Navigate to **Templates** from your dashboard sidebar. Browse through our curated layout archetypes:
* **Executive / Corporate:** Formal horizontal layout featuring high-contrast typography, company credentials, and legal disclaimers.
* **Modern Minimal:** Compact two-column design optimized for short correspondence and mobile readability.
* **Creative / Founder:** Prominent circular avatar with highlighted social channels and portfolio booking CTA.

Click **Use Template** to load your selection into the Design Studio.

### 2. Enter Personal & Company Details
In the left-hand editor sidebar, populate your core identity fields:
* **Full Name & Job Title:** Keep titles under 45 characters to avoid awkward line wrapping on smartphone screens.
* **Company Name & Department:** Optionally add your business URL with proper `https://` protocols.
* **Contact Information:** Phone number, direct email, office address, and calendar booking link (e.g., Calendly, Cal.com).

### 3. Upload Your Avatar Photo or Company Logo
Click on the **Images** tab in the sidebar:
* **File Formats:** Use PNG or JPEG. Avoid SVGs as Gmail and Outlook strip SVG images for security.
* **Resolution:** Upload at 2x resolution (e.g., 160x160px for an 80x80px display) for crisp Retina display sharpness.
* **Cropping & Shape:** Choose between Circular, Rounded Rect (8px radius), or Sharp Square.

### 4. Configure Social Icons & Action CTAs
Connect your professional touchpoints: LinkedIn, X (Twitter), GitHub, YouTube, or your website. Select from 4 icon visual styles (Filled Circle, Minimal Outline, Square, or Brand Colors). Ensure every link is tested and active.

### 5. Inspect Live Preview (Desktop & Mobile)
Click the **Preview Signature** button in the top navigation. Toggle between:
* **Desktop (600px):** Simulates standard widescreen Outlook, Apple Mail, and Gmail desktop views.
* **Mobile (360px):** Verifies how horizontal columns stack on iOS Mail and Android Gmail apps.

> [!TIP]
> **Deliverability Standard:** Keep your total HTML file size under 10KB and total image payload under 150KB. Heavy signatures increase spam score triggers on corporate email firewalls (Proofpoint, Mimecast).

---

## Best Practices & Quality Checklist

| Element | Recommended Setting | Why It Matters |
|---|---|---|
| **Avatar / Logo Size** | 65px to 85px max display width | Prevents overpowering email body text on mobile screens. |
| **Font Hierarchy** | Max 2 font families (System safe) | Guarantees exact font fallbacks on Outlook (Word engine). |
| **Phone Numbers** | International format (`+1 555-0199`) | Enables native one-tap mobile calling without formatting errors. |
| **Social Icons** | Maximum 4-5 core channels | Maintains visual cleanliness and reduces link spam reputation flags. |

---

## Key Takeaways
* Always test your signature in both desktop and mobile viewports before exporting.
* Images must be hosted over HTTPS on global CDN endpoints with explicit HTML width/height attributes.
* Save your signature to your dashboard so updates automatically propagate across team templates.
