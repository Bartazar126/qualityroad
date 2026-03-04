import { promises as fs } from "node:fs";
import path from "node:path";
import { GalleryItem } from "@/types/site-content";

function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function getFallbackGallery(): Promise<GalleryItem[]> {
  const uploadsPath = path.join(process.cwd(), "public", "uploads");

  try {
    const files = await fs.readdir(uploadsPath, { withFileTypes: true });
    const imageFiles = files
      .filter((entry) => entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    return imageFiles.map((file, index) => ({
      id: `fallback-${index + 1}`,
      src: `/uploads/${file}`,
      alt: humanizeFilename(file),
      caption: humanizeFilename(file),
    }));
  } catch {
    return [];
  }
}
