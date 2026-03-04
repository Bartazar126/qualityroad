"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { DropZone } from "./drop-zone";
import type { SiteContent, ProjectReference, GalleryItem } from "@/types/site-content";

/* ─── helpers ──────────────────────────────────────── */
const uuid = () => crypto.randomUUID();

const emptyProject = (): ProjectReference => ({
  id: uuid(),
  name: "",
  location: "",
  summary: "",
  logoSrc: "",
  images: [],
});

/* ─── types ─────────────────────────────────────────── */
type Toast = { msg: string; ok: boolean };

/* ═══════════════════════════════════════════════════════
   AdminPanel
═══════════════════════════════════════════════════════ */
export function AdminPanel() {
  const [content, setContent]     = useState<SiteContent | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft]         = useState<ProjectReference | null>(null);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState<Toast | null>(null);
  /* drag-to-reorder images */
  const [dragIdx, setDragIdx]     = useState<number | null>(null);
  const [dropIdx, setDropIdx]     = useState<number | null>(null);

  /* ── load ─────────────────────────────────────────── */
  const load = useCallback(async () => {
    const res = await fetch("/api/site-content");
    const data = (await res.json()) as SiteContent;
    setContent(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── toast helper ─────────────────────────────────── */
  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── select project ───────────────────────────────── */
  const select = (id: string) => {
    const proj = content?.projects.find((p) => p.id === id) ?? null;
    setSelectedId(id);
    setDraft(proj ? { ...proj, images: [...proj.images] } : null);
  };

  /* ── new project ──────────────────────────────────── */
  const newProject = () => {
    const proj = emptyProject();
    setSelectedId(proj.id);
    setDraft(proj);
  };

  /* ── save ─────────────────────────────────────────── */
  const save = async () => {
    if (!content || !draft) return;
    if (!draft.name.trim()) { notify("A projekt neve kötelező!", false); return; }

    setSaving(true);
    const exists = content.projects.some((p) => p.id === draft.id);
    const projects = exists
      ? content.projects.map((p) => (p.id === draft.id ? draft : p))
      : [...content.projects, draft];

    const next = { ...content, projects };
    const res = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) {
      setContent(next);
      notify("Projekt elmentve ✓");
    } else {
      notify("Mentési hiba!", false);
    }
  };

  /* ── delete project ───────────────────────────────── */
  const deleteProject = async () => {
    if (!content || !draft) return;
    if (!confirm(`Biztosan törlöd a(z) "${draft.name}" projektet?`)) return;

    const projects = content.projects.filter((p) => p.id !== draft.id);
    const next = { ...content, projects };
    const res = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (res.ok) {
      setContent(next);
      setDraft(null);
      setSelectedId(null);
      notify("Projekt törölve.");
    }
  };

  /* ── images ───────────────────────────────────────── */
  const addImages = (srcs: string[]) => {
    if (!draft) return;
    const newImgs: GalleryItem[] = srcs.map((src) => ({
      id: uuid(), src, alt: "", caption: "",
    }));
    setDraft({ ...draft, images: [...draft.images, ...newImgs] });
  };

  const removeImage = (idx: number) => {
    if (!draft) return;
    const images = draft.images.filter((_, i) => i !== idx);
    setDraft({ ...draft, images });
  };

  const updateCaption = (idx: number, caption: string) => {
    if (!draft) return;
    const images = draft.images.map((img, i) => i === idx ? { ...img, caption } : img);
    setDraft({ ...draft, images });
  };

  /* ── drag-to-reorder images ───────────────────────── */
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

  /* ── logo ─────────────────────────────────────────── */
  const setLogo = (srcs: string[]) => {
    if (!draft || srcs.length === 0) return;
    setDraft({ ...draft, logoSrc: srcs[0] });
  };

  /* ════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  if (!content) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
              Admin felület
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">Projekt kezelő</h1>
          </div>
          <a href="/" className="border border-slate-700 px-4 py-2 text-xs font-bold tracking-widest text-slate-400 uppercase hover:text-white transition">
            ← Vissza az oldalra
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* ── Left: project list ────────────────────── */}
          <aside className="flex flex-col gap-2">
            <button
              type="button"
              onClick={newProject}
              className="flex items-center justify-center gap-2 bg-orange-500 px-4 py-3 text-sm font-extrabold tracking-widest text-white uppercase hover:bg-orange-600 transition"
            >
              + Új projekt
            </button>

            {content.projects.length === 0 && (
              <p className="mt-4 text-center text-xs text-slate-600">
                Még nincs projekt. Hozz létre egyet!
              </p>
            )}

            {content.projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => select(p.id)}
                className={[
                  "w-full border px-4 py-3 text-left text-sm font-semibold transition",
                  selectedId === p.id
                    ? "border-orange-500 bg-slate-800 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white",
                ].join(" ")}
              >
                <span className="block truncate">{p.name || "(névtelen)"}</span>
                <span className="mt-0.5 block text-[10px] font-normal text-slate-600">
                  {p.images.length} kép
                </span>
              </button>
            ))}
          </aside>

          {/* ── Right: editor ─────────────────────────── */}
          {draft ? (
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
                      onUpload={setLogo}
                      folder={`project-logos`}
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
                  <p className="text-[10px] text-slate-600">
                    Húzd a képeket az átrendezéshez
                  </p>
                </div>

                <div className="mt-4">
                  <DropZone
                    onUpload={addImages}
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
                        onDragStart={() => onImageDragStart(idx)}
                        onDragOver={(e) => onImageDragOver(e, idx)}
                        onDrop={(e) => onImageDrop(e, idx)}
                        onDragEnd={onImageDragEnd}
                        className={[
                          "group relative cursor-grab border transition active:cursor-grabbing",
                          dropIdx === idx && dragIdx !== idx
                            ? "border-orange-500 scale-105"
                            : "border-slate-700",
                          dragIdx === idx ? "opacity-40" : "opacity-100",
                        ].join(" ")}
                      >
                        {/* image */}
                        <div className="relative aspect-[4/3] bg-slate-800">
                          <Image
                            src={img.src}
                            alt={img.caption || "kép"}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                          {/* drag handle indicator */}
                          <div className="absolute left-1 top-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition">
                            ⠿ {idx + 1}
                          </div>
                        </div>
                        {/* caption input */}
                        <input
                          value={img.caption}
                          onChange={(e) => updateCaption(idx, e.target.value)}
                          placeholder="Felirat (opcionális)"
                          className="w-full border-t border-slate-700 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-300 placeholder-slate-600 focus:border-orange-500 focus:outline-none"
                        />
                        {/* delete */}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
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
                  onClick={save}
                  disabled={saving}
                  className="bg-orange-500 px-8 py-3 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? "Mentés…" : "Mentés"}
                </button>
                <button
                  type="button"
                  onClick={deleteProject}
                  className="border border-red-700 px-6 py-3 text-sm font-bold text-red-400 uppercase transition hover:bg-red-900/30"
                >
                  Projekt törlése
                </button>
              </div>
            </section>
          ) : (
            <div className="flex items-center justify-center border border-dashed border-slate-800 text-slate-600">
              <p className="py-20 text-sm">Válassz egy projektet, vagy hozz létre újat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
