import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { readSiteContent } from "@/lib/site-content";
import { contactData, referenceList, folderProjects } from "@/lib/company-data";
import { getProjectFolderImages } from "@/lib/project-gallery";
import { ShowcaseLightbox } from "@/components/home/showcase-lightbox";
import type { GalleryItem } from "@/types/site-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Referenciák | QUALITY ROAD INTACT KFT",
  description: "Kivitelezett útépítési, aszfaltozási és burkolat-felújítási referenciáink.",
};

const refStats = [
  { value: "50+",    label: "elvégzett projekt" },
  { value: "15+",    label: "év tapasztalat" },
  { value: "30 000+", label: "m² aszfalt" },
  { value: "100%",   label: "garanciális munka" },
];

export default async function ReferenciakPage() {
  const content = await readSiteContent();

  const hiddenSet        = new Set(content.hiddenImages ?? []);
  const hiddenProjectSet = new Set(content.hiddenProjects ?? []);

  /* ── Folder-based projects ── */
  const resolvedFolderProjects = folderProjects
    .filter((p) => !hiddenProjectSet.has(p.id))
    .map((p) => ({
      ...p,
      images: getProjectFolderImages(p.folder).filter((img) => !hiddenSet.has(img.src)),
    }));

  const adminProjects = content.projects;
  const adminNames    = new Set(adminProjects.map((p) => p.name));
  const filteredFolderProjects = resolvedFolderProjects.filter((p) => !adminNames.has(p.name));

  type UnifiedProject = {
    id: string; name: string; year?: string;
    summary: string; logoSrc: string;
    tags?: readonly string[] | string[];
    images: GalleryItem[];
  };

  const allProjects: UnifiedProject[] = [
    ...filteredFolderProjects.map((p) => ({
      id: p.id, name: p.name, year: p.year, summary: p.summary,
      logoSrc: p.logoSrc, tags: p.tags, images: p.images,
    })),
    ...adminProjects.map((p) => ({
      id: p.id, name: p.name, year: undefined, summary: p.summary,
      logoSrc: p.logoSrc, tags: (p.tags ?? []).length ? p.tags : undefined,
      images: p.images.filter((img) => !hiddenSet.has(img.src)),
    })),
  ];

  return (
    <div>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <div className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">Quality Road Intact Kft</p>
          <h1 className="mt-3 text-5xl font-black text-white sm:text-6xl">Referenciáink</h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-400 leading-relaxed">
            Büszkék vagyunk elvégzett munkáinkra. Megbízóink között magánvállalkozások,
            ipari nagyvállalatok és önkormányzatok egyaránt megtalálhatók.
          </p>

          {/* stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {refStats.map((s) => (
              <div key={s.label} className="border border-slate-800 p-4 text-center">
                <p className="text-3xl font-black text-orange-400">{s.value}</p>
                <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          {/* anchor nav */}
          {allProjects.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {allProjects.map((p) => (
                <a key={p.id} href={`#${p.id}`}
                  className="flex min-h-[44px] items-center border border-slate-700 px-4 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase transition hover:border-orange-500 hover:text-orange-400">
                  {p.name}
                </a>
              ))}
              <a href="#lista"
                className="flex min-h-[44px] items-center border border-slate-700 px-4 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase transition hover:border-orange-500 hover:text-orange-400">
                Teljes lista
              </a>
            </div>
          )}
        </div>
        <div className="road-stripe" />
      </div>

      {/* ════════════════════════════════════════════
          PROJECT SECTIONS
      ════════════════════════════════════════════ */}
      {allProjects.map((project, index) => (
        <section key={project.id} id={project.id} className="border-b border-slate-100 bg-white last:border-0">

          {/* project header */}
          <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-8">

              {/* left: number + meta */}
              <div className="flex items-start gap-5 min-w-0">
                <span className="hidden shrink-0 text-[5rem] font-black leading-none text-slate-100 select-none sm:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Projekt referencia</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{project.name}</h2>
                  {project.year && (
                    <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">{project.year}</p>
                  )}
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-2xl">{project.summary}</p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-slate-600 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* right: logo */}
              {project.logoSrc && (
                <div className="shrink-0 border border-slate-100 bg-white shadow-md p-6 flex items-center justify-center min-w-0 w-full sm:w-auto sm:min-w-[200px] sm:min-h-[110px]">
                  <div className="relative h-20 w-full max-w-[208px]">
                    <Image
                      src={project.logoSrc}
                      alt={`${project.name} logó`}
                      fill
                      sizes="208px"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* photos */}
          <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
            {project.images.length > 0 ? (
              <ShowcaseLightbox images={project.images} hideCaptions />
            ) : (
              <div className="flex items-center gap-4 border border-dashed border-slate-200 p-10 text-slate-400">
                <Camera size={28} strokeWidth={1.5} />
                <p className="font-semibold text-slate-400">Képek hamarosan</p>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ════════════════════════════════════════════
          FULL REFERENCE LIST
      ════════════════════════════════════════════ */}
      <section id="lista" className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Teljes lista</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">Összes megbízónk</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl">
            Az évek során számos ipari, önkormányzati és magán megrendelő bízta ránk útépítési és aszfaltozási munkáit.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {referenceList.map((reference) => {
              const dashIdx = reference.indexOf(" - ");
              const name    = dashIdx !== -1 ? reference.slice(0, dashIdx) : reference;
              const details = dashIdx !== -1 ? reference.slice(dashIdx + 3) : "";
              return (
                <div key={reference}
                  className="group relative border border-slate-200 bg-white p-5 transition hover:border-orange-400 hover:shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] origin-bottom scale-y-0 bg-orange-500 transition-transform duration-300 group-hover:scale-y-100" />
                  <p className="font-bold text-slate-800 text-sm">{name}</p>
                  {details && <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{details}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BENTO — WHY US
      ════════════════════════════════════════════ */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">Miért minket?</p>
          <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">
            A számok <span className="text-orange-400">magukért</span> beszélnek.
          </h2>

          {/* Bento grid */}
          <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2">

            {/* BIG — 15 év */}
            <div className="col-span-2 row-span-2 bg-orange-500 p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden">
              <span className="absolute -bottom-6 -right-4 text-[11rem] font-black leading-none text-orange-400/30 select-none pointer-events-none">15</span>
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.28em] text-white/60 uppercase">Szakmai múlt</p>
                <p className="mt-3 text-4xl font-black text-white leading-none sm:text-5xl">15+ év<br />tapasztalat</p>
              </div>
              <p className="relative z-10 text-sm text-white/80 leading-relaxed max-w-xs">
                2018 óta önálló vállalkozásként, de közel másfél évtizedes szakmai tudással állunk megrendelőink mögé.
              </p>
            </div>

            {/* 50+ projekt */}
            <div className="bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-slate-500 uppercase">Projektek</p>
              <div>
                <p className="text-5xl font-black text-white leading-none">50<span className="text-orange-400">+</span></p>
                <p className="mt-1 text-xs text-slate-500 font-semibold uppercase tracking-widest">elvégzett munka</p>
              </div>
            </div>

            {/* 30 000 m² */}
            <div className="bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-slate-500 uppercase">Terület</p>
              <div>
                <p className="text-4xl font-black text-white leading-none">30k<span className="text-orange-400">+</span></p>
                <p className="mt-1 text-xs text-slate-500 font-semibold uppercase tracking-widest">m² aszfalt</p>
              </div>
            </div>

            {/* Garancia */}
            <div className="bg-white p-6 flex flex-col justify-between">
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase">Vállalás</p>
              <div>
                <p className="text-2xl font-black text-slate-900 leading-tight sm:text-3xl">100%<br />garanciális</p>
                <p className="mt-1 text-xs text-slate-500 font-semibold uppercase tracking-widest">minden munka</p>
              </div>
            </div>

            {/* 48 óra */}
            <div className="bg-slate-800 p-6 flex flex-col justify-between">
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-slate-500 uppercase">Reakcióidő</p>
              <div>
                <p className="text-4xl font-black text-orange-400 leading-none">48h</p>
                <p className="mt-1 text-xs text-slate-500 font-semibold uppercase tracking-widest">ajánlatküldés</p>
              </div>
            </div>

          </div>

          {/* Badges row */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="border border-slate-800 bg-slate-900 p-6 flex items-center gap-6">
              <div className="relative h-20 w-20 shrink-0">
                <Image src="/badge-megbizhat.png" alt="Kiemelten Megbízható Vállalkozás" fill className="object-contain" />
              </div>
              <div>
                <p className="font-black text-white text-base">Kiemelten Megbízható<br />Vállalkozás</p>
                <p className="mt-1 text-[10px] font-bold tracking-widest text-orange-400 uppercase">BCP Rating · 2023</p>
              </div>
            </div>
            <div className="border border-slate-800 bg-slate-900 p-6 flex items-center gap-6">
              <div className="relative h-14 w-40 shrink-0">
                <Image src="/badge-dinamikus.png" alt="Dinamikusan Fejlődő Vállalkozás" fill className="object-contain" />
              </div>
              <div>
                <p className="font-black text-white text-base">Dinamikusan Fejlődő<br />Vállalkozás</p>
                <p className="mt-1 text-[10px] font-bold tracking-widest text-orange-400 uppercase">BCP Rating · 2023</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════ */}
      <div className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">Legyen Ön is referenciánk</p>
              <p className="mt-2 text-3xl font-black text-white">Kérjen ingyenes helyszíni felmérést!</p>
              <p className="mt-3 text-sm text-slate-400 max-w-xl">
                Útépítés, aszfaltozás, felújítás — minden méretű projekthez. Díjmentes helyszíni szemle és tételes árajánlat 48 órán belül.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                {contactData.contacts.map((c) => (
                  <a key={c.name} href={`tel:${c.phone}`}
                    className="flex flex-col border border-slate-700 px-5 py-3 transition hover:border-orange-500">
                    <span className="text-[10px] font-bold text-slate-500">{c.name}</span>
                    <span className="text-lg font-black text-white hover:text-orange-400 transition">{c.phoneDisplay}</span>
                  </a>
                ))}
                <a href={`mailto:${contactData.email}`}
                  className="flex flex-col border border-slate-700 px-5 py-3 transition hover:border-orange-500">
                  <span className="text-[10px] font-bold text-slate-500">E-mail</span>
                  <span className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition">{contactData.email}</span>
                </a>
              </div>
            </div>
            <Link href="/kapcsolat"
              className="shrink-0 bg-orange-500 px-10 py-4 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600">
              Kapcsolat →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
