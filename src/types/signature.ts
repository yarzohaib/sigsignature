import { TemplateSignatureData } from "./template";

export interface SavedSignature {
  id: string;
  templateId: string;
  templateVersion: number; // use 1 for now
  name: string; // label shown on My Signatures, default to data.fullName or "My Signature"
  data: TemplateSignatureData; // reuse the existing type from src/types/template.ts
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export type SaveSignatureInput = {
  id?: string; // present when editing an existing signature
  templateId: string;
  name: string;
  data: TemplateSignatureData;
};
