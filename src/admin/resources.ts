import type { ResourceConfig } from "./types";

const publishedField = {
  name: "published",
  label: "Published",
  type: "switch" as const,
  help: "Visible on the public website",
};

export const homepageResource: ResourceConfig = {
  collection: "homepage_sections",
  title: "Homepage Content",
  singular: "Section",
  description: "Headlines, supporting copy and calls to action shown on the public homepage.",
  searchKeys: ["section", "heading", "subheading"],
  fields: [
    { name: "section", label: "Section name", type: "text", required: true, placeholder: "Hero" },
    { name: "order", label: "Display order", type: "number", placeholder: "1" },
    { name: "heading", label: "Heading", type: "text", required: true, full: true },
    { name: "subheading", label: "Supporting text", type: "textarea", full: true },
    { name: "cta_label", label: "Button label", type: "text", placeholder: "Plan your visit" },
    { name: "cta_link", label: "Button link", type: "text", placeholder: "/contact" },
    publishedField,
  ],
  columns: [
    { name: "section", label: "Section" },
    { name: "heading", label: "Heading", kind: "truncate" },
    { name: "order", label: "Order", hideOnMobile: true },
    { name: "published", label: "Status", kind: "boolean" },
  ],
};

export const leadershipResource: ResourceConfig = {
  collection: "leaders",
  title: "Leadership",
  singular: "Leader",
  description: "Pastors, ministers and department heads featured on the leadership page.",
  searchKeys: ["name", "role", "bio"],
  fields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true },
    { name: "bio", label: "Biography", type: "textarea", full: true },
    { name: "image_url", label: "Portrait URL", type: "url", full: true, placeholder: "https://…" },
    { name: "order", label: "Display order", type: "number" },
    publishedField,
  ],
  columns: [
    { name: "name", label: "Name" },
    { name: "role", label: "Role", hideOnMobile: true },
    { name: "order", label: "Order", hideOnMobile: true },
    { name: "published", label: "Status", kind: "boolean" },
  ],
};

export const ministriesResource: ResourceConfig = {
  collection: "ministries",
  title: "Ministries",
  singular: "Ministry",
  description: "Departments and fellowships people can join.",
  searchKeys: ["title", "description", "leader"],
  fields: [
    { name: "title", label: "Ministry name", type: "text", required: true },
    { name: "leader", label: "Ministry lead", type: "text" },
    { name: "description", label: "Description", type: "textarea", full: true },
    { name: "meets", label: "Meeting schedule", type: "text", placeholder: "Sundays · 8:00 AM" },
    publishedField,
  ],
  columns: [
    { name: "title", label: "Ministry" },
    { name: "meets", label: "Meets", hideOnMobile: true },
    { name: "leader", label: "Lead", hideOnMobile: true },
    { name: "published", label: "Status", kind: "boolean" },
  ],
};

export const sermonsResource: ResourceConfig = {
  collection: "sermons",
  title: "Sermons",
  singular: "Sermon",
  description: "Messages archived for streaming and download.",
  searchKeys: ["title", "speaker", "series"],
  fields: [
    { name: "title", label: "Sermon title", type: "text", required: true },
    { name: "speaker", label: "Speaker", type: "text", required: true },
    { name: "series", label: "Series", type: "text" },
    { name: "date", label: "Date preached", type: "text", placeholder: "July 26, 2026" },
    { name: "duration", label: "Duration", type: "text", placeholder: "48 min" },
    { name: "video_url", label: "Video / audio URL", type: "url", full: true },
    { name: "summary", label: "Summary", type: "textarea", full: true },
    publishedField,
  ],
  columns: [
    { name: "title", label: "Title", kind: "truncate" },
    { name: "speaker", label: "Speaker", hideOnMobile: true },
    { name: "series", label: "Series", kind: "badge", hideOnMobile: true },
    { name: "published", label: "Status", kind: "boolean" },
  ],
};

export const eventsResource: ResourceConfig = {
  collection: "events",
  title: "Events",
  singular: "Event",
  description: "Services, outreaches and special gatherings on the church calendar.",
  searchKeys: ["title", "location", "description"],
  fields: [
    { name: "title", label: "Event title", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Upcoming", value: "upcoming" },
        { label: "Past", value: "past" },
      ],
    },
    { name: "date", label: "Date", type: "text", placeholder: "August 14, 2026" },
    { name: "time", label: "Time", type: "text", placeholder: "6:00 PM – 9:00 PM" },
    { name: "location", label: "Location", type: "text", full: true },
    { name: "description", label: "Description", type: "textarea", full: true },
    publishedField,
  ],
  columns: [
    { name: "title", label: "Event", kind: "truncate" },
    { name: "date", label: "Date", hideOnMobile: true },
    { name: "status", label: "Status", kind: "badge" },
    { name: "published", label: "Published", kind: "boolean", hideOnMobile: true },
  ],
};

