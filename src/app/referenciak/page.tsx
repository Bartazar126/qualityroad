import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { readSiteContent } from "@/lib/site-content";
import { getFallbackGallery } from "@/lib/fallback-gallery";
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
  const content         = await readSiteContent();
  const fallbackGallery = await getFallbackGallery();

  const hiddenSet        = new Set(content.hiddenImages ?? []);
  const hiddenProjectSet = new Set(content.hiddenProjects ?? []);

  const filteredFallback = fallbackGallery.filter((img) => !hiddenSet.has(img.src));
  const gallery: GalleryItem[] = content.gallery.length > 0
    ? content.gallery.filter((img) => !hiddenSet.has(img.src))
    : filteredFallback;

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
                  className="border border-slate-700 px-4 py-1.5 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase transition hover:border-orange-500 hover:text-orange-400">
                  {p.name}
                </a>
              ))}
              <a href="#lista"
                className="border border-slate-700 px-4 py-1.5 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase transition hover:border-orange-500 hover:text-orange-400">
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
                <div className="shrink-0 border border-slate-100 bg-white shadow-md p-6 flex items-center justify-center" style={{ minWidth: 200, minHeight: 110 }}>
                  <div className="relative h-20 w-52">
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
          GALLERY
      ════════════════════════════════════════════ */}
      {gallery.length > 0 && (
        <>
          <section id="galeria" className="py-16 bg-white border-t border-slate-100">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">Képgaléria</p>
              <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">Összes munkakép</h2>
              <p className="mt-2 text-sm text-slate-500">Kattints bármelyik képre a teljes mérethez és lapozáshoz.</p>
              <div className="mt-8">
                <ShowcaseLightbox images={gallery} hideCaptions />
              </div>
            </div>
          </section>
        </>
      )}

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
