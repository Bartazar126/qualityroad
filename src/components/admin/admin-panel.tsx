"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DropZone } from "./drop-zone";
import type { SiteContent, ProjectReference, GalleryItem } from "@/types/site-content";
import type { FolderImage } from "@/lib/project-gallery";

/* ─── types ─────────────────────────────────────────── */
export type FolderProjectData = {
  id:      string;
  name:    string;
  folder:  string;
  year:    string;
  summary: string;
  logoSrc: string;
  tags:    string[];
  images:  FolderImage[];
};

type Toast = { msg: string; ok: boolean };

/* ─── helpers ───────────────────────────────────────── */
const uuid = () => crypto.randomUUID();

const emptyProject = (): ProjectReference => ({
  id: uuid(), name: "", location: "", summary: "", logoSrc: "", images: [],
});

/* ═══════════════════════════════════════════════════════
   AdminPanel
═══════════════════════════════════════════════════════ */
interface AdminPanelProps {
  folderProjects: FolderProjectData[];
}

type ActiveView =
  | { kind: "json";   id: string }
  | { kind: "folder"; id: string }
  | null;

export function AdminPanel({ folderProjects }: AdminPanelProps) {
  const router = useRouter();

  const [content, setContent]       = useState<SiteContent | null>(null);
  const [active, setActive]         = useState<ActiveView>(null);
  const [draft, setDraft]           = useState<ProjectReference | null>(null);
  /* folder project extra images added this session (before refresh) */
  const [folderExtra, setFolderExtra] = useState<Record<string, string[]>>({});
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<Toast | null>(null);
  /* drag-to-reorder */
  const [dragIdx, setDragIdx]       = useState<number | null>(null);
  const [dropIdx, setDropIdx]       = useState<number | null>(null);

  /* ── load ─────────────────────────────────────────── */
  const load = useCallback(async () => {
    const res  = await fetch("/api/site-content");
    const data = (await res.json()) as SiteContent;
    setContent(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── toast ────────────────────────────────────────── */
  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── logout ───────────────────────────────────────── */
  const logout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  /* ── select JSON project ──────────────────────────── */
  const selectJson = (id: string) => {
    const proj = content?.projects.find((p) => p.id === id) ?? null;
    setActive({ kind: "json", id });
    setDraft(proj ? { ...proj, images: [...proj.images] } : null);
  };

  /* ── new JSON project ─────────────────────────────── */
  const newProject = () => {
    const proj = emptyProject();
    setActive({ kind: "json", id: proj.id });
    setDraft(proj);
  };

  /* ── save JSON project ────────────────────────────── */
  const save = async () => {
    if (!content || !draft) return;
    if (!draft.name.trim()) { notify("A projekt neve kötelező!", false); return; }

    setSaving(true);
    const exists   = content.projects.some((p) => p.id === draft.id);
    const projects = exists
      ? content.projects.map((p) => (p.id === draft.id ? draft : p))
      : [...content.projects, draft];

    const next = { ...content, projects };
    const res  = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) { setContent(next); notify("Projekt elmentve ✓"); }
    else        { notify("Mentési hiba!", false); }
  };

  /* ── delete JSON project ──────────────────────────── */
  const deleteProject = async () => {
    if (!content || !draft) return;
    if (!confirm(`Biztosan törlöd: "${draft.name}"?`)) return;

    const projects = content.projects.filter((p) => p.id !== draft.id);
    const next     = { ...content, projects };
    const res      = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (res.ok) {
      setContent(next);
      setDraft(null);
      setActive(null);
      notify("Projekt törölve.");
    }
  };

  /* ── JSON project images ──────────────────────────── */
  const addImages = (srcs: string[]) => {
    if (!draft) return;
    const newImgs: GalleryItem[] = srcs.map((src) => ({ id: uuid(), src, alt: "", caption: "" }));
    setDraft({ ...draft, images: [...draft.images, ...newImgs] });
  };

  const removeImage = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, images: draft.images.filter((_, i) => i !== idx) });
  };

  const updateCaption = (idx: number, caption: string) => {
    if (!draft) return;
    setDraft({ ...draft, images: draft.images.map((img, i) => i === idx ? { ...img, caption } : img) });
  };

  /* ── drag-to-reorder ──────────────────────────────── */
  const onImageDragStart = (idx: number) => setDragIdx(idx);

  const onImageDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDropIdx(idx);
  };

  const onImageDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx || !draft) {
      setDragIdx(null); setDropIdx(null); return;
    }
    const imgs = [...draft.images];
    const [moved] = imgs.splice(dragIdx, 1);
    imgs.splice(idx, 0, moved);
    setDraft({ ...draft, images: imgs });
    setDragIdx(null); setDropIdx(null);
  };

  const onImageDragEnd = () => { setDragIdx(null); setDropIdx(null); };

  /* ── logo for JSON project ────────────────────────── */
  const setLogo = (srcs: string[]) => {
    if (!draft || srcs.length === 0) return;
    setDraft({ ...draft, logoSrc: srcs[0] });
  };

  /* ── folder project: upload more images ───────────── */
  const addFolderImages = (id: string, srcs: string[]) => {
    setFolderExtra((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), ...srcs] }));
    notify(`${srcs.length} kép feltöltve ✓`);
  };

  /* ════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  const activeFolderProject = active?.kind === "folder"
    ? folderProjects.find((p) => p.id === active.id) ?? null
    : null;

  if (!content) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Betöltés…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">

      {/* Toast */}
      {toast && (
        <div className={[
          "fixed bottom-6 right-6 z-50 px-5 py-3 text-sm font-bold shadow-2xl",
          toast.ok ? "bg-orange-500 text-white" : "bg-red-600 text-white",
        ].join(" ")}>
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
              Admin felület
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">Projekt kezelő</h1>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="border border-slate-700 px-4 py-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition hover:text-white"
            >
              ← Weboldal
            </a>
            <button
              type="button"
              onClick={logout}
              className="border border-red-800 px-4 py-2 text-xs font-bold tracking-widest text-red-400 uppercase transition hover:bg-red-900/30"
            >
              Kijelentkezés
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

          {/* ── Sidebar ──────────────────────────────── */}
          <aside className="flex flex-col gap-2">

            {/* JSON projects */}
            <p className="px-1 text-[9px] font-extrabold tracking-[0.3em] text-slate-500 uppercase">
              Saját projektek
            </p>
            <button
              type="button"
              onClick={newProject}
              className="flex items-center justify-center gap-2 bg-orange-500 px-4 py-3 text-sm font-extrabold tracking-widest text-white uppercase hover:bg-orange-600 transition"
            >
              + Új projekt
            </button>

            {content.projects.length === 0 && (
              <p className="mt-2 text-center text-[11px] text-slate-600">
                Még nincs saját projekt.
              </p>
            )}

            {content.projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectJson(p.id)}
                className={[
                  "w-full border px-4 py-3 text-left text-sm font-semibold transition",
                  active?.kind === "json" && active.id === p.id
                    ? "border-orange-500 bg-slate-800 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white",
                ].join(" ")}
              >
                <span className="block truncate">{p.name || "(névtelen)"}</span>
                <span className="block text-[10px] font-normal text-slate-600">
                  {p.images.length} kép
                </span>
              </button>
            ))}

            {/* Folder projects */}
            <p className="mt-4 px-1 text-[9px] font-extrabold tracking-[0.3em] text-slate-500 uppercase">
              Mappa-alapú projektek
            </p>

            {folderProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive({ kind: "folder", id: p.id })}
                className={[
                  "w-full border px-4 py-3 text-left text-sm font-semibold transition",
                  active?.kind === "folder" && active.id === p.id
                    ? "border-orange-500 bg-slate-800 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white",
                ].join(" ")}
              >
                <span className="flex items-center gap-2 truncate">
                  {p.name}
                  <span className="rounded-sm bg-orange-500/20 px-1 py-0.5 text-[9px] font-extrabold text-orange-400 uppercase">
                    Mappa
                  </span>
                </span>
                <span className="block text-[10px] font-normal text-slate-600">
                  {p.images.length + (folderExtra[p.id]?.length ?? 0)} kép
                </span>
              </button>
            ))}
          </aside>

          {/* ── Main area ─────────────────────────────── */}
          {active?.kind === "json" && draft ? (
            <JsonProjectEditor
              draft={draft}
              setDraft={setDraft}
              onSave={save}
              onDelete={deleteProject}
              onAddImages={addImages}
              onRemoveImage={removeImage}
              onUpdateCaption={updateCaption}
              onSetLogo={setLogo}
              onDragStart={onImageDragStart}
              onDragOver={onImageDragOver}
              onDrop={onImageDrop}
              onDragEnd={onImageDragEnd}
              dragIdx={dragIdx}
              dropIdx={dropIdx}
              saving={saving}
            />
          ) : active?.kind === "folder" && activeFolderProject ? (
            <FolderProjectViewer
              project={activeFolderProject}
              extraImages={folderExtra[activeFolderProject.id] ?? []}
              onAddImages={(srcs) => addFolderImages(activeFolderProject.id, srcs)}
            />
          ) : (
            <div className="flex items-center justify-center border border-dashed border-slate-800">
              <p className="py-24 text-sm text-slate-600">
                Válassz egy projektet a bal oldali listából.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   JSON Project Editor
═══════════════════════════════════════════════════════ */
interface JsonEditorProps {
  draft:            ProjectReference;
  setDraft:         (d: ProjectReference) => void;
  onSave:           () => void;
  onDelete:         () => void;
  onAddImages:      (srcs: string[]) => void;
  onRemoveImage:    (idx: number) => void;
  onUpdateCaption:  (idx: number, caption: string) => void;
  onSetLogo:        (srcs: string[]) => void;
  onDragStart:      (idx: number) => void;
  onDragOver:       (e: React.DragEvent, idx: number) => void;
  onDrop:           (e: React.DragEvent, idx: number) => void;
  onDragEnd:        () => void;
  dragIdx:          number | null;
  dropIdx:          number | null;
  saving:           boolean;
}

function JsonProjectEditor({
  draft, setDraft,
  onSave, onDelete,
  onAddImages, onRemoveImage, onUpdateCaption, onSetLogo,
  onDragStart, onDragOver, onDrop, onDragEnd,
  dragIdx, dropIdx, saving,
}: JsonEditorProps) {
  return (
    <section className="space-y-6">

      {/* Fields */}
      <div className="grid gap-4 border border-slate-800 bg-slate-900 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
            Projekt neve *
          </label>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="pl. Wellis Beruházás"
            className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
            Helyszín
          </label>
          <input
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            placeholder="pl. Budapest, XIV. kerület"
            className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
            Rövid leírás
          </label>
          <input
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            placeholder="pl. 2200 m² aszfaltozás, 2024"
            className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Logo */}
      <div className="border border-slate-800 bg-slate-900 p-6">
        <p className="text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
          Megbízó logója (opcionális)
        </p>
        <div className="mt-3 flex flex-wrap items-start gap-4">
          {draft.logoSrc && (
            <div className="relative">
              <div className="relative h-16 w-28 border border-slate-700 bg-white">
                <Image src={draft.logoSrc} alt="Logó" fill sizes="112px" className="object-contain p-1" />
              </div>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, logoSrc: "" })}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-red-600 text-[10px] text-white hover:bg-red-500"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <DropZone
              onUpload={onSetLogo}
              folder="project-logos"
              multiple={false}
              label="Logó feltöltése (1 fájl)"
              compact
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
            Projekt képek ({draft.images.length} db)
          </p>
          {draft.images.length > 0 && (
            <p className="text-[10px] text-slate-600">Fogd & húzd az átrendezéshez</p>
          )}
        </div>

        <div className="mt-4">
          <DropZone
            onUpload={onAddImages}
            folder={`project-${draft.id}`}
            multiple
            label="Húzd ide a képeket (több fájl egyszerre is)"
          />
        </div>

        {draft.images.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {draft.images.map((img, idx) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={(e) => onDrop(e, idx)}
                onDragEnd={onDragEnd}
                className={[
                  "group relative cursor-grab border transition active:cursor-grabbing",
                  dropIdx === idx && dragIdx !== idx ? "border-orange-500 scale-105" : "border-slate-700",
                  dragIdx === idx ? "opacity-40" : "opacity-100",
                ].join(" ")}
              >
                <div className="relative aspect-[4/3] bg-slate-800">
                  <Image src={img.src} alt={img.caption || "kép"} fill sizes="200px" className="object-cover" />
                  <div className="absolute left-1 top-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition">
                    ⠿ {idx + 1}
                  </div>
                </div>
                <input
                  value={img.caption}
                  onChange={(e) => onUpdateCaption(idx, e.target.value)}
                  placeholder="Felirat (opcionális)"
                  className="w-full border-t border-slate-700 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-300 placeholder-slate-600 focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-red-600/90 text-[10px] text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-orange-500 px-8 py-3 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Mentés…" : "Mentés"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="border border-red-700 px-6 py-3 text-sm font-bold text-red-400 uppercase transition hover:bg-red-900/30"
        >
          Projekt törlése
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   Folder Project Viewer
═══════════════════════════════════════════════════════ */
function FolderProjectViewer({
  project,
  extraImages,
  onAddImages,
}: {
  project:      FolderProjectData;
  extraImages:  string[];
  onAddImages:  (srcs: string[]) => void;
}) {
  const allImageCount = project.images.length + extraImages.length;

  return (
    <section className="space-y-6">

      {/* Info */}
      <div className="border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3 mb-4">
          <p className="text-xl font-black text-white">{project.name}</p>
          <span className="rounded-sm bg-orange-500/20 px-2 py-1 text-[9px] font-extrabold text-orange-400 uppercase">
            Mappa-alapú
          </span>
        </div>
        <dl className="grid gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Év</dt>
            <dd className="text-slate-300">{project.year}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Leírás</dt>
            <dd className="text-slate-300">{project.summary}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Mappa</dt>
            <dd className="font-mono text-[11px] text-slate-400">public/uploads/{project.folder}/</dd>
          </div>
          <div>
            <dt className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Képek</dt>
            <dd className="text-slate-300">{allImageCount} db</dd>
          </div>
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Upload more images */}
      <div className="border border-slate-800 bg-slate-900 p-6">
        <p className="text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
          Képek hozzáadása
        </p>
        <p className="mt-1 text-xs text-slate-500">
          A feltöltött képek a <span className="font-mono">public/uploads/{project.folder}/</span> mappába kerülnek és azonnal megjelennek a referencia oldalon.
        </p>
        <div className="mt-4">
          <DropZone
            onUpload={onAddImages}
            folder={project.folder}
            multiple
            label={`Képek feltöltése a(z) "${project.name}" projekthez`}
          />
        </div>
        {extraImages.length > 0 && (
          <p className="mt-3 text-xs font-bold text-orange-400">
            ✓ {extraImages.length} kép feltöltve ebben a munkamenetben. Frissítsd az oldalt a megjelenítéshez.
          </p>
        )}
      </div>

      {/* Image grid */}
      {project.images.length > 0 && (
        <div className="border border-slate-800 bg-slate-900 p-6">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
            Jelenlegi képek ({project.images.length} db) — megjelenítés oldalon
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {project.images.map((img) => (
              <div key={img.id} className="relative aspect-[4/3] border border-slate-700 bg-slate-800">
                <Image src={img.src} alt={img.alt || "kép"} fill sizes="160px" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-slate-600">
            Képek törléséhez távolítsd el a fájlt a mappából.
          </p>
        </div>
      )}

      <a
        href="/referenciak"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block border border-slate-700 px-5 py-2.5 text-xs font-bold tracking-widest text-slate-400 uppercase transition hover:text-white"
      >
        Referencia oldal megtekintése →
      </a>
    </section>
  );
}
