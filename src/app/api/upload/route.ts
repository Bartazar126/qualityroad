import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/* ── Cloudinary upload (production) ──────────────────────────────────── */

async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder: string,
): Promise<string> {
  const { v2: cloudinary } = await import("cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder:          folder ? `qualityroad/${folder}` : "qualityroad",
    use_filename:    false,
    unique_filename: true,
    overwrite:       false,
    quality:         "auto",
    fetch_format:    "auto",
  });

  return result.secure_url.replace("/upload/", "/upload/q_auto,f_auto,w_1920/");
}

/* ── Filesystem upload (development) ─────────────────────────────────── */

async function uploadToFilesystem(
  buffer: Buffer,
  folder: string,
  extension: string,
): Promise<string> {
  const { promises: fs } = await import("node:fs");
  const path = await import("node:path");

  const filename    = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadsBase = path.join(process.cwd(), "public", "uploads");
  const targetDir   = folder ? path.join(uploadsBase, folder) : uploadsBase;

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, filename), buffer);

  return folder
    ? `/uploads/${encodeURIComponent(folder)}/${filename}`
    : `/uploads/${filename}`;
}

/* ── Route handler ────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  try {
    const url    = new URL(request.url);
    const folder = url.searchParams.get("folder") ?? "";

    const formData = await request.formData();
    const file     = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Nincs fájl csatolva." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Csak JPG, PNG, WEBP vagy GIF képet tölts fel." },
        { status: 400 },
      );
    }

    const bytes     = await file.arrayBuffer();
    const buffer    = Buffer.from(bytes);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const useCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY    &&
      process.env.CLOUDINARY_API_SECRET;

    if (!useCloudinary && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Cloudinary nincs konfigurálva! Add hozzá a CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env változókat Vercelen." },
        { status: 500 },
      );
    }

    const src = useCloudinary
      ? await uploadToCloudinary(buffer, file.type, folder)
      : await uploadToFilesystem(buffer, folder, extension);

    return NextResponse.json({ src });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    const message = err instanceof Error ? err.message : "Ismeretlen hiba";
    return NextResponse.json({ error: `Feltöltési hiba: ${message}` }, { status: 500 });
  }
}
