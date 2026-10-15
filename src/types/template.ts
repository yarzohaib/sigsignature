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
  layout: "two-column" | "horizontal" | "compact" | "single";
  socialIconsStyle: "filled" | "outline" | "circle" | "minimal";
  design?: {
    theme: "corporate" | "minimal" | "modern" | "dark";
    shape: "rounded" | "square" | "pill";
    buttonStyle: "solid" | "outline";
  };
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
  extras?: SignatureExtraItem[];
}

export type ExtraTextItem = {
  id: string;
  type: "text";
  text: string;
  align: "left" | "center" | "right";
  size: "sm" | "md" | "lg";
  bold: boolean;
  width?: number;
  column?: "left" | "right" | "full";
};

export type ExtraImageItem = {
  id: string;
  type: "image";
  url: string;
  width: number;
  align: "left" | "center" | "right";
  linkUrl?: string;
  column?: "left" | "right" | "full";
};

export type ExtraDividerItem = {
  id: string;
  type: "divider";
  width?: number;
  align?: "left" | "center" | "right";
  thickness?: number;
  orientation?: "horizontal" | "vertical";
  column?: "left" | "right" | "full";
};

export type ExtraCtaItem = {
  id: string;
  type: "cta";
  label: string;
  url: string;
  align: "left" | "center" | "right";
  width?: number;
  column?: "left" | "right" | "full";
};

export type ExtraBannerItem = {
  id: string;
  type: "banner";
  imageUrl: string;
  linkUrl?: string;
  column?: "left" | "right" | "full";
};

export type SignatureExtraItem =
  | ExtraTextItem
  | ExtraImageItem
  | ExtraDividerItem
  | ExtraCtaItem
  | ExtraBannerItem;

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
