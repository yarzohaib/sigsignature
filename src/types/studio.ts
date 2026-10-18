export type StudioLayout = "single" | "two-column" | "compact";
export type StudioSocialIconsStyle = "filled" | "outline" | "minimal";
export type StudioTheme = "corporate" | "minimal" | "modern" | "dark";
export type StudioShape = "rounded" | "square" | "pill";
export type StudioButtonStyle = "solid" | "outline";

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

export type FreeBase = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  locked?: boolean;
};

export type FreeTextElement = FreeBase & {
  type: "text";
  text: string;
  size: "sm" | "md" | "lg";
  bold: boolean;
  align: "left" | "center" | "right";
  bind?: "name" | "jobTitle" | "email" | "phone";
};

export type FreeImageElement = FreeBase & {
  type: "image";
  url: string;
  linkUrl?: string;
  bind?: "photo";
};

export type FreeLogoElement = FreeBase & {
  type: "logo";
  url: string;
  linkUrl?: string;
};

export type FreeBannerElement = FreeBase & {
  type: "banner";
  url: string;
  linkUrl?: string;
};

export type FreeDividerElement = FreeBase & {
  type: "divider";
  orientation: "horizontal" | "vertical";
  thickness: number;
};

export type FreeCtaElement = FreeBase & {
  type: "cta";
  label: string;
  url: string;
};

export type FreeSocialElement = FreeBase & {
  type: "social";
};

export type FreeElement =
  | FreeTextElement
  | FreeImageElement
  | FreeLogoElement
  | FreeBannerElement
  | FreeDividerElement
  | FreeCtaElement
  | FreeSocialElement;

export interface StudioSignatureData {
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
  layout: StudioLayout;
  socialIconsStyle: StudioSocialIconsStyle;
  design?: {
    theme: StudioTheme;
    shape: StudioShape;
    buttonStyle: StudioButtonStyle;
  };
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
  extras?: SignatureExtraItem[];
  canvas?: { width: 600; height: number };
  elements?: FreeElement[];
}
