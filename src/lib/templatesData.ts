import { TemplateItem } from "@/types/template";

export const AVAILABLE_TEMPLATES: TemplateItem[] = [
  {
    id: "professional-minimal",
    name: "Professional Minimal",
    category: "Minimal",
    tag: "Minimal",
    isPopular: true,
    isFeatured: true,
    description: "A sleek, modern dual-column signature with profile portrait, contact channels, and company branding.",
    defaultData: {
      fullName: "Daniel Wilson",
      jobTitle: "UX/UI Designer",
      companyName: "Company Name",
      email: "daniel@company.com",
      phone: "+1 (555) 345-6789",
      website: "www.company.com",
      avatarUrl: "/daniel-wilson.png",
      companyLogoUrl: "",
      themeColor: "#245FD4",
      fontFamily: "Inter",
      layout: "two-column",
      socialIconsStyle: "filled",
      socials: {
        linkedin: "https://linkedin.com/in/danielwilson",
        twitter: "https://twitter.com/danielwilson",
        facebook: "https://facebook.com/danielwilson",
        instagram: "",
      },
      optional: {
        address: "123 Business Ave, New York, NY 10001",
        tagline: "Tagline goes here",
        disclaimer: "Confidentiality Notice: This email and any attachments are intended solely for the use of the individual or entity to whom it is addressed.",
      },
    },
  },
];
