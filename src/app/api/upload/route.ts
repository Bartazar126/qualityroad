import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "";

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nincs fájl csatolva." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Csak JPG, PNG, WEBP vagy GIF képet tölts fel." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;

  const uploadsBase = path.join(process.cwd(), "public", "uploads");
  const targetDir = folder
    ? path.join(uploadsBase, folder)
    : uploadsBase;

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, filename), buffer);

  const src = folder
    ? `/uploads/${encodeURIComponent(folder)}/${filename}`
    : `/uploads/${filename}`;

  return NextResponse.json({ src });
}
