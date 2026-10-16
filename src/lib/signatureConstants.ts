export const SIGNATURE_COLOR_SWATCHES = [
  "#0F172A",
  "#245FD4",
  "#022977",
  "#8B5CF6",
  "#059669",
] as const;

export const SOCIAL_NETWORKS = [
  "linkedin",
  "twitter",
  "facebook",
  "instagram",
] as const;

export const ICON_STYLES = ["filled", "outline", "circle", "minimal"] as const;

export type SignatureColorSwatch = (typeof SIGNATURE_COLOR_SWATCHES)[number];
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
export type IconStyle = (typeof ICON_STYLES)[number];

export const EMAIL_SAFE_ICONS: Record<SocialNetwork, string> = {
  linkedin:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/linkedin-icon-2x.png",
  twitter:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/twitter-icon-2x.png",
  facebook:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/facebook-icon-2x.png",
  instagram:
    "https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/instagram-icon-2x.png",
};

export function emailIconUrl(
  style: IconStyle | string,
  color: string,
  network: SocialNetwork | string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  if (baseUrl) {
    const cleanColor = color.replace(/^#/, "").toLowerCase();
    const normalizedBase = baseUrl.replace(/\/$/, "");
    return `${normalizedBase}/static/${style}-${cleanColor}-${network}.png`;
  }
  const net = (network || "").toLowerCase() as SocialNetwork;
  return EMAIL_SAFE_ICONS[net] || "";
}
