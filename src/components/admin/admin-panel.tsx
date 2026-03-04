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

type Toast         = { msg: string; ok: boolean };
type ActiveKind    = { kind: "regular"; id: string } | { kind: "folder"; id: string } | null;

/* ─── helpers ───────────────────────────────────────── */
const uuid = () => crypto.randomUUID();

const emptyProject = (): ProjectReference => ({
  id: uuid(), name: "", location: "", summary: "", logoSrc: "", tags: [], images: [],
});

/* ═══════════════════════════════════════════════════════
   AdminPanel
═══════════════════════════════════════════════════════ */
interface AdminPanelProps {
  folderProjects: FolderProjectData[];
}

export function AdminPanel({ folderProjects }: AdminPanelProps) {
  const router = useRouter();

  const [content, setContent] = useState<SiteContent | null>(null);
  const [active, setActive]   = useState<ActiveKind>(null);
  const [draft, setDraft]     = useState<ProjectReference | null>(null);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<Toast | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res  = await fetch("/api/site-content");
    const data = (await res.json()) as SiteContent;
    setContent(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), ok ? 3500 : 8000);
  };

  const logout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  /* ── regular project handlers ─────────────────────── */
  const selectRegular = (id: string) => {
    const proj = content?.projects.find((p) => p.id === id) ?? null;
    setActive({ kind: "regular", id });
    setDraft(proj ? { ...proj, images: [...proj.images], tags: [...(proj.tags ?? [])] } : null);
  };

  const newProject = () => {
    const proj = emptyProject();
    setActive({ kind: "regular", id: proj.id });
    setDraft(proj);
  };

  const saveRegular = async () => {
    if (!content || !draft) return;
    if (!draft.name.trim()) { notify("A projekt neve kötelező!", false); return; }
    setSaving(true);
    const exists   = content.projects.some((p) => p.id === draft.id);
    const projects = exists
      ? content.projects.map((p) => (p.id === draft.id ? draft : p))
      : [...content.projects, draft];
    const next = { ...content, projects };
    const res  = await fetch("/api/site-content", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) {
      setContent(next);
      notify("Projekt elmentve ✓");
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({ error: "?" })) as { error?: string };
      notify(err.error ?? `Mentési hiba! (${res.status})`, false);
    }
  };

  const deleteRegular = async () => {
    if (!content || !draft) return;
    if (!confirm(`Biztosan törlöd: "${draft.name}"?`)) return;
    setSaving(true);
    const projects = content.projects.filter((p) => p.id !== draft.id);
    const next     = { ...content, projects };
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next),
      });
      if (res.ok) {
        setContent(next);
        setDraft(null);
        setActive(null);
        notify("Projekt törölve.");
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({ error: "?" })) as { error?: string };
        notify(err.error ?? `Törlési hiba! (${res.status})`, false);
      }
    } catch (e) {
      console.error("delete error", e);
      notify("Hálózati hiba a törléskor!", false);
    } finally {
      setSaving(false);
    }
  };

  /* ── folder project: hide/show from site ──────────── */
  const toggleHideProject = async (id: string, name: string) => {
    if (!content) return;
    const already  = content.hiddenProjects ?? [];
    const isHidden = already.includes(id);
    if (!isHidden && !confirm(`"${name}" projekt elrejtése az oldalról?`)) return;
    const hiddenProjects = isHidden ? already.filter((s) => s !== id) : [...already, id];
    const next = { ...content, hiddenProjects };
    const res  = await fetch("/api/site-content", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next),
    });
    if (res.ok) {
      setContent(next);
      notify(isHidden ? "Projekt visszaállítva ✓" : "Projekt elrejtve az oldalról");
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({ error: "?" })) as { error?: string };
      notify(err.error ?? `Hiba! (${res.status})`, false);
    }
  };

  /* ── image visibility ─────────────────────────────── */
  const toggleHideImage = async (src: string) => {
    if (!content) return;
    const already      = content.hiddenImages ?? [];
    const hiddenImages = already.includes(src)
      ? already.filter((s) => s !== src)
      : [...already, src];
    const next = { ...content, hiddenImages };
    const res  = await fetch("/api/site-content", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next),
    });
    if (res.ok) {
      setContent(next);
      notify(hiddenImages.includes(src) ? "Kép elrejtve" : "Kép visszaállítva ✓");
    } else {
      const err = await res.json().catch(() => ({ error: "?" })) as { error?: string };
      notify(err.error ?? `Hiba! (${res.status})`, false);
    }
  };

  /* ── regular image handlers ───────────────────────── */
  const addImages = (srcs: string[]) => {
    if (!draft) return;
    const imgs: GalleryItem[] = srcs.map((src) => ({ id: uuid(), src, alt: "", caption: "" }));
    setDraft({ ...draft, images: [...draft.images, ...imgs] });
  };
  const removeImage    = (idx: number)              => { if (!draft) return; setDraft({ ...draft, images: draft.images.filter((_, i) => i !== idx) }); };
  const updateCaption  = (idx: number, cap: string) => { if (!draft) return; setDraft({ ...draft, images: draft.images.map((img, i) => i === idx ? { ...img, caption: cap } : img) }); };
  const setLogo        = (srcs: string[])            => { if (!draft || !srcs.length) return; setDraft({ ...draft, logoSrc: srcs[0] }); };

  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver  = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDropIdx(idx); };
  const onDrop      = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx || !draft) { setDragIdx(null); setDropIdx(null); return; }
    const imgs = [...draft.images];
    const [moved] = imgs.splice(dragIdx, 1);
    imgs.splice(idx, 0, moved);
    setDraft({ ...draft, images: imgs });
    setDragIdx(null); setDropIdx(null);
  };
  const onDragEnd = () => { setDragIdx(null); setDropIdx(null); };

  /* ════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  if (!content) {
    return <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">Betöltés…</div>;
  }

  const hiddenProjectIds = new Set(content.hiddenProjects ?? []);

  /* Active folder project */
  const activeFolderProj = active?.kind === "folder"
    ? folderProjects.find((p) => p.id === active.id) ?? null
    : null;

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">

      {toast && (
        <div className={["fixed bottom-6 right-6 z-50 max-w-sm px-5 py-3 text-sm font-bold shadow-2xl break-words",
          toast.ok ? "bg-orange-500 text-white" : "bg-red-600 text-white"].join(" ")}>
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">Admin felület</p>
            <h1 className="mt-1 text-3xl font-black text-white">Projekt kezelő</h1>
          </div>
          <div className="flex gap-3">
            <a href="/" className="border border-slate-700 px-4 py-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition hover:text-white">← Weboldal</a>
            <button type="button" onClick={logout}
              className="border border-red-800 px-4 py-2 text-xs font-bold tracking-widest text-red-400 uppercase transition hover:bg-red-900/30">
              Kijelentkezés
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* ── Sidebar ──────────────────────────────── */}
          <aside className="flex flex-col gap-2">
            <p className="px-1 text-[9px] font-extrabold tracking-[0.3em] text-slate-500 uppercase">Projektek</p>
            <button type="button" onClick={newProject}
              className="flex items-center justify-center gap-2 bg-orange-500 px-4 py-3 text-sm font-extrabold tracking-widest text-white uppercase hover:bg-orange-600 transition">
              + Új projekt
            </button>

            {/* folder projects — same look as regular */}
            {folderProjects.map((p) => (
              <button key={p.id} type="button" onClick={() => setActive({ kind: "folder", id: p.id })}
                className={["w-full border px-4 py-3 text-left text-sm font-semibold transition",
                  active?.kind === "folder" && active.id === p.id
                    ? "border-orange-500 bg-slate-800 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white",
                ].join(" ")}>
                <span className={["block truncate", hiddenProjectIds.has(p.id) ? "line-through opacity-50" : ""].join(" ")}>
                  {p.name}
                </span>
                <span className="block text-[10px] font-normal text-slate-600">{p.images.length} kép</span>
              </button>
            ))}

            {/* regular projects */}
            {content.projects.map((p) => (
              <button key={p.id} type="button" onClick={() => selectRegular(p.id)}
                className={["w-full border px-4 py-3 text-left text-sm font-semibold transition",
                  active?.kind === "regular" && active.id === p.id
                    ? "border-orange-500 bg-slate-800 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white",
                ].join(" ")}>
                <span className="block truncate">{p.name || "(névtelen)"}</span>
                <span className="block text-[10px] font-normal text-slate-600">{p.images.length} kép</span>
              </button>
            ))}

            {content.projects.length === 0 && folderProjects.length === 0 && (
              <p className="mt-2 text-center text-[11px] text-slate-600">Még nincs projekt.</p>
            )}
          </aside>

          {/* ── Main area ─────────────────────────────── */}
          {active?.kind === "regular" && draft ? (
            <RegularProjectEditor
              draft={draft} setDraft={setDraft}
              onSave={saveRegular} onDelete={deleteRegular}
              onAddImages={addImages} onRemoveImage={removeImage} onUpdateCaption={updateCaption}
              onSetLogo={setLogo}
              onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}
              dragIdx={dragIdx} dropIdx={dropIdx} saving={saving}
            />
          ) : active?.kind === "folder" && activeFolderProj ? (
            <FolderProjectEditor
              project={activeFolderProj}
              hiddenImages={content.hiddenImages ?? []}
              isHidden={hiddenProjectIds.has(activeFolderProj.id)}
              onToggleHide={toggleHideImage}
              onToggleHideProject={() => toggleHideProject(activeFolderProj.id, activeFolderProj.name)}
            />
          ) : (
            <div className="flex items-center justify-center border border-dashed border-slate-800">
              <p className="py-24 text-sm text-slate-600">Válassz egy projektet a bal oldali listából.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Regular Project Editor
═══════════════════════════════════════════════════════ */
interface RegularEditorProps {
  draft: ProjectReference; setDraft: (d: ProjectReference) => void;
  onSave: () => void; onDelete: () => void;
  onAddImages: (srcs: string[]) => void; onRemoveImage: (idx: number) => void;
  onUpdateCaption: (idx: number, cap: string) => void; onSetLogo: (srcs: string[]) => void;
  onDragStart: (idx: number) => void; onDragOver: (e: React.DragEvent, idx: number) => void;
  onDrop: (e: React.DragEvent, idx: number) => void; onDragEnd: () => void;
  dragIdx: number | null; dropIdx: number | null; saving: boolean;
}

function RegularProjectEditor({
  draft, setDraft, onSave, onDelete,
  onAddImages, onRemoveImage, onUpdateCaption, onSetLogo,
  onDragStart, onDragOver, onDrop, onDragEnd,
  dragIdx, dropIdx, saving,
}: RegularEditorProps) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !(draft.tags ?? []).includes(t)) setDraft({ ...draft, tags: [...(draft.tags ?? []), t] });
    setTagInput("");
  };

  return (
    <section className="space-y-6">

      {/* Alap adatok */}
      <div className="grid gap-4 border border-slate-800 bg-slate-900 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">Projekt neve *</label>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="pl. Wellis Beruházás"
            className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">Helyszín</label>
          <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            placeholder="pl. Budapest, XIV. kerület"
            className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">Rövid leírás</label>
          <input value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            placeholder="pl. 2200 m² aszfaltozás, 2024"
            className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">Címkék</label>
          <div className="mt-1.5 flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="pl. Aszfaltozás — Enter a hozzáadáshoz"
              className="flex-1 border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none" />
            <button type="button" onClick={addTag}
              className="border border-orange-500 px-4 py-2 text-xs font-bold text-orange-400 uppercase hover:bg-orange-500/10 transition">
              + Add
            </button>
          </div>
          {(draft.tags ?? []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(draft.tags ?? []).map((tag) => (
                <span key={tag} className="flex items-center gap-1 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase">
                  {tag}
                  <button type="button" onClick={() => setDraft({ ...draft, tags: draft.tags.filter((t) => t !== tag) })}
                    className="text-red-500 hover:text-red-400 ml-1">✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logó */}
      <div className="border border-slate-800 bg-slate-900 p-6">
        <p className="text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">Megbízó logója (opcionális)</p>
        <div className="mt-3 flex flex-wrap items-start gap-4">
          {draft.logoSrc && (
            <div className="relative">
              <div className="relative h-16 w-28 border border-slate-700 bg-white">
                <Image src={draft.logoSrc} alt="Logó" fill sizes="112px" className="object-contain p-1" />
              </div>
              <button type="button" onClick={() => setDraft({ ...draft, logoSrc: "" })}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-red-600 text-[10px] text-white hover:bg-red-500">✕</button>
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <DropZone onUpload={onSetLogo} folder="project-logos" multiple={false} label="Logó feltöltése (1 fájl)" compact />
          </div>
        </div>
      </div>

      {/* Képek */}
      <div className="border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">Képek ({draft.images.length} db)</p>
          {draft.images.length > 0 && <p className="text-[10px] text-slate-600">Fogd & húzd az átrendezéshez</p>}
        </div>
        <div className="mt-4">
          <DropZone onUpload={onAddImages} folder={`project-${draft.id}`} multiple label="Húzd ide a képeket" />
        </div>
        {draft.images.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {draft.images.map((img, idx) => (
              <div key={img.id} draggable
                onDragStart={() => onDragStart(idx)} onDragOver={(e) => onDragOver(e, idx)}
                onDrop={(e) => onDrop(e, idx)} onDragEnd={onDragEnd}
                className={["group relative cursor-grab border transition active:cursor-grabbing",
                  dropIdx === idx && dragIdx !== idx ? "border-orange-500 scale-105" : "border-slate-700",
                  dragIdx === idx ? "opacity-40" : "opacity-100"].join(" ")}>
                <div className="relative aspect-4/3 bg-slate-800">
                  <Image src={img.src} alt={img.caption || "kép"} fill sizes="200px" className="object-cover" />
                  <div className="absolute left-1 top-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition">⠿ {idx + 1}</div>
                </div>
                <input value={img.caption} onChange={(e) => onUpdateCaption(idx, e.target.value)}
                  placeholder="Felirat (opcionális)"
                  className="w-full border-t border-slate-700 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-300 placeholder-slate-600 focus:border-orange-500 focus:outline-none" />
                <button type="button" onClick={() => onRemoveImage(idx)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-red-600/90 text-[10px] text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Akciók */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onSave} disabled={saving}
          className="bg-orange-500 px-8 py-3 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600 disabled:opacity-50">
          {saving ? "Mentés…" : "Mentés"}
        </button>
        <button type="button" onClick={onDelete}
          className="border border-red-700 px-6 py-3 text-sm font-bold text-red-400 uppercase transition hover:bg-red-900/30">
          Projekt törlése
        </button>
        <a href="/referenciak" target="_blank" rel="noopener noreferrer"
          className="ml-auto border border-slate-700 px-5 py-3 text-xs font-bold tracking-widest text-slate-400 uppercase transition hover:text-white">
          Referencia oldal →
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   Folder Project Editor (képek hide/show + projekt törlés)
═══════════════════════════════════════════════════════ */
function FolderProjectEditor({
  project, hiddenImages, isHidden, onToggleHide, onToggleHideProject,
}: {
  project:              FolderProjectData;
  hiddenImages:         string[];
  isHidden:             boolean;
  onToggleHide:         (src: string) => void;
  onToggleHideProject:  () => void;
}) {
  const hiddenSet    = new Set(hiddenImages);
  const visibleCount = project.images.filter((img) => !hiddenSet.has(img.src)).length;
  const hiddenCount  = project.images.length - visibleCount;

  return (
    <section className="space-y-6">

      {/* Projekt info */}
      <div className="border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className={["text-xl font-black", isHidden ? "line-through text-slate-500" : "text-white"].join(" ")}>
              {project.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">{project.summary}</p>
            <p className="mt-1 text-xs text-slate-600">
              {visibleCount} látható kép
              {hiddenCount > 0 && <span className="ml-2 text-red-500">· {hiddenCount} rejtett</span>}
            </p>
          </div>
          <button type="button" onClick={onToggleHideProject}
            className={["px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition",
              isHidden
                ? "bg-green-700/30 border border-green-700 text-green-400 hover:bg-green-700/50"
                : "border border-red-700 text-red-400 hover:bg-red-900/30",
            ].join(" ")}>
            {isHidden ? "✓ Visszaállítás az oldalra" : "Projekt törlése az oldalról"}
          </button>
        </div>
        {isHidden && (
          <p className="mt-3 text-xs text-red-400 font-semibold">
            Ez a projekt jelenleg el van rejtve — nem látható a weboldalon.
          </p>
        )}
      </div>

      {/* Képek grid hide/show */}
      {project.images.length > 0 && (
        <div className="border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase">
              Képek ({project.images.length} db)
            </p>
            <p className="text-[10px] text-slate-600">Hover → szem ikon a rejtéshez/visszaállításhoz</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {project.images.map((img) => {
              const imgHidden = hiddenSet.has(img.src);
              return (
                <div key={img.id}
                  className={["group relative border transition",
                    imgHidden ? "border-red-900/60 opacity-50" : "border-slate-700"].join(" ")}>
                  <div className="relative aspect-4/3 bg-slate-800">
                    <Image src={img.src} alt={img.alt || "kép"} fill sizes="180px" className="object-cover" />
                    {imgHidden && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="rounded bg-red-600/90 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-widest">Rejtett</span>
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => onToggleHide(img.src)}
                    title={imgHidden ? "Megjelenítés" : "Elrejtés"}
                    className={["absolute right-1 top-1 flex h-7 w-7 items-center justify-center text-sm transition",
                      imgHidden
                        ? "bg-green-600/90 text-white hover:bg-green-500"
                        : "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600/90",
                    ].join(" ")}>
                    {imgHidden ? "👁" : "🚫"}
                  </button>
                  <p className="px-2 py-1 text-[10px] text-slate-500 truncate">{img.src.split("/").pop()}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <a href="/referenciak" target="_blank" rel="noopener noreferrer"
        className="inline-block border border-slate-700 px-5 py-2.5 text-xs font-bold tracking-widest text-slate-400 uppercase transition hover:text-white">
        Referencia oldal →
      </a>
    </section>
  );
}
