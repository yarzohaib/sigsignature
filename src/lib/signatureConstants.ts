import {
  emailIconUrl as coreEmailIconUrl,
  SOCIAL_NETWORKS as coreSocialNetworks,
  CONTACT_ICONS as coreContactIcons,
  type SocialNetwork as CoreSocialNetwork,
  type ContactIcon as CoreContactIcon,
} from "./email-core";

export const SIGNATURE_COLOR_SWATCHES = [
  "#0F172A",
  "#245FD4",
  "#022977",
  "#8B5CF6",
  "#059669",
  "#DCBB9A",
] as const;

export const CONTACT_ICONS = coreContactIcons;
export const SOCIAL_NETWORKS = coreSocialNetworks;

export const ICON_STYLES = ["filled", "outline", "circle", "minimal"] as const;

export type SignatureColorSwatch = (typeof SIGNATURE_COLOR_SWATCHES)[number];
export type ContactIcon = CoreContactIcon;
export type SocialNetwork = CoreSocialNetwork;
export type IconStyle = (typeof ICON_STYLES)[number];

export const emailIconUrl = coreEmailIconUrl;
