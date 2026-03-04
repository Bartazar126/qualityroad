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

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    setError(null);
    const srcs: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      try {
        const fd = new FormData();
        fd.append("file", imageFiles[i]);
        const url = `/api/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ""}`;
        const res = await fetch(url, { method: "POST", body: fd });
        const data = (await res.json()) as { src?: string; error?: string };
        if (data.src) {
          srcs.push(data.src);
        } else {
          setError(data.error ?? "Ismeretlen feltöltési hiba");
        }
      } catch (e) {
        console.error("upload error", e);
        setError("Hálózati hiba a feltöltéskor");
      }
      setProgress(Math.round(((i + 1) / imageFiles.length) * 100));
    }

    setUploading(false);
    setProgress(0);
    if (srcs.length > 0) onUpload(srcs);
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
