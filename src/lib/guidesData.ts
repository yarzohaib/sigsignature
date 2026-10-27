// Auto-generated Knowledge Base documentation data for all 19 guides
// Source: /Users/zohaib/Downloads/Help Guides/View_All_Guides

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
  guideNumber?: number;
  isPopular?: boolean;
  title: string;
  eyebrow: string;
  category: string;
  categorySlug?: string;
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

export const ALL_19_GUIDES: DetailedGuide[] = [
  {
    "id": "create-first-email-signature",
    "slug": "create-first-email-signature",
    "guideNumber": 1,
    "isPopular": true,
    "title": "Create Your First Email Signature",
    "eyebrow": "GETTING STARTED GUIDE",
    "category": "Getting started",
    "categorySlug": "getting-started",
    "readTime": "3 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Deliverability Team",
    "subtitle": "Step-by-step walkthrough to design, customize, and preview a bulletproof HTML email signature tailored for your personal brand or team.",
    "overview": [
      "An email signature is not a graphic banner; it is a critical deliverability asset. Unlike standard web pages, email clients (especially Microsoft Outlook and Gmail) use legacy HTML rendering engines. SigSignature automatically compiles your visual design into email-safe nested tables, 100% inline CSS, and Outlook MSO conditionals to guarantee consistent rendering across every inbox.",
      "**Prerequisite:** Ensure you are logged into your SigSignature account at `sigsignature.com`. Free accounts can generate and export personal signatures immediately without any credit card required."
    ],
    "sections": [
      {
        "heading": "Step-by-Step Creation Guide",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Select a Foundation Template",
            "description": "Navigate to **Templates** from your dashboard sidebar. Browse through our curated layout archetypes: Click **Use Template** to load your selection into the Design Studio.",
            "substeps": [
              "**Executive / Corporate:** Formal horizontal layout featuring high-contrast typography, company credentials, and legal disclaimers.",
              "**Modern Minimal:** Compact two-column design optimized for short correspondence and mobile readability.",
              "**Creative / Founder:** Prominent circular avatar with highlighted social channels and portfolio booking CTA."
            ]
          },
          {
            "number": 2,
            "title": "Enter Personal & Company Details",
            "description": "In the left-hand editor sidebar, populate your core identity fields:",
            "substeps": [
              "**Full Name & Job Title:** Keep titles under 45 characters to avoid awkward line wrapping on smartphone screens.",
              "**Company Name & Department:** Optionally add your business URL with proper `https://` protocols.",
              "**Contact Information:** Phone number, direct email, office address, and calendar booking link (e.g., Calendly, Cal.com)."
            ]
          },
          {
            "number": 3,
            "title": "Upload Your Avatar Photo or Company Logo",
            "description": "Click on the **Images** tab in the sidebar:",
            "substeps": [
              "**File Formats:** Use PNG or JPEG. Avoid SVGs as Gmail and Outlook strip SVG images for security.",
              "**Resolution:** Upload at 2x resolution (e.g., 160x160px for an 80x80px display) for crisp Retina display sharpness.",
              "**Cropping & Shape:** Choose between Circular, Rounded Rect (8px radius), or Sharp Square."
            ]
          },
          {
            "number": 4,
            "title": "Configure Social Icons & Action CTAs",
            "description": "Connect your professional touchpoints: LinkedIn, X (Twitter), GitHub, YouTube, or your website. Select from 4 icon visual styles (Filled Circle, Minimal Outline, Square, or Brand Colors). Ensure every link is tested and active."
          },
          {
            "number": 5,
            "title": "Inspect Live Preview (Desktop & Mobile)",
            "description": "Click the **Preview Signature** button in the top navigation. Toggle between: > [!TIP] > **Deliverability Standard:** Keep your total HTML file size under 10KB and total image payload under 150KB. Heavy signatures increase spam score triggers on corporate email firewalls (Proofpoint, Mimecast).",
            "substeps": [
              "**Desktop (600px):** Simulates standard widescreen Outlook, Apple Mail, and Gmail desktop views.",
              "**Mobile (360px):** Verifies how horizontal columns stack on iOS Mail and Android Gmail apps.",
              "---"
            ]
          }
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Element",
        "Recommended Setting",
        "Why It Matters"
      ],
      "rows": [
        [
          "**Avatar / Logo Size**",
          "65px to 85px max display width",
          "Prevents overpowering email body text on mobile screens."
        ],
        [
          "**Font Hierarchy**",
          "Max 2 font families (System safe)",
          "Guarantees exact font fallbacks on Outlook (Word engine)."
        ],
        [
          "**Phone Numbers**",
          "International format (`+1 555-0199`)",
          "Enables native one-tap mobile calling without formatting errors."
        ],
        [
          "**Social Icons**",
          "Maximum 4-5 core channels",
          "Maintains visual cleanliness and reduces link spam reputation flags."
        ]
      ]
    },
    "keyTakeaways": [
      "Always test your signature in both desktop and mobile viewports before exporting.",
      "Images must be hosted over HTTPS on global CDN endpoints with explicit HTML width/height attributes.",
      "Save your signature to your dashboard so updates automatically propagate across team templates."
    ]
  },
  {
    "id": "choose-email-signature-template",
    "slug": "choose-email-signature-template",
    "guideNumber": 2,
    "isPopular": false,
    "title": "Choose the Right Template for Your Role & Industry",
    "eyebrow": "GETTING STARTED GUIDE",
    "category": "Getting started",
    "categorySlug": "getting-started",
    "readTime": "3 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Design Strategy Team",
    "subtitle": "Compare Executive, Minimalist, Creative, and Corporate email signature templates. Learn how to select the best layout for your industry and role.",
    "overview": [
      "Your email signature is the final visual impression of every email you send. A creative freelancer communicating with a boutique design agency requires a completely different visual hierarchy than an enterprise consultant sending contracts to Fortune 500 legal teams.",
      "SigSignature categorizes templates into 4 foundational archetypes. Selecting the correct archetype ensures your email footer reinforces your professional credibility without creating visual friction."
    ],
    "sections": [
      {
        "heading": "The 4 Foundational Template Archetypes",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Executive & Corporate",
            "description": "Executive & Corporate",
            "substeps": [
              "**Best For:** C-Suite executives, corporate directors, legal advisors, financial consultants, and enterprise sales teams.",
              "**Layout Structure:** Formal horizontal grid layout. Prominent corporate branding on the left, clear two-tier title typography, direct corporate phone lines, physical headquarters address, and regulatory disclaimers.",
              "**Key Strength:** Conveys institutional weight, regulatory compliance, and security."
            ]
          },
          {
            "number": 2,
            "title": "Modern Minimalist",
            "description": "Modern Minimalist",
            "substeps": [
              "**Best For:** Software engineers, developers, startup founders, technical consultants, and venture operators.",
              "**Layout Structure:** Ultra-compact single or dual-column layout. High optical contrast, monochrome or single-accent palette, zero unnecessary decorative borders. Focuses on Name, Role, Verified Domain, and GitHub / LinkedIn links.",
              "**Key Strength:** Renders flawlessly on mobile screens and respects the recipient's attention with zero visual bloat."
            ]
          },
          {
            "number": 3,
            "title": "Creative & Portfolio",
            "description": "Creative & Portfolio",
            "substeps": [
              "**Best For:** Creative directors, UI/UX designers, photographers, marketing strategists, and agency owners.",
              "**Layout Structure:** Prominent high-resolution circular avatar or studio wordmark, expressive accent color rule, portfolio hyperlink, and direct calendar link (e.g. Cal.com / Calendly).",
              "**Key Strength:** Balances human approachability with design polish."
            ]
          },
          {
            "number": 4,
            "title": "Sales & Commercial Growth",
            "description": "Sales & Commercial Growth",
            "substeps": [
              "**Best For:** Account executives, business development managers, real estate agents, and recruitment specialists.",
              "**Layout Structure:** Dual-contact columns with prominent direct cell and WhatsApp numbers, headshot avatar, and an optional 600x120px promotional banner slot highlighting active case studies or webinars.",
              "**Key Strength:** Maximizes response velocity and booked discovery meetings.",
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Step-by-Step: Switching Templates in the Design Studio",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In the SigSignature editor, click the **Templates** tab in the top navigation bar.",
            "description": "In the SigSignature editor, click the **Templates** tab in the top navigation bar."
          },
          {
            "number": 2,
            "title": "Select your desired archetype from the preview grid.",
            "description": "Select your desired archetype from the preview grid."
          },
          {
            "number": 3,
            "title": "Your existing contact details, uploaded avatar, and custom links will automatically map into the new layout architecture.",
            "description": "Your existing contact details, uploaded avatar, and custom links will automatically map into the new layout architecture."
          },
          {
            "number": 4,
            "title": "Review the preview in both Desktop (600px) and Mobile (360px) viewports before saving.",
            "description": "Review the preview in both Desktop (600px) and Mobile (360px) viewports before saving.",
            "substeps": [
              "---"
            ]
          }
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Professional Role",
        "Recommended Template",
        "Key Visual Elements",
        "What to Avoid"
      ],
      "rows": [
        [
          "**Founder / CEO**",
          "Modern Minimal or Executive",
          "High-contrast title, company domain, single primary channel",
          "Overloaded social links, motivational quotes"
        ],
        [
          "**Enterprise Sales**",
          "Commercial Growth",
          "Verified cell, meeting booking link, concise promotional badge",
          "Personal social handles (Instagram/TikTok)"
        ],
        [
          "**Software Developer**",
          "Modern Minimal",
          "Clean GitHub & LinkedIn nodes, light footprint (<5KB)",
          "Heavy graphic banners, multiple phone numbers"
        ],
        [
          "**Agency / Designer**",
          "Creative & Portfolio",
          "Sharp headshot avatar, portfolio link, refined accent color",
          "Generic clip art, busy multi-colored icons"
        ],
        [
          "**Consultant / Legal**",
          "Corporate Standard",
          "Full entity name, license numbers, mandatory legal disclaimer",
          "Casual headshots, emojis, animated GIFs"
        ]
      ]
    },
    "keyTakeaways": [
      "Choose a template that matches your recipient's expectations, not just your personal aesthetic preference.",
      "Mobile readability is paramount: ensure your template does not force horizontal scrolling on 360px smartphones.",
      "You can switch templates at any time without re-entering your contact information."
    ]
  },
  {
    "id": "format-contact-details",
    "slug": "format-contact-details",
    "guideNumber": 3,
    "isPopular": false,
    "title": "Add and Format Your Personal & Contact Details",
    "eyebrow": "GETTING STARTED GUIDE",
    "category": "Getting started",
    "categorySlug": "getting-started",
    "readTime": "2 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Deliverability Team",
    "subtitle": "Best practices for formatting job titles, international phone numbers (tel: links), company URLs, and calendar booking links in email signatures.",
    "overview": [
      "When email recipients inspect your signature, they are usually hunting for one specific piece of information: your phone number, your calendar booking link, or your official job title. If that information is buried inside five lines of secondary addresses and disorganized links, the signature fails its primary objective.",
      "Formatting your contact details correctly guarantees that mobile users can call or book meetings with a single tap, while preventing email clients from injecting ugly blue auto-links."
    ],
    "sections": [
      {
        "heading": "Step-by-Step Formatting Instructions",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Formatting Full Name & Professional Title",
            "description": "Formatting Full Name & Professional Title",
            "substeps": [
              "**Full Name:** Use standard title case (e.g., `Sardar Muhammad Nadir`). Avoid all-caps typography as it appears aggressive in inbox previews.",
              "**Job Title:** Keep your primary title under 45 characters (e.g., `Head of Product Engineering`). If you hold dual roles, separate them with a vertical pipe `|` or a clean slash `/` (e.g., `Founder | CEO`).",
              "**Avoid:** Long academic qualifications or honorific strings unless strictly required by your professional governing board."
            ]
          },
          {
            "number": 2,
            "title": "International Phone Number Protocols",
            "description": "Mobile operating systems (iOS and Android) automatically scan email bodies for phone patterns and turn them into hyperlinks. If improperly formatted, Apple Mail will turn your phone number into an unstyled bright blue link that clashes with your brand palette. `+1 (555) 234-5678` or `+92 300 1234567` `<a href=\"tel:+15552345678\" style=\"color: inherit; text-decoration: none;\">+1 (555) 234-5678</a>` This prevents email clients from overriding your typography while enabling native 1-tap mobile dialing.",
            "substeps": [
              "**Standard Format:** Always include your international country code:",
              "**Under the Hood:** SigSignature wraps phone numbers in explicit `tel:` protocols with inline styling:"
            ]
          },
          {
            "number": 3,
            "title": "Web URLs & Verified Domains",
            "description": "Web URLs & Verified Domains",
            "substeps": [
              "Display clean, human-readable domain strings (e.g., `sigsignature.com` or `thenevon.com`).",
              "SigSignature automatically binds the underlying `href` attribute with secure `https://` encryption.",
              "Never use raw URL shorteners (e.g., bit.ly) in your email signature as commercial spam filters flag shortened links as potential phishing vectors."
            ]
          },
          {
            "number": 4,
            "title": "Direct Meeting Booking Links (Calendly, Cal.com)",
            "description": "Adding a calendar link accelerates meeting scheduling by eliminating back-and-forth emails:",
            "substeps": [
              "Use a crisp, actionable CTA label: `Book a 15-min Call` or `Schedule Discovery Session`.",
              "Avoid placing massive button blocks next to tiny text rows. Keep calendar links inline with a clean calendar icon badge.",
              "---"
            ]
          }
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Field",
        "Priority",
        "Recommendation",
        "Example"
      ],
      "rows": [
        [
          "**Full Name**",
          "Mandatory",
          "Primary font size (14-16px), bold",
          "`Sardar Nadir`"
        ],
        [
          "**Job Title**",
          "Mandatory",
          "Secondary font size (11-13px), muted tone",
          "`Product Strategist`"
        ],
        [
          "**Company Name**",
          "Mandatory",
          "Bold or uppercase sub-label",
          "`The Nevon`"
        ],
        [
          "**Direct Phone**",
          "High",
          "Include international country code",
          "`+92 42 3587 0000`"
        ],
        [
          "**Official Website**",
          "High",
          "Clean root domain without http:// prefix",
          "`www.sigsignature.com`"
        ],
        [
          "**Calendar Link**",
          "Optional",
          "High-conversion meetings link",
          "`cal.com/sardar-thenevon`"
        ],
        [
          "**Physical Address**",
          "Optional",
          "Only include if client foot traffic is expected",
          "`DHA Phase 5, Lahore`"
        ],
        [
          "**Personal Fax / 2nd Cell**",
          "Deprecated",
          "Remove completely to eliminate clutter",
          "N/A"
        ]
      ]
    },
    "keyTakeaways": [
      "Restrict contact rows to a maximum of 3-4 clean lines.",
      "Always use international telephone formats to guarantee seamless one-tap dialing on smartphones.",
      "Keep URLs clean and human-readable while ensuring secure HTTPS destination links."
    ]
  },
  {
    "id": "preview-desktop-mobile-signature",
    "slug": "preview-desktop-mobile-signature",
    "guideNumber": 4,
    "isPopular": false,
    "title": "Live Preview: Inspect Desktop (600px) and Mobile (360px) Views",
    "eyebrow": "GETTING STARTED GUIDE",
    "category": "Getting started",
    "categorySlug": "getting-started",
    "readTime": "2 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature QA Engineering Team",
    "subtitle": "Learn how to test your email signature in desktop (600px) and mobile (360px) viewports inside the SigSignature editor before exporting.",
    "overview": [
      "Over 55% of all commercial emails are opened on mobile devices (Apple Mail for iPhone and the Gmail mobile app). Yet most professionals design their signatures on a 27-inch desktop monitor.",
      "When an email signature designed at 600px width hits a 375px mobile screen, one of two disastrous things happens: 1. The email client scales the entire email down to fit the screen, making the body text microscopic and unreadable. 2. The columns fail to collapse, forcing the recipient to scroll horizontally to read your contact details.",
      "SigSignature's built-in **Live Dual-Viewport Inspector** allows you to audit responsive behavior in real time before exporting a single line of code."
    ],
    "sections": [
      {
        "heading": "How to Use the Live Preview Inspector",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Activating the Preview Mode",
            "description": "In the SigSignature Design Studio, locate the viewport toggle in the top-right toolbar:",
            "substeps": [
              "**Desktop View (600px):** Simulates wide reading panes in Outlook 365, Gmail Web, and Apple Mail on macOS.",
              "**Mobile View (360px):** Simulates modern iOS and Android viewport constraints."
            ]
          },
          {
            "number": 2,
            "title": "What to Inspect in Desktop Mode (600px)",
            "description": "What to Inspect in Desktop Mode (600px)",
            "substeps": [
              "**Horizontal Balance:** Verify that your logo, name, title, and contact columns maintain comfortable optical alignment.",
              "**Vertical Divider Rules:** Ensure vertical hairline separators (`|` or `1px solid border`) do not clip or create unnatural gaps.",
              "**Banner Width:** If you use a marketing banner, confirm it does not exceed the standard 600px maximum width."
            ]
          },
          {
            "number": 3,
            "title": "What to Inspect in Mobile Mode (360px)",
            "description": "What to Inspect in Mobile Mode (360px)",
            "substeps": [
              "**Column Stacking:** SigSignature uses responsive table architecture. Inspect how horizontal modules stack vertically on narrow screens.",
              "**Text Wrapping:** Ensure job titles and company names do not wrap awkwardly into single-word lines (e.g., breaking \"Executive\" onto a new line).",
              "**Tap Target Spacing:** Verify that social icons and phone links have at least 8px of padding between them so users can tap them without mis-clicking.",
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Pre-Export Checklist",
        "paragraphs": [
          "Before clicking **Export HTML** or **Copy Visual Signature**:"
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Metric",
        "Desktop Standard",
        "Mobile Standard",
        "Deliverability Rationale"
      ],
      "rows": [
        [
          "**Canvas Max Width**",
          "600px",
          "320px - 360px",
          "600px prevents horizontal overflow in default email reading panes."
        ],
        [
          "**Logo Display Width**",
          "70px - 90px",
          "60px - 75px",
          "Prevents oversized images from dominating small phone screens."
        ],
        [
          "**Minimum Tap Target**",
          "24px x 24px",
          "36px x 36px",
          "Apple Human Interface Guidelines require touchable icons."
        ],
        [
          "**HTML Payload Weight**",
          "<10KB",
          "<10KB",
          "Emails over 102KB get clipped by Gmail; signatures must stay tiny."
        ]
      ]
    },
    "keyTakeaways": [
      "Never deploy an email signature without inspecting both Desktop and Mobile viewports.",
      "Keep column widths flexible and text strings concise to prevent awkward mobile line wraps.",
      "SigSignature automatically handles the underlying responsive table math so you never have to edit media queries manually."
    ]
  },
  {
    "id": "fix-image-sizing-spacing",
    "slug": "fix-image-sizing-spacing",
    "guideNumber": 5,
    "isPopular": true,
    "title": "Fix Image Sizing, Aspect Ratio & Spacing Bugs",
    "eyebrow": "DESIGN & TEMPLATES GUIDE",
    "category": "Design & templates",
    "categorySlug": "design-templates",
    "readTime": "3 min read",
    "appliesTo": "Retina Screens, Outlook, Gmail, Webmail",
    "author": "SigSignature Deliverability & Rendering Lab",
    "subtitle": "Complete diagnostic guide to solving blurry photos, giant Outlook logos, circular crop distortion, and unwanted table gaps in email signatures.",
    "overview": [
      "Images in email signatures are notoriously fragile. Because email clients do not support modern CSS standards like `object-fit: cover` or responsive `aspect-ratio` properties, minor markup mistakes can cause your company logo to blow up to 1200px wide in Outlook or look blurry on iPhones.",
      "This guide provides tested, verified fixes for the 4 most common image bugs in email signature design."
    ],
    "sections": [
      {
        "heading": "Diagnostic Breakdown: 4 Common Image Issues",
        "paragraphs": [
          "### Issue 1: Blurry Logos & Headshots on High-Resolution Screens 1. Always upload your headshot or logo at exactly 2x display dimensions. 2. If the target display is 70x70px, upload a source image of 140x140px (or up to 200x200px max). 3. Ensure your image has explicit HTML width constraints (`width=\"70\"`). The browser will squeeze the 140px crisp image into the 70px slot, delivering razor-sharp quality on all screens.",
          "### Issue 2: Giant Oversized Image in Outlook Desktop SigSignature automatically injects both inline CSS styles AND hardcoded HTML tag attributes: `<img src=\"...\" width=\"70\" height=\"70\" style=\"display: block; width: 70px; height: 70px; border: 0;\" />` This forces Outlook's Word engine to constrain the image regardless of source file dimensions.",
          "### Issue 3: Oval or Stretched Headshots (Aspect Ratio Distortion) Always crop your headshot to an exact 1:1 square aspect ratio before uploading, or use SigSignature's built-in image cropper to center your face inside a perfect square bounding box.",
          "### Issue 4: Random White Gaps or Padding Below Images Always apply `style=\"display: block;\"` to all signature image elements. SigSignature applies this rule natively to every image container."
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Metric",
        "Ideal Standard",
        "Supported Formats",
        "Avoid"
      ],
      "rows": [
        [
          "**Avatar Display**",
          "65px - 80px",
          "PNG, JPEG",
          "SVG (stripped by Outlook & Gmail)"
        ],
        [
          "**Logo Display**",
          "120px - 160px max",
          "PNG (transparent)",
          "Uncompressed TIFF or BMP files"
        ],
        [
          "**Marketing Banner**",
          "600px width x 100px height",
          "JPEG, Web-optimized PNG",
          "Banners taller than 150px"
        ],
        [
          "**Max File Payload**",
          "Under 50KB per image",
          "High-compression Web",
          "Raw 5MB camera exports"
        ]
      ]
    },
    "keyTakeaways": [
      "Follow the 2x Retina formula: upload at twice the display dimensions with hardcoded HTML width attributes.",
      "Always crop profile photos to an exact 1:1 square before applying circular frames.",
      "Host all images on global HTTPS CDNs with permanent cache headers."
    ]
  },
  {
    "id": "customize-brand-colors",
    "slug": "customize-brand-colors",
    "guideNumber": 6,
    "isPopular": false,
    "title": "Customize Brand Colors, Themes & Accent Palettes",
    "eyebrow": "DESIGN & TEMPLATES GUIDE",
    "category": "Design & templates",
    "categorySlug": "design-templates",
    "readTime": "3 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Design System Lab",
    "subtitle": "Master brand color palettes in email signatures. Learn the 1-accent color rule, WCAG AA contrast standards, and how to avoid rainbow clutter.",
    "overview": [
      "Color in an email signature is an accent, not a canvas. When signatures feature five different colors (red titles, blue phone numbers, green website links, and orange social icons), the recipient's eye experiences visual fatigue, and the email takes on the appearance of an advertising banner.",
      "SigSignature enforces an **authoritative single-accent design system**. By selecting one primary brand color, your signature looks cohesive, premium, and calm across every inbox."
    ],
    "sections": [
      {
        "heading": "The 3 Color Pillars of a Professional Signature",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Primary Text Color (Carbon Black or Deep Slate)",
            "description": "Primary Text Color (Carbon Black or Deep Slate)",
            "substeps": [
              "**Hex Recommendation:** `#1A1A1A` or `#1E293B`",
              "Used for: Full Name, essential contact labels.",
              "**Why:** Pure black (`#000000`) can look harsh on modern screens. Carbon black provides deep, crisp contrast while appearing softer and more refined."
            ]
          },
          {
            "number": 2,
            "title": "Secondary Text Color (Muted Slate / Charcoal)",
            "description": "Secondary Text Color (Muted Slate / Charcoal)",
            "substeps": [
              "**Hex Recommendation:** `#64748B` or `#475569`",
              "Used for: Job Title, Company Department, phone label prefixes (e.g. `O:`, `M:`).",
              "**Why:** Creates optical hierarchy. The eye immediately identifies the individual's name first, then moves smoothly to supporting credentials."
            ]
          },
          {
            "number": 3,
            "title": "The Single Brand Accent Color",
            "description": "The Single Brand Accent Color",
            "substeps": [
              "**Hex Recommendation:** Your official brand color (e.g. Electric Cyan `#00D5F5`, Royal Cobalt `#01285D`, Emerald `#10B981`, or Crimson `#E63946`).",
              "Used for: Vertical divider hairline rules, active hyperlink URLs, and social icon glyphs.",
              "**The Rule:** Limit this accent to exactly ONE color throughout the entire signature layout.",
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Step-by-Step: Setting Custom Hex Codes in the Editor",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Open your signature in the **Design Studio**.",
            "description": "Open your signature in the **Design Studio**."
          },
          {
            "number": 2,
            "title": "Click the **Colors & Theme** tab in the left-hand navigation.",
            "description": "Click the **Colors & Theme** tab in the left-hand navigation."
          },
          {
            "number": 3,
            "title": "In the **Primary Accent** field, type your organization's exact 6-character hex code (e.g., `#01285D`).",
            "description": "In the **Primary Accent** field, type your organization's exact 6-character hex code (e.g., `#01285D`)."
          },
          {
            "number": 4,
            "title": "Select your **Icon Theme**:",
            "description": "Select your **Icon Theme**:",
            "substeps": [
              "**Monochrome:** Icons use your muted secondary text color for ultra-minimalism.",
              "**Accent Matched:** All icons dynamically adapt your brand accent color.",
              "**Brand Native:** Icons use their official corporate brand colors (LinkedIn blue, X black, etc.)."
            ]
          },
          {
            "number": 5,
            "title": "Check the Live Preview to ensure high contrast against a white inbox background.",
            "description": "Check the Live Preview to ensure high contrast against a white inbox background.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Accessibility & Contrast Standards (WCAG AA Compliance)",
        "paragraphs": [
          "Email clients frequently alter background luminosity (especially in Dark Mode). To guarantee readability:"
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Industry",
        "Primary Text",
        "Secondary Muted",
        "Recommended Accent",
        "Emotional Impression"
      ],
      "rows": [
        [
          "**Tech & SaaS**",
          "`#0F172A`",
          "`#64748B`",
          "Electric Cyan (`#00D5F5`)",
          "Modern, forward-thinking, precise"
        ],
        [
          "**Finance & Legal**",
          "`#111827`",
          "`#4B5563`",
          "Deep Navy (`#0A2540`)",
          "Institutional stability, trustworthy"
        ],
        [
          "**Creative & Design**",
          "`#18181B`",
          "`#71717A`",
          "Vivid Vermilion (`#E63946`)",
          "Bold, authoritative, memorable"
        ],
        [
          "**Healthcare & Biotech**",
          "`#022C22`",
          "`#4B5563`",
          "Deep Emerald (`#059669`)",
          "Clean, calming, reliable"
        ]
      ]
    },
    "keyTakeaways": [
      "Stick to the 1-accent color rule to prevent your signature from looking like a carnival flyer.",
      "Ensure your text passes WCAG 4.5:1 contrast standards against white backgrounds.",
      "Use muted slate for titles and labels to establish clear typographic hierarchy."
    ]
  },
  {
    "id": "upload-logo-headshot-retina",
    "slug": "upload-logo-headshot-retina",
    "guideNumber": 7,
    "isPopular": false,
    "title": "Upload Logos & Headshots Without Blur or Distortion",
    "eyebrow": "DESIGN & TEMPLATES GUIDE",
    "category": "Design & templates",
    "categorySlug": "design-templates",
    "readTime": "3 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Assets & Delivery Team",
    "subtitle": "How to upload headshots and company logos at 2x Retina resolution with explicit HTML width/height attributes so they never appear blurry or oversized.",
    "overview": [
      "Most modern laptops, iPhones, and Android smartphones feature high-DPI displays (Retina, OLED, 4K). These displays pack 2x to 3x more physical hardware pixels into every square inch.",
      "If you upload an image cropped to exactly 70x70px and display it at 70x70px, high-DPI screens must stretch that image across 140 or 210 physical hardware pixels. The result is a blurry, fuzzy headshot or logo that undermines your professional image.",
      "This guide outlines how to format, compress, and upload images that look razor-sharp on every high-DPI screen without triggering spam filters."
    ],
    "sections": [
      {
        "heading": "The 2x Retina Golden Rule",
        "paragraphs": [
          "To achieve crisp rendering on high-DPI screens: > **Upload an image whose physical pixel dimensions are exactly double (2x) the target display dimensions.**",
          "Target Display Size in Signature: `75px x 75px` Upload Source Dimensions: `150px x 150px` Target Display Size in Signature: `140px width x 40px height` Upload Source Dimensions: `280px width x 80px height`",
          "SigSignature automatically sets the explicit HTML attribute `width=\"75\"` while serving the 150px source asset. The browser squeezes the crisp image into the smaller slot, achieving pixel-perfect clarity."
        ]
      },
      {
        "heading": "File Format Selection: PNG vs. JPEG vs. SVG",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Company Logos: Transparent PNG",
            "description": "Company Logos: Transparent PNG",
            "substeps": [
              "**Format:** PNG-24 with alpha transparency.",
              "**Why:** Transparent backgrounds ensure your logo renders cleanly whether the recipient uses Light Mode, Dark Mode, or a tinted background.",
              "**Warning:** Never use solid white background boxes around your logo, as they turn into ugly white squares in Dark Mode."
            ]
          },
          {
            "number": 2,
            "title": "Personal Headshots: Web-Optimized JPEG or PNG",
            "description": "Personal Headshots: Web-Optimized JPEG or PNG",
            "substeps": [
              "**Format:** JPEG (quality 85%) or PNG.",
              "**Why:** JPEG provides superior compression for photographic gradients, keeping file weight under 30KB."
            ]
          },
          {
            "number": 3,
            "title": "Why SVG is Strictly Forbidden in Email",
            "description": "While SVGs are the gold standard for web design, **email clients strictly block or sanitize SVG images**. Both Microsoft Outlook and Gmail treat SVGs as security risks (potential XML injection vulnerabilities) and replace them with broken image icons. Always export SVGs to high-resolution transparent PNGs before uploading.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Step-by-Step Upload Walkthrough",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In the SigSignature editor, click on **Images** in the left sidebar.",
            "description": "In the SigSignature editor, click on **Images** in the left sidebar."
          },
          {
            "number": 2,
            "title": "Select whether you are uploading an **Avatar (Headshot)** or a **Company Logo**.",
            "description": "Select whether you are uploading an **Avatar (Headshot)** or a **Company Logo**."
          },
          {
            "number": 3,
            "title": "Drag and drop your 2x image file into the upload zone.",
            "description": "Drag and drop your 2x image file into the upload zone."
          },
          {
            "number": 4,
            "title": "Use the interactive cropping modal:",
            "description": "Use the interactive cropping modal:",
            "substeps": [
              "**Circle:** Best for headshots; centers the face with balanced padding.",
              "**Rounded Rect (8px):** Clean modern corner rounding for square logos.",
              "**Sharp Square (0px):** Architectural corporate standard."
            ]
          },
          {
            "number": 5,
            "title": "Click **Apply Image**. SigSignature instantly optimizes the file and pushes it to our global HTTPS CDN.",
            "description": "Click **Apply Image**. SigSignature instantly optimizes the file and pushes it to our global HTTPS CDN.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Image File Weight & Deliverability Limits",
        "paragraphs": [],
        "table": {
          "headers": [
            "Parameter",
            "Recommended Standard",
            "Maximum Hard Limit",
            "Consequence of Exceeding"
          ],
          "rows": [
            [
              "**Avatar File Size**",
              "20KB - 35KB",
              "80KB",
              "Slow loading on mobile data connections"
            ],
            [
              "**Logo File Size**",
              "15KB - 30KB",
              "60KB",
              "Increases total email payload"
            ],
            [
              "**Total Signature Images**",
              "Under 100KB combined",
              "150KB",
              "Spam score penalty on enterprise firewalls"
            ],
            [
              "**CDN Protocol**",
              "HTTPS strictly",
              "HTTPS strictly",
              "Mixed content security warnings in Gmail"
            ]
          ]
        }
      }
    ],
    "keyTakeaways": [
      "Always export your images at 2x resolution and let HTML constraints handle the scaling.",
      "Never use SVGs in email signatures; always upload transparent PNGs.",
      "Keep individual image file sizes under 50KB to maintain top deliverability scores."
    ]
  },
  {
    "id": "email-safe-fonts-fallbacks",
    "slug": "email-safe-fonts-fallbacks",
    "guideNumber": 8,
    "isPopular": false,
    "title": "Email-Safe Typography: Font Pairing & System Fallbacks",
    "eyebrow": "DESIGN & TEMPLATES GUIDE",
    "category": "Design & templates",
    "categorySlug": "design-templates",
    "readTime": "3 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Typography Lab",
    "subtitle": "Discover which fonts render safely across Outlook, Gmail, and Apple Mail. Master multi-tier fallback stacks to prevent the Times New Roman trap.",
    "overview": [
      "In web development, you can import any custom font using Google Fonts or Adobe Typekit. In email development, attempting to use an external web font without proper defensive coding creates a notorious disaster: **The Times New Roman Trap**.",
      "When Microsoft Outlook for Windows encounters a font that is not pre-installed on the recipient's computer (or linked via external `@import` tags), it silently fails. Instead of falling back to a clean sans-serif font like Arial, Outlook's Word engine defaults to 12pt serif Times New Roman, completely destroying your visual branding.",
      "SigSignature uses multi-tiered, battle-tested font stacks to ensure your typography remains clean and professional everywhere."
    ],
    "sections": [
      {
        "heading": "Universal Email-Safe Fonts (Tier 1)",
        "paragraphs": [
          "These fonts are pre-installed on virtually 100% of all Windows, macOS, iOS, and Android devices worldwide:"
        ]
      },
      {
        "heading": "How SigSignature Implements Safe Fallback Stacks",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "When you select a modern font in SigSignature (such as Plus Jakarta Sans or Inter), our compiler does not simply output `font-family: 'Inter';`. Instead, it writes a defensive, cascading font stack directly onto every table cell:",
            "description": "```html <td style=\"font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 18px; color: #1a1a1a;\"> Sardar Muhammad Nadir </td> ``` ### How Clients Process This Stack:"
          },
          {
            "number": 2,
            "title": "**Apple Mail & Modern Webmail:** Detects the high-end font and renders it with full anti-aliased sharpness.",
            "description": "**Apple Mail & Modern Webmail:** Detects the high-end font and renders it with full anti-aliased sharpness."
          },
          {
            "number": 3,
            "title": "**Standard Windows Systems:** If the custom font is absent, it renders crisp `Segoe UI` or `Arial`.",
            "description": "**Standard Windows Systems:** If the custom font is absent, it renders crisp `Segoe UI` or `Arial`."
          },
          {
            "number": 4,
            "title": "**Legacy Outlook Desktop:** Safely falls back to `Arial`, completely bypassing the Times New Roman bug.",
            "description": "**Legacy Outlook Desktop:** Safely falls back to `Arial`, completely bypassing the Times New Roman bug.",
            "substeps": [
              "---"
            ]
          }
        ],
        "codeSnippet": {
          "language": "html",
          "code": "<td style=\"font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 18px; color: #1a1a1a;\">\n  Sardar Muhammad Nadir\n</td>"
        }
      },
      {
        "heading": "Font Sizing & Line Height Hierarchy Rules",
        "paragraphs": [
          "To guarantee readability across desktop monitors and mobile phone screens, adhere to these proportion standards:",
          "> [!CAUTION] > **Line Height Rule:** Always declare explicit pixel line heights (e.g., `line-height: 18px;`). If you omit line-height or use unitless values (`line-height: 1.2;`), Outlook Desktop often collapses lines or injects arbitrary 24px vertical white spaces."
        ],
        "table": {
          "headers": [
            "Hierarchy Level",
            "Recommended Size",
            "Weight",
            "Recommended Line Height"
          ],
          "rows": [
            [
              "**Full Name**",
              "14px - 16px",
              "Bold (700)",
              "18px - 20px"
            ],
            [
              "**Job Title & Company**",
              "11px - 13px",
              "Semi-Bold or Regular",
              "16px"
            ],
            [
              "**Contact Labels & URLs**",
              "11px - 12px",
              "Regular (400)",
              "15px - 16px"
            ],
            [
              "**Legal Disclaimers**",
              "9px - 10px",
              "Regular (400)",
              "13px - 14px"
            ]
          ]
        }
      }
    ],
    "keyTakeaways": [
      "Never rely on custom web fonts without an explicit system fallback stack.",
      "Stick to maximum two font sizes and one font family per signature layout.",
      "Always specify explicit pixel line-heights to prevent Outlook from distorting your vertical spacing."
    ]
  },
  {
    "id": "dark-mode-email-signature",
    "slug": "dark-mode-email-signature",
    "guideNumber": 9,
    "isPopular": false,
    "title": "Optimize Signatures for Dark Mode & Color Inversion",
    "eyebrow": "DESIGN & TEMPLATES GUIDE",
    "category": "Design & templates",
    "categorySlug": "design-templates",
    "readTime": "3 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Rendering Lab",
    "subtitle": "Prevent ugly white logo bounding boxes and unreadable text in dark mode across Outlook, Gmail, and Apple Mail with these proven design techniques.",
    "overview": [
      "Over 40% of smartphone and desktop users now read emails with Dark Mode enabled. However, \"Dark Mode\" is not a standardized web technology in email. Each major email client applies its own aggressive color inversion algorithm:",
      "1. **Apple Mail (No Inversion / Partial):** Respects HTML background colors; only inverts plain text when no background is specified. 2. **Gmail (Partial Inversion):** Converts light backgrounds to dark slate, and shifts dark text to light gray. Leaves colored buttons intact. 3. **Outlook 365 (Full Inversion):** Aggressively inverts all colors: `#FFFFFF` becomes `#1E1E1E`, and dark text becomes pure white.",
      "If your email signature is not engineered defensively, your black company logo will vanish into the black background, or your headshot will be framed by an embarrassing, glowing white rectangle."
    ],
    "sections": [
      {
        "heading": "3 Critical Rules for Dark Mode Compatibility",
        "paragraphs": [
          "### Rule 1: The Transparent PNG Cutout (Eliminate White Squares)",
          "### Rule 2: The Subtle Light Glow Trick for Dark Logos",
          "### Rule 3: Avoid Pure Black and Pure White Text"
        ]
      },
      {
        "heading": "How to Test Dark Mode Before Sending",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In the SigSignature editor, preview your signature in both Desktop and Mobile views.",
            "description": "In the SigSignature editor, preview your signature in both Desktop and Mobile views."
          },
          {
            "number": 2,
            "title": "Send a live test email to:",
            "description": "Send a live test email to:",
            "substeps": [
              "A personal iPhone with iOS Dark Mode toggled ON.",
              "A desktop Outlook account with Dark Theme enabled."
            ]
          },
          {
            "number": 3,
            "title": "Check:",
            "description": "Check:",
            "substeps": [
              "Does your company logo remain completely legible?",
              "Are there any awkward white bounding boxes around icons or avatars?",
              "Are telephone numbers and links readable without clashing?",
              "---"
            ]
          }
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Email Client",
        "Inversion Type",
        "What Happens to Logos",
        "Recommended Defense"
      ],
      "rows": [
        [
          "**Apple Mail (iOS & Mac)**",
          "Minimal / Native",
          "Renders exactly as coded; dark backgrounds stay dark",
          "Transparent PNG with high contrast"
        ],
        [
          "**Gmail Web**",
          "Partial Inversion",
          "Text shifts to light; transparent images unaffected",
          "Transparent PNG; avoid low-contrast grays"
        ],
        [
          "**Outlook for Windows**",
          "Full Inversion",
          "White backgrounds inverted to black; text inverted to white",
          "Explicit MSO background tags + 2px light logo stroke"
        ],
        [
          "**Outlook Mobile (iOS/Android)**",
          "Full Inversion",
          "High-contrast inversion of all table containers",
          "Test on real device before deployment"
        ]
      ]
    },
    "keyTakeaways": [
      "Never use JPEG logos with white backgrounds; always use transparent PNGs.",
      "Add a subtle 1-2px light outer glow to black logos to keep them visible on dark canvases.",
      "Always send a live test email to a phone with Dark Mode enabled before rolling out across a team."
    ]
  },
  {
    "id": "social-icons-badges-cta",
    "slug": "social-icons-badges-cta",
    "guideNumber": 10,
    "isPopular": false,
    "title": "Add Social Media Icons, Badges & Custom CTAs",
    "eyebrow": "DESIGN & TEMPLATES GUIDE",
    "category": "Design & templates",
    "categorySlug": "design-templates",
    "readTime": "2 min read",
    "appliesTo": "All Plans & Templates",
    "author": "SigSignature Growth & Integration Team",
    "subtitle": "Add verified social media icons, app store badges, calendar buttons, and promotional CTAs to your email signature without triggering spam filters.",
    "overview": [
      "Your email signature is not just a digital business card; it is an owned marketing touchpoint. Every email you send to clients, leads, and partners represents an opportunity to drive traffic to your LinkedIn profile, showcase your company portfolio, or book a discovery meeting.",
      "However, over-stuffing signatures with too many icons, broken links, or heavy graphic banners can trigger corporate spam filters.",
      "SigSignature provides optimized social icon modules and promotional CTA slots engineered for high click-through rates and zero deliverability penalties."
    ],
    "sections": [
      {
        "heading": "The Rule of 4: Preventing Link-Spam Flags",
        "paragraphs": [
          "Corporate email security filters (like Barracuda, Proofpoint, and Google Workspace security) inspect the ratio of plain text to outbound hyperlinks in every email. If a short 2-sentence email contains 12 outbound links, spam algorithms flag the message as potential phishing or marketing blast spam.",
          "1. Primary Professional Channel: **LinkedIn** 2. Public Thought Leadership / News: **X (Twitter) or YouTube** 3. Work & Code Showcase: **GitHub, Dribbble, or Portfolio** 4. Instant Booking: **Calendly or Cal.com**"
        ]
      },
      {
        "heading": "4 Icon Visual Styles in SigSignature",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In the **Social Icons** tab of the Design Studio, choose from 4 curated styles to match your brand aesthetic:",
            "description": "In the **Social Icons** tab of the Design Studio, choose from 4 curated styles to match your brand aesthetic:"
          },
          {
            "number": 2,
            "title": "**Filled Circle:** Clean, modern circular badges with colored backgrounds. High visibility and easy to tap on mobile screens.",
            "description": "**Filled Circle:** Clean, modern circular badges with colored backgrounds. High visibility and easy to tap on mobile screens."
          },
          {
            "number": 3,
            "title": "**Minimal Outline:** 1px hairline circular outlines with monochrome glyphs. Best for luxury, architectural, and design agencies.",
            "description": "**Minimal Outline:** 1px hairline circular outlines with monochrome glyphs. Best for luxury, architectural, and design agencies."
          },
          {
            "number": 4,
            "title": "**Sharp Square:** Contemporary tech aesthetic with 0px corner rounding.",
            "description": "**Sharp Square:** Contemporary tech aesthetic with 0px corner rounding."
          },
          {
            "number": 5,
            "title": "**Official Brand Colors:** Retains official corporate colors (LinkedIn Blue `#0A66C2`, GitHub Black `#181717`, YouTube Red `#FF0000`).",
            "description": "**Official Brand Colors:** Retains official corporate colors (LinkedIn Blue `#0A66C2`, GitHub Black `#181717`, YouTube Red `#FF0000`).",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Adding Trackable Promotional Banners & CTAs",
        "paragraphs": [
          "Pro and Team accounts can add a promotional banner directly below the signature contact block:",
          "`https://yourcompany.com/case-study?utm_source=email_signature&utm_medium=direct&utm_campaign=q4_launch`"
        ]
      },
      {
        "heading": "Industry Badges & Compliance Accreditations",
        "paragraphs": [
          "If your organization holds professional certifications, SigSignature allows you to place compact accreditation badges in the secondary footer:"
        ]
      }
    ],
    "keyTakeaways": [
      "Limit social channels to 3-5 high-value platforms to protect email deliverability.",
      "Add UTM parameters to promotional CTAs to track inbound leads in Google Analytics.",
      "Keep banner images strictly under 120px height to avoid pushing email replies off the screen."
    ]
  },
  {
    "id": "install-signature-gmail",
    "slug": "install-signature-gmail",
    "guideNumber": 11,
    "isPopular": true,
    "title": "Install Your Signature in Gmail (Web & Mobile)",
    "eyebrow": "EXPORT & INSTALLATION GUIDE",
    "category": "Export & installation",
    "categorySlug": "export-installation",
    "readTime": "2 min read",
    "appliesTo": "Gmail Web, Google Workspace, iOS & Android",
    "author": "SigSignature Technical Support",
    "subtitle": "Complete instructions for installing your SigSignature into Google Workspace and personal @gmail.com accounts with zero formatting loss.",
    "overview": [
      "Gmail Web uses a rich-text WYSIWYG editor that sanitizes pasted markup. When raw code is pasted improperly, Gmail can strip CSS styles, inject unwanted double line breaks, or turn signature text purple in email threads.",
      "Following this verified procedure ensures your table structure and images remain 100% intact."
    ],
    "sections": [
      {
        "heading": "Installation Walkthrough: Gmail on the Web",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Step 1: Copy the Signature from SigSignature",
            "description": "Step 1: Copy the Signature from SigSignature"
          },
          {
            "number": 2,
            "title": "In your SigSignature dashboard, open your finalized signature.",
            "description": "In your SigSignature dashboard, open your finalized signature."
          },
          {
            "number": 3,
            "title": "Click **Copy Visual Signature** (or click *Copy Signature to Clipboard*).",
            "description": "Click **Copy Visual Signature** (or click *Copy Signature to Clipboard*)."
          },
          {
            "number": 4,
            "title": "**Do not copy raw HTML code for Gmail Web**; copy the rendered visual binary output directly to your clipboard.",
            "description": "### Step 2: Open Gmail Settings"
          },
          {
            "number": 5,
            "title": "Open Gmail in Chrome, Safari, or Edge.",
            "description": "Open Gmail in Chrome, Safari, or Edge."
          },
          {
            "number": 6,
            "title": "Click the **Settings Gear icon (⚙️)** in the top-right corner.",
            "description": "Click the **Settings Gear icon (⚙️)** in the top-right corner."
          },
          {
            "number": 7,
            "title": "Click **See all settings**.",
            "description": "### Step 3: Navigate to Signature Settings"
          },
          {
            "number": 8,
            "title": "On the **General** tab, scroll down to the **Signature** section.",
            "description": "On the **General** tab, scroll down to the **Signature** section."
          },
          {
            "number": 9,
            "title": "Click **+ Create new**, name your signature (e.g., *SigSignature Professional*), and click **Create**.",
            "description": "### Step 4: Paste and Configure Defaults"
          },
          {
            "number": 10,
            "title": "Click inside the empty signature text box on the right.",
            "description": "Click inside the empty signature text box on the right."
          },
          {
            "number": 11,
            "title": "Paste your clipboard content using **Ctrl+V** (Windows) or **Cmd+V** (Mac).",
            "description": "Paste your clipboard content using **Ctrl+V** (Windows) or **Cmd+V** (Mac)."
          },
          {
            "number": 12,
            "title": "Under **Signature defaults**:",
            "description": "Under **Signature defaults**:",
            "substeps": [
              "Set *FOR NEW EMAILS USE:* -> Select your new signature.",
              "Set *ON REPLY/FORWARD USE:* -> Select your new signature (or choose *No signature* if you prefer clean reply chains)."
            ]
          },
          {
            "number": 13,
            "title": "Check the box: *\"Insert signature before quoted text in replies and remove the '--' line that precedes it.\"* (This prevents Gmail from hiding your signature inside collapsed reply quotes).",
            "description": "Check the box: *\"Insert signature before quoted text in replies and remove the '--' line that precedes it.\"* (This prevents Gmail from hiding your signature inside collapsed reply quotes)."
          },
          {
            "number": 14,
            "title": "Scroll to the bottom of the page and click **Save Changes**.",
            "description": "Scroll to the bottom of the page and click **Save Changes**.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Installing on Gmail Mobile App (iPhone & Android)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "The Gmail mobile app does not sync rich-text HTML signatures from the web version by default. To send HTML signatures from mobile:",
            "description": "### Method A: Web-Synced Signatures (Recommended)"
          },
          {
            "number": 2,
            "title": "In the Gmail mobile app, tap the **Menu (≡)** -> **Settings**.",
            "description": "In the Gmail mobile app, tap the **Menu (≡)** -> **Settings**."
          },
          {
            "number": 3,
            "title": "Tap your email account.",
            "description": "Tap your email account."
          },
          {
            "number": 4,
            "title": "Locate **Mobile Signature**. Ensure this field is **turned OFF / Empty**.",
            "description": "Locate **Mobile Signature**. Ensure this field is **turned OFF / Empty**."
          },
          {
            "number": 5,
            "title": "When Mobile Signature is disabled, Google Workspace automatically pulls your server-side rich HTML signature when sending!",
            "description": "### Method B: Standalone Mobile Signature If your organization requires a local mobile signature, use a concise 2-line plain text format (e.g., `Sardar Nadir | thenevon.com`) to avoid mobile rendering glitches.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Troubleshooting Common Gmail Issues",
        "paragraphs": [],
        "table": {
          "headers": [
            "Symptom",
            "Cause",
            "Immediate Resolution"
          ],
          "rows": [
            [
              "**Text Turns Purple in Threads**",
              "Gmail detects identical text in previous reply history",
              "Normal Gmail behavior; recipients see standard black text"
            ],
            [
              "**Images Display Red \"X\" Box**",
              "Image URL blocked or not HTTPS",
              "SigSignature hosts on HTTPS CDNs; verify image links are active"
            ],
            [
              "**Signature Hidden Behind \"...\"**",
              "Signature placed after quoted text",
              "Check *\"Insert signature before quoted text\"* in Gmail settings"
            ],
            [
              "**Double Line Breaks Injected**",
              "Browser rich-text formatting bug",
              "Always use Chrome or Edge when pasting into Gmail settings"
            ]
          ]
        }
      }
    ],
    "keyTakeaways": [
      "Always copy the *Visual Signature* (not raw HTML) when installing into Gmail Web.",
      "Check the box to insert your signature before quoted text to keep it visible in email threads.",
      "Disable mobile text signatures in the Gmail app to enable server-side HTML sync."
    ]
  },
  {
    "id": "add-signature-outlook",
    "slug": "add-signature-outlook",
    "guideNumber": 12,
    "isPopular": true,
    "title": "Add a Signature to Outlook (Desktop, Web & Mac)",
    "eyebrow": "EXPORT & INSTALLATION GUIDE",
    "category": "Export & installation",
    "categorySlug": "export-installation",
    "readTime": "4 min read",
    "appliesTo": "Outlook 2016/2019/2021, Microsoft 365, Outlook Web, Outlook Mac",
    "author": "SigSignature Outlook Engineering Team",
    "subtitle": "Mastering Outlook email signature setup across Windows desktop, Microsoft 365 OWA, and macOS with perfect image rendering and MSO table support.",
    "overview": [
      "Mastering Outlook email signature setup across Windows desktop, Microsoft 365 OWA, and macOS with perfect image rendering and MSO table support."
    ],
    "sections": [
      {
        "heading": "The Outlook Challenge: Microsoft Word Rendering Engine",
        "paragraphs": [
          "Desktop Outlook for Windows does not use a modern browser rendering engine (like Blink or WebKit). Instead, it uses **Microsoft Word** to render HTML emails. This creates notorious compatibility challenges: unsupported modern CSS (flexbox, grid, border-radius), distorted images on high-DPI screens, and ignored web fonts.",
          "SigSignature incorporates Microsoft Office XML tags (`<!--[if mso]>`) and table constraints to guarantee your signature renders flawlessly."
        ]
      },
      {
        "heading": "Method 1: Outlook on the Web (Microsoft 365 / OWA)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "This is the cleanest and fastest method for Microsoft 365 enterprise users.",
            "description": "This is the cleanest and fastest method for Microsoft 365 enterprise users."
          },
          {
            "number": 2,
            "title": "In SigSignature, click **Copy Visual Signature**.",
            "description": "In SigSignature, click **Copy Visual Signature**."
          },
          {
            "number": 3,
            "title": "Log into Outlook on the Web at `outlook.office.com`.",
            "description": "Log into Outlook on the Web at `outlook.office.com`."
          },
          {
            "number": 4,
            "title": "Click the **Settings Gear (⚙️)** in the top right -> Click **View all Outlook settings** (or search for *Signature*).",
            "description": "Click the **Settings Gear (⚙️)** in the top right -> Click **View all Outlook settings** (or search for *Signature*)."
          },
          {
            "number": 5,
            "title": "Go to **Mail** -> **Compose and reply**.",
            "description": "Go to **Mail** -> **Compose and reply**."
          },
          {
            "number": 6,
            "title": "Click **+ New signature**, name it, and paste your clipboard content (**Ctrl+V** or **Cmd+V**) into the edit box.",
            "description": "Click **+ New signature**, name it, and paste your clipboard content (**Ctrl+V** or **Cmd+V**) into the edit box."
          },
          {
            "number": 7,
            "title": "Under **Select default signatures**, set your new signature for *New messages* and *Replies/forwards*.",
            "description": "Under **Select default signatures**, set your new signature for *New messages* and *Replies/forwards*."
          },
          {
            "number": 8,
            "title": "Click **Save**.",
            "description": "Click **Save**.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Method 2: Outlook for Windows (Desktop 2019 / 2021 / Microsoft 365)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In SigSignature, click **Copy Visual Signature**.",
            "description": "In SigSignature, click **Copy Visual Signature**."
          },
          {
            "number": 2,
            "title": "Open desktop Outlook.",
            "description": "Open desktop Outlook."
          },
          {
            "number": 3,
            "title": "Click **File** in the top-left menu -> Click **Options**.",
            "description": "Click **File** in the top-left menu -> Click **Options**."
          },
          {
            "number": 4,
            "title": "In the Outlook Options window, select **Mail** from the left sidebar, then click the **Signatures...** button.",
            "description": "In the Outlook Options window, select **Mail** from the left sidebar, then click the **Signatures...** button."
          },
          {
            "number": 5,
            "title": "In the *Email Signature* tab, click **New**, type a name, and click **OK**.",
            "description": "In the *Email Signature* tab, click **New**, type a name, and click **OK**."
          },
          {
            "number": 6,
            "title": "Click inside the **Edit signature** box below.",
            "description": "Click inside the **Edit signature** box below."
          },
          {
            "number": 7,
            "title": "Paste your signature using **Ctrl+V**.",
            "description": "Paste your signature using **Ctrl+V**."
          },
          {
            "number": 8,
            "title": "In the top-right of that window, assign your signature to your desired email account under **New messages** and **Replies/forwards**.",
            "description": "In the top-right of that window, assign your signature to your desired email account under **New messages** and **Replies/forwards**."
          },
          {
            "number": 9,
            "title": "Click **OK** to save.",
            "description": "> [!IMPORTANT] > **Outlook High-DPI Fix:** If your logo appears oversized in Outlook Desktop, ensure you did not manually resize the image by dragging corner handles in Outlook's editor. Outlook's editor will strip SigSignature's MSO width tags. Always delete, re-copy from SigSignature, and paste cleanly.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Method 3: Outlook for Mac",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In SigSignature, click **Copy Visual Signature**.",
            "description": "In SigSignature, click **Copy Visual Signature**."
          },
          {
            "number": 2,
            "title": "Open Outlook on macOS.",
            "description": "Open Outlook on macOS."
          },
          {
            "number": 3,
            "title": "In the top menu bar, click **Outlook** -> **Settings...** (or press `Cmd+,`).",
            "description": "In the top menu bar, click **Outlook** -> **Settings...** (or press `Cmd+,`)."
          },
          {
            "number": 4,
            "title": "Click **Signatures** (under Email).",
            "description": "Click **Signatures** (under Email)."
          },
          {
            "number": 5,
            "title": "Click the **+** button at the bottom of the signature list to create a new signature.",
            "description": "Click the **+** button at the bottom of the signature list to create a new signature."
          },
          {
            "number": 6,
            "title": "Paste your signature (**Cmd+V**) into the editor pane.",
            "description": "Paste your signature (**Cmd+V**) into the editor pane."
          },
          {
            "number": 7,
            "title": "In the *Choose default signature* dropdowns at the bottom, select your signature for New messages and Replies.",
            "description": "In the *Choose default signature* dropdowns at the bottom, select your signature for New messages and Replies."
          },
          {
            "number": 8,
            "title": "Close the window; macOS automatically saves changes.",
            "description": "Close the window; macOS automatically saves changes.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Outlook Compatibility Troubleshooting",
        "paragraphs": [],
        "table": {
          "headers": [
            "Issue in Outlook",
            "Root Cause",
            "Fix"
          ],
          "rows": [
            [
              "**Giant Logo on Windows**",
              "User dragged corner handles in Outlook editor",
              "Delete signature, re-copy from SigSignature, and paste without editing"
            ],
            [
              "**Thin Line Borders Disappear**",
              "Outlook Word engine rounds 0.5px borders to zero",
              "SigSignature uses explicit `1px solid` table borders natively"
            ],
            [
              "**Times New Roman Font Bug**",
              "Outlook failed to find custom web font",
              "SigSignature injects universal system fallbacks (Arial/Calibri)"
            ],
            [
              "**Extra Spacing Below Rows**",
              "Outlook injected default paragraph spacing",
              "SigSignature forces `margin: 0; padding: 0; mso-line-height-rule: exactly;`"
            ]
          ]
        }
      }
    ],
    "keyTakeaways": [
      "Never drag image corner handles inside Outlook's built-in signature editor.",
      "Outlook on the Web (OWA) provides the fastest, most reliable setup across corporate teams.",
      "SigSignature's built-in MSO tags guarantee that table borders and spacing stay locked in desktop Outlook."
    ]
  },
  {
    "id": "export-html-embed-code",
    "slug": "export-html-embed-code",
    "guideNumber": 13,
    "isPopular": true,
    "title": "Export Production-Ready HTML & Raw Embed Code",
    "eyebrow": "EXPORT & INSTALLATION GUIDE",
    "category": "Export & installation",
    "categorySlug": "export-installation",
    "readTime": "2 min read",
    "appliesTo": "HubSpot, Salesforce, Apple Mail, CRM Platforms",
    "author": "SigSignature Core Platform Team",
    "subtitle": "Technical developer guide to exporting minified, production-grade HTML signatures and integrating them into CRMs, Apple Mail, and custom marketing platforms.",
    "overview": [
      "Technical developer guide to exporting minified, production-grade HTML signatures and integrating them into CRMs, Apple Mail, and custom marketing platforms."
    ],
    "sections": [
      {
        "heading": "What Defines \"Production-Ready\" HTML Email Signatures?",
        "paragraphs": [
          "Modern web development techniques (Flexbox, CSS Grid, external stylesheets, SVG graphics) completely fail in standard email clients. A production-ready email signature must satisfy strict structural constraints:"
        ]
      },
      {
        "heading": "Export Options in SigSignature",
        "paragraphs": [
          "### Option 1: Copy Visual Signature (Clipboard)",
          "### Option 2: Copy Raw HTML Embed Code",
          "### Option 3: Download HTML File (`signature.html`)"
        ]
      },
      {
        "heading": "Integrating into CRMs & Marketing Platforms",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "HubSpot CRM",
            "description": "HubSpot CRM"
          },
          {
            "number": 2,
            "title": "In HubSpot, click the **Settings Gear (⚙️)** in top navigation.",
            "description": "In HubSpot, click the **Settings Gear (⚙️)** in top navigation."
          },
          {
            "number": 3,
            "title": "In left sidebar, navigate to **General** -> **Email** tab.",
            "description": "In left sidebar, navigate to **General** -> **Email** tab."
          },
          {
            "number": 4,
            "title": "In the *Signature* section, click **Edit signature** -> Click the **HTML (Source Code)** button.",
            "description": "In the *Signature* section, click **Edit signature** -> Click the **HTML (Source Code)** button."
          },
          {
            "number": 5,
            "title": "Paste your raw SigSignature HTML code and click **Save**.",
            "description": "### Salesforce Sales Cloud"
          },
          {
            "number": 6,
            "title": "Click your Profile Avatar in top right -> Click **Settings**.",
            "description": "Click your Profile Avatar in top right -> Click **Settings**."
          },
          {
            "number": 7,
            "title": "In Quick Find, search for **My Email Settings**.",
            "description": "In Quick Find, search for **My Email Settings**."
          },
          {
            "number": 8,
            "title": "In the *Email Signature* box, paste your SigSignature markup and click **Save**.",
            "description": "In the *Email Signature* box, paste your SigSignature markup and click **Save**.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Technical Specifications & Architecture",
        "paragraphs": [],
        "table": {
          "headers": [
            "Parameter",
            "Specification Standard",
            "Technical Rationale"
          ],
          "rows": [
            [
              "**DOCTYPE**",
              "XHTML 1.0 Transitional / HTML5",
              "Guarantees standards mode parsing in legacy webmail"
            ],
            [
              "**CSS Inlining**",
              "100% Inline on `<td>` / `<span>`",
              "Webmail clients strip `<style>` headers in email body"
            ],
            [
              "**Table Spacing**",
              "`cellpadding=\"0\" cellspacing=\"0\" border=\"0\"`",
              "Eliminates phantom default browser cell spacing"
            ],
            [
              "**Asset Delivery**",
              "Cloudflare Global CDN / HTTPS",
              "Sub-50ms worldwide asset load times; zero mixed-content flags"
            ]
          ]
        }
      }
    ],
    "keyTakeaways": [
      "Use \"Copy Visual Signature\" for webmail clients (Gmail/Outlook); use \"Copy Raw HTML\" for CRMs and marketing software.",
      "All SigSignature code is 100% inline and minified for maximum deliverability.",
      "Images are permanently hosted on secure, high-speed CDN servers."
    ]
  },
  {
    "id": "install-signature-apple-mail",
    "slug": "install-signature-apple-mail",
    "guideNumber": 14,
    "isPopular": false,
    "title": "Install Your Signature in Apple Mail (macOS & iOS)",
    "eyebrow": "EXPORT & INSTALLATION GUIDE",
    "category": "Export & installation",
    "categorySlug": "export-installation",
    "readTime": "3 min read",
    "appliesTo": "Apple Mail macOS, iPhone & iPad iOS",
    "author": "SigSignature Apple Ecosystem Team",
    "subtitle": "Step-by-step setup for Apple Mail on macOS Sequoia/Sonoma and iOS 18/17. Fix font distortion and learn the shake-to-undo formatting restore trick.",
    "overview": [
      "Apple Mail (both macOS and iOS) uses the modern WebKit rendering engine. WebKit provides the highest standards compliance of any email client in the world: perfect support for rounded borders, high-DPI Retina assets, and web typography.",
      "However, Apple Mail has two specific idiosyncrasies: 1. On macOS, a default setting (\"Always match my default message font\") frequently overrides your custom typography. 2. On iOS (iPhone/iPad), pasting an HTML signature automatically strips font sizes and colors unless you trigger the **Shake to Undo** trick.",
      "This guide details the exact steps to achieve flawless rendering across Mac, iPhone, and iPad."
    ],
    "sections": [
      {
        "heading": "Part 1: Installing on macOS Apple Mail (Sequoia, Sonoma, Ventura)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Step 1: Copy Visual Signature",
            "description": "In your SigSignature dashboard, open your finalized signature and click **Copy Visual Signature**. ### Step 2: Open Apple Mail Signatures Setting"
          },
          {
            "number": 2,
            "title": "Open the **Mail** app on your Mac.",
            "description": "Open the **Mail** app on your Mac."
          },
          {
            "number": 3,
            "title": "In the top menu bar, click **Mail** -> **Settings...** (or press `Cmd+,`).",
            "description": "In the top menu bar, click **Mail** -> **Settings...** (or press `Cmd+,`)."
          },
          {
            "number": 4,
            "title": "Click the **Signatures** tab.",
            "description": "### Step 3: Create and Paste"
          },
          {
            "number": 5,
            "title": "In the left column, select the email account you want to use.",
            "description": "In the left column, select the email account you want to use."
          },
          {
            "number": 6,
            "title": "Click the **+** (Plus) button at the bottom of the middle column to create a new signature. Name it (e.g., *SigSignature Work*).",
            "description": "Click the **+** (Plus) button at the bottom of the middle column to create a new signature. Name it (e.g., *SigSignature Work*)."
          },
          {
            "number": 7,
            "title": "In the right-hand edit pane, delete any default text.",
            "description": "In the right-hand edit pane, delete any default text."
          },
          {
            "number": 8,
            "title": "Paste your signature (**Cmd+V**).",
            "description": "### Step 4: The Critical macOS Setting (CRITICAL) Look directly below the signature edit pane. Locate the checkbox labeled: > **\"Always match my default message font\"** If left checked, Apple Mail will strip your custom font sizes, colors, and line-heights, forcing your entire signature into plain 12pt Helvetica. Unchecking this box preserves 100% of your visual design.",
            "substeps": [
              "**UNCHECK THIS BOX IMMEDIATELY.**",
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Part 2: Installing on iPhone & iPad (iOS 18 & 17)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Installing an HTML signature directly on an iPhone requires a specific workaround to bypass iOS's automatic formatting strip:",
            "description": "### Step 1: Send the Signature to Your iPhone"
          },
          {
            "number": 2,
            "title": "On your desktop, compose a blank email to yourself.",
            "description": "On your desktop, compose a blank email to yourself."
          },
          {
            "number": 3,
            "title": "Insert your newly created signature and send the email.",
            "description": "Insert your newly created signature and send the email."
          },
          {
            "number": 4,
            "title": "Open the email in the **Mail app** on your iPhone.",
            "description": "### Step 2: Copy the Rendered Signature"
          },
          {
            "number": 5,
            "title": "Tap and hold inside the signature area.",
            "description": "Tap and hold inside the signature area."
          },
          {
            "number": 6,
            "title": "Drag the selection handles to highlight the entire signature (including your name, photo, and links).",
            "description": "Drag the selection handles to highlight the entire signature (including your name, photo, and links)."
          },
          {
            "number": 7,
            "title": "Tap **Copy**.",
            "description": "### Step 3: Paste in iOS Settings"
          },
          {
            "number": 8,
            "title": "On your iPhone, open **Settings** -> Scroll down and tap **Apps** -> **Mail** (or directly **Mail** in older iOS versions).",
            "description": "On your iPhone, open **Settings** -> Scroll down and tap **Apps** -> **Mail** (or directly **Mail** in older iOS versions)."
          },
          {
            "number": 9,
            "title": "Scroll to the bottom and tap **Signature**.",
            "description": "Scroll to the bottom and tap **Signature**."
          },
          {
            "number": 10,
            "title": "Select *All Accounts* or tap your specific work account.",
            "description": "Select *All Accounts* or tap your specific work account."
          },
          {
            "number": 11,
            "title": "Clear the box, tap and hold, then tap **Paste**.",
            "description": "### Step 4: The Famous \"Shake to Undo\" Trick (MANDATORY) Notice that when you paste, iOS automatically distorts font sizes or shifts colors."
          },
          {
            "number": 12,
            "title": "**Physically shake your iPhone** until a popup menu appears on screen.",
            "description": "**Physically shake your iPhone** until a popup menu appears on screen."
          },
          {
            "number": 13,
            "title": "The popup will say: **\"Undo Change Attributes\"**.",
            "description": "The popup will say: **\"Undo Change Attributes\"**."
          },
          {
            "number": 14,
            "title": "Tap **Undo**.",
            "description": "Tap **Undo**."
          },
          {
            "number": 15,
            "title": "Instantly, iOS restores the original HTML font sizes, inline CSS weights, and color balances!",
            "description": "Instantly, iOS restores the original HTML font sizes, inline CSS weights, and color balances!"
          },
          {
            "number": 16,
            "title": "Tap the back arrow to save.",
            "description": "Tap the back arrow to save.",
            "substeps": [
              "---"
            ]
          }
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Issue",
        "Root Cause",
        "Fix"
      ],
      "rows": [
        [
          "**Font Reverts to Plain Text on Mac**",
          "\"Always match my default message font\" is checked",
          "Uncheck the box in Mail -> Settings -> Signatures"
        ],
        [
          "**Phone Numbers Turn Bright Blue**",
          "iOS auto-detects phone numbers and injects links",
          "SigSignature wraps phone numbers in styled `tel:` tags"
        ],
        [
          "**Images Don't Load on Mobile**",
          "Mail Privacy Protection caching issue",
          "Toggle airplane mode or ensure images are hosted on HTTPS CDN"
        ]
      ]
    },
    "keyTakeaways": [
      "On Mac: Always uncheck \"Always match my default message font\".",
      "On iPhone: Always perform the \"Shake to Undo\" trick immediately after pasting into iOS Settings.",
      "WebKit renders high-DPI Retina assets with stunning clarity when formatted at 2x resolution."
    ]
  },
  {
    "id": "install-signature-yahoo-thunderbird",
    "slug": "install-signature-yahoo-thunderbird",
    "guideNumber": 15,
    "isPopular": false,
    "title": "Install in Yahoo Mail, Mozilla Thunderbird & Custom Webmail",
    "eyebrow": "EXPORT & INSTALLATION GUIDE",
    "category": "Export & installation",
    "categorySlug": "export-installation",
    "readTime": "3 min read",
    "appliesTo": "Yahoo Mail, Thunderbird, ProtonMail, Roundcube",
    "author": "SigSignature Webmail Support Team",
    "subtitle": "How to install your HTML email signature into Yahoo Mail, Mozilla Thunderbird, ProtonMail, and cPanel Roundcube webmail without broken tables.",
    "overview": [
      "While Gmail and Outlook dominate the corporate market, millions of professionals and agencies rely on independent email clients: Yahoo Mail for business, Mozilla Thunderbird for Linux/privacy workflows, ProtonMail for encrypted communications, and cPanel Roundcube for custom domain webmail.",
      "Because SigSignature compiles to 100% inline CSS and standard HTML tables, your signature integrates seamlessly into every platform."
    ],
    "sections": [
      {
        "heading": "1. Installing in Yahoo Mail (Web)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Open your signature in SigSignature and click **Copy Visual Signature**.",
            "description": "Open your signature in SigSignature and click **Copy Visual Signature**."
          },
          {
            "number": 2,
            "title": "Log into Yahoo Mail in your web browser.",
            "description": "Log into Yahoo Mail in your web browser."
          },
          {
            "number": 3,
            "title": "In the top right corner, click **Settings** -> Click **More Settings** at the bottom of the tray.",
            "description": "In the top right corner, click **Settings** -> Click **More Settings** at the bottom of the tray."
          },
          {
            "number": 4,
            "title": "In the left navigation, click **Writing email**.",
            "description": "In the left navigation, click **Writing email**."
          },
          {
            "number": 5,
            "title": "Under **Signature**, toggle your account signature **ON**.",
            "description": "Under **Signature**, toggle your account signature **ON**."
          },
          {
            "number": 6,
            "title": "Click inside the text box, press **Ctrl+V** (Windows) or **Cmd+V** (Mac) to paste your visual signature.",
            "description": "Click inside the text box, press **Ctrl+V** (Windows) or **Cmd+V** (Mac) to paste your visual signature."
          },
          {
            "number": 7,
            "title": "Changes in Yahoo Mail save automatically. Compose a new message to verify the visual display.",
            "description": "Changes in Yahoo Mail save automatically. Compose a new message to verify the visual display.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "2. Installing in Mozilla Thunderbird (Desktop)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Thunderbird supports direct HTML source embedding, guaranteeing pixel-perfect results:",
            "description": "### Method A: HTML File Attachment (Recommended)"
          },
          {
            "number": 2,
            "title": "In SigSignature, click **Export HTML** -> Click **Download .html File**. Save it to a permanent folder on your computer.",
            "description": "In SigSignature, click **Export HTML** -> Click **Download .html File**. Save it to a permanent folder on your computer."
          },
          {
            "number": 3,
            "title": "Open Thunderbird.",
            "description": "Open Thunderbird."
          },
          {
            "number": 4,
            "title": "Right-click your email account in the left sidebar -> Select **Settings**.",
            "description": "Right-click your email account in the left sidebar -> Select **Settings**."
          },
          {
            "number": 5,
            "title": "In the main *Account Settings* panel, check the box labeled:",
            "description": "In the main *Account Settings* panel, check the box labeled:",
            "substeps": [
              "**\"Attach the signature from a file instead (text, HTML, or image)\"**."
            ]
          },
          {
            "number": 6,
            "title": "Click **Choose...**, select your downloaded `signature.html` file, and click **Open**.",
            "description": "Click **Choose...**, select your downloaded `signature.html` file, and click **Open**."
          },
          {
            "number": 7,
            "title": "Click **OK**. Thunderbird will now render your HTML signature natively in every outgoing message.",
            "description": "### Method B: Direct HTML Source Paste"
          },
          {
            "number": 8,
            "title": "In SigSignature, click **Export HTML** -> **Copy Raw HTML**.",
            "description": "In SigSignature, click **Export HTML** -> **Copy Raw HTML**."
          },
          {
            "number": 9,
            "title": "In Thunderbird Account Settings, check the box **\"Use HTML\"** in the Signature text section.",
            "description": "In Thunderbird Account Settings, check the box **\"Use HTML\"** in the Signature text section."
          },
          {
            "number": 10,
            "title": "Paste your raw HTML code directly into the text box.",
            "description": "Paste your raw HTML code directly into the text box.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "3. Installing in ProtonMail",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In SigSignature, click **Copy Visual Signature**.",
            "description": "In SigSignature, click **Copy Visual Signature**."
          },
          {
            "number": 2,
            "title": "Open ProtonMail Web -> Click **Settings** (gear icon) -> **All settings**.",
            "description": "Open ProtonMail Web -> Click **Settings** (gear icon) -> **All settings**."
          },
          {
            "number": 3,
            "title": "In left navigation, click **Identity and addresses**.",
            "description": "In left navigation, click **Identity and addresses**."
          },
          {
            "number": 4,
            "title": "Scroll to **Signature**, toggle it **ON**.",
            "description": "Scroll to **Signature**, toggle it **ON**."
          },
          {
            "number": 5,
            "title": "In the rich-text editor, paste your signature (**Ctrl+V** or **Cmd+V**).",
            "description": "In the rich-text editor, paste your signature (**Ctrl+V** or **Cmd+V**)."
          },
          {
            "number": 6,
            "title": "Click **Save**.",
            "description": "Click **Save**.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "4. Installing in cPanel Webmail (Roundcube)",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "In SigSignature, click **Export HTML** -> **Copy Raw HTML**.",
            "description": "In SigSignature, click **Export HTML** -> **Copy Raw HTML**."
          },
          {
            "number": 2,
            "title": "Log into your cPanel Webmail and open **Roundcube**.",
            "description": "Log into your cPanel Webmail and open **Roundcube**."
          },
          {
            "number": 3,
            "title": "In the top-right menu, click **Settings** -> Click **Identities** in the left column.",
            "description": "In the top-right menu, click **Settings** -> Click **Identities** in the left column."
          },
          {
            "number": 4,
            "title": "Select your email identity.",
            "description": "Select your email identity."
          },
          {
            "number": 5,
            "title": "In the right-hand panel, check the box **HTML signature**.",
            "description": "In the right-hand panel, check the box **HTML signature**."
          },
          {
            "number": 6,
            "title": "In the signature editor toolbar, click the **HTML Source Code icon (`< >`)**.",
            "description": "In the signature editor toolbar, click the **HTML Source Code icon (`< >`)**."
          },
          {
            "number": 7,
            "title": "Paste your raw HTML code into the popup window and click **Update**.",
            "description": "Paste your raw HTML code into the popup window and click **Update**."
          },
          {
            "number": 8,
            "title": "Click **Save**.",
            "description": "Click **Save**.",
            "substeps": [
              "---"
            ]
          }
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Client",
        "Paste Method",
        "Notes"
      ],
      "rows": [
        [
          "**Yahoo Mail Web**",
          "Copy Visual Signature",
          "Rich text paste; auto-saved in settings"
        ],
        [
          "**Mozilla Thunderbird**",
          "Attach HTML File or Raw Code",
          "Supports full HTML markup without sanitization"
        ],
        [
          "**ProtonMail**",
          "Copy Visual Signature",
          "E2E encrypted; images load via Proton proxy"
        ],
        [
          "**Roundcube / cPanel**",
          "Copy Raw HTML Code",
          "Must enable the HTML signature toggle"
        ]
      ]
    },
    "keyTakeaways": [
      "Thunderbird and Roundcube support direct raw HTML pasting via their code view tools.",
      "Yahoo Mail and ProtonMail require copying the \"Visual Signature\" directly to clipboard.",
      "All signatures render consistently because SigSignature avoids unsupported external styles."
    ]
  },
  {
    "id": "manage-account-profile-password",
    "slug": "manage-account-profile-password",
    "guideNumber": 16,
    "isPopular": false,
    "title": "Manage Your SigSignature Account, Profile & Password",
    "eyebrow": "ACCOUNT & BILLING GUIDE",
    "category": "Account & billing",
    "categorySlug": "account-billing",
    "readTime": "2 min read",
    "appliesTo": "All Accounts & Users",
    "author": "SigSignature Account Operations",
    "subtitle": "How to update your account profile name, upload an account avatar, change your password, and manage security settings in SigSignature.",
    "overview": [
      "Your SigSignature account houses your saved signature configurations, uploaded high-resolution assets, custom team templates, and billing history. Keeping your profile updated ensures accurate team notifications and seamless customer support.",
      "This guide explains how to manage your personal profile, update security credentials, and handle registered email modifications."
    ],
    "sections": [
      {
        "heading": "Step-by-Step Account Management",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Navigating to Account Settings",
            "description": "Navigating to Account Settings"
          },
          {
            "number": 2,
            "title": "Log into your dashboard at `sigsignature.com`.",
            "description": "Log into your dashboard at `sigsignature.com`."
          },
          {
            "number": 3,
            "title": "In the left navigation sidebar, click on **Settings** (or click your profile avatar in the top right corner -> **Settings**).",
            "description": "In the left navigation sidebar, click on **Settings** (or click your profile avatar in the top right corner -> **Settings**)."
          },
          {
            "number": 4,
            "title": "The Settings screen is divided into two primary tabs: **Profile** and **Security**.",
            "description": "The Settings screen is divided into two primary tabs: **Profile** and **Security**."
          },
          {
            "number": 5,
            "title": "Updating Profile Information",
            "description": "Under the **Profile Settings** section:",
            "substeps": [
              "**Full Name:** Update your legal or preferred display name. This name is used for team workspace invites and account invoicing.",
              "**Profile Avatar:** Upload a PNG or JPEG photo (up to 2MB). A square 1:1 aspect ratio is recommended. This avatar serves as your user profile icon in the SigSignature dashboard.",
              "Click **Save Profile Changes**. A confirmation toast will indicate that your details have been updated."
            ]
          },
          {
            "number": 6,
            "title": "Updating Your Password",
            "description": "Under the **Password & Security** section:"
          },
          {
            "number": 7,
            "title": "Enter your **Current Password**.",
            "description": "Enter your **Current Password**."
          },
          {
            "number": 8,
            "title": "Enter your **New Password** (must contain at least 8 characters, including a combination of uppercase letters, numbers, and symbols).",
            "description": "Enter your **New Password** (must contain at least 8 characters, including a combination of uppercase letters, numbers, and symbols)."
          },
          {
            "number": 9,
            "title": "Re-enter your new password in **Confirm New Password**.",
            "description": "Re-enter your new password in **Confirm New Password**."
          },
          {
            "number": 10,
            "title": "Click **Update Password**.",
            "description": "Click **Update Password**."
          },
          {
            "number": 11,
            "title": "All active browser sessions will be refreshed securely.",
            "description": "All active browser sessions will be refreshed securely.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Registered Email Policy & Changes",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "> [!NOTE]",
            "description": "> **Security Protocol:** To protect your account from unauthorized hijacking and protect team templates, **registered account email addresses cannot be modified directly within the UI settings**. If your organization has rebranded or your work email has changed:"
          },
          {
            "number": 2,
            "title": "Submit a verification request to our engineering team at `support@thenevon.com`.",
            "description": "Submit a verification request to our engineering team at `support@thenevon.com`."
          },
          {
            "number": 3,
            "title": "Include your current registered email, your new target email, and your most recent Stripe invoice number for verification.",
            "description": "Include your current registered email, your new target email, and your most recent Stripe invoice number for verification."
          },
          {
            "number": 4,
            "title": "Our security team will process the email transfer within 24 business hours without any loss of your saved signatures.",
            "description": "Our security team will process the email transfer within 24 business hours without any loss of your saved signatures.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Deleting an Account",
        "paragraphs": [
          "If you wish to permanently delete your SigSignature account:"
        ]
      }
    ],
    "keyTakeaways": [
      "Access personal profile and password controls anytime under `/settings`.",
      "Passwords must be at least 8 characters with numbers and symbols.",
      "Registered email modifications require security verification via `support@thenevon.com`."
    ]
  },
  {
    "id": "upgrade-pro-team-plan",
    "slug": "upgrade-pro-team-plan",
    "guideNumber": 17,
    "isPopular": false,
    "title": "Upgrade to Pro or Team Plan & Unlock Premium Features",
    "eyebrow": "ACCOUNT & BILLING GUIDE",
    "category": "Account & billing",
    "categorySlug": "account-billing",
    "readTime": "2 min read",
    "appliesTo": "Free, Pro & Team Tiers",
    "author": "SigSignature Growth Operations",
    "subtitle": "Compare Free, Pro, and Team plans on SigSignature. Unlock unlimited signature slots, custom branding, analytics, and centralized team deployment.",
    "overview": [
      "SigSignature offers tiered plans designed for independent creators, growing consultancies, and multi-seat corporate organizations.",
      "Whether you need a single clean personal signature or centralized management for a 50-person sales organization, this guide helps you choose the optimal plan and execute an upgrade in under 60 seconds."
    ],
    "sections": [
      {
        "heading": "Step-by-Step: Upgrading Your Account",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Step 1: Open Pricing & Billing",
            "description": "Step 1: Open Pricing & Billing"
          },
          {
            "number": 2,
            "title": "Log into your account and click **Pricing & Billing** in the left sidebar (or click the blue **Upgrade Now** badge in the bottom-left account widget).",
            "description": "Log into your account and click **Pricing & Billing** in the left sidebar (or click the blue **Upgrade Now** badge in the bottom-left account widget)."
          },
          {
            "number": 3,
            "title": "Review the plan options. Toggle between **Monthly** and **Annual (Save 25%)** billing.",
            "description": "### Step 2: Select Your Plan ### Step 3: Secure Checkout via Stripe",
            "substeps": [
              "To unlock unlimited personal signatures: Click **Upgrade to Pro**.",
              "To manage team members and company templates: Click **Upgrade to Team** and select your required seat count (starting at 5 seats)."
            ]
          },
          {
            "number": 4,
            "title": "You will be redirected to the secure Stripe checkout portal.",
            "description": "You will be redirected to the secure Stripe checkout portal."
          },
          {
            "number": 5,
            "title": "Enter your credit/debit card details (Visa, Mastercard, American Express) or choose Apple Pay / Google Pay.",
            "description": "Enter your credit/debit card details (Visa, Mastercard, American Express) or choose Apple Pay / Google Pay."
          },
          {
            "number": 6,
            "title": "If purchasing on behalf of a company, enter your company name and **VAT / Tax ID** for tax-exempt invoicing.",
            "description": "If purchasing on behalf of a company, enter your company name and **VAT / Tax ID** for tax-exempt invoicing."
          },
          {
            "number": 7,
            "title": "Click **Subscribe**.",
            "description": "### Step 4: Immediate Feature Activation Upon payment completion, Stripe instantly redirects you back to your SigSignature dashboard. All plan limits are automatically lifted, and premium templates are unlocked immediately.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "14-Day Money-Back Guarantee",
        "paragraphs": [
          "We want you to be 100% satisfied with your email signatures. If you upgrade to Pro or Team and find that SigSignature does not satisfy your workflow requirements, email `support@thenevon.com` within 14 days of purchase for a prompt, no-questions-asked full refund."
        ]
      }
    ],
    "checklist": {
      "headers": [
        "Feature",
        "Free Tier",
        "Pro Plan ($9/mo or $79/yr)",
        "Team Plan ($29/mo + $5/seat)"
      ],
      "rows": [
        [
          "**Active Signature Slots**",
          "3 Signatures max",
          "**Unlimited Signatures**",
          "**Unlimited Signatures**"
        ],
        [
          "**All 40+ Templates**",
          "Standard only",
          "**Full Executive Access**",
          "**Full Executive Access**"
        ],
        [
          "**Retina Image Hosting**",
          "Standard CDN",
          "**High-Speed Global CDN**",
          "**Enterprise Dedicated CDN**"
        ],
        [
          "**Promotional CTAs & Banners**",
          "Basic",
          "**Advanced with UTM Tracking**",
          "**Advanced with UTM Tracking**"
        ],
        [
          "**Watermark Removal**",
          "Included",
          "**100% Whitelabel Clean Code**",
          "**100% Whitelabel Clean Code**"
        ],
        [
          "**Team Workspace & Roles**",
          "Not available",
          "Not available",
          "**Centralized Admin Dashboard**"
        ],
        [
          "**Brand Locking & Permissions**",
          "Not available",
          "Not available",
          "**Lock Colors, Logos & Disclaimers**"
        ],
        [
          "**Support SLA**",
          "Community Help",
          "**Priority Email (12hr SLA)**",
          "**Dedicated Success Manager**"
        ]
      ]
    },
    "keyTakeaways": [
      "Pro unlocks unlimited personal signatures, advanced banner CTAs, and custom color palettes.",
      "Team plans provide centralized template locking and multi-user seat administration.",
      "All upgrades are secured by Stripe and backed by a 14-day full refund guarantee."
    ]
  },
  {
    "id": "billing-stripe-invoices-payment-methods",
    "slug": "billing-stripe-invoices-payment-methods",
    "guideNumber": 18,
    "isPopular": false,
    "title": "Manage Billing, Stripe Invoices, Receipts & Payment Methods",
    "eyebrow": "ACCOUNT & BILLING GUIDE",
    "category": "Account & billing",
    "categorySlug": "account-billing",
    "readTime": "2 min read",
    "appliesTo": "Pro & Team Subscribers",
    "author": "SigSignature Finance & Billing Team",
    "subtitle": "How to update your credit card, download VAT/tax invoices, access the Stripe Customer Portal, and manage plan renewals in SigSignature.",
    "overview": [
      "SigSignature uses **Stripe** as our global payment infrastructure provider. Stripe handles all payment processing with bank-grade AES-256 encryption. We never store or process your credit card numbers on our local servers.",
      "Through the integrated Stripe Customer Portal, you have complete self-service control over your payment methods, billing history, and tax invoices."
    ],
    "sections": [
      {
        "heading": "Accessing the Billing Portal",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Log into your SigSignature dashboard.",
            "description": "Log into your SigSignature dashboard."
          },
          {
            "number": 2,
            "title": "Click **Pricing & Billing** in the left sidebar.",
            "description": "Click **Pricing & Billing** in the left sidebar."
          },
          {
            "number": 3,
            "title": "Under the **Current Plan** overview, click **Manage Billing & Invoices**.",
            "description": "Under the **Current Plan** overview, click **Manage Billing & Invoices**."
          },
          {
            "number": 4,
            "title": "You will be authenticated securely into the Stripe Customer Portal.",
            "description": "You will be authenticated securely into the Stripe Customer Portal.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Common Billing Tasks",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Updating Payment Methods (Credit Card)",
            "description": "Updating Payment Methods (Credit Card)",
            "substeps": [
              "Inside the Stripe portal, locate the **Payment Method** section.",
              "Click **+ Add payment method**.",
              "Enter your new card details and click **Add**.",
              "To set it as primary, click the three dots (`...`) next to the card and select **Make default**.",
              "Remove expired cards to prevent automated subscription interruptions."
            ]
          },
          {
            "number": 2,
            "title": "Downloading Official Tax Invoices & Receipts",
            "description": "Downloading Official Tax Invoices & Receipts",
            "substeps": [
              "Scroll down to the **Billing History / Invoices** section of the portal.",
              "You will see a chronological list of every charge date, amount, and payment status.",
              "Click on any transaction to download an official **PDF Invoice** or **Receipt**.",
              "Invoices include transaction timestamps, line-item breakdowns, and tax rates suitable for corporate bookkeeping."
            ]
          },
          {
            "number": 3,
            "title": "Adding Your Corporate Tax ID / VAT Number",
            "description": "If your company requires VAT, GST, or Tax IDs on invoices:"
          },
          {
            "number": 4,
            "title": "In the Stripe Customer Portal, click **Update information** under *Billing Information*.",
            "description": "In the Stripe Customer Portal, click **Update information** under *Billing Information*."
          },
          {
            "number": 5,
            "title": "Enter your official company legal entity name, corporate address, and Tax ID (e.g., `GB123456789`).",
            "description": "Enter your official company legal entity name, corporate address, and Tax ID (e.g., `GB123456789`)."
          },
          {
            "number": 6,
            "title": "Click **Save**. All past and future invoices will automatically regenerate with your tax credentials.",
            "description": "Click **Save**. All past and future invoices will automatically regenerate with your tax credentials."
          },
          {
            "number": 7,
            "title": "Canceling a Subscription",
            "description": "We believe canceling should be as simple as subscribing:"
          },
          {
            "number": 8,
            "title": "In the Stripe Customer Portal, click **Cancel plan**.",
            "description": "In the Stripe Customer Portal, click **Cancel plan**."
          },
          {
            "number": 9,
            "title": "Confirm your cancellation.",
            "description": "Confirm your cancellation."
          },
          {
            "number": 10,
            "title": "**What Happens Next:** Your subscription will remain active until the end of your current billing period (no prorated surprise charges). You retain full Pro/Team features until that date.",
            "description": "**What Happens Next:** Your subscription will remain active until the end of your current billing period (no prorated surprise charges). You retain full Pro/Team features until that date."
          },
          {
            "number": 11,
            "title": "**Permanent Guarantee:** Even after your plan reverts to Free, **all signatures you have already exported and installed into Gmail or Outlook will continue to function permanently**. We will never disable or break your existing email signatures.",
            "description": "**Permanent Guarantee:** Even after your plan reverts to Free, **all signatures you have already exported and installed into Gmail or Outlook will continue to function permanently**. We will never disable or break your existing email signatures.",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Billing FAQs",
        "paragraphs": [],
        "table": {
          "headers": [
            "Question",
            "Answer"
          ],
          "rows": [
            [
              "**What payment methods are supported?**",
              "Visa, MasterCard, American Express, Discover, Apple Pay, Google Pay"
            ],
            [
              "**Is billing automatic?**",
              "Yes, subscriptions renew automatically monthly or annually until canceled"
            ],
            [
              "**Can I switch between monthly and annual?**",
              "Yes, toggle in Pricing & Billing; unused days are credited automatically"
            ],
            [
              "**How do I get a refund?**",
              "Contact `support@thenevon.com` within 14 days of any charge"
            ]
          ]
        }
      }
    ],
    "keyTakeaways": [
      "Manage payment methods and download tax invoices anytime via the Stripe Customer Portal.",
      "Corporate VAT and Tax IDs can be added directly to invoice receipts.",
      "Exported email signatures remain functional forever, even if a subscription is canceled."
    ]
  },
  {
    "id": "team-workspace-members-roles",
    "slug": "team-workspace-members-roles",
    "guideNumber": 19,
    "isPopular": false,
    "title": "Team Workspace: Adding Members, Roles & Centralized Signatures",
    "eyebrow": "ACCOUNT & BILLING GUIDE",
    "category": "Account & billing",
    "categorySlug": "account-billing",
    "readTime": "3 min read",
    "appliesTo": "Team Plan Subscribers",
    "author": "SigSignature Enterprise Team",
    "subtitle": "Centralize your company's email branding. Learn how to invite team members, assign Admin/Member roles, and deploy standardized signatures across your organization.",
    "overview": [
      "When a scaling company lacks a centralized email signature system, employee signatures quickly degenerate into chaos: * Sales reps create their own signatures with outdated logos and inconsistent colors. * Employees link to defunct marketing campaigns or broken social handles. * Required legal disclaimers and regulatory notices are omitted.",
      "SigSignature's **Team Workspace** gives administrators complete governance over company email branding. You design and lock the master corporate template once; team members simply populate their name and direct phone number."
    ],
    "sections": [
      {
        "heading": "Step-by-Step Team Deployment",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Step 1: Open Team Signatures Dashboard",
            "description": "Step 1: Open Team Signatures Dashboard"
          },
          {
            "number": 2,
            "title": "Ensure your account is upgraded to the **Team Plan**.",
            "description": "Ensure your account is upgraded to the **Team Plan**."
          },
          {
            "number": 3,
            "title": "Click **Team Signatures** in the left sidebar navigation (`/teams`).",
            "description": "Click **Team Signatures** in the left sidebar navigation (`/teams`)."
          },
          {
            "number": 4,
            "title": "You will see your organization's centralized member roster and active seat count.",
            "description": "### Step 2: Create and Lock a Master Corporate Template"
          },
          {
            "number": 5,
            "title": "Under the **Company Templates** section, click **+ Create Master Template**.",
            "description": "Under the **Company Templates** section, click **+ Create Master Template**."
          },
          {
            "number": 6,
            "title": "Select your foundation archetype (e.g. Executive Corporate).",
            "description": "Select your foundation archetype (e.g. Executive Corporate)."
          },
          {
            "number": 7,
            "title": "Upload your official company logo, set your organization's exact brand hex code (e.g. `#01285D`), and add verified social links.",
            "description": "Upload your official company logo, set your organization's exact brand hex code (e.g. `#01285D`), and add verified social links."
          },
          {
            "number": 8,
            "title": "Input mandatory corporate legal disclaimers (e.g., confidentiality notices, GDPR statements).",
            "description": "Input mandatory corporate legal disclaimers (e.g., confidentiality notices, GDPR statements)."
          },
          {
            "number": 9,
            "title": "**Lock Core Assets:** Toggle **Lock Brand Elements**. This prevents team members from altering logos, fonts, colors, or disclaimers, while allowing them to edit their name, title, cell phone, and booking link.",
            "description": "### Step 3: Inviting Team Members You can onboard team members using two methods: ### Step 4: Role Permissions Structure",
            "substeps": [
              "**Method A (Email Invite):** Click **Invite Member**, type the employee's work email address (e.g., `alex@company.com`), select their role, and click **Send Invite**.",
              "**Method B (CSV Bulk Upload):** For teams over 10 members, click **Import CSV**. Upload a spreadsheet containing columns: `Name`, `Email`, `Title`, `Phone`. SigSignature will generate individual signatures automatically!",
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Distributing Signatures to Employees",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "Once an employee accepts their invite:",
            "description": "Once an employee accepts their invite:"
          },
          {
            "number": 2,
            "title": "They log in and see their pre-configured, locked company signature.",
            "description": "They log in and see their pre-configured, locked company signature."
          },
          {
            "number": 3,
            "title": "They verify their phone number and headshot.",
            "description": "They verify their phone number and headshot."
          },
          {
            "number": 4,
            "title": "They click **Copy Visual Signature** and paste it into their Gmail, Outlook, or Apple Mail client following the provided client guide.",
            "description": "They click **Copy Visual Signature** and paste it into their Gmail, Outlook, or Apple Mail client following the provided client guide."
          },
          {
            "number": 5,
            "title": "When marketing updates a global banner or corporate disclaimer, all workspace signatures update centrally!",
            "description": "When marketing updates a global banner or corporate disclaimer, all workspace signatures update centrally!",
            "substeps": [
              "---"
            ]
          }
        ]
      },
      {
        "heading": "Offboarding Team Members",
        "paragraphs": [],
        "steps": [
          {
            "number": 1,
            "title": "When an employee departs your organization:",
            "description": "When an employee departs your organization:"
          },
          {
            "number": 2,
            "title": "Navigate to **Team Signatures** -> Locate the employee in the member list.",
            "description": "Navigate to **Team Signatures** -> Locate the employee in the member list."
          },
          {
            "number": 3,
            "title": "Click the three dots (`...`) -> Select **Remove from Team**.",
            "description": "Click the three dots (`...`) -> Select **Remove from Team**."
          },
          {
            "number": 4,
            "title": "The allocated seat is instantly freed up for your next hire.",
            "description": "The allocated seat is instantly freed up for your next hire."
          },
          {
            "number": 5,
            "title": "The departed employee's access to the workspace template is immediately revoked.",
            "description": "The departed employee's access to the workspace template is immediately revoked.",
            "substeps": [
              "---"
            ]
          }
        ]
      }
    ],
    "keyTakeaways": [
      "Team Workspaces eliminate brand fragmentation by locking logos, colors, and disclaimers.",
      "Onboard individuals via email invite or bulk-import entire departments via CSV.",
      "Seat licenses can be reassigned freely whenever team members change."
    ]
  }
];

