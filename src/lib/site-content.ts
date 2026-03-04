import { promises as fs } from "node:fs";
import path from "node:path";
import { SiteContent } from "@/types/site-content";

const contentFilePath = path.join(process.cwd(), "data", "site-content.json");

const defaultContent: SiteContent = {
  gallery: [],
  projects: [],
  googleAds: {
    headSnippet: "",
    bodySnippet: "",
  },
};

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const file = await fs.readFile(contentFilePath, "utf8");
    const parsed = JSON.parse(file) as Partial<SiteContent>;

    return {
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      googleAds: {
        headSnippet: parsed.googleAds?.headSnippet ?? "",
        bodySnippet: parsed.googleAds?.bodySnippet ?? "",
      },
    };
  } catch {
    return defaultContent;
  }
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
  await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf8");
}
