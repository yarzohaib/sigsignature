import { emailIconUrl as coreEmailIconUrl } from "./email-core";

export const SIGNATURE_COLOR_SWATCHES = [
  "#0F172A",
  "#245FD4",
  "#022977",
  "#8B5CF6",
  "#059669",
  "#DCBB9A",
] as const;

export const SOCIAL_NETWORKS = [
  "linkedin",
  "twitter",
  "facebook",
  "instagram",
  "github",
  "youtube",
  "website",
] as const;

export const ICON_STYLES = ["filled", "outline", "circle", "minimal"] as const;

export type SignatureColorSwatch = (typeof SIGNATURE_COLOR_SWATCHES)[number];
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
export type IconStyle = (typeof ICON_STYLES)[number];

export const emailIconUrl = coreEmailIconUrl;
