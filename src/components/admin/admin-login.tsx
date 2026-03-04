"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [logoErr, setLogoErr]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Hiba történt.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">

      {/* Logo / Brand */}
      <div className="mb-10 flex flex-col items-center gap-4">
        {logoErr ? (
          <div className="flex items-center gap-3">
            <span className="block h-8 w-[3px] bg-orange-500" />
            <span className="text-sm font-extrabold tracking-[0.18em] text-white uppercase">
              Quality Road <span className="text-orange-400">Intact</span>
            </span>
          </div>
        ) : (
          <Image
            src="/logo.png"
            alt="Quality Road Intact Kft"
            width={180}
            height={50}
            className="h-12 w-auto object-contain"
            onError={() => setLogoErr(true)}
          />
        )}
        <p className="text-[10px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
          Admin belépés
        </p>
      </div>

      {/* Login card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-slate-800 bg-slate-900 p-8 shadow-2xl"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase"
            >
              Felhasználónév
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-extrabold tracking-[0.2em] text-orange-400 uppercase"
            >
              Jelszó
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 w-full border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white placeholder-slate-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="border border-red-800 bg-red-950/40 px-3 py-2 text-xs font-bold text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 py-3 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Belépés…" : "Belépés"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-[10px] tracking-widest text-slate-700 uppercase">
        Quality Road Intact Kft · Admin
      </p>
    </div>
  );
}
