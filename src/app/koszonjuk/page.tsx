"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function KoszonjukPage() {
  useEffect(() => {
    // Google Ads conversion event — csak akkor fut ha a gtag be van állítva
    if (typeof window !== "undefined" && typeof (window as { gtag?: Function }).gtag === "function") {
      (window as { gtag: Function }).gtag("event", "conversion", {
        event_category: "contact",
        event_label: "ajanlatkeresform",
      });
    }
  }, []);

  return (
    <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* Checkmark */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center bg-orange-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="h-10 w-10 text-white">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Text */}
        <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">
          Üzenet elküldve
        </p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
          Köszönjük megkeresését!
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm text-slate-400 leading-relaxed">
          Üzenetét megkaptuk és hamarosan felvesszük Önnel a kapcsolatot.
          Általában <strong className="text-white">1 munkanapon belül</strong> visszajelzünk.
        </p>

        {/* Divider */}
        <div className="mx-auto my-8 h-px w-24 bg-slate-800" />

        {/* Quick contact fallback */}
        <p className="text-xs text-slate-500 mb-4">
          Sürgős esetben hívjon minket közvetlenül:
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <a href="tel:+36704340766"
            className="border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-orange-500 hover:text-orange-400">
            06/70-434-07-66
          </a>
          <a href="tel:+36306906086"
            className="border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-orange-500 hover:text-orange-400">
            06/30-690-60-86
          </a>
        </div>

        {/* CTA */}
        <Link href="/"
          className="inline-flex items-center gap-2 bg-orange-500 px-8 py-3.5 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600">
          ← Vissza a főoldalra
        </Link>

      </div>
    </div>
  );
}
