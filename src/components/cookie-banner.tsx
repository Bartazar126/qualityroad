"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "qri_cookie_consent";

type ConsentValue = "granted" | "denied";

function updateGtagConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  const w = window as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      ad_storage:         value,
      ad_user_data:       value,
      ad_personalization: value,
      analytics_storage:  value,
    });
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else if (stored === "granted") {
      updateGtagConsent("granted");
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "granted");
    updateGtagConsent("granted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "denied");
    updateGtagConsent("denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-9999 border-t border-slate-800 bg-slate-950 px-4 py-5 shadow-2xl sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[260px]">
          <p className="text-[10px] font-extrabold tracking-[0.22em] text-orange-400 uppercase mb-1">
            Süti tájékoztató
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Weboldalunk analitikai és hirdetési sütiket használhat a jobb felhasználói élmény és hatékonyabb hirdetések érdekében.
            Bővebben:{" "}
            <Link href="/adatvedelmi-nyilatkozat" className="text-orange-400 underline hover:text-orange-300 transition">
              Adatvédelmi nyilatkozat
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={decline}
            className="border border-slate-700 px-5 py-2.5 text-xs font-bold tracking-widest text-slate-400 uppercase transition hover:border-slate-500 hover:text-white">
            Elutasít
          </button>
          <button type="button" onClick={accept}
            className="bg-orange-500 px-5 py-2.5 text-xs font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600">
            Elfogad
          </button>
        </div>
      </div>
    </div>
  );
}

/** Kis gomb a footer aljára — megnyitja újra a bannert */
export function CookieSettingsButton() {
  const reopen = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };
  return (
    <button type="button" onClick={reopen}
      className="text-[10px] tracking-widest text-slate-600 uppercase transition hover:text-slate-400">
      Cookie beállítások
    </button>
  );
}
