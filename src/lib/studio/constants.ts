export const STUDIO_SOLID_COLORS = [
  "#245FD4",
  "#64748B",
  "#FFFFFF",
  "#F59E0B",
  "#22A869",
  "#8B5CF6",
  "#EC4899",
  "#449AFA",
] as const;

export type StudioSolidColor = (typeof STUDIO_SOLID_COLORS)[number];
