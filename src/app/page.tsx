import React from "react";
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
import {
  HardHat, Layers, Wrench, Bike, Zap, Shovel,
  Gauge, Disc, Package, Scissors, Tractor, Truck,
} from "lucide-react";

export const dynamic = "force-dynamic";

const stats = [
  { value: "15+",  label: "év tapasztalat" },
  { value: "50+",  label: "elvégzett projekt" },
  { value: "2018", label: "alapítva" },
  { value: "100%", label: "minőségfókusz" },
];

const serviceDetails = [
  {
    name: "Út- és autópálya építés",
    desc: "Teljes körű kivitelezés tervezéstől az átadásig, ipari és önkormányzati projektekben egyaránt. Alapréteg, kötőréteg, kopóréteg.",
  },
  {
    name: "Aszfaltozás — kézi és gépi",
    desc: "Finisheres gépi bedolgozás 1–8 tonnás hengerrel vagy kézi kivitelezés kisebb felületeken. AC-11 minőségű aszfalt.",
  },
  {
    name: "Útfelújítás és burkolatjavítás",
    desc: "Kátyúzás vágással-kiszedéssel, meglévő burkolat megerősítése, kiegyenlítő réteg. Gyors mozgósítás, minimális forgalomzavar.",
  },
  {
    name: "Kerékpárút építés",
    desc: "Komplett kerékpárút alapozás és aszfalt burkolat, szegélykő beépítéssel. Önkormányzati és EU-s finanszírozású projektek.",
  },
  {
    name: "Közműépítés utáni helyreállítás",
    desc: "Gyors és pontos burkolat visszaállítás közműmunka után. Csatorna, vízvezeték, gáz – esztétikus, tartós végeredmény.",
  },
  {
    name: "Földmunka és szegélyépítés",
    desc: "Tükör kiszedés, alapréteg készítés, szegélybeépítés és zöldfelület kialakítás. Komplex helyszíni feladatok egy kézből.",
  },
];

const serviceIcons = [HardHat, Layers, Wrench, Bike, Zap, Shovel];

const equipment: { name: string; detail: string; Icon: React.ElementType }[] = [
  { name: "Vögele finiszer", detail: "Gépi aszfaltterítő, pontos rétegvastagság", Icon: Gauge },
  { name: "Hamm henger",     detail: "1–8 tonnás tömörítőhenger, ipari minőség",  Icon: Disc },
  { name: "CAT rakodó",      detail: "Anyagmozgatás, előkészítési munkálatok",     Icon: Package },
  { name: "Útmaró gép",      detail: "Meglévő burkolat eltávolítása, mart aszfalt", Icon: Scissors },
  { name: "Bulldózer",       detail: "Tereprendezés, alapréteg előkészítés",       Icon: Tractor },
  { name: "Tehergépjármű",   detail: "Anyagszállítás, saját logisztika",           Icon: Truck },
];

const processSteps = [
  { step: "01", title: "Helyszíni felmérés",         desc: "Díjmentes helyszíni szemle, műszaki állapotfelmérés és szóbeli konzultáció." },
  { step: "02", title: "Írásos árajánlat",            desc: "48 órán belül részletes, tételes árajánlat — meglepetések nélkül." },
  { step: "03", title: "Ütemezett kivitelezés",       desc: "Pontosan egyeztetett ütemterv szerint, gépparkkal és szakemberekkel." },
  { step: "04", title: "Minőségellenőrzés",           desc: "Rétegrend dokumentálás, tömörítési mérések, folyamatos ellenőrzés." },
  { step: "05", title: "Dokumentált átadás",          desc: "Fotódokumentáció, átadás-átvételi protokoll, garancia." },
];

const clientNames = [
  "Wellis Magyarország Zrt",
  "Ózdi Acélművek Zrt",
  "Airvent Zrt",
  "CASA-TECH Kft",
  "Umbroll Kft",
  "Zom Kft",
  "SCHENK és TÁRSA Kft",
  "Berekfürdő Önkormányzat",
];

