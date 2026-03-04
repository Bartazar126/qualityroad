import Link from "next/link";
import { contactData } from "@/lib/company-data";

export const metadata = {
  title: "Kapcsolat | QUALITY ROAD INTACT KFT",
  description: "Vegye fel velünk a kapcsolatot útépítési ajánlatkéréshez.",
};

export default function KapcsolatPage() {
  return (
    <div>

      {/* ── Hero header ─────────────────────────────────── */}
      <div className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
            Elérhetőség
          </p>
          <h1 className="mt-3 text-5xl font-black text-white sm:text-6xl">
            Kapcsolat
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-400 leading-relaxed">
            Kérdése van, ajánlatot szeretne kérni? Hívjon minket közvetlenül,
            vagy írjon — hamarosan visszajelzünk.
          </p>
        </div>
        <div className="road-stripe" />
      </div>

      {/* ── Main content ────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

          {/* left: contact cards */}
          <div className="space-y-5">
            <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">
              Munkatársaink
            </p>

            {contactData.contacts.map((person) => (
              <div
                key={person.name}
                className="flex items-center gap-5 border border-slate-200 bg-white p-6"
              >
                {/* avatar placeholder */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-slate-900 text-xl font-black text-orange-400">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-extrabold tracking-[0.22em] text-orange-500 uppercase">
                    {person.role}
                  </p>
                  <p className="mt-0.5 text-xl font-black text-slate-900">{person.name}</p>
                  <a
                    href={`tel:${person.phone}`}
                    className="mt-1 block text-lg font-bold text-slate-700 transition hover:text-orange-600"
                  >
                    {person.phoneDisplay}
                  </a>
                </div>
              </div>
            ))}

            {/* phone + email CTA */}
            <div className="bg-orange-500 p-6 space-y-3">
              <p className="text-[10px] font-extrabold tracking-[0.25em] text-white/70 uppercase">
                Hívjon most
              </p>
              {contactData.contacts.map((person) => (
                <div key={person.name}>
                  <p className="text-[10px] font-bold text-white/60">{person.name}</p>
                  <a
                    href={`tel:${person.phone}`}
                    className="block text-2xl font-black text-white transition hover:text-orange-100"
                  >
                    {person.phoneDisplay}
                  </a>
                </div>
              ))}
              <div className="pt-1 border-t border-white/20">
                <p className="text-[10px] font-extrabold tracking-[0.25em] text-white/70 uppercase mb-1">
                  E-mail
                </p>
                <a
                  href={`mailto:${contactData.email}`}
                  className="block text-sm font-bold text-white transition hover:text-orange-100"
                >
                  {contactData.email}
                </a>
              </div>
              <p className="text-sm text-white/80 pt-1">
                Hétköznapokon személyesen is elérhető munkatársaink.
              </p>
            </div>
          </div>

          {/* right: info + CTA */}
          <div className="flex flex-col gap-5">
            <div className="border border-slate-200 bg-white p-6">
              <p className="text-[10px] font-extrabold tracking-[0.25em] text-orange-500 uppercase">
                Cégadatok
              </p>
              <p className="mt-3 text-base font-black text-slate-900">{contactData.companyNameFull}</p>
              <div className="mt-4 divide-y divide-slate-100">
                {[
                  { label: "Rövidített név",  value: contactData.companyName },
                  { label: "Alapítás éve",     value: contactData.foundedYear },
                  { label: "Adószám",          value: contactData.taxNumber },
                  { label: "Főtevékenység",    value: contactData.mainActivity },
                  { label: "Székhely",         value: contactData.address },
                  { label: "E-mail",           value: contactData.email },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-wrap justify-between gap-2 py-2.5 text-sm">
                    <span className="font-semibold text-slate-500">{label}</span>
                    {label === "E-mail" ? (
                      <a href={`mailto:${value}`} className="text-right text-orange-600 hover:text-orange-800 transition">{value}</a>
                    ) : (
                      <span className="text-right text-slate-800">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-6">
              <p className="text-[10px] font-extrabold tracking-[0.25em] text-orange-400 uppercase">
                Ajánlatkérés
              </p>
              <p className="mt-3 text-xl font-black text-white leading-snug">
                Ingyenes helyszíni felmérés és árajánlat
              </p>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Hívjon minket, rövid egyeztetés után felmérjük a helyszínt
                és írásban küldünk tájékoztató árajánlatot.
              </p>
              <Link
                href="/araink"
                className="mt-5 inline-flex items-center gap-2 border border-slate-600 px-5 py-3 text-sm font-bold tracking-widest text-white uppercase transition hover:border-orange-500 hover:text-orange-400"
              >
                Tájékoztató árlista →
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
