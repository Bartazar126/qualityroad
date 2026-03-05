"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GalleryItem } from "@/types/site-content";

type Props = {
  images: GalleryItem[];
  hideCaptions?: boolean;
};

export function ShowcaseLightbox({ images, hideCaptions = false }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loaded, setLoaded]           = useState(false);

  const isOpen     = activeIndex !== null;
  const activeItem = isOpen ? images[activeIndex] : null;

  const close    = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setLoaded(false);
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setLoaded(false);
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const open = (i: number) => { setLoaded(false); setActiveIndex(i); };

  /* keyboard */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")       close();
      if (e.key === "ArrowLeft")    showPrev();
      if (e.key === "ArrowRight")   showNext();
    };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", handler); };
  }, [isOpen, close, showPrev, showNext]);

  return (
    <>
      {/* ── Grid ── */}
      <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item, i) => (
          <button key={item.id} type="button" onClick={() => open(i)}
            className="group relative overflow-hidden bg-slate-800 text-left">
            <div className="relative aspect-5/4">
              <Image
                src={item.src.replace("w_1920", "w_800")}
                alt={item.alt || item.caption}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={i < 2 ? "eager" : "lazy"}
                priority={i < 2}
                className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
                <span className="scale-75 rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-extrabold tracking-[0.25em] text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:scale-100 group-hover:opacity-100 uppercase">
                  Megtekintés
                </span>
              </div>
              {!hideCaptions && (
                <p className="absolute bottom-2 left-3 text-[10px] font-bold tracking-widest text-white/60 uppercase group-hover:opacity-0 transition">
                  {item.caption || ""}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {isOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/95" onClick={close}>

          {/* Preload adjacent */}
          {activeIndex !== null && images[(activeIndex + 1) % images.length] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[(activeIndex + 1) % images.length].src} alt="" className="hidden" aria-hidden />
          )}

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6"
            onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-bold text-white/50">
              {activeIndex + 1} / {images.length}
            </span>
            <button type="button" onClick={close} aria-label="Bezárás"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 text-xl">
              ✕
            </button>
          </div>

          {/* Image area — full screen */}
          <div className="flex h-full w-full items-center justify-center px-16 sm:px-24"
            onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl" style={{ maxHeight: "calc(100dvh - 80px)" }}>
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                </div>
              )}
              <Image
                key={activeItem.src}
                src={activeItem.src}
                alt={activeItem.alt || activeItem.caption}
                width={1200}
                height={800}
                priority
                onLoad={() => setLoaded(true)}
                className={[
                  "mx-auto max-h-[calc(100dvh-80px)] w-auto rounded object-contain transition-opacity duration-300",
                  loaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </div>
          </div>

          {/* Prev — left half tap zone */}
          <button type="button" aria-label="Előző" onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-0 top-12 bottom-0 w-16 sm:w-24 flex items-center justify-start pl-2 sm:pl-4 text-white/50 hover:text-white transition group">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl transition group-hover:bg-white/20 select-none">‹</span>
          </button>

          {/* Next — right half tap zone */}
          <button type="button" aria-label="Következő" onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-0 top-12 bottom-0 w-16 sm:w-24 flex items-center justify-end pr-2 sm:pr-4 text-white/50 hover:text-white transition group">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl transition group-hover:bg-white/20 select-none">›</span>
          </button>

        </div>
      )}
    </>
  );
}
