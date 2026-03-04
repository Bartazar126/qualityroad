import Image from "next/image";
import Link from "next/link";
import { readSiteContent } from "@/lib/site-content";
import { getFallbackGallery } from "@/lib/fallback-gallery";
import {
  contactData,
  introParagraphs,
  prices,
  referenceList,
  strengths,
} from "@/lib/company-data";
import { ShowcaseLightbox } from "@/components/home/showcase-lightbox";

export const dynamic = "force-dynamic";

const stats = [
  { value: "15+",  label: "év szakmai tapasztalat" },
  { value: "2017", label: "alapítva" },
  { value: "100%", label: "minőségfókusz" },
];

const landingBadges = [
  { src: "/uploads/badge-dinamikus.png", alt: "Dinamikus kivitelezés", label: "Dinamikus kivitelezés" },
  { src: "/uploads/badge-megbizhat.png", alt: "Megbízható partner",    label: "Megbízható partner" },
];

const serviceDetails = [
  { name: "Út- és autópálya építés",                  desc: "Teljes körű kivitelezés tervezéstől az átadásig, ipari és önkormányzati projektekben egyaránt." },
  { name: "Aszfaltozás – kézi és gépi technológiával", desc: "Finisheres gépi bedolgozás 1–8 tonnás hengerrel, vagy kézi kivitelezés kisebb felületeken." },
  { name: "Útfelújítás és burkolatjavítás",            desc: "Kátyúzás vágással-kiszedéssel, meglévő burkolat megerősítése, kiegyenlítő réteg készítés." },
  { name: "Kerékpárút építés",                         desc: "Komplett kerékpárút alapozás és aszfalt burkolat, szegélykő beépítéssel." },
  { name: "Közműépítés utáni út-helyreállítás",        desc: "Gyors és pontos burkolat visszaállítás közműmunka után, esztétikus végeredménnyel." },
  { name: "Földmunka, szegélyépítés, parkosítás",      desc: "Tükör kiszedés, alapréteg készítés, szegélybeépítés és zöldfelület kialakítás." },
];

const processSteps = [
  "Helyszíni felmérés és műszaki javaslat",
  "Ütemezett kivitelezés gépparkkal",
  "Rétegrend, tömörítés, minőségellenőrzés",
  "Dokumentált átadás",
];

