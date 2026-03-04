import Link from "next/link";
import Image from "next/image";
import { contactData } from "@/lib/company-data";
import { existsSync } from "node:fs";
import path from "node:path";

function FooterLogo() {
  const hasLogo = existsSync(path.join(process.cwd(), "public", "logo.png"));
  if (hasLogo) {
    return (
      <Image
        src="/logo.png"
        alt="Quality Road Intact Kft"
        width={160}
        height={44}
        className="h-10 w-auto object-contain"
      />
    );
  }
  return (
    <>
      <span className="block h-8 w-[3px] bg-orange-500" />
      <span className="text-sm font-extrabold tracking-[0.18em] uppercase">
        Quality Road <span className="text-orange-400">Intact Kft</span>
      </span>
    </>
  );
}

const navLinks = [
  { href: "/",            label: "Főoldal" },
  { href: "/referenciak", label: "Referenciák" },
  { href: "/araink",      label: "Áraink" },
  { href: "/kapcsolat",   label: "Kapcsolat" },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="road-stripe" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-start gap-3">
              <FooterLogo />
            </div>
            <p className="mt-5 max-w-xs text-sm text-slate-400 leading-relaxed">
              &quot;Az út amely a jövőbe vezet a közös sikereinkért&quot;
            </p>
              <p className="mt-3 text-xs text-slate-600 tracking-wider">
              QUALITY ROAD INTACT KFT · Alapítva {contactData.foundedYear}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {contactData.address}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">
              Navigáció
            </p>
            <ul className="mt-5 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white hover:pl-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.28em] text-orange-400 uppercase">
              Elérhetőség
            </p>
            <div className="mt-5 space-y-3">
              {contactData.contacts.map((person) => (
                <p key={person.name} className="text-sm text-slate-300">
                  <span className="font-bold">{person.name}</span>
                  <span className="ml-2 text-slate-500">— {person.role}</span>
                </p>
              ))}
              <a
                href={`tel:${contactData.phone}`}
                className="block text-2xl font-black text-white transition hover:text-orange-400"
              >
                {contactData.phoneDisplay}
              </a>
              <p className="text-xs text-slate-600">Hétköznapokon elérhető</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[10px] tracking-widest text-slate-600 uppercase">
            © {new Date().getFullYear()} QUALITY ROAD INTACT KFT — Minden jog fenntartva
          </p>
          <p className="text-[10px] tracking-widest text-slate-600 uppercase">
            Designed by NEXUSCODE
          </p>
        </div>
      </div>
    </footer>
  );
}
