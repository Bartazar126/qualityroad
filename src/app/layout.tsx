import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleAdsBodySnippet, GoogleAdsHeadSnippet } from "@/components/google-ads-snippets";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
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
    locale: "hu_HU",
    type: "website",
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
        <GoogleAdsHeadSnippet />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SiteHeader />
        {/* Spacer compensates for the fixed header (~52 px) */}
        <div className="h-[52px]" aria-hidden="true" />
        <main>{children}</main>
        <SiteFooter />
        <GoogleAdsBodySnippet />
      </body>
    </html>
  );
}
