"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GalleryItem } from "@/types/site-content";

type ShowcaseLightboxProps = {
  images: GalleryItem[];
  hideCaptions?: boolean;
};

export function ShowcaseLightbox({ images, hideCaptions = false }: ShowcaseLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const activeItem = activeIndex !== null ? images[activeIndex] : null;
  const prevItem   = activeIndex !== null ? images[(activeIndex - 1 + images.length) % images.length] : null;
  const nextItem   = activeIndex !== null ? images[(activeIndex + 1) % images.length] : null;

  const close    = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setLoaded(false);
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setLoaded(false);
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const openAt = (index: number) => { setLoaded(false); setActiveIndex(index); };

  useEffect(() => {
    if (activeIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")       close();
      else if (e.key === "ArrowLeft")  showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [activeIndex, close, showPrev, showNext]);

  return (
    <>
      {/* ── Grid ─────────────────────────────────────── */}
      <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item, index) => (
          <button key={item.id} type="button" onClick={() => openAt(index)}
            className="group relative overflow-hidden bg-slate-900 text-left">
            <div className="relative aspect-5/4 bg-slate-800">
              <Image
                src={item.src}
                alt={item.alt || item.caption}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={index < 6 ? "eager" : "lazy"}
                priority={index < 3}
                className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute left-0 top-0 h-[3px] w-0 bg-orange-500 transition-all duration-500 group-hover:w-full" />
            </div>

            {!hideCaptions && (
              <figcaption className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-[10px] font-extrabold tracking-[0.2em] text-white/70 uppercase">
                  {item.caption || "Referencia kivitelezés"}
                </p>
              </figcaption>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="bg-black/40 px-4 py-2 backdrop-blur-sm">
                <p className="text-[11px] font-extrabold tracking-[0.3em] text-white uppercase">Megtekintés</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox ─────────────────────────────────── */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={close}>

          {/* Preload prev + next so they're ready instantly */}
          {prevItem && <link rel="preload" as="image" href={prevItem.src} />}
          {nextItem && <link rel="preload" as="image" href={nextItem.src} />}

          {/* Close */}
          <button type="button" aria-label="Bezárás" onClick={close}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-orange-500 hover:text-orange-400">
            ✕
          </button>

          {/* Prev */}
          <button type="button" aria-label="Előző" onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-14 w-14 items-center justify-center border border-slate-700 bg-slate-900/80 text-3xl text-white transition hover:border-orange-500 hover:bg-slate-800 sm:left-5 select-none">
            ‹
          </button>

          {/* Main panel */}
          <div className="w-full max-w-5xl border border-slate-800 bg-slate-950 p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>

            {/* counter */}
            <div className="mb-3 flex items-center justify-between">
              {!hideCaptions && (
                <p className="text-[10px] font-extrabold tracking-[0.25em] text-orange-400 uppercase">
                  {activeItem.caption || "Referencia kivitelezés"}
                </p>
              )}
              <p className="ml-auto text-[11px] font-bold text-slate-500">
                {(activeIndex ?? 0) + 1}&nbsp;/&nbsp;{images.length}
              </p>
            </div>

            {/* main image with fade */}
            <div className="relative aspect-video bg-slate-900">
              {/* loading shimmer */}
              {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-slate-800" />
              )}
              <Image
                key={activeItem.src}
                src={activeItem.src}
                alt={activeItem.alt || activeItem.caption}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
                onLoad={() => setLoaded(true)}
                className={["object-contain transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0"].join(" ")}
              />
            </div>

            {/* thumbnails */}
            <div className="mt-2 grid grid-cols-8 gap-1 sm:grid-cols-10">
              {images.map((item, index) => (
                <button key={item.id} type="button" onClick={() => openAt(index)}
                  className={["relative aspect-square overflow-hidden transition-all duration-150",
                    index === activeIndex
                      ? "ring-2 ring-orange-500 ring-offset-1 ring-offset-slate-950 opacity-100"
                      : "opacity-35 hover:opacity-80",
                  ].join(" ")}>
                  <Image src={item.src} alt={item.alt || item.caption} fill sizes="60px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Next */}
          <button type="button" aria-label="Következő" onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-14 w-14 items-center justify-center border border-slate-700 bg-slate-900/80 text-3xl text-white transition hover:border-orange-500 hover:bg-slate-800 sm:right-5 select-none">
            ›
          </button>
        </div>
      )}
    </>
  );
}
