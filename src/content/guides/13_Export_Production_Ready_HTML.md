# Export Production-Ready HTML & Raw Embed Code

> **Category:** EXPORT & INSTALLATION GUIDE • `EXPORT & INSTALLATION`  
> **Estimated Reading Time:** 2 min read  
> **Applies to:** HubSpot, Salesforce, Apple Mail, CRM Platforms  
> **Author:** Sig Signature Core Platform Team  
> **Canonical URL:** `/help/export-installation/export-html-embed-code`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Export Production-Ready HTML Email Signatures | Sig Signature
* **Meta Description:** Technical developer guide to exporting minified, production-grade HTML signatures and integrating them into CRMs, Apple Mail, and custom marketing platforms.
* **Primary Target Keyword:** `export html email signature`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, Sig Signature documentation

---

## What Defines "Production-Ready" HTML Email Signatures?

Modern web development techniques (Flexbox, CSS Grid, external stylesheets, SVG graphics) completely fail in standard email clients. A production-ready email signature must satisfy strict structural constraints:

* **100% Inline CSS:** All styling attributes must exist directly on HTML elements (`<td style="...">`).
* **Nested Table Architecture:** Structural positioning must rely entirely on `<table>`, `<tr>`, and `<td>` elements with zero reliance on margins or floating elements.
* **Asset Hosting on Global CDN:** All images must be hosted on high-availability HTTPS CDNs with permanent cache headers.
* **Client-Safe Typography:** Robust multi-tier font stacks with universal system fallbacks.

---

## Export Options in Sig Signature

### Option 1: Copy Visual Signature (Clipboard)
* **Best For:** Direct visual pasting into webmail clients (Gmail, Outlook Web, Yahoo Mail, Thunderbird).
* **How It Works:** Copies rich text and rendered table binaries directly to system clipboard.
* **Usage:** Click **Copy Visual Signature** -> Navigate to email client settings -> Paste directly.

### Option 2: Copy Raw HTML Embed Code
* **Best For:** Developers, CRM integration, email marketing automation, and Apple Mail manual `.mailsignature` injection.
* **How It Works:** Copies minified, production-ready HTML source markup to your clipboard.
* **Usage:** Click **Export HTML** -> Select **Copy Raw HTML**. Paste into HubSpot, Salesforce, Outreach.io, or email marketing templates.

### Option 3: Download HTML File (`signature.html`)
* **Best For:** Archival backup, team distribution, and offline deployment.
* **How It Works:** Downloads a standalone `.html` file containing the complete inline signature code.
* **Usage:** Click **Export HTML** -> Click **Download .html File**.

---

## Integrating into CRMs & Marketing Platforms

### HubSpot CRM
1. In HubSpot, click the **Settings Gear (⚙️)** in top navigation.
2. In left sidebar, navigate to **General** -> **Email** tab.
3. In the *Signature* section, click **Edit signature** -> Click the **HTML (Source Code)** button.
4. Paste your raw Sig Signature HTML code and click **Save**.

### Salesforce Sales Cloud
1. Click your Profile Avatar in top right -> Click **Settings**.
2. In Quick Find, search for **My Email Settings**.
3. In the *Email Signature* box, paste your Sig Signature markup and click **Save**.

---

## Technical Specifications & Architecture

| Parameter | Specification Standard | Technical Rationale |
|---|---|---|
| **DOCTYPE** | XHTML 1.0 Transitional / HTML5 | Guarantees standards mode parsing in legacy webmail |
| **CSS Inlining** | 100% Inline on `<td>` / `<span>` | Webmail clients strip `<style>` headers in email body |
| **Table Spacing** | `cellpadding="0" cellspacing="0" border="0"` | Eliminates phantom default browser cell spacing |
| **Asset Delivery** | Cloudflare Global CDN / HTTPS | Sub-50ms worldwide asset load times; zero mixed-content flags |

---

## Key Takeaways
* Use "Copy Visual Signature" for webmail clients (Gmail/Outlook); use "Copy Raw HTML" for CRMs and marketing software.
* All Sig Signature code is 100% inline and minified for maximum deliverability.
* Images are permanently hosted on secure, high-speed CDN servers.
