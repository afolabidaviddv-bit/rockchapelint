const PREFIX = "local:";

export const isStorageRef = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith(PREFIX);
export const toStorageRef = (value: string) => value;
export const storagePath = (ref: string) => ref.slice(PREFIX.length);

export async function uploadMedia(file: File, _folder = "uploads", onProgress?: (percent: number) => void) {
  onProgress?.(25);
  const url = URL.createObjectURL(file);
  onProgress?.(100);
  return `${PREFIX}${url}`;
}

export async function removeMedia(ref: string) {
  if (isStorageRef(ref)) URL.revokeObjectURL(storagePath(ref));
}

export async function resolveMediaUrl(value: unknown): Promise<string> {
  if (typeof value !== "string" || !value) return "";
  return isStorageRef(value) ? storagePath(value) : value;
}
