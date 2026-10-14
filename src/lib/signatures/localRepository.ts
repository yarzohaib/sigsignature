import { getStoredUser } from "@/app/lib/auth";
import { SavedSignature, SaveSignatureInput } from "@/types/signature";
import { SignatureRepository } from "./repository";

const LEGACY_STORAGE_KEY = "sig_user_signatures";

export class LocalSignatureRepository implements SignatureRepository {
  private getStorageKey(): string {
    const user = getStoredUser();
    if (!user || !user.id) {
      throw new Error("No authenticated user found. Please log in to manage signatures.");
    }
    return `sig_signatures_${user.id}`;
  }

  private readRaw(storageKey: string): SavedSignature[] {
    if (typeof window === "undefined") return [];

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as SavedSignature[];
      }
      return [];
    } catch (err) {
      console.error(`Error reading ${storageKey} from localStorage:`, err);
      return [];
    }
  }

  private writeRaw(storageKey: string, signatures: SavedSignature[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(signatures));
    } catch (err: unknown) {
      if (
        err instanceof DOMException &&
        (err.name === "QuotaExceededError" ||
          err.code === 22 ||
          err.code === 1014 ||
          err.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        throw new Error("Storage is full. Remove old signatures or use a smaller photo.");
      }
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("Failed to save signature to local storage.");
    }
  }

  private migrateLegacyData(storageKey: string, currentList: SavedSignature[]): SavedSignature[] {
    if (typeof window === "undefined") return currentList;

    const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!rawLegacy) return currentList;

    try {
      const parsedLegacy = JSON.parse(rawLegacy);
      if (!Array.isArray(parsedLegacy)) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return currentList;
      }

      const existingIds = new Set(currentList.map((s) => s.id));
      const migrated: SavedSignature[] = [];

      for (const item of parsedLegacy) {
        if (item && typeof item === "object" && "rawTemplateData" in item && item.rawTemplateData) {
          const legacyId = typeof item.id === "string" ? item.id : `sig_${crypto.randomUUID()}`;
          if (!existingIds.has(legacyId)) {
            existingIds.add(legacyId);
            migrated.push({
              id: legacyId,
              templateId: typeof item.templateId === "string" ? item.templateId : "minimal-1",
              templateVersion: 1,
              name:
                typeof item.name === "string" && item.name
                  ? item.name
                  : item.rawTemplateData.fullName || "My Signature",
              data: item.rawTemplateData,
              createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
              updatedAt: typeof item.updatedAt === "string" && !item.updatedAt.startsWith("Updated")
                ? item.updatedAt
                : new Date().toISOString(),
            });
          }
        }
      }

      const merged = [...migrated, ...currentList];
      this.writeRaw(storageKey, merged);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return merged;
    } catch (err) {
      console.warn("Legacy signatures migration error:", err);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return currentList;
    }
  }

  async list(): Promise<SavedSignature[]> {
    const storageKey = this.getStorageKey();
    let signatures = this.readRaw(storageKey);

    // One-time migration if legacy key exists
    signatures = this.migrateLegacyData(storageKey, signatures);

    // Sort newest updatedAt first
    return [...signatures].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async get(id: string): Promise<SavedSignature | null> {
    const signatures = await this.list();
    return signatures.find((s) => s.id === id) || null;
  }

  async save(input: SaveSignatureInput): Promise<SavedSignature> {
    if (input.data.avatarUrl && input.data.avatarUrl.startsWith("data:")) {
      throw new Error("Photo is not uploaded yet. Please wait for the upload to finish.");
    }

    const storageKey = this.getStorageKey();
    const existingList = await this.list();

    const now = new Date().toISOString();
    const existingIndex = input.id ? existingList.findIndex((s) => s.id === input.id) : -1;

    let savedItem: SavedSignature;

    if (existingIndex >= 0) {
      const existing = existingList[existingIndex];
      savedItem = {
        id: existing.id,
        templateId: input.templateId,
        templateVersion: 1,
        name: input.name.trim() || input.data.fullName.trim() || "My Signature",
        data: input.data,
        createdAt: existing.createdAt,
        updatedAt: now,
      };

      const updatedList = [...existingList];
      updatedList[existingIndex] = savedItem;
      this.writeRaw(storageKey, updatedList);
    } else {
      const newId = input.id && input.id.startsWith("sig_") ? input.id : `sig_${crypto.randomUUID()}`;
      savedItem = {
        id: newId,
        templateId: input.templateId,
        templateVersion: 1,
        name: input.name.trim() || input.data.fullName.trim() || "My Signature",
        data: input.data,
        createdAt: now,
        updatedAt: now,
      };

      const updatedList = [savedItem, ...existingList];
      this.writeRaw(storageKey, updatedList);
    }

    return savedItem;
  }

  async remove(id: string): Promise<void> {
    const storageKey = this.getStorageKey();
    const existingList = await this.list();
    const filtered = existingList.filter((s) => s.id !== id);
    this.writeRaw(storageKey, filtered);
  }

  async duplicate(id: string): Promise<SavedSignature> {
    const storageKey = this.getStorageKey();
    const existingList = await this.list();
    const target = existingList.find((s) => s.id === id);

    if (!target) {
      throw new Error(`Signature with id "${id}" not found.`);
    }

    const now = new Date().toISOString();
    const duplicated: SavedSignature = {
      id: `sig_${crypto.randomUUID()}`,
      templateId: target.templateId,
      templateVersion: target.templateVersion || 1,
      name: `${target.name} (Copy)`,
      data: JSON.parse(JSON.stringify(target.data)),
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [duplicated, ...existingList];
    this.writeRaw(storageKey, updatedList);
    return duplicated;
  }
}
