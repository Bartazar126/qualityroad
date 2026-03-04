import { promises as fs } from "node:fs";
import path from "node:path";
import { GalleryItem } from "@/types/site-content";

// These are client logo / badge files — exclude from gallery
const LOGO_FILENAMES = new Set([
  "wellis.png", "airvent.png", "umbrolkft.png", "berekfurdo.jpeg",
  "wellis.jpg", "airvent.jpg", "umbrolkft.jpg", "berekfurdo.png",
  "badge megbizhat.png", "badge-dinamikus.png",
  "badge megbizhat.jpg", "badge-dinamikus.jpg",
]);

function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function collectImages(dir: string, baseUrl: string): Promise<GalleryItem[]> {
  const items: GalleryItem[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name)) {
        // Skip logo files from root-level
        if (LOGO_FILENAMES.has(entry.name.toLowerCase())) continue;
        items.push({
          id:      `fallback-${baseUrl}-${entry.name}`,
          src:     `${baseUrl}/${entry.name}`,
          alt:     humanizeFilename(entry.name),
          caption: humanizeFilename(entry.name),
        });
      } else if (entry.isDirectory()) {
        // Skip logo sub-dirs
        if (entry.name === "project-logos") continue;
        const sub = await collectImages(
          path.join(dir, entry.name),
          `${baseUrl}/${encodeURIComponent(entry.name)}`,
        );
        items.push(...sub);
      }
    }
  } catch {
    // directory doesn't exist or can't be read
  }
  return items;
}

export async function getFallbackGallery(): Promise<GalleryItem[]> {
  const uploadsPath = path.join(process.cwd(), "public", "uploads");
  return collectImages(uploadsPath, "/uploads");
}
