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
  | "richtext"
  | "image"
  | "media"
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
  /** Storage folder for image/media uploads. */
  folder?: string;
  accept?: string;
  /** Groups fields into friendly sections in the editor. */
  group?: string;
}

export interface ColumnConfig {
  name: string;
  label: string;
  kind?: "text" | "badge" | "date" | "boolean" | "truncate" | "image" | "html";
  hideOnMobile?: boolean;
}

export interface CardConfig {
  /** Field shown as the card title. */
  title: string;
  /** Field shown as the card body (plain text or rich text). */
  body?: string;
  /** Small line above the title (e.g. sender, album). */
  eyebrow?: string;
  /** Field rendered as a cover image. */
  image?: string;
  /** Field rendered as a coloured pill. */
  badge?: string;
  /** Extra one-line meta fields shown at the card foot. */
  meta?: string[];
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
  /** Preferred default layout. Cards suit visual or message-style content. */
  defaultView?: "table" | "cards";
  /** Card renderer mapping — required when cards are available. */
  card?: CardConfig;
  /** Show the draft / published filter and publish toggle in the editor. */
  publishable?: boolean;
  /** Field used for the draft/published state. */
  statusField?: string;
}

