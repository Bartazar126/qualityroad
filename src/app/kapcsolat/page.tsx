import Link from "next/link";
import { contactData } from "@/lib/company-data";
import { ContactForm } from "@/components/contact-form";

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
            vagy töltse ki az alábbi űrlapot — hamarosan visszajelzünk.
          </p>
        </div>
        <div className="road-stripe" />
      </div>

      {/* ── Contact form + info ────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">

          {/* left: form */}
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Írjon nekünk</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Ajánlatkérés / Kérdés</h2>
            <p className="mt-2 mb-7 text-sm text-slate-500 leading-relaxed">
              Töltse ki az alábbi űrlapot, és munkatársaink hamarosan felveszik Önnel a kapcsolatot.
              Az üzenet közvetlenül a postaládánkba érkezik.
            </p>
            <ContactForm />
          </div>

          {/* right: contacts + company */}
          <div className="flex flex-col gap-5">

            {/* contact persons */}
            <div className="space-y-3">
              <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">
                Munkatársaink
              </p>
              {contactData.contacts.map((person) => (
                <div key={person.name} className="flex items-center gap-5 border border-slate-200 bg-white p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-900 text-lg font-black text-orange-400">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold tracking-[0.22em] text-orange-500 uppercase">{person.role}</p>
                    <p className="mt-0.5 text-base font-black text-slate-900">{person.name}</p>
                    <a href={`tel:${person.phone}`} className="mt-0.5 block text-sm font-bold text-slate-700 transition hover:text-orange-600">
                      {person.phoneDisplay}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* quick contact strip */}
            <div className="bg-orange-500 p-5 space-y-3">
              <p className="text-[10px] font-extrabold tracking-[0.25em] text-white/70 uppercase">Gyors elérés</p>
              {contactData.contacts.map((person) => (
                <div key={person.name}>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{person.name}</p>
                  <a href={`tel:${person.phone}`} className="block text-xl font-black text-white transition hover:text-orange-100">
                    {person.phoneDisplay}
                  </a>
                </div>
              ))}
              <div className="pt-1 border-t border-white/20">
                <p className="text-[10px] font-extrabold tracking-[0.25em] text-white/70 uppercase mb-1">E-mail</p>
                <a href={`mailto:${contactData.email}`} className="block text-sm font-bold text-white transition hover:text-orange-100">
                  {contactData.email}
                </a>
              </div>
            </div>

            {/* company data */}
            <div className="border border-slate-200 bg-white p-5">
              <p className="text-[10px] font-extrabold tracking-[0.25em] text-orange-500 uppercase">Cégadatok</p>
              <p className="mt-2 text-sm font-black text-slate-900">{contactData.companyNameFull}</p>
              <div className="mt-3 divide-y divide-slate-100">
                {[
                  { label: "Adószám",       value: contactData.taxNumber },
                  { label: "Főtevékenység", value: contactData.mainActivity },
                  { label: "Székhely",      value: contactData.address },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5 py-2 text-xs sm:flex-row sm:justify-between sm:gap-2">
                    <span className="font-semibold text-slate-400">{label}</span>
                    <span className="text-slate-700 sm:text-right">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/araink"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-widest text-orange-500 uppercase hover:text-orange-700 transition"
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
