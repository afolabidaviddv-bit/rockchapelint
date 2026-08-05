/**
 * Shared admin data types.
 *
 * Every record mirrors a future Supabase table row: `id` (uuid) + `created_at`
 * (timestamptz) + content columns. Swapping the local adapter in
 * `src/admin/store.ts` for Supabase queries requires no UI changes.
 */

export interface BaseRecord {
  id: string;
  created_at: string;
  [key: string]: unknown;
}

export type CollectionKey =
  | "homepage_sections"
  | "leaders"
  | "ministries"
  | "sermons"
  | "events"
  | "gallery"
  | "announcements"
  | "prayer_requests"
  | "contact_messages"
  | "subscribers"
  | "settings";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "switch"
  | "url"
  | "email";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  help?: string;
  full?: boolean;
}

export interface ColumnConfig {
  name: string;
  label: string;
  kind?: "text" | "badge" | "date" | "boolean" | "truncate";
  hideOnMobile?: boolean;
}

export interface ResourceConfig {
  collection: CollectionKey;
  title: string;
  singular: string;
  description: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  searchKeys: string[];
  /** Read-only collections (inbound submissions) cannot be created from the UI. */
  canCreate?: boolean;
  canEdit?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
}
