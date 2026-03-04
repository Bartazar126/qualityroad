import { NextResponse } from "next/server";
import { readSiteContent, writeSiteContent } from "@/lib/site-content";
import { SiteContent } from "@/types/site-content";

export const dynamic = "force-dynamic";

function isValidPayload(payload: unknown): payload is SiteContent {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as SiteContent;
  const hasValidGallery =
    Array.isArray(candidate.gallery) &&
    candidate.gallery.every(
      (item) =>
        typeof item.id === "string" &&
        typeof item.src === "string" &&
        typeof item.alt === "string" &&
        typeof item.caption === "string",
    );

  const hasValidProjects =
    Array.isArray(candidate.projects) &&
    candidate.projects.every(
      (project) =>
        typeof project.id === "string" &&
        typeof project.name === "string" &&
        typeof project.location === "string" &&
        typeof project.summary === "string" &&
        typeof project.logoSrc === "string" &&
        Array.isArray(project.images) &&
        project.images.every(
          (image) =>
            typeof image.id === "string" &&
            typeof image.src === "string" &&
            typeof image.alt === "string" &&
            typeof image.caption === "string",
        ),
    );

  const hasValidAds =
    typeof candidate.googleAds?.headSnippet === "string" &&
    typeof candidate.googleAds?.bodySnippet === "string";

  return hasValidGallery && hasValidProjects && hasValidAds;
}

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const body: unknown = await request.json();

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Érvénytelen adatszerkezet." }, { status: 400 });
  }

  await writeSiteContent(body);
  return NextResponse.json({ ok: true });
}
