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

export function emailIconUrl(
  style: IconStyle | string,
  color: string,
  network: SocialNetwork | string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  if (!baseUrl) {
    return "";
  }
  const cleanColor = color.replace(/^#/, "").toLowerCase();
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}/static/${style}-${cleanColor}-${network}.png`;
}
