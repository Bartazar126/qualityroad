import path from "node:path";
import fs from "node:fs";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export type FolderImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

/**
 * Reads all image files from public/uploads/<folderName>/ at request time
 * (server-side only). Returns an empty array if the folder doesn't exist.
 */
export function getProjectFolderImages(folderName: string): FolderImage[] {
  try {
    const folderPath = path.join(process.cwd(), "public", "uploads", folderName);

    if (!fs.existsSync(folderPath)) return [];

    return fs
      .readdirSync(folderPath)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file, i) => {
        const nameWithoutExt = file.replace(/\.[^.]+$/, "");
        return {
          id: `${folderName}-${i}`,
          src: `/uploads/${encodeURIComponent(folderName)}/${encodeURIComponent(file)}`,
          alt: nameWithoutExt,
          caption: nameWithoutExt.replace(/[-_]/g, " "),
        };
      });
  } catch {
    return [];
  }
}
