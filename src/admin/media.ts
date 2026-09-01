import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "site-media";
export const MEDIA_DEFAULTS = {
  homeHero: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1600&q=80",
  about: "https://images.unsplash.com/photo-1548625361-1934e6c986eb?auto=format&fit=crop&w=1200&q=80",
  directions: "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?auto=format&fit=crop&w=1200&q=80",
  logo: "https://images.unsplash.com/photo-1548625361-58a2f0f8d7f1?auto=format&fit=crop&w=160&q=80",
} as const;

export type MediaKind = "image" | "audio" | "logo";
export type MediaAsset = { key: string; label: string; kind: MediaKind; url: string; alt_text: string };

const mediaTable = () => (supabase as any).from("media_assets");

export async function getMediaAsset(key: string): Promise<MediaAsset | null> {
  const { data } = await mediaTable().select("key,label,kind,url,alt_text").eq("key", key).maybeSingle();
  return (data as MediaAsset | null) ?? null;
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const { data } = await mediaTable().select("key,label,kind,url,alt_text").order("label");
  return (data as MediaAsset[] | null) ?? [];
}

export async function uploadMedia(file: File, keyOrFolder: string, labelOrProgress?: string | ((percent: number) => void), kindOrProgress?: MediaKind | ((percent: number) => void), altText = "") {
  const isCatalogUpload = typeof labelOrProgress === "string";
  const key = isCatalogUpload ? keyOrFolder : `${keyOrFolder}/${file.name}`;
  const label = isCatalogUpload ? labelOrProgress : file.name;
  const kind = isCatalogUpload ? (kindOrProgress as MediaKind) : (file.type.startsWith("audio") ? "audio" : "image");
  const progress = typeof labelOrProgress === "function" ? labelOrProgress : typeof kindOrProgress === "function" ? kindOrProgress : undefined;
  progress?.(20);
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `site/${key}-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  const { error } = await mediaTable().upsert({ key, label, kind, url: data.publicUrl, alt_text: altText, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
  return data.publicUrl;
}

export async function removeMedia(_ref: string) {
  return Promise.resolve();
}

export async function resolveMediaUrl(value: unknown): Promise<string> {
  if (typeof value !== "string" || !value) return "";
  return value;
}

export async function saveMediaUrl(key: string, label: string, kind: MediaKind, url: string, altText = "") {
  const { error } = await mediaTable().upsert({ key, label, kind, url, alt_text: altText, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

export function mediaUrl(asset: MediaAsset | null | undefined, fallback: string) {
  return asset?.url || fallback;
}
