"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "sending" | "error";

export function ContactForm() {
  const router = useRouter();
  const [form, setForm]     = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        router.push("/koszonjuk");
      } else {
        setErrorMsg(data.error ?? "Ismeretlen hiba.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Hálózati hiba. Kérjük próbálja újra.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none transition";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] font-extrabold tracking-[0.2em] text-orange-500 uppercase">
            Név <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="pl. Kovács János"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-extrabold tracking-[0.2em] text-orange-500 uppercase">
            Telefonszám
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="pl. 06 30 123 4567"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-extrabold tracking-[0.2em] text-orange-500 uppercase">
          E-mail cím
        </label>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="pl. nev@email.hu"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-extrabold tracking-[0.2em] text-orange-500 uppercase">
          Üzenet <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Írja le röviden, miben segíthetünk — helyszín, méret, munkavégzés jellege..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-orange-500 py-4 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600 disabled:opacity-60"
      >
        {status === "sending" ? "Küldés…" : "Üzenet küldése →"}
      </button>

      <p className="text-[10px] text-slate-400 text-center">
        Az üzenet közvetlenül a Quality Road Intact Kft postaládájába érkezik.
      </p>
    </form>
  );
}
