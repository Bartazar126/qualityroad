import { NextResponse } from "next/server";
import { readSiteContent, writeSiteContent } from "@/lib/site-content";
import { SiteContent } from "@/types/site-content";

export const dynamic = "force-dynamic";

function isValidPayload(payload: unknown): payload is SiteContent {
  if (!payload || typeof payload !== "object") return false;
  const c = payload as Record<string, unknown>;
  return Array.isArray(c.gallery) && Array.isArray(c.projects);
}

export async function GET() {
  try {
    const content = await readSiteContent();
    return NextResponse.json(content);
  } catch (err) {
    console.error("[GET /api/site-content]", err);
    return NextResponse.json({ error: "Olvasási hiba." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: "Érvénytelen adatszerkezet." }, { status: 400 });
    }

    // Ensure all optional fields exist with defaults before saving
    const safe: SiteContent = {
      gallery:        Array.isArray(body.gallery)        ? body.gallery        : [],
      projects:       Array.isArray(body.projects)       ? body.projects       : [],
      hiddenImages:   Array.isArray(body.hiddenImages)   ? body.hiddenImages   : [],
      hiddenProjects: Array.isArray(body.hiddenProjects) ? body.hiddenProjects : [],
      googleAds: {
        headSnippet: typeof body.googleAds?.headSnippet === "string" ? body.googleAds.headSnippet : "",
        bodySnippet: typeof body.googleAds?.bodySnippet === "string" ? body.googleAds.bodySnippet : "",
      },
    };

    await writeSiteContent(safe);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[PUT /api/site-content]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
