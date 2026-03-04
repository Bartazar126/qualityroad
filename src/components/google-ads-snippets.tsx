import { readSiteContent } from "@/lib/site-content";

export async function GoogleAdsHeadSnippet() {
  const content = await readSiteContent();

  if (!content.googleAds.headSnippet.trim()) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: content.googleAds.headSnippet,
      }}
    />
  );
}

export async function GoogleAdsBodySnippet() {
  const content = await readSiteContent();

  if (!content.googleAds.bodySnippet.trim()) {
    return null;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content.googleAds.bodySnippet,
      }}
    />
  );
}
