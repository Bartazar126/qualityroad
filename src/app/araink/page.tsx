import Link from "next/link";
import { prices } from "@/lib/company-data";

export const metadata = {
  title: "Áraink | QUALITY ROAD INTACT KFT",
  description: "Tájékoztató árlista útépítési és aszfaltozási munkákhoz.",
};

export default function ArainkPage() {
  return (
    <div>
      {/* ── Hero header ───────────────────────────────────── */}
      <div className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
            Tájékoztató
          </p>
          <h1 className="mt-3 text-5xl font-black text-white sm:text-6xl">
            Áraink&nbsp;
            <span className="text-orange-400">(+ÁFA)</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-400 leading-relaxed">
            Az alábbi árak tájékoztató jellegűek. Pontos, személyre szabott ajánlatot
            helyszíni felmérés és egyeztetés után adunk — díjmentesen.
          </p>
        </div>
        <div className="road-stripe" />
      </div>

      {/* ── Price list ──────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="border border-slate-200 divide-y divide-slate-200">
          {prices.map((price, i) => (
            <div
              key={price.name}
              className="group grid gap-5 p-6 transition hover:bg-slate-50 sm:grid-cols-[3rem_1fr_auto] sm:items-start"
            >
              {/* big number */}
              <span
                className="text-5xl font-black leading-none text-slate-100 group-hover:text-orange-100 transition select-none hidden sm:block"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* name + details */}
              <div>
                <h2 className="text-lg font-bold text-slate-900">{price.name}</h2>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{price.details}</p>
              </div>

              {/* price */}
              <div className="shrink-0 pt-0.5">
                <p className="text-xl font-black text-orange-600 sm:text-right">{price.value}</p>
                <p className="mt-0.5 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase sm:text-right">
                  +ÁFA
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA banner ─────────────────────────────────── */}
        <div className="mt-8 grid gap-0 sm:grid-cols-[1fr_auto] bg-slate-900 overflow-hidden">
          <div className="p-8">
            <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
              Ingyenes helyszíni felmérés
            </p>
            <p className="mt-3 text-2xl font-black text-white leading-snug">
              Kérjen személyre szabott ajánlatot —<br className="hidden sm:block" /> hamarosan visszajelzünk!
            </p>
          </div>
          <Link
            href="/kapcsolat"
            className="flex min-h-[56px] items-center justify-center bg-orange-500 px-8 text-sm font-extrabold tracking-[0.2em] text-white uppercase hover:bg-orange-600 transition whitespace-nowrap"
          >
            Ajánlatkérés →
          </Link>
        </div>

      </div>
    </div>
  );
}
