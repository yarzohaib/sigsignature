export type TemplateCategory = "All" | "Minimal" | "Corporate" | "Creative" | "Bold";

export interface TemplateSignatureData {
  templateId?: string;
  fullName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  avatarUrl: string;
  companyLogoUrl?: string;
  themeColor: string;
  fontFamily: string;
  layout: "two-column" | "horizontal" | "compact" | "single" | "corporate-card";
  socialIconsStyle: "filled" | "outline" | "circle";
  socials: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram?: string;
    github?: string;
    youtube?: string;
    website?: string;
  };
  optional: {
    address?: string;
    tagline?: string;
    disclaimer?: string;
  };
}

export interface TemplateItem {
  id: string;
  name: string;
  category: "Minimal" | "Corporate" | "Creative" | "Bold";
  tag: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  description: string;
  defaultData: TemplateSignatureData;
}
