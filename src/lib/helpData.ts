export interface HelpCategory {
  slug: string;
  title: string;
  description: string;
  guideCount: number;
  icon: "rocket" | "palette" | "code" | "user";
}

export interface PopularGuide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  href: string;
}

export interface QuickAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface SupportInfo {
  title: string;
  description: string;
  buttonText: string;
  fallbackEmail: string;
  href?: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "Your first signature, step by step.",
    guideCount: 4,
    icon: "rocket",
  },
  {
    slug: "design-templates",
    title: "Design & templates",
    description: "Make every detail your own.",
    guideCount: 6,
    icon: "palette",
  },
  {
    slug: "export-installation",
    title: "Export & installation",
    description: "From the editor to your inbox.",
    guideCount: 5,
    icon: "code",
  },
  {
    slug: "account-billing",
    title: "Account & billing",
    description: "Manage access and preferences.",
    guideCount: 4,
    icon: "user",
  },
];

export const POPULAR_GUIDES: PopularGuide[] = [
  {
    id: "create-first-signature",
    title: "Create your first email signature",
    category: "Getting started",
    readTime: "3 min read",
    href: "/help?guide=create-first-signature",
  },
  {
    id: "install-gmail",
    title: "Install your signature in Gmail",
    category: "Installation",
    readTime: "2 min read",
    href: "/help?guide=install-gmail",
  },
  {
    id: "add-outlook",
    title: "Add a signature to Outlook",
    category: "Installation",
    readTime: "4 min read",
    href: "/help?guide=add-outlook",
  },
  {
    id: "export-html",
    title: "Export production ready HTML",
    category: "Export",
    readTime: "2 min read",
    href: "/help?guide=export-html",
  },
  {
    id: "fix-image-sizing",
    title: "Fix image sizing and spacing",
    category: "Troubleshooting",
    readTime: "3 min read",
    href: "/help?guide=fix-image-sizing",
  },
];

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    id: "email-client-compatibility",
    question: "Can I use my signature in any email client?",
    answer:
      "Export the HTML and follow the installation guide for your email client. Gmail and Outlook handle formatting differently, so send a test email after exporting.",
  },
  {
    id: "edit-after-exporting",
    question: "Can I edit a signature after exporting?",
    answer:
      "Signatures are saved in your account, so simply open My Signatures, edit your signature, and export the updated version again.",
  },
  {
    id: "outlook-image-rendering",
    question: "Why does my image look different in Outlook?",
    answer:
      "Outlook uses Microsoft Word's rendering engine which can scale images unexpectedly. Use JPEG or PNG format with explicit width and height attributes in the editor for pixel-perfect results.",
  },
  {
    id: "save-multiple-signatures",
    question: "How do I save more than one signature?",
    answer:
      "The Free plan allows up to 3 signatures. Upgrade to a premium plan for unlimited signatures, or delete an existing signature to create a new one.",
  },
  {
    id: "manage-account-settings",
    question: "Where can I manage my account?",
    answer:
      "You can manage your profile, team members, and billing preferences directly from Settings and Pricing & Billing in the left sidebar.",
  },
];

export const SUPPORT_INFO: SupportInfo = {
  title: "Still need a hand?",
  description: "Tell us what you're trying to do. A screenshot or email client name helps.",
  buttonText: "Contact Support",
  href: "/contact",
  fallbackEmail: "teams@thenevon.com",
};