export const galleryResource: ResourceConfig = {
  collection: "gallery",
  title: "Gallery",
  singular: "Photo",
  description: "Photographs grouped into albums for the public gallery.",
  searchKeys: ["title", "album", "caption"],
  fields: [
    { name: "title", label: "Photo title", type: "text", required: true },
    { name: "album", label: "Album", type: "text", placeholder: "Worship" },
    { name: "image_url", label: "Image URL", type: "url", full: true, placeholder: "https://…" },
    { name: "caption", label: "Caption", type: "textarea", full: true },
    publishedField,
  ],
  columns: [
    { name: "title", label: "Photo" },
    { name: "album", label: "Album", kind: "badge", hideOnMobile: true },
    { name: "caption", label: "Caption", kind: "truncate", hideOnMobile: true },
    { name: "published", label: "Status", kind: "boolean" },
  ],
};

export const announcementsResource: ResourceConfig = {
  collection: "announcements",
  title: "Announcements",
  singular: "Announcement",
  description: "Notices shown across the site and read out during services.",
  searchKeys: ["title", "body"],
  fields: [
    { name: "title", label: "Title", type: "text", required: true, full: true },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      options: [
        { label: "High", value: "high" },
        { label: "Normal", value: "normal" },
        { label: "Low", value: "low" },
      ],
    },
    { name: "body", label: "Message", type: "textarea", full: true, required: true },
    publishedField,
  ],
  columns: [
    { name: "title", label: "Announcement", kind: "truncate" },
    { name: "priority", label: "Priority", kind: "badge", hideOnMobile: true },
    { name: "created_at", label: "Created", kind: "date", hideOnMobile: true },
    { name: "published", label: "Status", kind: "boolean" },
  ],
};

export const prayerResource: ResourceConfig = {
  collection: "prayer_requests",
  title: "Prayer Requests",
  singular: "Prayer request",
  description: "Requests submitted through the public prayer desk.",
  searchKeys: ["name", "email", "request", "category"],
  canCreate: false,
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "category", label: "Category", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "New", value: "new" },
        { label: "Praying", value: "praying" },
        { label: "Answered", value: "answered" },
        { label: "Archived", value: "archived" },
      ],
    },
    { name: "request", label: "Request", type: "textarea", full: true },
    { name: "confidential", label: "Confidential", type: "switch" },
  ],
  columns: [
    { name: "name", label: "From" },
    { name: "category", label: "Category", kind: "badge", hideOnMobile: true },
    { name: "request", label: "Request", kind: "truncate", hideOnMobile: true },
    { name: "status", label: "Status", kind: "badge" },
  ],
  emptyTitle: "No prayer requests yet",
  emptyBody: "Requests submitted from the public prayer page will appear here.",
};

export const messagesResource: ResourceConfig = {
  collection: "contact_messages",
  title: "Contact Messages",
  singular: "Message",
  description: "Enquiries sent through the public contact form.",
  searchKeys: ["name", "email", "subject", "message"],
  canCreate: false,
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "subject", label: "Subject", type: "text", full: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Unread", value: "unread" },
        { label: "Read", value: "read" },
        { label: "Replied", value: "replied" },
      ],
    },
    { name: "message", label: "Message", type: "textarea", full: true },
  ],
  columns: [
    { name: "name", label: "From" },
    { name: "subject", label: "Subject", kind: "truncate", hideOnMobile: true },
    { name: "created_at", label: "Received", kind: "date", hideOnMobile: true },
    { name: "status", label: "Status", kind: "badge" },
  ],
  emptyTitle: "No messages yet",
  emptyBody: "Messages sent from the public contact form will appear here.",
};

export const subscribersResource: ResourceConfig = {
  collection: "subscribers",
  title: "Newsletter Subscribers",
  singular: "Subscriber",
  description: "People receiving the church newsletter.",
  searchKeys: ["email", "name", "source"],
  fields: [
    { name: "email", label: "Email", type: "email", required: true },
    { name: "name", label: "Name", type: "text" },
    { name: "source", label: "Source", type: "text", placeholder: "footer" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Subscribed", value: "subscribed" },
        { label: "Unsubscribed", value: "unsubscribed" },
      ],
    },
  ],
  columns: [
    { name: "email", label: "Email" },
    { name: "name", label: "Name", hideOnMobile: true },
    { name: "source", label: "Source", kind: "badge", hideOnMobile: true },
    { name: "status", label: "Status", kind: "badge" },
  ],
  emptyTitle: "No subscribers yet",
  emptyBody: "Newsletter sign-ups from the site footer will appear here.",
};
