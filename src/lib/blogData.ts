export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Signature design" | "Brand consistency" | "HTML & compatibility" | "Team workflows" | "Email marketing";
  visualType: "nevon-signature" | "html-vs-image" | "envelope-at" | "calm-rollout" | "campaign-banner" | "good-hierarchy" | "outlook-word";
  coverImage?: string;
  pdfUrl?: string;
  readingTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  contentMarkdown: string;
}

export const BLOG_CATEGORIES = [
  "All stories",
  "Signature design",
  "Brand consistency",
  "HTML & compatibility",
  "Team workflows",
  "Email marketing",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-belongs-in-an-email-signature",
    title: "What belongs in an email signature? Less than you think.",
    excerpt: "A practical edit of the details that help people recognize you and reach you.",
    category: "Signature design",
    visualType: "nevon-signature",
    readingTime: "4 min read",
    publishedAt: "November 2, 2026",
    author: {
      name: "The Nevon Design Studio",
      role: "Brand & Design Systems",
    },
    contentMarkdown: `
# What belongs in an email signature? Less than you think.

The email signature is often treated like a junk drawer: mobile phone, office phone, fax number, physical street address, three social links, a motivational quote, a legal disclaimer long enough to wrap around a phone screen, and a seasonal banner.

When you pack everything into a sign-off, none of it stands out.

## The Rule of 4 Anchors

Every effective email signature requires four core anchors:

1. **Who you are:** Full name and preferred professional title.
2. **What company you represent:** Company brand mark or verified text name.
3. **The single fastest way to reach you:** Direct email address or phone number.
4. **The single most relevant next step:** A one-tap booking link, corporate website, or primary social channel (such as LinkedIn).

## What to Remove Immediately

* **The Fax Number:** Unless you work in regulated legal archival filings, nobody will fax your email signature.
* **The Motivational Quote:** Personal philosophy belongs on your personal website or social profile, not on corporate correspondence.
* **Uncompressed High-Res Headshots:** Uploading a 2MB headshot bloats your email size and triggers spam filter warnings.
* **Redundant Email Addresses:** If someone received your email, they already have your email in the header. Only include your email if people frequently forward your emails to colleagues.

## Good Signatures Respect the Reader

An email signature should feel like a handshake, not a brochure. By curating your sign-off to four essential data points, you make your message easier to read, prevent mobile rendering bugs, and build instant executive credibility.
    `,
  },
  {
    slug: "why-outlook-uses-microsoft-word-to-render-html",
    title: "Why Outlook Uses Microsoft Word to Render HTML (And How to Fix It)",
    excerpt: "Discover why desktop Microsoft Outlook renders HTML emails using Microsoft Word 2007, why standard CSS flexbox and max-width break, and how to compile bulletproof corporate email signatures that never deform.",
    category: "HTML & compatibility",
    visualType: "outlook-word",
    coverImage: "/blog/day01_cover_16_9.webp",
    pdfUrl: "/blog/why-outlook-uses-microsoft-word-to-render-html.pdf",
    readingTime: "8 min read",
    publishedAt: "October 31, 2026",
    author: {
      name: "SigSignature Engineering Lab",
      role: "Email Deliverability & Rendering",
    },
    contentMarkdown: `
# Why Outlook Uses Microsoft Word to Render HTML (And How to Fix It)

## Executive Summary: The Legacy Engine Behind Corporate Email

Microsoft Outlook on Windows does not use Microsoft Edge, Google Chromium, or Apple WebKit to render HTML emails. 

Instead, desktop versions of Outlook (including Microsoft 365 desktop, Outlook 2021, 2019, and 2016) parse HTML using the print rendering engine of **Microsoft Word 2007**.

Because Microsoft Word is a document layout engine rather than a web browser, it ignores modern web standards. Properties like CSS Flexbox, CSS Grid, and \`max-width\` fail silently. This discrepancy causes over 60% of corporate email signatures to break, stretching company logos out of proportion, misaligning contact rows, and reverting custom typography to Times New Roman.

To solve these rendering failures, email signatures must be compiled defensively using nested HTML \`<table>\` architecture, explicit dimension attributes, and Microsoft Office (MSO) conditional comments.

---

## The 2007 Architectural Decision That Changed Email Development

In modern web development, browsers are forgiving. WebKit, Chromium, and Gecko parse modern CSS fluidly. You build a responsive component once, and it maintains layout integrity across screens.

The moment you design an email signature, that modern web foundation vanishes.

According to the [Litmus Email Client Market Share Benchmark](https://www.litmus.com/blog/email-client-market-share), Microsoft Outlook accounts for **over 60% of all corporate desktop email opens** worldwide. Yet, every one of those desktop opens relies on an architectural compromise dating back to 2007.

In Outlook 2007, Microsoft replaced the Internet Explorer MSHTML rendering pipeline with the Microsoft Word typesetting engine (\`wwlib.dll\`). The original objective was document parity: Microsoft engineers wanted emails composed in Outlook to mirror the exact rich-text editing experience of Microsoft Word documents.

The unintended consequence was a multi-decade challenge for email engineers. As documented in the official [Microsoft Word HTML and CSS Rendering Specification](https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa338201(v=office.12)), Microsoft Word was designed for physical paper pagination and print margins. It possesses zero native comprehension of modern responsive web development.

When modern CSS enters Outlook desktop, Word strips or distorts almost every standard web property.

---

## 4 Critical Ways Microsoft Word Destroys Email Signatures

### 1. Flexbox and CSS Grid Are Completely Ignored
Frontend developers instinctively build signatures using flexible container models:

\`\`\`html
<!-- This layout collapses completely in Microsoft Outlook desktop -->
<div style="display: flex; align-items: center; justify-content: space-between;">
  <img src="avatar.png" style="width: 60px; border-radius: 50%;">
  <div>
    <h4>Alex Vance</h4>
    <p>Chief Technology Officer</p>
  </div>
</div>
\`\`\`

In Apple Mail or web browsers, this code renders as a clean horizontal card. 

In Microsoft Outlook, Word parses \`display: flex\`, fails to recognize the instruction, and falls back to standard block flow. The avatar appears on top, the text drops underneath it, and horizontal spacing collapses.

### 2. Image \`max-width\` Stripping and the 4K DPI Scaling Blowout
One of the most frequent visual bugs in corporate correspondence is the oversized logo blowout. An organization uploads a 400x400 pixel image asset and constrains it with inline CSS:

\`\`\`html
<img src="logo.png" style="max-width: 80px; height: auto;">
\`\`\`

Microsoft Word completely discards \`max-width\`. It checks the physical pixel dimensions of the image file and renders the asset at full 400px width, instantly consuming the recipient's entire viewing pane.

Furthermore, on modern Windows laptops with high-DPI displays (such as 125% or 150% display scaling), Word calculates layout dimensions based on physical 96 DPI system settings rather than logical CSS pixels. Without rigid HTML attribute constraints, logos scale unpredictably, clipping adjacent contact details.

### 3. Erratic Margin Collapsing and 20px Spacer Gaps
Standard CSS margins applied to \`<div>\`, \`<p>\`, or \`<span>\` tags behave erratically inside Word:
* \`margin-top\` and \`margin-bottom\` frequently collapse or inherit default Word paragraph spacing (often injecting an unprompted 15px to 20px blank gap).
* Padding applied to block-level container tags is routinely discarded or applied only to the top edge.

### 4. The Silent Fallback to Times New Roman
When a signature links external web fonts (such as Inter, Roboto, or Plus Jakarta Sans) via stylesheets, Outlook blocks the external connection. Rather than falling back gracefully to the next font in the CSS font stack, Word frequently defaults to 12pt serif Times New Roman. 

Your sleek executive brand identity suddenly resembles an unstyled print memo.

---

## Defensive Engineering: How SigSignature Guarantees Universal Parity

To ensure that email signatures render with pixel-perfect consistency across Outlook, Gmail, Apple Mail, and mobile clients, developers must implement defensive email architecture.

### Rule 1: Replace \`<div>\` Tags with Strict Nested \`<table>\` Structures
HTML tables are not legacy compromises in email engineering. They represent the only layout engine with 100% universal support across all legacy and modern email clients worldwide.

Every signature compiled by SigSignature uses a 3-tier nested table hierarchy:
1. **Outer Container Table:** Enforces a rigid 600px desktop boundary with \`cellpadding="0" cellspacing="0" border="0"\`.
2. **Structural Column Table:** Splits the signature into clean horizontal columns (avatar on the left, typography on the right).
3. **Data Cell Table:** Holds individual contact rows, verified badges, and action links.

\`\`\`html
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
  <tr>
    <td valign="middle" style="padding-right: 20px;">
      <img src="https://cdn.sigsignature.com/assets/avatar.png" width="64" height="64" alt="Alex Vance" style="display: block; width: 64px; height: 64px; border: 0;">
    </td>
    <td valign="middle" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 18px; color: #1a1a1a;">
      <strong style="font-size: 16px; color: #011532;">Alex Vance</strong><br>
      <span style="color: #4e80ee; font-size: 13px;">Chief Technology Officer</span>
    </td>
  </tr>
</table>
\`\`\`

### Rule 2: Explicit Dual-Dimension Image Attributes
Never rely solely on inline CSS styles to size images. Always specify exact display dimensions in three distinct locations:
* The HTML \`width\` and \`height\` attributes on the \`<img>\` tag.
* The inline CSS \`style=""\` attribute on the \`<img>\` tag.
* The explicit \`width\` attribute on the wrapping \`<td>\` cell.

\`\`\`html
<td width="80" style="width: 80px;">
  <img src="https://cdn.sigsignature.com/assets/logo.png" 
       width="80" 
       height="32" 
       alt="Logo" 
       style="display: block; width: 80px; height: 32px; border: 0; outline: none; text-decoration: none;">
</td>
\`\`\`

Declaring explicit attributes (\`width="80" height="32"\`) forces Word to allocate the exact bounding box before image bytes are downloaded, preventing layout shifts and oversized explosions.

### Rule 3: Preparing Clean Vector and Transparent Assets
Before embedding logos into your signature, asset preparation is critical. Uploading standard JPEG files with solid white backgrounds produces glaring white bounding boxes when recipients read emails in Dark Mode.

To prevent dirty edge halos and uncompressed image bloat, prepare your source logos and headshots as true 24-bit transparent PNGs or clean scalable vectors. You can strip image backgrounds and compress vector marks locally in your browser using [CrushSVG](https://www.crushsvg.net). This eliminates fringing artifacts and keeps individual image weights well under 50KB to preserve email deliverability.

### Rule 4: Defensive MSO Conditional Comments
When you want to deliver modern visual styling to Apple Mail and Chrome while shielding Microsoft Outlook from unsupported properties, implement Microsoft Office (MSO) conditional comments:

\`\`\`html
<!--[if mso]>
<table width="600" cellpadding="0" cellspacing="0" border="0">
<tr>
<td width="100" valign="top">
<![endif]-->

<!-- Modern Webmail / Mobile Container -->
<div style="display: inline-block; max-width: 100px; vertical-align: top;">
  <img src="avatar.png" width="64" height="64" style="border-radius: 50%;">
</div>

<!--[if mso]>
</td>
<td width="500" valign="top">
<![endif]-->

<div style="display: inline-block; max-width: 500px; vertical-align: top;">
  <!-- Contact details -->
</div>

<!--[if mso]>
</td>
</tr>
</table>
<![endif]-->
\`\`\`

Modern clients bypass the \`<!--[if mso]>\` blocks and parse the modern layout rules. Outlook ignores the \`<div>\` containers and executes the rigid, fixed-width table structure.

### Rule 5: Multi-Tiered System Font Fallbacks
To eliminate the Times New Roman fallback bug, write multi-tiered font stacks directly onto every table cell:

\`\`\`html
<td style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
\`\`\`

1. **Apple Mail and Safari:** Renders the premium font \`Plus Jakarta Sans\`.
2. **Modern Windows Webmail:** Falls back cleanly to \`Segoe UI\`.
3. **Legacy Outlook Desktop:** Safely defaults to \`Arial\`, bypassing the Times New Roman trap.

---

## Deliverability First: The Under 10KB Guarantee

Visual signature tools often solve Outlook bugs by generating repetitive, bloated code, frequently inflating signature payloads past 45KB.

When that signature is included in an ongoing email thread with several replies, the total email message quickly crosses the **102KB threshold**. At 102KB, Gmail automatically truncates the message with \`[Message clipped]\`.

This truncation causes severe operational damage:
* Unsubscribe links and legal notices vanish.
* Email tracking pixels in the footer are severed.
* Corporate spam filters dock sender domain reputation scores.

At [SigSignature](https://www.sigsignature.com), our compiler is engineered around a core priority: **Deliverability-First Architecture**.

Signatures compiled by SigSignature:
* Guarantee a compiled HTML footprint strictly under 10KB.
* Prevent the 102KB Gmail message truncation ceiling.
* Provide universal rendering parity across Microsoft Outlook, Gmail, and Apple Mail.
* Feature 1-Click Clipboard installation directly into email client settings.
    `,
  },
  {
    slug: "html-or-image-find-the-right-export-for-your-inbox",
    title: "HTML or image? Find the right export for your inbox.",
    excerpt: "Understand the trade-offs before you copy, download and send.",
    category: "HTML & compatibility",
    visualType: "html-vs-image",
    readingTime: "5 min read",
    publishedAt: "November 1, 2026",
    author: {
      name: "SigSignature Engineering Lab",
      role: "Email Deliverability",
    },
    contentMarkdown: `
# HTML or image? Find the right export for your inbox.

When creating an email signature, one of the first decisions you face is format: should you export as clean, interactive HTML code, or as a single high-resolution image?

Both options have distinct strengths depending on your workflow and the clients your recipients use.

## The Case for HTML Signatures

HTML email signatures are built with live, selectable text and web links.

* **Clickable Channels:** Recipients can click your phone number to dial directly, click your email to start a reply, and click your social icons.
* **Retina Sharpness:** Live text scales crisply at any zoom level or screen density without pixelation.
* **Lightweight Payload:** A properly compiled HTML signature weighs under 10KB, loading instantly on mobile connections.
* **Searchability:** Recipients can search their inbox for your name or phone number and find your emails immediately.

## The Case for Image Signatures

Image signatures convert your entire sign-off into a single PNG or JPEG graphic.

* **100% Visual Lockdown:** No email client can shift fonts or misalign columns because the design is permanently flattened.
* **Effortless Mobile Setup:** Some mobile email clients do not allow custom HTML code pasting. Adding a single image is often simpler on restrictive clients.

## The Trade-Offs

Image signatures suffer from two major drawbacks:
1. **No Live Links:** A single image can only link to one destination (or none at all). Recipients cannot click your phone number separately from your website.
2. **Image Blocking:** Over 40% of corporate email clients block external images by default until the recipient explicitly clicks "Download Pictures." With an image signature, your entire sign-off appears as a blank box with a red "X."

## The SigSignature Verdict

Whenever possible, choose **HTML**. With defensive table architecture and bulletproof MSO comments, you gain all the visual consistency of an image while preserving live interactive links and deliverability.
    `,
  },
  {
    slug: "one-brand-many-people-signature-system",
    title: "One brand, many people. One considered signature system.",
    excerpt: "Build a visual language that stays coherent across roles, teams and conversations.",
    category: "Brand consistency",
    visualType: "envelope-at",
    readingTime: "6 min read",
    publishedAt: "October 28, 2026",
    author: {
      name: "The Nevon Design Team",
      role: "Corporate Brand Architecture",
    },
    contentMarkdown: `
# One brand, many people. One considered signature system.

When an organization grows past ten people, brand entropy begins. Without a unified system, individual employees create their own signatures. Colors drift, outdated logos circulate, and job titles become inconsistent.

Every outbound email is a brand touchpoint. When your team's signatures look disconnected, your organization looks disorganized.

## The Elements of a Scalable Signature System

A scalable signature system balances brand governance with role flexibility:

1. **Locked Typography & Color:** Primary colors, secondary accents, and font stacks should be standardized across the whole team.
2. **Role-Based Variations:** Sales reps need booking links and direct phone numbers; legal or HR teams need compliance disclaimers; executives need clean, minimal branding.
3. **Centralized Brand Assets:** Logos and verified icons should be hosted on a high-availability CDN with long cache headers, never attached locally to each email.

## Eliminating Manual Updates

With SigSignature for Teams, administrators create a single template, define role fields, and invite teammates via email or public link. Teammates enter their name and direct phone number, while all brand colors and layout geometry remain locked.
    `,
  },
  {
    slug: "a-calmer-way-to-roll-out-your-next-email-signature",
    title: "A calmer way to roll out your next email signature.",
    excerpt: "From checking contact details to testing a real email: a checklist worth keeping.",
    category: "Team workflows",
    visualType: "calm-rollout",
    readingTime: "5 min read",
    publishedAt: "October 25, 2026",
    author: {
      name: "SigSignature Operations",
      role: "Team Enablement",
    },
    contentMarkdown: `
# A calmer way to roll out your next email signature.

Rolling out new email signatures across a company shouldn't be stressful. Follow this battle-tested 4-step checklist to launch cleanly without inbox surprises:

## Phase 1: Audit Contact Data
Verify direct dial numbers, international country codes (+1, +44, etc.), and official job titles with HR before publishing.

## Phase 2: Send Real Test Emails
Never rely only on browser previews. Send test emails to:
* A desktop Outlook account (on Windows)
* An Apple Mail account (macOS and iOS)
* A personal Gmail account on mobile

Verify that links open correctly, logos stay crisp, and text doesn't collapse.

## Phase 3: Prepare 1-Click Instructions
Provide your team with concise, visual steps tailored to their email client (Gmail, Outlook 365, Apple Mail). SigSignature includes 1-click clipboard installation guides that make setup take less than 60 seconds.

## Phase 4: Set a Refresh Cadence
Review your company signatures quarterly to ensure marketing banners are current and former employee handles have been retired.
    `,
  },
  {
    slug: "your-next-campaign-already-has-a-place-to-show-up",
    title: "Your next campaign already has a place to show up.",
    excerpt: "Give your email banner one clear message and a next step that makes sense.",
    category: "Email marketing",
    visualType: "campaign-banner",
    readingTime: "4 min read",
    publishedAt: "October 22, 2026",
    author: {
      name: "SigSignature Growth Team",
      role: "Email Marketing & Conversions",
    },
    contentMarkdown: `
# Your next campaign already has a place to show up.

Your team sends thousands of emails every week to prospects, customers, partners, and investors. That high-intent 1-on-1 correspondence has higher engagement rates than any cold marketing blast.

An email signature banner turns that daily traffic into a high-converting conversion channel.

## What Makes an Email Banner Work?

* **Single Clear CTA:** Focus on one campaign at a time: a product launch, upcoming webinar, or annual conference.
* **Compact Dimensions:** Keep banner heights under 100px so they don't overpower the email body.
* **Visual Restraint:** Match your company's core palette rather than using flashing neon elements.
* **Trackable Destination:** Use UTM parameters on your banner link so your marketing analytics can attribute signups directly.
    `,
  },
  {
    slug: "good-hierarchy-makes-a-small-signature-feel-effortless",
    title: "Good hierarchy makes a small signature feel effortless.",
    excerpt: "Use type, spacing and contrast to make the important details easy to find.",
    category: "Signature design",
    visualType: "good-hierarchy",
    readingTime: "5 min read",
    publishedAt: "October 18, 2026",
    author: {
      name: "The Nevon Typography Lab",
      role: "Visual Design",
    },
    contentMarkdown: `
# Good hierarchy makes a small signature feel effortless.

An email signature occupies a small canvas, typically between 80px and 160px in height. In that compact space, typography hierarchy is what separates an amateur layout from a refined executive signature.

## 3 Principles of Micro-Typography

### 1. Contrast Over Clutter
Make the sender's name the dominant focal point (16px to 18px font weight 600). Keep the job title and company name slightly smaller (13px to 14px weight 400). Contact channels should be 12px to 13px in a muted slate color.

### 2. Generous Micro-Spacing
Use 4px to 8px row gaps between distinct semantic blocks rather than cramming text lines directly on top of each other.

### 3. Deliberate Accent Colors
Use brand colors sparingly: on your company name, verified badge, or primary social icon. When every word is colored, nothing feels prioritized.
    `,
  },
];
