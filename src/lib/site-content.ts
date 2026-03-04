import { SiteContent } from "@/types/site-content";

const REDIS_KEY = "site-content";

const defaultContent: SiteContent = {
  gallery: [],
  projects: [],
  googleAds: { headSnippet: "", bodySnippet: "" },
  hiddenImages: [],
  hiddenProjects: [],
};

function mergeWithDefaults(parsed: Partial<SiteContent>): SiteContent {
  return {
    gallery:        Array.isArray(parsed.gallery)        ? parsed.gallery        : [],
    projects:       Array.isArray(parsed.projects)       ? parsed.projects       : [],
    hiddenImages:   Array.isArray(parsed.hiddenImages)   ? parsed.hiddenImages   : [],
    hiddenProjects: Array.isArray(parsed.hiddenProjects) ? parsed.hiddenProjects : [],
    googleAds: {
      headSnippet: parsed.googleAds?.headSnippet ?? "",
      bodySnippet: parsed.googleAds?.bodySnippet ?? "",
    },
  };
}

/* ── Upstash Redis (production on Vercel) ─────────────────────────────── */

async function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url, token });
}

/* ── Local filesystem (development) ──────────────────────────────────── */

async function readFromFile(): Promise<SiteContent> {
  try {
    const { promises: fs } = await import("node:fs");
    const path = await import("node:path");
    const filePath = path.join(process.cwd(), "data", "site-content.json");
    const file = await fs.readFile(filePath, "utf8");
    return mergeWithDefaults(JSON.parse(file) as Partial<SiteContent>);
  } catch {
    return defaultContent;
  }
}

async function writeToFile(content: SiteContent): Promise<void> {
  const { promises: fs } = await import("node:fs");
  const path = await import("node:path");
  const filePath = path.join(process.cwd(), "data", "site-content.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf8");
}

/* ── Public API ───────────────────────────────────────────────────────── */

export async function readSiteContent(): Promise<SiteContent> {
  const redis = await getRedis();
  if (redis) {
    try {
      const data = await redis.get<SiteContent>(REDIS_KEY);
      return data ? mergeWithDefaults(data) : defaultContent;
    } catch {
      return defaultContent;
    }
  }
  return readFromFile();
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, content);
    return;
  }
  await writeToFile(content);
}
