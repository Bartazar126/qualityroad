export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export type ProjectReference = {
  id: string;
  name: string;
  location: string;
  summary: string;
  logoSrc: string;
  images: GalleryItem[];
};

export type GoogleAdsConfig = {
  headSnippet: string;
  bodySnippet: string;
};

export type SiteContent = {
  gallery: GalleryItem[];
  projects: ProjectReference[];
  googleAds: GoogleAdsConfig;
};
