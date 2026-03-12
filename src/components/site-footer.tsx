import Link from "next/link";
import Image from "next/image";
import { contactData } from "@/lib/company-data";
import { CookieSettingsButton } from "@/components/cookie-banner";

function FooterLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-white p-1.5 shadow-lg">
        <Image
          src="/logo.png"
          alt="Quality Road Intact Kft logó"
          width={120}
          height={120}
          className="h-full w-full object-contain"
        />
      </div>
      <span className="flex flex-col leading-none">
        <span className="text-[14px] font-black tracking-[0.22em] text-white uppercase">
          Quality Road
        </span>
        <span className="text-[10px] font-bold tracking-[0.35em] text-orange-400 uppercase mt-[3px]">
          Intact Kft
        </span>
      </span>
    </div>
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
            <a href="https://nexuscode.hu" target="_blank" rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 transition">
              <span className="text-[9px] tracking-widest text-slate-700 uppercase transition group-hover:text-slate-500">
                Tervezte &amp; fejlesztette
              </span>
              <span className="border border-slate-800 px-2.5 py-1 text-[9px] font-extrabold tracking-[0.18em] text-slate-600 uppercase transition group-hover:border-orange-500 group-hover:text-orange-400">
                NEXUSCODE.HU
              </span>
            </a>
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
                <div key={person.name}>
                  <p className="text-xs text-slate-500">
                    <span className="font-bold text-slate-300">{person.name}</span>
                    <span className="ml-1">— {person.role}</span>
                  </p>
                  <a
                    href={`tel:${person.phone}`}
                    className="text-lg font-black text-white transition hover:text-orange-400"
                  >
                    {person.phoneDisplay}
                  </a>
                </div>
              ))}
              <a
                href={`mailto:${contactData.email}`}
                className="block text-sm font-semibold text-orange-400 transition hover:text-orange-300"
              >
                {contactData.email}
              </a>
              <p className="text-xs text-slate-600">Hétköznapokon elérhető</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[10px] tracking-widest text-slate-600 uppercase">
            © {new Date().getFullYear()} QUALITY ROAD INTACT KFT — Minden jog fenntartva
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/adatvedelmi-nyilatkozat"
              className="text-[10px] tracking-widest text-slate-600 uppercase transition hover:text-slate-400">
              Adatvédelmi nyilatkozat
            </Link>
            <Link href="/aszf"
              className="text-[10px] tracking-widest text-slate-600 uppercase transition hover:text-slate-400">
              ÁSZF
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
