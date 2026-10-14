import { requestUploadUrl, UploadContentType, UploadKind } from "@/app/lib/api";

const VALID_CONTENT_TYPES: readonly UploadContentType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/**
 * Uploads an avatar or logo Blob to S3 via backend presigned URL.
 * Returns the public URL of the uploaded image.
 */
export async function uploadSignatureImage(
  blob: Blob,
  kind: UploadKind = "avatar"
): Promise<string> {
  const contentType = blob.type as UploadContentType;
  if (!VALID_CONTENT_TYPES.includes(contentType)) {
    throw new Error(
      `Invalid image content type "${blob.type}". Expected image/jpeg, image/png, or image/webp.`
    );
  }

  // 1. Request presigned URL from backend
  const { uploadUrl, publicUrl } = await requestUploadUrl({
    kind,
    contentType,
    size: blob.size,
  });

  // 2. Direct PUT of the raw blob to S3 with Content-Type header and NO Authorization header
  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: blob,
    });
  } catch (networkErr: unknown) {
    const errorDetail =
      networkErr instanceof Error ? networkErr.message : "Network error";
    throw new Error(`Failed to upload image to storage (${errorDetail}).`);
  }

  if (!response.ok) {
    throw new Error(
      `Image upload failed with status ${response.status} (${response.statusText || "Storage error"}).`
    );
  }

  return publicUrl;
}
