"use client";

import { useState, useRef } from "react";

interface DropZoneProps {
  onUpload: (srcs: string[]) => void;
  folder?: string;
  multiple?: boolean;
  label?: string;
  compact?: boolean;
}

export function DropZone({
  onUpload,
  folder = "",
  multiple = true,
  label,
  compact = false,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Átméretezi és tömöríti a képet Canvas API-val feltöltés előtt */
  const compressImage = (file: File): Promise<Blob> =>
    new Promise((resolve) => {
      const MAX = 1920;
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width >= height) { height = Math.round((height * MAX) / width); width = MAX; }
          else                 { width  = Math.round((width  * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob ?? file),
          "image/jpeg",
          0.85,
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    setError(null);

    const srcs: string[] = [];
    const failed: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      try {
        const compressed = await compressImage(file);

        const fd = new FormData();
        fd.append("file", compressed, file.name.replace(/\.[^.]+$/, ".jpg"));
        const url = `/api/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ""}`;

        const res = await fetch(url, { method: "POST", body: fd, signal: AbortSignal.timeout(55_000) });
        const data = (await res.json()) as { src?: string; error?: string };

        if (data.src) {
          srcs.push(data.src);
        } else {
          failed.push(file.name);
          console.error("upload error:", data.error);
        }
      } catch (e) {
        failed.push(file.name);
        console.error("upload network error", e);
      }

      setProgress(Math.round(((i + 1) / imageFiles.length) * 100));
    }

    setUploading(false);
    setProgress(0);

    if (srcs.length > 0) onUpload(srcs);

    if (failed.length > 0) {
      setError(
        failed.length === imageFiles.length
          ? "Minden kép feltöltése sikertelen — ellenőrizd a hálózatot."
          : `${srcs.length}/${imageFiles.length} kép feltöltve. Sikertelen: ${failed.join(", ")}`,
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Képfeltöltő zóna"
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={[
        "cursor-pointer select-none border-2 border-dashed transition-all",
        dragging
          ? "border-orange-500 bg-orange-500/10"
          : "border-slate-600 hover:border-orange-400 hover:bg-slate-800/40",
        compact ? "p-4" : "p-10",
        "flex flex-col items-center justify-center gap-2 text-center",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          uploadFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      {uploading ? (
        <div className="w-full max-w-xs">
          <p className="text-sm text-slate-400">Feltöltés… {progress}%</p>
          <div className="mt-2 h-1.5 w-full rounded bg-slate-700">
            <div
              className="h-1.5 rounded bg-orange-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : error ? (
        <div className="w-full text-center">
          <p className="text-sm font-bold text-red-400">⚠ {error}</p>
          <p className="mt-1 text-xs text-slate-500">Kattints az újrapróbáláshoz</p>
        </div>
      ) : (
        <>
          <span className="text-3xl" aria-hidden="true">
            {dragging ? "📂" : "📁"}
          </span>
          <p className="text-sm text-slate-400">
            {label ?? (multiple ? "Húzd ide a képeket, vagy kattints a tallózáshoz" : "Húzd ide a képet, vagy kattints")}
          </p>
          <p className="text-xs text-slate-600">JPG · PNG · WEBP</p>
        </>
      )}
    </div>
  );
}
