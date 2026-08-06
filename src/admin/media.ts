import { supabase } from "@/integrations/supabase/client";

/**
 * Media helpers for the admin portal.
 *
 * Files live in the private `media` bucket. A record stores a lightweight
 * reference (`storage:<path>`); the UI resolves it to a temporary signed URL
 * when rendering. Plain http(s) values are still supported so existing content
 * keeps working.
 */

export const BUCKET = "media";
const PREFIX = "storage:";
const SIGNED_TTL = 60 * 60 * 24; // 24 hours

export const isStorageRef = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith(PREFIX);

export const toStorageRef = (path: string) => `${PREFIX}${path}`;
export const storagePath = (ref: string) => ref.slice(PREFIX.length);

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-|-$/g, "");

export async function uploadMedia(
  file: File,
  folder = "uploads",
  onProgress?: (percent: number) => void,
): Promise<string> {
  const path = `${folder}/${Date.now()}-${slug(file.name)}`;
  onProgress?.(15);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  onProgress?.(100);
  return toStorageRef(path);
}

export async function removeMedia(ref: string) {
  if (!isStorageRef(ref)) return;
  await supabase.storage.from(BUCKET).remove([storagePath(ref)]);
}

const urlCache = new Map<string, string>();

export async function resolveMediaUrl(value: unknown): Promise<string> {
  if (typeof value !== "string" || !value) return "";
  if (!isStorageRef(value)) return value;
  const cached = urlCache.get(value);
  if (cached) return cached;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath(value), SIGNED_TTL);
  if (error || !data?.signedUrl) return "";
  urlCache.set(value, data.signedUrl);
  return data.signedUrl;
}
