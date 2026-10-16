import { SavedSignature } from "@/types/signature";

export function getSignatureKind(templateId: string): "template" | "studio" {
  return templateId === "design-studio" ? "studio" : "template";
}

export function getEditHref(sig: SavedSignature): string {
  return sig.kind === "studio"
    ? `/design-studio?edit=${encodeURIComponent(sig.id)}`
    : `/templates?edit=${encodeURIComponent(sig.id)}`;
}
