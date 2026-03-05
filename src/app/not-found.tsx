import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Az oldal nem található | Quality Road Intact Kft",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-xl bg-white p-2 shadow-lg">
          <Image
            src="/logo.png"
            alt="Quality Road Intact Kft"
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>

        {/* 404 */}
        <p className="text-[9rem] font-black leading-none text-slate-800 select-none">404</p>

        <p className="text-[11px] font-extrabold tracking-[0.28em] text-orange-400 uppercase -mt-4">
          Az oldal nem található
        </p>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
          Erre nem vezet út...
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
          A keresett oldal nem létezik, vagy áthelyezésre került.
          Visszavezetjük a főoldalra!
        </p>

        <div className="mx-auto my-8 h-px w-24 bg-slate-800" />

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/"
            className="bg-orange-500 px-8 py-3.5 text-sm font-extrabold tracking-widest text-white uppercase transition hover:bg-orange-600">
            Főoldal
          </Link>
          <Link href="/kapcsolat"
            className="border border-slate-700 px-8 py-3.5 text-sm font-bold tracking-widest text-slate-300 uppercase transition hover:border-slate-500 hover:text-white">
            Kapcsolat
          </Link>
        </div>

      </div>
    </div>
  );
}
