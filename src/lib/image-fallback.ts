import type { SyntheticEvent } from "react";

export function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#e9e5dc"/><path d="M0 390l170-145 105 90 120-135 205 190H0z" fill="#c7bda9"/><circle cx="610" cy="145" r="46" fill="#b49a62"/><text x="400" y="455" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="#263b36">Image unavailable</text></svg>`,
  )}`;
  image.classList.add("bg-muted");
  image.alt = image.alt || "Image unavailable";
  image.setAttribute("aria-label", image.alt);
}