export default async function Home() {
  const content          = await readSiteContent();
  const fallbackGallery  = await getFallbackGallery();
  const hiddenSet        = new Set(content.hiddenImages ?? []);
  const filteredFallback = fallbackGallery.filter((img) => !hiddenSet.has(img.src));
  const gallery          = content.gallery.length > 0
    ? content.gallery.filter((img) => !hiddenSet.has(img.src))
    : filteredFallback;
  const showcaseImages   = gallery.slice(0, 8);
  const pricePreview     = prices.slice(0, 4);

  return (
    <div>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-slate-950">
        {/* background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 60px)" }} />
        <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(0,0,0,0.98)_0%,rgba(15,23,42,0.9)_60%,rgba(15,23,42,0.7)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:gap-16">

          {/* Left */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-10 bg-orange-400" />
              <p className="text-[11px] font-extrabold tracking-[0.32em] text-orange-400 uppercase">
                Quality Road Intact Kft · Alapítva 2018
              </p>
            </div>

            <h1 className="hero-headline text-white">
              <span className="block">Útépítés.</span>
              <span className="hero-word-stroke">Aszfaltozás.</span>
              <span className="block">Kivitelezés.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              15+ év tapasztalattal, modern gépparkkal és korrekt partneri szemlélettel —
              az ipari, önkormányzati és magán útépítési projektek megbízható kivitelezője
              egész Magyarországon.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/kapcsolat"
                className="bg-orange-500 px-8 py-3.5 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600">
                Ajánlatkérés
              </Link>
              <Link href="/referenciak"
                className="border border-white/35 px-8 py-3.5 text-sm font-semibold tracking-widest text-white uppercase transition hover:bg-white/10">
                Referenciák
              </Link>
            </div>

            {/* contacts inline */}
            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8">
              {contactData.contacts.map((c) => (
                <div key={c.name}>
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{c.role}</p>
                  <a href={`tel:${c.phone}`} className="mt-0.5 block text-lg font-black text-white hover:text-orange-400 transition">
                    {c.phoneDisplay}
                  </a>
                  <p className="text-xs text-slate-500">{c.name}</p>
                </div>
              ))}
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">E-mail</p>
                <a href={`mailto:${contactData.email}`} className="mt-0.5 block text-sm font-semibold text-orange-400 hover:text-orange-300 transition">
                  {contactData.email}
                </a>
              </div>
            </div>
          </div>

          {/* Right — brand seal */}
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-5 lg:shrink-0">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm ring-1 ring-orange-500/20 shadow-[0_0_80px_rgba(249,115,22,0.12)]">
              <div className="absolute inset-0 rounded-full border border-orange-500/15" />
              <div className="absolute inset-4 rounded-full border border-white/5" />
              <div className="relative z-10 flex h-52 w-52 items-center justify-center rounded-full bg-white p-4 shadow-xl">
                <Image src="/logo.png" alt="Quality Road Intact Kft" width={180} height={180} className="h-full w-full object-contain" priority />
              </div>
            </div>
            <p className="text-[9px] font-bold tracking-[0.45em] text-slate-500 uppercase">Alapítva 2018</p>
          </div>
        </div>

        {/* stats strip */}
        <div className="absolute bottom-0 left-0 right-0 z-20 road-stripe opacity-60" style={{bottom:"52px"}} />
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800">
          <div className="mx-auto flex max-w-6xl items-stretch divide-x divide-slate-800">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col items-center justify-center px-2 py-3 text-center sm:px-4 sm:py-4">
                <p className="text-xl font-black text-orange-400 leading-none sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-[8px] font-bold tracking-[0.15em] text-slate-500 uppercase sm:text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ABOUT
      ════════════════════════════════════════════════════ */}
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
            <Link href="/kapcsolat"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-orange-500 pb-0.5 text-sm font-extrabold tracking-widest text-slate-800 uppercase hover:text-orange-600 transition">
              Kérjen ajánlatot →
            </Link>
          </article>

          <aside className="flex flex-col gap-5">
            <div className="border-l-[3px] border-orange-500 bg-slate-50 py-5 pl-5 pr-4">
              <h3 className="text-base font-extrabold tracking-wide text-slate-900 uppercase">Miért minket választanak?</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {strengths.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 p-6 text-white">
              <p className="text-[10px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">Tervezéstől az átadásig</p>
              <div className="mt-4 space-y-3">
                {processSteps.slice(0, 4).map((s, i) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-orange-500 text-[11px] font-black text-white">{i + 1}</span>
                    <p className="text-sm text-slate-300 leading-snug">{s.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-orange-200 bg-orange-50 p-5">
              <p className="text-[10px] font-extrabold tracking-[0.25em] text-orange-600 uppercase">Azonnali kapcsolat</p>
              <div className="mt-3 space-y-3">
                {contactData.contacts.map((person) => (
                  <div key={person.name}>
                    <p className="text-xs font-bold text-slate-500">{person.name} <span className="font-normal">— {person.role}</span></p>
                    <a href={`tel:${person.phone}`} className="text-xl font-black text-slate-900 transition hover:text-orange-600">{person.phoneDisplay}</a>
                  </div>
                ))}
              </div>
              <a href={`mailto:${contactData.email}`} className="mt-3 block text-sm font-semibold text-orange-600 transition hover:text-orange-800">{contactData.email}</a>
            </div>
          </aside>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TRUST BADGES
      ════════════════════════════════════════════════════ */}
      <section className="bg-white py-10">
        <div className="site-section">
          <p className="text-center text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Tanúsítványok &amp; minősítések</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
            <div className="relative h-28 w-52">
              <Image src="/badge-megbizhat.png" alt="Megbízható vállalkozás" fill className="object-contain" />
            </div>
            <div className="relative h-28 w-52">
              <Image src="/badge-dinamikus.png" alt="Dinamikusan fejlődő vállalkozás" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-20">
        <div className="site-section">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">Amit vállalunk</p>
              <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">Komplett kivitelezés</h2>
            </div>
            <Link href="/kapcsolat" className="text-sm font-bold tracking-wide text-slate-500 uppercase hover:text-orange-400 transition">
              Ajánlatot kérek →
            </Link>
          </div>

          <div className="grid gap-px bg-slate-700 border border-slate-700 sm:grid-cols-2 lg:grid-cols-3">
            {serviceDetails.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <div key={service.name}
                  className="group relative overflow-hidden bg-slate-900 p-7 transition hover:bg-slate-800">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 bg-orange-500 transition-transform duration-300 group-hover:scale-y-100" />
                  <span className="pointer-events-none absolute -right-1 -bottom-3 select-none text-[5.5rem] font-black leading-none text-slate-800 transition group-hover:text-slate-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-orange-500/10 text-orange-400">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white">{service.name}</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          EQUIPMENT / GÉPPARKUNK
      ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="site-section">
          <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Saját géppark</p>
          <h2 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">Modern eszközök,<br />profi eredmény</h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-500 leading-relaxed">
            Saját gépparkunk lehetővé teszi a rugalmas, gyors mozgósítást — nincsenek bérlési késések, az időbeosztás a mienk.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((eq) => (
              <div key={eq.name} className="group flex items-start gap-4 border border-slate-200 p-5 transition hover:border-orange-300 hover:bg-orange-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-600 transition group-hover:bg-orange-100 group-hover:text-orange-600">
                  <eq.Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-orange-700 transition">{eq.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{eq.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PROCESS — teljes folyamat
      ════════════════════════════════════════════════════ */}
      <section className="bg-slate-950 py-20">
        <div className="site-section">
          <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">Hogyan dolgozunk</p>
          <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">5 lépés, 0 meglepetés</h2>

          <div className="mt-12 grid gap-0 lg:grid-cols-5">
            {processSteps.map((s, i) => (
              <div key={s.step} className="relative flex flex-col border-b border-slate-800 pb-8 pt-6 lg:border-b-0 lg:border-r lg:px-6 lg:py-0 last:border-0">
                {/* connector line */}
                {i < processSteps.length - 1 && (
                  <div className="absolute hidden lg:block right-0 top-6 h-[2px] w-6 translate-x-full bg-orange-500/40" />
                )}
                <span className="text-4xl font-black text-orange-500/30 leading-none">{s.step}</span>
                <p className="mt-3 font-bold text-white text-sm">{s.title}</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="road-stripe" />

      {/* ════════════════════════════════════════════════════
          CLIENTS
      ════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-16">
        <div className="site-section">
          <p className="text-center text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">Megbízóink</p>
          <h2 className="mt-3 text-center text-3xl font-black text-white">Akik ránk bízták az utat</h2>
          <p className="mt-2 text-center text-sm text-slate-500">Ipari nagyvállalatoktól önkormányzatokig</p>

          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {([
              { src: "/uploads/wellis.png",      name: "Wellis Magyarország Zrt" },
              { src: "/uploads/airvent.png",     name: "Airvent Zrt" },
              { src: "/uploads/umbrolkft.png",   name: "Umbroll Kft" },
              { src: "/uploads/berekfurdo.jpeg", name: "Berekfürdő Önkormányzat" },
            ] as { src: string; name: string }[]).map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-36 items-center justify-center bg-white p-3">
                  <Image src={c.src} alt={c.name} width={120} height={56} className="h-full w-auto object-contain" />
                </div>
                <p className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase text-center max-w-[9rem]">{c.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/referenciak"
              className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase hover:text-orange-400 transition">
              Összes referencia →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          GALLERY
      ════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
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
          {showcaseImages.length > 0 ? (
            <ShowcaseLightbox images={showcaseImages} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-slate-300 py-20 text-center">
              <p className="text-sm font-semibold text-slate-400">Képek hamarosan — töltsd fel az admin felületen</p>
              <Link href="/admin" className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:text-orange-600 transition">Admin panel →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PRICES + CTA
      ════════════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="site-section">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

            <div>
              <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Tájékoztató</p>
              <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">Áraink (+ÁFA)</h2>
              <p className="mt-2 text-sm text-slate-500">Tájékoztató árak — pontos ajánlatot helyszíni felmérés után adunk.</p>

              <div className="mt-6 divide-y divide-slate-200 border border-slate-200">
                {pricePreview.map((price, i) => (
                  <div key={price.name}
                    className="group flex flex-wrap items-start justify-between gap-3 p-4 transition hover:bg-slate-50">
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

              <Link href="/araink"
                className="mt-5 inline-flex items-center gap-2 bg-slate-900 px-6 py-3 text-sm font-bold tracking-widest text-white uppercase transition hover:bg-slate-800">
                Teljes árlista →
              </Link>
            </div>

            {/* CTA panel */}
            <div className="flex flex-col justify-center bg-orange-500 p-8">
              <p className="text-[10px] font-extrabold tracking-[0.3em] text-white/70 uppercase">Kezdjük el</p>
              <p className="mt-3 text-3xl font-black leading-snug text-white">
                Kérjen ingyenes<br />helyszíni felmérést
              </p>
              <p className="mt-3 text-sm text-white/80">
                Rövid egyeztetés után írásban visszajelzünk a várható költségekről. Nincs kötelezettség.
              </p>
              <div className="mt-6 space-y-2">
                {contactData.contacts.map((c) => (
                  <a key={c.name} href={`tel:${c.phone}`} className="block">
                    <span className="text-[10px] font-bold text-white/60">{c.name}</span>
                    <span className="ml-2 text-xl font-black text-white transition hover:text-orange-100">{c.phoneDisplay}</span>
                  </a>
                ))}
              </div>
              <Link href="/kapcsolat"
                className="mt-5 inline-block border-2 border-white/80 px-5 py-3 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-white hover:text-orange-600">
                Írjon nekünk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FINAL CTA STRIP
      ════════════════════════════════════════════════════ */}
      <div className="bg-slate-950 py-14">
        <div className="site-section flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">Ne várjon tovább</p>
            <p className="mt-2 text-3xl font-black text-white">Épitsük meg együtt a következő projektet.</p>
            <p className="mt-2 text-sm text-slate-400">Díjmentes felmérés · Gyors visszajelzés · Garanciális munka</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/kapcsolat"
              className="bg-orange-500 px-8 py-3.5 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600">
              Ajánlatkérés
            </Link>
            <Link href="/referenciak"
              className="border border-slate-600 px-8 py-3.5 text-sm font-semibold tracking-widest text-slate-300 uppercase transition hover:border-slate-400 hover:text-white">
              Referenciák
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
