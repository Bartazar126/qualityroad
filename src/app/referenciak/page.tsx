import Image from "next/image";
import Link from "next/link";
import { readSiteContent } from "@/lib/site-content";
import { getFallbackGallery } from "@/lib/fallback-gallery";
import { referenceList, folderProjects } from "@/lib/company-data";
import { getProjectFolderImages } from "@/lib/project-gallery";
import { ShowcaseLightbox } from "@/components/home/showcase-lightbox";
import type { GalleryItem } from "@/types/site-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Referenciák | QUALITY ROAD INTACT KFT",
  description: "Kivitelezett útépítési, aszfaltozási és burkolat-felújítási referenciáink.",
};

export default async function ReferenciakPage() {
  const content         = await readSiteContent();
  const fallbackGallery = await getFallbackGallery();
  const gallery: GalleryItem[] = content.gallery.length > 0 ? content.gallery : fallbackGallery;

  /* ── Build unified project list ─────────────────────────
     1. Folder-based projects (auto-scanned, always shown)
     2. Admin-managed projects from site-content.json
  ──────────────────────────────────────────────────────── */
  const resolvedFolderProjects = folderProjects.map((p) => ({
    ...p,
    images: getProjectFolderImages(p.folder),
  }));

  const adminProjects = content.projects;

  /* Merge: admin projects override folder projects with the same name */
  const adminNames = new Set(adminProjects.map((p) => p.name));
  const filteredFolderProjects = resolvedFolderProjects.filter(
    (p) => !adminNames.has(p.name),
  );

  /* ── Final ordered project list ── */
  type UnifiedProject = {
    id: string;
    name: string;
    year?: string;
    summary: string;
    logoSrc: string;
    tags?: readonly string[];
    images: GalleryItem[];
  };

  const allProjects: UnifiedProject[] = [
    ...filteredFolderProjects.map((p) => ({
      id: p.id,
      name: p.name,
      year: p.year,
      summary: p.summary,
      logoSrc: p.logoSrc,
      tags: p.tags,
      images: p.images,
    })),
    ...adminProjects.map((p) => ({
      id: p.id,
      name: p.name,
      year: undefined,
      summary: p.summary,
      logoSrc: p.logoSrc,
      tags: undefined,
      images: p.images,
    })),
  ];

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
            Quality Road Intact Kft
          </p>
          <h1 className="mt-3 text-5xl font-black text-white sm:text-6xl">
            Referenciáink
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-400 leading-relaxed">
            Büszkék vagyunk elvégzett munkáinkra. Megbízóink között magánvállalkozások,
            ipari cégek és önkormányzatok egyaránt megtalálhatók.
          </p>

          {/* project nav anchors */}
          {allProjects.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {allProjects.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="border border-slate-700 px-4 py-1.5 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase transition hover:border-orange-500 hover:text-orange-400"
                >
                  {p.name}
                </a>
              ))}
              <a
                href="#galeria"
                className="border border-slate-700 px-4 py-1.5 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 uppercase transition hover:border-orange-500 hover:text-orange-400"
              >
                Képgaléria
              </a>
            </div>
          )}
        </div>
        <div className="road-stripe" />
      </div>

      {/* ════════════════════════════════════════════════
          PROJECT SECTIONS
      ════════════════════════════════════════════════ */}
      {allProjects.map((project, index) => (
        <section
          key={project.id}
          id={project.id}
          className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
        >
          {/* ── Project header ─── */}
          <div className="bg-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-black leading-none text-orange-500/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">
                        Projekt referencia
                      </p>
                      <h2 className="mt-0.5 text-2xl font-black text-white sm:text-3xl">
                        {project.name}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                    {project.year && (
                      <p className="text-sm font-semibold text-slate-300">
                        <span className="text-orange-400">⬥</span> {project.year}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-slate-300">
                      <span className="text-orange-400">⬥</span> {project.summary}
                    </p>
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-slate-700 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {project.logoSrc && (
                  <div className="relative h-14 w-28 shrink-0 border border-slate-700 bg-slate-800">
                    <Image
                      src={project.logoSrc}
                      alt={`${project.name} logó`}
                      fill
                      sizes="112px"
                      className="object-contain p-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Photos ─── */}
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {project.images.length > 0 ? (
              <ShowcaseLightbox images={project.images} />
            ) : (
              <div className="flex items-center gap-4 border border-dashed border-slate-300 p-10 text-slate-400">
                <span className="text-4xl">📷</span>
                <div>
                  <p className="font-semibold text-slate-600">Képek hamarosan</p>
                  <p className="mt-0.5 text-sm">
                    A projekt képeit a{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      uploads/{project.name}/
                    </code>{" "}
                    mappába helyezd el.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ── If no projects at all: hardcoded list ─────── */}
      {allProjects.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">
            Megbízóink
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
            Kiemelt referenciák
          </h2>
          <div className="mt-10 divide-y divide-slate-200 border border-slate-200">
            {referenceList.map((reference, i) => {
              const dashIdx = reference.indexOf(" - ");
              const name    = dashIdx !== -1 ? reference.slice(0, dashIdx) : reference;
              const details = dashIdx !== -1 ? reference.slice(dashIdx + 3) : "";
              return (
                <div key={reference} className="group flex items-start gap-5 p-5 transition hover:bg-slate-50">
                  <span className="mt-0.5 w-10 shrink-0 text-3xl font-black leading-none text-slate-100 select-none group-hover:text-orange-100 transition">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{name}</p>
                    {details && <p className="mt-0.5 text-sm text-slate-500 leading-relaxed">{details}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="road-stripe" />

      {/* ── General gallery ──────────────────────────────── */}
      {gallery.length > 0 && (
        <section id="galeria" className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-500 uppercase">
              Képgaléria
            </p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
              Összes munkakép
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Kattints bármelyik képre a teljes mérethez és lapozáshoz.
            </p>
            <div className="mt-8">
              <ShowcaseLightbox images={gallery} />
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────── */}
      <div className="bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
              Legyen Ön is referenciánk
            </p>
            <p className="mt-2 text-2xl font-black text-white">
              Kérjen ingyenes helyszíni felmérést!
            </p>
          </div>
          <Link
            href="/kapcsolat"
            className="bg-orange-500 px-8 py-3.5 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600"
          >
            Kapcsolat →
          </Link>
        </div>
      </div>

    </div>
  );
}
