/** Local browser media adapter for the preview/demo experience. */
const PREFIX = "local-media:";

export const isStorageRef = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith(PREFIX);

export async function uploadMedia(file: File, _folder = "uploads", onProgress?: (percent: number) => void) {
  onProgress?.(20);
  const result = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
  onProgress?.(100);
  return `${PREFIX}${result}`;
}

export async function removeMedia(_ref: string) {
  return Promise.resolve();
}

export async function resolveMediaUrl(value: unknown): Promise<string> {
  if (typeof value !== "string" || !value) return "";
  return isStorageRef(value) ? value.slice(PREFIX.length) : value;
}
