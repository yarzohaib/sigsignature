import { TemplateSignatureData } from "./template";
import { StudioSignatureData } from "./studio";

export interface TemplateSavedSignature {
  id: string;
  kind: "template";
  templateId: string;
  templateVersion: number;
  name: string;
  data: TemplateSignatureData;
  createdAt: string;
  updatedAt: string;
}

export interface StudioSavedSignature {
  id: string;
  kind: "studio";
  templateId: string;
  templateVersion: number;
  name: string;
  data: StudioSignatureData;
  createdAt: string;
  updatedAt: string;
}

export type SavedSignature = TemplateSavedSignature | StudioSavedSignature;

export type TemplateSaveSignatureInput = {
  id?: string;
  kind?: "template";
  templateId: string;
  name: string;
  data: TemplateSignatureData;
};

export type StudioSaveSignatureInput = {
  id?: string;
  kind?: "studio";
  templateId: string;
  name: string;
  data: StudioSignatureData;
};

export type SaveSignatureInput = TemplateSaveSignatureInput | StudioSaveSignatureInput;