export const DETAILED_GUIDES: Record<string, DetailedGuide> = {};

// Register all 19 guides by their primary canonical slug
ALL_19_GUIDES.forEach((guide) => {
  DETAILED_GUIDES[guide.slug] = guide;
});

// Aliases for backwards compatibility with earlier routes & popular guides
const ALIASES: Record<string, string> = {
  "create-first-signature": "create-first-email-signature",
  "fix-image-sizing": "fix-image-sizing-spacing",
  "install-gmail": "install-signature-gmail",
  "add-outlook": "add-signature-outlook",
  "export-html": "export-html-embed-code",
};

Object.entries(ALIASES).forEach(([alias, targetSlug]) => {
  if (DETAILED_GUIDES[targetSlug]) {
    DETAILED_GUIDES[alias] = DETAILED_GUIDES[targetSlug];
  }
});

export const GUIDES_BY_CATEGORY: Record<string, DetailedGuide[]> = {
  "getting-started": ALL_19_GUIDES.filter((g) => g.categorySlug === "getting-started"),
  "design-templates": ALL_19_GUIDES.filter((g) => g.categorySlug === "design-templates"),
  "export-installation": ALL_19_GUIDES.filter((g) => g.categorySlug === "export-installation"),
  "account-billing": ALL_19_GUIDES.filter((g) => g.categorySlug === "account-billing"),
};
