export type TemplateCategory = "All" | "Minimal" | "Corporate" | "Creative" | "Bold";

export interface TemplateSignatureData {
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
  layout: "two-column" | "horizontal" | "compact";
  socialIconsStyle: "filled" | "outline" | "circle";
  socials: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram?: string;
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
