import type { Metadata } from "next";
import Link from "next/link";
import { contactData } from "@/lib/company-data";

export const metadata: Metadata = {
  title: "Adatvédelmi nyilatkozat | Quality Road Intact Kft",
  description: "A Quality Road Intact Kft adatvédelmi és cookie tájékoztatója.",
  robots: { index: true, follow: false },
};

const sections = [
  {
    title: "1. Az adatkezelő adatai",
    content: null,
    table: [
      { label: "Cégnév",       value: "Quality Road Intact Kft" },
      { label: "Székhely",     value: contactData.address },
      { label: "Adószám",      value: contactData.taxNumber },
      { label: "E-mail",       value: contactData.email },
      { label: "Telefon",      value: contactData.phoneDisplay },
    ],
  },
  {
    title: "2. Kezelt személyes adatok és céljuk",
    content: `A weboldal kapcsolatfelvételi űrlapján keresztül a következő személyes adatokat kezeljük:

• Név (kötelező) — az érdeklődő azonosítása és megszólítása céljából
• E-mail cím (opcionális) — visszajelzés küldéséhez
• Telefonszám (opcionális) — telefonos visszahívás céljából
• Üzenet szövege — az ajánlatkérés tartalmának megismeréséhez

Az adatokat kizárólag az Ön megkeresésének megválaszolásához, ajánlat elkészítéséhez és kapcsolattartáshoz használjuk fel.`,
    table: null,
  },
  {
    title: "3. Az adatkezelés jogalapja",
    content: `Az adatkezelés jogalapja az Ön önkéntes hozzájárulása (GDPR 6. cikk (1) bek. a) pont), amelyet az űrlap elküldésével ad meg. Az ajánlatkérés esetén az adatkezelés szükséges a szerződéskötést megelőző lépések megtételéhez (GDPR 6. cikk (1) bek. b) pont).`,
    table: null,
  },
  {
    title: "4. Adatok tárolása és megőrzési idő",
    content: `A beérkezett üzeneteket legfeljebb 2 évig őrizzük meg, majd töröljük. Amennyiben üzleti kapcsolat jön létre, a kapcsolódó adatokat a jogszabályi előírásoknak megfelelően (számviteli törvény: 8 év) tároljuk.`,
    table: null,
  },
  {
    title: "5. Adattovábbítás, adatfeldolgozók",
    content: `Személyes adatait harmadik félnek nem adjuk át, nem értékesítjük. Az alábbi adatfeldolgozókat vesszük igénybe:

• Vercel Inc. (USA) — webtárhely szolgáltató; az adattovábbítás az EU–USA adatvédelmi keret alapján történik.
• Google LLC — amennyiben Google Analytics / Google Ads követési kód van beállítva az oldalon; lásd: Google adatvédelmi irányelvek.`,
    table: null,
  },
  {
    title: "6. Sütik (cookie-k)",
    content: `A weboldal az alábbi sütiket használhatja:

• Munkamenet sütik (szükséges) — az oldal működéséhez elengedhetetlen, személyes adatot nem tartalmaznak. Böngészőablak bezárásakor törlődnek.

• Analitikai / hirdetési sütik (Google Analytics, Google Ads) — csak az Ön hozzájárulása esetén kerülnek alkalmazásra. A sütikezelő felugró ablakban bármikor visszavonhatja hozzájárulását.

Az analitikai sütik célja: a weboldal forgalmának mérése, a hirdetések hatékonyságának követése. Az adatokat anonim, összesített formában dolgozzuk fel.`,
    table: null,
  },
  {
    title: "7. Az érintett jogai",
    content: `A GDPR alapján Ön jogosult:

• Hozzáférési jog — tájékoztatást kérhet a kezelt adatairól.
• Helyesbítési jog — kérheti a pontatlan adatok javítását.
• Törlési jog — kérheti adatai törlését, ha az adatkezelés jogalapja megszűnt.
• Adathordozhatóság joga — kérheti adatait géppel olvasható formátumban.
• Tiltakozás joga — tiltakozhat az adatkezelés ellen.

Jogai gyakorlásához írjon az alábbi e-mail címre: ${contactData.email}`,
    table: null,
  },
  {
    title: "8. Panaszjog",
    content: `Ha úgy véli, hogy adatkezelésünk sérti a GDPR rendelkezéseit, panaszt nyújthat be a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH):

• Honlap: naih.hu
• Cím: 1055 Budapest, Falk Miksa utca 9–11.
• E-mail: ugyfelszolgalat@naih.hu`,
    table: null,
  },
  {
    title: "9. Módosítások",
    content: `Fenntartjuk a jogot jelen tájékoztató módosítására. A módosítások hatályba lépéséről az oldalon tájékoztatjuk látogatóinkat. Utolsó módosítás: 2025. január.`,
    table: null,
  },
];

export default function AdatvedelmiPage() {
  return (
    <div>
      <div className="bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">Jogi információk</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Adatvédelmi nyilatkozat</h1>
          <p className="mt-4 text-sm text-slate-400">
            Quality Road Intact Kft — hatályos: 2025. január 1-től
          </p>
        </div>
        <div className="road-stripe" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="border-l-2 border-orange-500 pl-6">
              <h2 className="text-lg font-black text-slate-900">{section.title}</h2>

              {section.table && (
                <div className="mt-4 divide-y divide-slate-100 border border-slate-200 bg-white">
                  {section.table.map(({ label, value }) => (
                    <div key={label} className="flex flex-wrap gap-4 px-5 py-3 text-sm">
                      <span className="w-32 shrink-0 font-semibold text-slate-500">{label}</span>
                      <span className="text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.content && (
                <p className="mt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link href="/"
            className="text-sm font-bold text-orange-500 uppercase tracking-widest hover:text-orange-700 transition">
            ← Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  );
}