export default async function Home() {
  const content         = await readSiteContent();
  const fallbackGallery = await getFallbackGallery();
  const gallery         = content.gallery.length > 0 ? content.gallery : fallbackGallery;
  const heroBg          = gallery[4]?.src ?? gallery[0]?.src ?? "/uploads/hamm-henger.png";
  const showcaseImages  = gallery.filter((_, i) => i !== 4).slice(0, 6);
  const pricePreview    = prices.slice(0, 4);
  const projectReferences =
    content.projects.length > 0
      ? content.projects.slice(0, 4)
      : referenceList.slice(0, 4).map((ref, i) => {
          const [name, ...rest] = ref.split(" - ");
          return { id: `fb-${i}`, name, location: "", summary: rest.join(" - "), logoSrc: "", images: [] };
        });

  return (
    <div>

      {/* ═══════════════════════════════════════════════
          1.  HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* priority + sizes="100vw" → browser fetches correct hero image size for LCP */}
        <Image
          src={heroBg}
          alt="Útépítési munkálatok"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.7)_55%,rgba(0,0,0,0.2)_100%)]" />

        <div className="relative z-10 flex min-h-screen flex-col justify-center px-4 pb-20 pt-24 sm:pb-28 sm:pt-28 sm:px-8 lg:px-14">
          {/* Overline — no opacity animation on above-fold content (LCP) */}
          <p className="flex items-center gap-3 text-[11px] font-extrabold tracking-[0.32em] text-orange-400 uppercase">
            <span className="block h-px w-10 bg-orange-400" aria-hidden="true" />
            Quality Road Intact Kft
          </p>

          {/* h1 — visible immediately, no fade-up (LCP optimisation) */}
          <h1 className="hero-headline mt-5 text-white">
            <span className="block">Útépítés.</span>
            <span className="hero-word-stroke">Aszfaltozás.</span>
            <span className="block">Kivitelezés.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            15+ év tapasztalattal, modern gépparkkal és korrekt partneri szemlélettel —
            az ipari, önkormányzati és magán útépítési projektek megbízható kivitelezője.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/kapcsolat"
              className="bg-orange-500 px-8 py-3.5 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600"
            >
              Ajánlatkérés
            </Link>
            <Link
              href="/referenciak"
              className="border border-white/35 px-8 py-3.5 text-sm font-semibold tracking-widest text-white uppercase transition hover:bg-white/10"
            >
              Referenciák
            </Link>
          </div>
        </div>

        {/* road-stripe line above stats */}
        <div className="absolute bottom-[52px] left-0 right-0 z-20 road-stripe opacity-60 sm:bottom-[60px]" />

        {/* ── stats strip ── compact on mobile */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800">
          <div className="mx-auto flex max-w-6xl items-stretch divide-x divide-slate-800">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col items-center justify-center px-2 py-2.5 text-center sm:px-4 sm:py-4">
                <p className="text-lg font-black text-orange-400 leading-none sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-[8px] font-bold tracking-[0.15em] text-slate-500 uppercase sm:text-[10px] sm:tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
            <a
              href={`tel:${contactData.phone}`}
              className="group flex flex-1 flex-col items-center justify-center px-2 py-2.5 text-center transition hover:bg-orange-500/10 sm:px-4 sm:py-4"
            >
              <p className="hidden text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase group-hover:text-orange-400 transition sm:block">
                Hívjon most
              </p>
              <p className="text-xs font-black text-white sm:text-lg">{contactData.phoneDisplay}</p>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2.  ABOUT
      ═══════════════════════════════════════════════ */}
      <section className="site-section py-20">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">

          <article>
            <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Bemutatkozás</p>
            <h2 className="mt-3 text-5xl font-black leading-[1.02] text-slate-900 sm:text-6xl">
              Megbízható útépítési<br />partner közel<br />
              <span className="text-orange-500">15 éve.</span>
            </h2>
            <div className="mt-7 space-y-4 text-slate-600 leading-relaxed max-w-2xl">
              {introParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link
              href="/kapcsolat"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-orange-500 pb-0.5 text-sm font-extrabold tracking-widest text-slate-800 uppercase hover:text-orange-600 transition"
            >
              Kérjen ajánlatot →
            </Link>
          </article>

          <aside className="flex flex-col gap-5">
            {/* why us */}
            <div className="border-l-[3px] border-orange-500 bg-slate-50 py-5 pl-5 pr-4">
              <h3 className="text-base font-extrabold tracking-wide text-slate-900 uppercase">
                Miért minket választják?
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {strengths.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* process */}
            <div className="bg-slate-900 p-6 text-white">
              <p className="text-[10px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">
                Tervezéstől az átadásig
              </p>
              <div className="mt-4 space-y-3">
                {processSteps.map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-orange-500 text-[11px] font-black text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* quick contact */}
            <div className="border border-orange-200 bg-orange-50 p-5">
              <p className="text-[10px] font-extrabold tracking-[0.25em] text-orange-600 uppercase">Azonnali kapcsolat</p>
              <a
                href={`tel:${contactData.phone}`}
                className="mt-2 block text-3xl font-black text-slate-900 transition hover:text-orange-600"
              >
                {contactData.phoneDisplay}
              </a>
              <div className="mt-2 space-y-0.5">
                {contactData.contacts.map((person) => (
                  <p key={person.name} className="text-sm text-slate-600">
                    {person.name} <span className="text-slate-400">— {person.role}</span>
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3.  BADGES  — full-width dark showcase
      ═══════════════════════════════════════════════ */}
      <section className="bg-slate-950 py-16">
        <div className="site-section">
          <p className="text-center text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">
            Elismerések
          </p>
          <h2 className="mt-3 text-center text-3xl font-black text-white">
            Bizalmi jelvényeink
          </h2>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-16">
            {landingBadges.map((badge) => (
              <div key={badge.src} className="flex flex-col items-center gap-5">
                <div className="badge-glow animate-badge-pop relative h-44 w-44 sm:h-56 sm:w-56">
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    fill
                    sizes="(max-width: 640px) 176px, 224px"
                    className="object-contain drop-shadow-[0_0_32px_rgba(249,115,22,0.45)]"
                  />
                </div>
                <p className="text-sm font-extrabold tracking-[0.15em] text-slate-300 uppercase">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* animated divider */}
      <div className="road-stripe" />

      {/* ═══════════════════════════════════════════════
          4.  SERVICES  — 2-col grid, creative hover
      ═══════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-16">
        <div className="site-section">
          <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">
            Amit vállalunk
          </p>
          <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">Komplett kivitelezés</h2>

          <div className="mt-10 grid gap-px bg-slate-700 border border-slate-700 sm:grid-cols-2">
            {serviceDetails.map((service, index) => (
              <div
                key={service.name}
                className="group relative overflow-hidden bg-slate-900 p-7 transition hover:bg-slate-800"
              >
                {/* large background number */}
                <span className="pointer-events-none absolute -right-1 -bottom-3 select-none text-[6rem] font-black leading-none text-slate-800 transition group-hover:text-slate-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* orange left border */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 bg-orange-500 transition-transform duration-300 group-hover:scale-y-100" />

                <div className="relative">
                  <span className="text-[10px] font-extrabold tracking-[0.3em] text-orange-500 uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">{service.name}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* animated divider */}
      <div className="road-stripe" />

      {/* ═══════════════════════════════════════════════
          5.  GALLERY
      ═══════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="site-section">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Képgaléria</p>
              <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">Munkáink képekben</h2>
              <p className="mt-2 text-sm text-slate-500">Kattints bármelyik képre a nagyobb nézethez.</p>
            </div>
            <Link href="/referenciak" className="text-sm font-bold tracking-wide text-slate-700 uppercase hover:text-orange-600 transition">
              Összes referencia →
            </Link>
          </div>
          <ShowcaseLightbox images={showcaseImages} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6.  REFERENCES
      ═══════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16">
        <div className="site-section">
          <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Megbízóink</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">Kiemelt referenciák</h2>

          <div className="mt-8 divide-y divide-slate-200 border border-slate-200 bg-white">
            {projectReferences.map((project, index) => (
              <article
                key={project.id}
                className="group grid gap-4 p-5 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="text-[10px] font-extrabold tracking-[0.25em] text-orange-500 uppercase">
                    Projekt {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{project.name}</h3>
                  {project.location ? <p className="text-sm text-slate-500">{project.location}</p> : null}
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">{project.summary}</p>
                </div>
                {project.logoSrc ? (
                  <div className="relative h-14 w-24 shrink-0 self-start border border-slate-200 bg-white">
                    <Image src={project.logoSrc} alt={`${project.name} logó`} fill sizes="96px" className="object-contain p-2" />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* animated divider */}
      <div className="road-stripe" />

      {/* ═══════════════════════════════════════════════
          7.  PRICES  +  CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="site-section">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

            {/* price list */}
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Tájékoztató</p>
              <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">Áraink (+ÁFA)</h2>
              <p className="mt-2 text-sm text-slate-500">
                Tájékoztató árak — pontos ajánlatot helyszíni felmérés után adunk.
              </p>

              <div className="mt-6 divide-y divide-slate-200 border border-slate-200">
                {pricePreview.map((price, i) => (
                  <div key={price.name} className="group flex flex-wrap items-start justify-between gap-3 p-4 transition hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-2xl font-black leading-none text-slate-100 select-none transition group-hover:text-orange-100">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">{price.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{price.details}</p>
                      </div>
                    </div>
                    <p className="font-black text-orange-600">{price.value}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/araink"
                className="mt-5 inline-flex items-center gap-2 bg-slate-900 px-6 py-3 text-sm font-bold tracking-widest text-white uppercase transition hover:bg-slate-800"
              >
                Teljes árlista →
              </Link>
            </div>

            {/* orange CTA panel */}
            <div className="flex flex-col justify-center bg-orange-500 p-8">
              <p className="text-[10px] font-extrabold tracking-[0.3em] text-white/70 uppercase">Kezdjük el</p>
              <p className="mt-3 text-3xl font-black leading-snug text-white">
                Kérjen ingyenes<br />helyszíni felmérést
              </p>
              <p className="mt-3 text-sm text-white/80">
                Rövid egyeztetés után írásban visszajelzünk a várható költségekről.
              </p>
              <a
                href={`tel:${contactData.phone}`}
                className="mt-6 block text-3xl font-black text-white transition hover:text-orange-100"
              >
                {contactData.phoneDisplay}
              </a>
              <Link
                href="/kapcsolat"
                className="mt-5 inline-block border-2 border-white/80 px-5 py-3 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-white hover:text-orange-600"
              >
                Írjon nekünk
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
