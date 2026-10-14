import { SavedSignature, SaveSignatureInput } from "@/types/signature";
import { ApiSignatureRepository } from "./apiRepository";

export interface SignatureRepository {
  list(): Promise<SavedSignature[]>;
  get(id: string): Promise<SavedSignature | null>;
  save(input: SaveSignatureInput): Promise<SavedSignature>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<SavedSignature>;
}

let repositoryInstance: SignatureRepository | null = null;

export function getSignatureRepository(): SignatureRepository {
  if (!repositoryInstance) {
    repositoryInstance = new ApiSignatureRepository();
  }
  return repositoryInstance;
}
