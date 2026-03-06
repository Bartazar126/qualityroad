import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleAdsBodySnippet, GoogleAdsHeadSnippet } from "@/components/google-ads-snippets";
import { CookieBanner } from "@/components/cookie-banner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://qualityroadkft.hu"
  ),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
  title: {
    template: "%s | Quality Road Intact Kft",
    default: "Quality Road Intact Kft – Útépítés, aszfaltozás, útfelújítás",
  },
  description:
    "Prémium útépítés, aszfaltozás és útfelújítás közel 15 év szakmai tapasztalattal. Ingyenes helyszíni felmérés. Tel.: 06/70-434-07-66",
  keywords: [
    "útépítés",
    "aszfaltozás",
    "útfelújítás",
    "kátyúzás",
    "telephely aszfaltozás",
    "kerékpárút építés",
    "Quality Road Intact",
  ],
  openGraph: {
    title: "Quality Road Intact Kft – Útépítés, aszfaltozás",
    description:
      "Prémium útépítés, aszfaltozás és útfelújítás közel 15 év szakmai tapasztalattal. Hívjon: 06/70-434-07-66",
    url: "/",
    siteName: "Quality Road Intact Kft",
    locale: "hu_HU",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quality Road Intact Kft – Útépítés, aszfaltozás",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <head>
        {/* Google Consent Mode v2 — default: minden tiltva, amíg a user el nem fogad */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
        `}} />
        <GoogleAdsHeadSnippet />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SiteHeader />
        {/* Spacer compensates for the fixed header (~72 px: 56px logo + 16px padding) */}
        <div className="h-[72px]" aria-hidden="true" />
        <main>{children}</main>
        <SiteFooter />
        <GoogleAdsBodySnippet />
        <CookieBanner />
      </body>
    </html>
  );
}
