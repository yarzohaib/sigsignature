import {
  fetchSignatures,
  fetchSignatureById,
  createSignature,
  updateSignature,
  deleteSignature,
  duplicateSignature,
  isSignatureLimitError,
  ApiError,
  BackendSavedSignature,
} from "@/app/lib/api";
import { getStoredUser } from "@/app/lib/auth";
import { SavedSignature, SaveSignatureInput } from "@/types/signature";
import { TemplateSignatureData } from "@/types/template";
import { StudioSignatureData } from "@/types/studio";
import { SignatureRepository } from "./repository";
import { LocalSignatureRepository } from "./localRepository";
import { getSignatureKind } from "./kind";
import {
  syncLifetimeSignatureCount,
  recordSignatureCreated,
  isSignatureLimitReached,
} from "./lifetimeTracker";

function showToastNotification(message: string): void {
  if (typeof window === "undefined") return;

  // Dispatch custom event for global stacked toast notification
  window.dispatchEvent(new CustomEvent("sig_toast", { detail: message }));
}

function toSavedSignature(item: BackendSavedSignature): SavedSignature {
  const kind = getSignatureKind(item.templateId);
  if (kind === "studio") {
    return {
      ...item,
      kind: "studio",
      data: item.data as StudioSignatureData,
    };
  }
  return {
    ...item,
    kind: "template",
    data: item.data as TemplateSignatureData,
  };
}

export class ApiSignatureRepository implements SignatureRepository {
  private isImporting = false;

  private async importLegacyLocalSignatures(userId: string): Promise<void> {
    if (typeof window === "undefined" || this.isImporting) return;
    const flagKey = `sig_imported_${userId}`;
    if (localStorage.getItem(flagKey)) {
      return;
    }

    const legacyKey = `sig_signatures_${userId}`;
    const rawLocal = localStorage.getItem(legacyKey);
    const rawOldLegacy = localStorage.getItem("sig_user_signatures");

    if (!rawLocal && !rawOldLegacy) {
      localStorage.setItem(flagKey, "true");
      return;
    }

    this.isImporting = true;
    try {
      const legacyRepo = new LocalSignatureRepository();
      const localItems = await legacyRepo.list();

      if (localItems.length === 0) {
        localStorage.setItem(flagKey, "true");
        return;
      }

      let importedCount = 0;
      for (const item of localItems) {
        try {
          await createSignature({
            name: item.name || item.data?.fullName || "My Signature",
            templateId: item.templateId || "minimal-1",
            templateVersion: item.templateVersion ?? 1,
            data: item.data,
          });
          importedCount++;
        } catch (err: unknown) {
          if (isSignatureLimitError(err)) {
            // Stop quietly if the plan limit is reached
            break;
          }
          console.warn("[Import] Failed to upload legacy signature:", item.name, err);
        }
      }

      localStorage.setItem(flagKey, "true");

      if (importedCount > 0) {
        showToastNotification(`Imported ${importedCount} saved signatures to your account`);
      }
    } catch (err) {
      console.warn("[Import] Error during legacy signatures import:", err);
      localStorage.setItem(flagKey, "true");
    } finally {
      this.isImporting = false;
    }
  }

  async list(): Promise<SavedSignature[]> {
    const user = getStoredUser();
    if (user?.id) {
      await this.importLegacyLocalSignatures(user.id);
    }

    const items = await fetchSignatures();
    const mapped = items.map(toSavedSignature);
    syncLifetimeSignatureCount(mapped.length, user?.id);
    return mapped;
  }

  async get(id: string): Promise<SavedSignature | null> {
    try {
      const item = await fetchSignatureById(id);
      return toSavedSignature(item);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.statusCode === 404) {
        return null;
      }
      throw err;
    }
  }

  async save(input: SaveSignatureInput): Promise<SavedSignature> {
    const user = getStoredUser();

    if (input.id) {
      const updated = await updateSignature(input.id, {
        name: input.name,
        templateId: input.templateId,
        templateVersion: 1,
        data: input.data,
      });
      return toSavedSignature(updated);
    }

    if (isSignatureLimitReached(0, user?.id)) {
      throw new ApiError(
        "You have reached the maximum signature limit (3) for your Free account. Deleting signatures does not grant additional slots. Please upgrade your plan.",
        403,
        "SIGNATURE_LIMIT_REACHED"
      );
    }

    const created = await createSignature({
      name: input.name,
      templateId: input.templateId,
      templateVersion: 1,
      data: input.data,
    });
    recordSignatureCreated(user?.id);
    return toSavedSignature(created);
  }

  async remove(id: string): Promise<void> {
    await deleteSignature(id);
  }

  async duplicate(id: string): Promise<SavedSignature> {
    const user = getStoredUser();
    if (isSignatureLimitReached(0, user?.id)) {
      throw new ApiError(
        "You have reached the maximum signature limit (3) for your Free account. Deleting signatures does not grant additional slots. Please upgrade your plan.",
        403,
        "SIGNATURE_LIMIT_REACHED"
      );
    }

    const duplicated = await duplicateSignature(id);
    recordSignatureCreated(user?.id);
    return toSavedSignature(duplicated);
  }
}
