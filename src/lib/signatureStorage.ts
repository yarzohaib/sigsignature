import { SignatureItem } from "@/components/signatures/SignatureCard";
import { compressDataUrl } from "./imageUtils";

const STORAGE_KEY = "sig_user_signatures";
const DB_NAME = "SigSignatureDB";
const STORE_NAME = "signatures";
const DB_VERSION = 1;

/**
 * Native IndexedDB connection for persistent high-capacity storage
 * (immune to localStorage 5MB QuotaExceededError).
 */
function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function saveToIndexedDB(signatures: SignatureItem[]): Promise<void> {
  try {
    const db = await openDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const item of signatures) {
      store.put(item);
    }
  } catch (err) {
    console.warn("IndexedDB sync warning:", err);
  }
}

export async function getFromIndexedDB(): Promise<SignatureItem[]> {
  try {
    const db = await openDB();
    if (!db) return [];
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Safely retrieve all saved signatures from localStorage.
 */
export function getStoredSignatures(): SignatureItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error reading signatures from localStorage:", err);
    return [];
  }
}

function notifyStorageUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("sig_storage_updated"));
  }
}

/**
 * Save or update a single signature.
 * Automatically compresses large image data URLs to prevent QuotaExceededError.
 * Also mirrors to IndexedDB as high-capacity persistent backup.
 */
export async function saveStoredSignature(signature: SignatureItem): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // 1. Ensure avatarUrl is compressed to lightweight size (~15KB)
    let optimizedAvatar = signature.avatarUrl;
    if (optimizedAvatar && optimizedAvatar.startsWith("data:image/") && optimizedAvatar.length > 35000) {
      optimizedAvatar = await compressDataUrl(optimizedAvatar, 256, 0.82);
    }

    const itemToSave: SignatureItem = {
      ...signature,
      avatarUrl: optimizedAvatar,
      rawTemplateData: signature.rawTemplateData
        ? {
            ...signature.rawTemplateData,
            avatarUrl: optimizedAvatar || signature.rawTemplateData.avatarUrl,
          }
        : undefined,
      updatedAt: "Updated just now",
    };

    const existing = getStoredSignatures();
    const index = existing.findIndex((s) => s.id === itemToSave.id);

    let updatedList: SignatureItem[];
    if (index >= 0) {
      updatedList = [...existing];
      updatedList[index] = itemToSave;
    } else {
      updatedList = [itemToSave, ...existing];
    }

    // 2. Try saving to localStorage with QuotaExceededError recovery
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (quotaErr) {
      console.warn("Storage quota exceeded. Applying aggressive compression to all avatars...", quotaErr);
      for (const item of updatedList) {
        if (item.avatarUrl && item.avatarUrl.startsWith("data:image/")) {
          item.avatarUrl = await compressDataUrl(item.avatarUrl, 160, 0.7);
          if (item.rawTemplateData) {
            item.rawTemplateData.avatarUrl = item.avatarUrl;
          }
        }
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (finalQuotaErr) {
        console.error("Critical storage quota error. Trimming to recent items:", finalQuotaErr);
        const trimmed = updatedList.slice(0, 5);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      }
    }

    // 3. Persist to IndexedDB (immune to 5MB quota)
    await saveToIndexedDB(updatedList);

    notifyStorageUpdate();
  } catch (err) {
    console.error("Error saving signature:", err);
  }
}

/**
 * Overwrite the full list of saved signatures.
 */
export function saveAllSignatures(signatures: SignatureItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
    notifyStorageUpdate();
  } catch (err) {
    console.error("Error writing signatures to localStorage:", err);
  }
}

/**
 * Delete a signature by id from localStorage.
 */
export function deleteStoredSignature(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getStoredSignatures();
    const filtered = existing.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    notifyStorageUpdate();
  } catch (err) {
    console.error("Error deleting signature from localStorage:", err);
  }
}

/**
 * Duplicate an existing signature in localStorage.
 */
export function duplicateStoredSignature(id: string): SignatureItem | null {
  if (typeof window === "undefined") return null;

  try {
    const existing = getStoredSignatures();
    const target = existing.find((s) => s.id === id);
    if (!target) return null;

    const duplicated: SignatureItem = {
      ...target,
      id: `sig-${Date.now()}`,
      name: `${target.name} (Copy)`,
      updatedAt: "Updated just now",
    };

    const updatedList = [duplicated, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    notifyStorageUpdate();
    return duplicated;
  } catch (err) {
    console.error("Error duplicating signature in localStorage:", err);
    return null;
  }
}

/**
 * Retrieve a single signature by id.
 */
export function getStoredSignatureById(id: string): SignatureItem | null {
  const all = getStoredSignatures();
  return all.find((s) => s.id === id) || null;
}
