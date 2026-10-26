export interface GuideSection {
  heading: string;
  subheading?: string;
  paragraphs?: string[];
  steps?: {
    number: number;
    title: string;
    description: string;
    substeps?: string[];
    callout?: {
      type: "tip" | "warning" | "note";
      text: string;
    };
  }[];
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
  list?: string[];
}

export interface DetailedGuide {
  id: string;
  slug: string;
  title: string;
  eyebrow: string; // e.g. "GETTING STARTED", "INSTALLATION", "EXPORT & INTEGRATION", "TROUBLESHOOTING"
  category: string;
  readTime: string;
  appliesTo: string;
  author: string;
  subtitle: string;
  overview: string[];
  prerequisites?: string[];
  sections: GuideSection[];
  checklist?: {
    headers: string[];
    rows: string[][];
  };
  keyTakeaways: string[];
}

export const DETAILED_GUIDES: Record<string, DetailedGuide> = {
  "create-first-signature": {
    id: "create-first-signature",
    slug: "create-first-signature",
    title: "Create Your First Email Signature",
    eyebrow: "GETTING STARTED GUIDE",
    category: "Getting started",
    readTime: "3 min read",
    appliesTo: "All Plans & Templates",
    author: "SigSignature Deliverability Team",
    subtitle:
      "A step-by-step walkthrough to design, customize, and preview a bulletproof HTML email signature tailored for your personal brand or team.",
    overview: [
      "An email signature is not a graphic banner; it is a critical deliverability asset. Unlike standard web pages, email clients (especially Microsoft Outlook and Gmail) use legacy HTML rendering engines.",
      "SigSignature automatically compiles your visual design into email-safe nested tables, 100% inline CSS, and Outlook MSO conditionals to guarantee consistent rendering across every inbox.",
    ],
    prerequisites: [
      "Ensure you are logged into your SigSignature account at sigsignature.com.",
      "Free accounts can generate, customize, and export signatures immediately with zero credit card required.",
    ],
    sections: [
      {
        heading: "Step-by-Step Creation Guide",
        steps: [
          {
            number: 1,
            title: "Select a Foundation Template",
            description:
              "Navigate to Templates from your dashboard sidebar. Browse through our curated layout archetypes:",
            substeps: [
              "Executive / Corporate: Formal horizontal layout featuring high-contrast typography, company credentials, and legal disclaimers.",
              "Modern Minimal: Compact two-column design optimized for short correspondence and mobile readability.",
              "Creative / Founder: Prominent circular avatar with highlighted social channels and portfolio booking CTA.",
            ],
            callout: {
              type: "tip",
              text: "Click 'Use Template' to load your chosen foundation into the Design Studio editor.",
            },
          },
          {
            number: 2,
            title: "Enter Personal & Company Details",
            description: "In the left-hand editor sidebar, populate your core identity fields:",
            substeps: [
              "Full Name & Job Title: Keep titles under 45 characters to avoid awkward line wrapping on smartphone screens.",
              "Company Name & Department: Optionally add your business URL with proper https:// protocols.",
              "Contact Information: Phone number, direct email, office address, and calendar booking link (e.g., Calendly, Cal.com).",
            ],
          },
          {
            number: 3,
            title: "Upload Your Avatar Photo or Company Logo",
            description: "Click on the Images tab in the editor sidebar:",
            substeps: [
              "File Formats: Use PNG or JPEG. Avoid SVGs as Gmail and Outlook strip SVG images for security.",
              "Resolution: Upload at 2x resolution (e.g., 160×160px for an 80×80px display) for crisp Retina sharpness.",
              "Cropping & Shape: Choose between Circular, Rounded Rect (8px radius), or Sharp Square.",
            ],
          },
          {
            number: 4,
            title: "Configure Social Icons & Action CTAs",
            description:
              "Connect your professional touchpoints: LinkedIn, X (Twitter), GitHub, YouTube, or your website. Select from 4 icon visual styles (Filled Circle, Minimal Outline, Square, or Brand Colors). Ensure every link is tested and active.",
          },
          {
            number: 5,
            title: "Inspect Live Preview (Desktop & Mobile)",
            description: "Click the Preview Signature button in the top navigation bar. Toggle between:",
            substeps: [
              "Desktop (600px): Simulates standard widescreen Outlook, Apple Mail, and Gmail desktop views.",
              "Mobile (360px): Verifies how horizontal columns stack on iOS Mail and Android Gmail apps.",
            ],
            callout: {
              type: "note",
              text: "Pro Tip for Deliverability: Keep your total HTML file size under 10KB and total image payload under 150KB. Heavy signatures increase spam score triggers on corporate email firewalls (Proofpoint, Mimecast).",
            },
          },
        ],
      },
    ],
    checklist: {
      headers: ["Element", "Recommended Setting", "Why It Matters"],
      rows: [
        [
          "Avatar / Logo Size",
          "65px to 85px max display width",
          "Prevents overpowering email body text on mobile screens.",
        ],
        [
          "Font Hierarchy",
          "Max 2 font families (System safe)",
          "Guarantees exact font fallbacks on Outlook (Word engine).",
        ],
        [
          "Phone Numbers",
          "International format (+1 555-0199)",
          "Enables native one-tap mobile calling without formatting errors.",
        ],
        [
          "Social Icons",
          "Maximum 4–5 core channels",
          "Maintains visual cleanliness and reduces link spam reputation flags.",
        ],
      ],
    },
    keyTakeaways: [
      "Always test your signature in both desktop and mobile viewports before exporting.",
      "Images must be hosted over HTTPS on global CDN endpoints with explicit HTML width/height attributes.",
      "Save your signature to your dashboard so updates automatically propagate across team templates.",
    ],
  },

  "install-gmail": {
    id: "install-gmail",
    slug: "install-gmail",
    title: "Install Your Signature in Gmail (Web & Mobile)",
    eyebrow: "INSTALLATION GUIDE",
    category: "Installation",
    readTime: "2 min read",
    appliesTo: "Gmail Web, Google Workspace, iOS & Android",
    author: "SigSignature Technical Support",
    subtitle:
      "Complete instructions for installing your SigSignature into Google Workspace and personal @gmail.com accounts with zero formatting loss.",
    overview: [
      "Gmail Web uses a rich-text WYSIWYG editor that sanitizes pasted markup. When raw code is pasted improperly, Gmail can strip CSS styles, inject unwanted double line breaks, or turn signature text purple in email threads.",
      "Following this procedure ensures your table structure and images remain 100% intact.",
    ],
    sections: [
      {
        heading: "Installation Walkthrough (Gmail Web)",
        steps: [
          {
            number: 1,
            title: "Copy the Signature from SigSignature",
            description:
              "In your SigSignature dashboard, open your finalized signature and click 'Copy Visual Signature' (or click 'Copy Signature to Clipboard'). Do not copy raw HTML text for Gmail Web; copy the rendered visual output.",
          },
          {
            number: 2,
            title: "Open Gmail Settings",
            description:
              "Open Gmail in Chrome, Safari, or Edge. Click the Settings Gear icon (⚙) in the top-right corner, then click 'See all settings'.",
          },
          {
            number: 3,
            title: "Navigate to the Signature Section",
            description:
              "Under the General tab, scroll down to the Signature section. Click '+ Create new' and name your signature (e.g., 'Work Official' or 'SigSignature').",
          },
          {
            number: 4,
            title: "Paste and Assign Defaults",
            description:
              "Click inside the white signature text box. Paste your signature using keyboard shortcuts:",
            substeps: [
              "Windows: Ctrl + V",
              "Mac: Cmd + V",
              "Under Signature defaults, configure FOR NEW EMAILS USE: Select your new signature name.",
              "Under ON REPLY/FORWARD USE: Select your new signature name.",
            ],
          },
          {
            number: 5,
            title: "Enable the Quoted Text Reply Fix",
            description:
              "Immediately below the signature defaults, check the checkbox: ☑ 'Insert signature before quoted text in replies and remove the \"--\" line that precedes it.'",
            callout: {
              type: "warning",
              text: "Crucial: If this is left unchecked, Gmail pushes your signature all the way to the very bottom of long reply threads underneath quoted history.",
            },
          },
          {
            number: 6,
            title: "Save Changes",
            description:
              "Scroll down to the bottom of the page and click 'Save Changes'. Compose a new email to verify.",
            callout: {
              type: "note",
              text: "Gmail Mobile App Limitation: The official Gmail app for iOS and Android has a built-in plaintext-only mobile signature setting. To send HTML signatures from mobile, disable the 'Mobile Signature' toggle in Gmail App Settings; Gmail will then automatically inherit your desktop HTML signature via Google Workspace cloud sync.",
            },
          },
        ],
      },
    ],
    checklist: {
      headers: ["Issue", "Root Cause", "Exact Solution"],
      rows: [
        [
          "Signature turns purple in replies",
          "Gmail detects repeated text in email history and applies its quoting color.",
          "Normal Gmail client-side behavior. Recipients see your signature in normal brand colors.",
        ],
        [
          "Images appear as broken boxes",
          "Google Image Proxy blocked access to your CDN image URL.",
          "SigSignature CDN automatically serves images over public SSL with open CORS headers.",
        ],
        [
          "Extra space lines between elements",
          "Gmail converted empty <div> tags into extra paragraph breaks.",
          "SigSignature uses strict table rows (<tr>) with explicit line heights to prevent line jumps.",
        ],
      ],
    },
    keyTakeaways: [
      "Always copy via 'Copy Visual Signature' for direct paste into Gmail Web.",
      "Ensure the 'Insert signature before quoted text' checkbox is enabled.",
      "Verify by composing a new email and sending a live test to an external inbox.",
    ],
  },

  "add-outlook": {
    id: "add-outlook",
    slug: "add-outlook",
    title: "Add a Signature to Outlook (Desktop, Web & Mac)",
    eyebrow: "INSTALLATION GUIDE",
    category: "Installation",
    readTime: "4 min read",
    appliesTo: "Outlook 2016/2019/2021, Microsoft 365, Outlook Web, Outlook Mac",
    author: "SigSignature Outlook Engineering Team",
    subtitle:
      "Mastering Outlook email signature setup across Windows desktop, Microsoft 365 OWA, and macOS with perfect image rendering.",
    overview: [
      "Desktop Outlook for Windows does not use a modern browser rendering engine (like Blink or WebKit). Instead, it uses Microsoft Word to render HTML emails.",
      "This creates notorious compatibility challenges: unsupported modern CSS (flexbox, grid, border-radius), distorted images on high-DPI screens, and ignored web fonts. SigSignature incorporates Microsoft Office XML tags (<!--[if mso]>) and table constraints to guarantee your signature renders flawlessly.",
    ],
    sections: [
      {
        heading: "Method 1: Outlook on the Web (Microsoft 365 / OWA)",
        steps: [
          {
            number: 1,
            title: "Copy Signature",
            description: "In SigSignature, click 'Copy Visual Signature'.",
          },
          {
            number: 2,
            title: "Open Outlook Web Settings",
            description:
              "Log in to Outlook on the web (outlook.office.com). Click the Gear icon (⚙) in the top-right toolbar.",
          },
          {
            number: 3,
            title: "Add & Paste Signature",
            description:
              "Navigate to Mail > Compose and reply > Email signature. Click '+ New signature', name it, click in the editor box, and press Ctrl+V (Windows) or Cmd+V (Mac). Set default signatures and click Save.",
          },
        ],
      },
      {
        heading: "Method 2: Outlook for Windows (Desktop Client)",
        steps: [
          {
            number: 1,
            title: "Open Signatures Panel",
            description:
              "In Outlook Desktop, click File > Options > Mail, then click the 'Signatures...' button. (Alternatively: Open a new message, click Signature in the ribbon, and select Signatures...).",
          },
          {
            number: 2,
            title: "Create & Paste",
            description:
              "Click 'New', enter a name, and paste your copied visual signature into the 'Edit signature' field.",
          },
          {
            number: 3,
            title: "Configure Default Accounts",
            description:
              "Under 'Choose default signature', select your email account and assign your new signature to both New messages and Replies/forwards. Click OK.",
            callout: {
              type: "tip",
              text: "High-DPI / 4K Monitor Note: If your photo appears gigantic in Outlook, Outlook ignored CSS dimensions because the image tag lacked an explicit HTML width=\"\" attribute. All SigSignature exports include hardcoded physical HTML width and height attributes to lock dimensions in the Word MSO engine.",
            },
          },
        ],
      },
      {
        heading: "Method 3: Outlook for Mac",
        steps: [
          {
            number: 1,
            title: "Open Mac Preferences",
            description: "In Outlook for Mac, go to Outlook > Settings (or Preferences) > Signatures.",
          },
          {
            number: 2,
            title: "Paste & Select Default",
            description:
              "Click the '+' button, paste your signature into the right panel, close the window, and choose your default signature under Choose default signature.",
          },
        ],
      },
    ],
    checklist: {
      headers: ["Feature", "Outlook Desktop Behavior", "SigSignature Compatibility Fix"],
      rows: [
        [
          "Web Fonts",
          "Ignores Google Fonts, falls back to Times New Roman if unhandled.",
          "Applies MSO font-family fallbacks (e.g. Arial, Helvetica, sans-serif).",
        ],
        [
          "Border Radius (Circles)",
          "Word engine cannot render CSS border-radius on images.",
          "SigSignature pre-crops circular avatars on our server before hosting.",
        ],
        [
          "Table Padding",
          "Ignores standard CSS margin and collapses cell padding.",
          "Uses explicit cellpadding=\"0\" and nested table cell spacers.",
        ],
      ],
    },
    keyTakeaways: [
      "Use 'Copy Visual Signature' for direct paste into Outlook Web and Desktop.",
      "Always assign your signature to both 'New messages' and 'Replies/forwards' in Outlook defaults.",
      "SigSignature's built-in MSO conditional tables ensure 100% layout lock on Word engine versions.",
    ],
  },

  "export-html": {
    id: "export-html",
    slug: "export-html",
    title: "Export Production-Ready HTML & Raw Embed Code",
    eyebrow: "EXPORT & INTEGRATION GUIDE",
    category: "Export",
    readTime: "2 min read",
    appliesTo: "HubSpot, Salesforce, Apple Mail, CRM Platforms",
    author: "SigSignature Core Platform Team",
    subtitle:
      "A technical developer guide to exporting minified, production-grade HTML signatures and integrating them into CRMs, Apple Mail, and custom marketing platforms.",
    overview: [
      "Modern web development techniques (Flexbox, CSS Grid, external stylesheets, SVG graphics) completely fail in standard email clients.",
      "A production-ready email signature must satisfy strict constraints: 100% Inline CSS, nested table architecture, asset hosting on global CDNs, and client-safe universal typography.",
    ],
    sections: [
      {
        heading: "Export Options in SigSignature",
        steps: [
          {
            number: 1,
            title: "Copy Visual Signature (Clipboard)",
            description:
              "Best for direct visual pasting into webmail clients (Gmail, Outlook Web, Yahoo Mail, Thunderbird). Copies rich text and rendered table binaries directly to system clipboard.",
          },
          {
            number: 2,
            title: "Copy HTML Source Code",
            description:
              "Best for CRM templates (HubSpot, Salesforce Lightning, Zoho Mail) and web developers. Copies clean, minified HTML with inline styles and MSO tags.",
          },
          {
            number: 3,
            title: "Download HTML File (.html)",
            description:
              "Downloads a standalone .html file suitable for local archiving, Apple Mail configuration, or programmatic distribution.",
          },
        ],
      },
      {
        heading: "Deploying to Major CRM Platforms",
        steps: [
          {
            number: 1,
            title: "HubSpot CRM",
            description:
              "In HubSpot, navigate to Settings (⚙) > General > Email. In the 'Email signature' box, click the HTML source code button (</>). Paste the minified HTML code exported from SigSignature and click Save.",
          },
          {
            number: 2,
            title: "Salesforce Lightning",
            description:
              "In Salesforce, click your Profile avatar > Settings > Email > My Email Settings. Paste the raw HTML into the Email Signature text area. Check the box to apply to outgoing emails and click Save.",
          },
          {
            number: 3,
            title: "Apple Mail (macOS .mailsignature method)",
            description: "Apple Mail requires replacing the internal binary signature file:",
            substeps: [
              "1. In Apple Mail, create a placeholder signature under Settings > Signatures.",
              "2. Close Apple Mail. Open Terminal and navigate to ~/Library/Mail/V10/MailData/Signatures/.",
              "3. Identify the newest .mailsignature file. Open it in a text editor, replace the body HTML with your exported SigSignature HTML, and lock the file (chflags uchg filename) to prevent Apple Mail from overwriting it.",
            ],
          },
        ],
      },
      {
        heading: "HTML Architecture Anatomy",
        codeSnippet: {
          language: "html",
          code: `<table cellpadding="0" cellspacing="0" border="0" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial, sans-serif;">
  <tbody>
    <tr>
      <td style="vertical-align: top; padding-right: 14px;">
        <img src="https://cdn.sigsignature.com/assets/avatar.png" width="70" height="70" alt="Avatar" style="display: block; border-radius: 50%;" />
      </td>
      <td style="vertical-align: middle;">
        <h3 style="margin: 0px; font-size: 15px; font-weight: 700; color: #0F172A;">Sardar Nadir</h3>
        <p style="margin: 0px; font-size: 12px; color: #64748B;">Product Designer • The Nevon</p>
      </td>
    </tr>
  </tbody>
</table>`,
          caption: "RFC 5322 compliant nested table structure with 100% inline CSS and hardcoded dimensions.",
        },
      },
    ],
    keyTakeaways: [
      "Use Copy HTML Source Code when integrating into CRM systems (HubSpot, Salesforce).",
      "Never paste raw HTML code into rich-text fields; always toggle the code (</>) mode first.",
      "SigSignature's inline code complies with RFC 5322 email body standards.",
    ],
  },

  "fix-image-sizing": {
    id: "fix-image-sizing",
    slug: "fix-image-sizing",
    title: "Fix Image Sizing, Aspect Ratio & Spacing Bugs",
    eyebrow: "TROUBLESHOOTING GUIDE",
    category: "Troubleshooting",
    readTime: "3 min read",
    appliesTo: "Retina Screens, Outlook, Gmail, Webmail",
    author: "SigSignature Deliverability & Rendering Lab",
    subtitle:
      "A comprehensive diagnostic guide to solving blurry photos, giant Outlook logos, circular crop distortion, and unwanted table gaps.",
    overview: [
      "Image rendering anomalies account for over 85% of broken email signatures. Because email clients lack modern layout engines, images must adhere to strict physical attributes and hosting standards.",
      "Use this diagnostic breakdown to identify and resolve image sizing and spacing bugs instantly.",
    ],
    sections: [
      {
        heading: "Issue 1: Blurry Logos & Headshots on High-Resolution Screens",
        paragraphs: [
          "The Symptom: Your profile photo looks sharp in the editor, but appears fuzzy or pixelated on iPhones, MacBooks, and high-DPI Windows laptops.",
          "The Cause: Modern smartphone and laptop displays have a device pixel ratio (DPR) of 2x or 3x. If you display an image at 65×65px and upload a 65×65px source file, the screen stretches those pixels across 130 physical hardware pixels.",
        ],
        steps: [
          {
            number: 1,
            title: "The 2x Retina Rule",
            description:
              "Always upload your headshot or logo at 2x the display dimensions. If the target display is 70×70px, upload a source image of 140×140px (or up to 200×200px max). Ensure your image has an explicit HTML width constraint (width=\"70\"). The browser will squeeze the 140px crisp image into the 70px slot, delivering razor-sharp quality on all screens.",
          },
        ],
      },
      {
        heading: "Issue 2: Giant Oversized Image in Outlook Desktop",
        paragraphs: [
          "The Symptom: An email sent to a recipient on Outlook for Windows displays your company logo at massive, screen-filling size.",
          "The Cause: Microsoft Word's rendering engine ignores CSS styles such as max-width: 100%, width: 70px, or height: auto in style blocks. It reads the physical image metadata or native pixel size.",
        ],
        codeSnippet: {
          language: "html",
          code: `<!-- Correct SigSignature Implementation -->
<img src="https://cdn.sigsignature.com/logo.png"
     width="120"
     height="40"
     style="width: 120px; height: 40px; display: block;"
     alt="Company Logo"
     border="0" />`,
          caption: "Dual-Attribute HTML Constraints: Hardcoded width and height attributes lock dimensions in Word MSO engine.",
        },
      },
      {
        heading: "Issue 3: Circular Avatar Distortion (Oval / Squished Photos)",
        paragraphs: [
          "The Symptom: A circular headshot appears stretched horizontally or vertically like an oval egg.",
          "The Cause: The source image was uploaded with a non-square aspect ratio (e.g. 4:3 or 16:9 rectangle). Applying equal width/height forces uneven pixel stretching.",
          "The Fix: Always use a 1:1 square crop before uploading. SigSignature includes a built-in interactive cropper to ensure your image is exactly 1:1 before saving.",
        ],
      },
      {
        heading: "Issue 4: Mysterious White Gaps Below Images",
        paragraphs: [
          "The Symptom: There is a persistent 2px to 4px blank gap directly underneath your logo or avatar inside its table cell.",
          "The Cause: By default, HTML renders images as inline elements. Browsers reserve vertical baseline space beneath inline elements for typography descenders (e.g., the tail on 'g', 'y', 'p').",
          "The Fix: Add display: block; to every image tag, or set line-height: 0; on the parent <td> container.",
        ],
      },
    ],
    checklist: {
      headers: ["Check", "Correct Standard", "Fail State"],
      rows: [
        [
          "Source File Format",
          "PNG or JPG",
          "SVG, WebP, or GIF (strip or fail on Outlook)",
        ],
        [
          "Aspect Ratio",
          "1:1 Square (for avatars)",
          "Rectangular upload causing oval distortion",
        ],
        [
          "HTML Width Attribute",
          "Hardcoded width=\"X\"",
          "CSS-only width causing Outlook blowout",
        ],
        [
          "Baseline Gap Fix",
          "style=\"display: block;\"",
          "Default inline behavior causing bottom gap",
        ],
        [
          "Image Hosting",
          "HTTPS CDN with public SSL",
          "Local file paths (file:///) or HTTP blocking",
        ],
      ],
    },
    keyTakeaways: [
      "Upload square 1:1 images at 2x resolution for crystal clear Retina displays.",
      "Never rely exclusively on CSS width; always include hardcoded HTML width and height attributes for Outlook.",
      "Ensure all images have display: block; to eliminate unwanted table gap bugs.",
    ],
  },
};
