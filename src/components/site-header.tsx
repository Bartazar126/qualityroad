"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { contactData } from "@/lib/company-data";

const navItems = [
  { href: "/",            label: "Főoldal" },
  { href: "/referenciak", label: "Referenciák" },
  { href: "/araink",      label: "Áraink" },
  { href: "/kapcsolat",   label: "Kapcsolat" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Header bar — sticky, constant height ────────
          The header itself NEVER changes height.
          No children in the page-flow toggle here.
      ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950 border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 py-2"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white shadow-md overflow-hidden">
              <Image
                src="/logo.png"
                alt="Quality Road Intact Kft logó"
                width={160}
                height={160}
                className="h-full w-full object-contain object-center"
                priority
              />
            </div>
            <span className="flex flex-col leading-none" aria-label="Quality Road Intact Kft">
              <span className="text-[14px] font-black tracking-[0.22em] text-white uppercase">
                Quality Road
              </span>
              <span className="text-[10px] font-bold tracking-[0.35em] text-orange-400 uppercase mt-[3px]">
                Intact Kft
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center md:flex" aria-label="Főmenü">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative px-5 py-5 text-[10px] font-extrabold tracking-[0.22em] uppercase transition",
                    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-orange-500",
                    "after:origin-left after:transition-transform after:duration-300",
                    isActive
                      ? "text-orange-400 after:scale-x-100"
                      : "text-slate-400 hover:text-white after:scale-x-0 hover:after:scale-x-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop phone CTA */}
          <a
            href={`tel:${contactData.phone}`}
            className="hidden items-center bg-orange-500 px-5 py-4 text-[10px] font-extrabold tracking-[0.2em] text-white uppercase transition hover:bg-orange-600 md:flex"
          >
            {contactData.phoneDisplay}
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-[44px] w-[44px] items-center justify-center text-white md:hidden"
          >
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>

        </div>
      </header>

      {/* ── Mobile dropdown — fixed, completely outside the header ──
          position: fixed means it has zero impact on page layout.
          top-[52px] matches the header height (32px padding + ~20px text).
          z-index 40 (below the sticky header at 50).
      ──────────────────────────────────────────────────────────── */}
      <div
        className={[
          "fixed inset-x-0 top-[52px] z-40 bg-slate-950 border-b border-slate-800 md:hidden",
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        <nav className="flex flex-col px-4 pb-5 pt-2" aria-label="Mobilmenü">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex min-h-[44px] items-center border-b border-slate-800/60 text-sm font-extrabold tracking-[0.18em] uppercase transition",
                  isActive ? "text-orange-400" : "text-slate-300 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={`tel:${contactData.phone}`}
            onClick={() => setOpen(false)}
            className="mt-4 flex min-h-[44px] items-center justify-center bg-orange-500 px-6 text-sm font-extrabold tracking-widest text-white uppercase hover:bg-orange-600"
          >
            {contactData.phoneDisplay}
          </a>
        </nav>
      </div>
    </>
  );
}
