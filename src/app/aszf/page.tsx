import type { Metadata } from "next";
import { contactData } from "@/lib/company-data";

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek | Quality Road Intact Kft",
  description: "A Quality Road Intact Kft. szolgáltatásainak igénybevételére vonatkozó Általános Szerződési Feltételek.",
};

export default function ASZFPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* ── Hero header ─────────────────────────────────── */}
      <div className="bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-extrabold tracking-[0.3em] text-orange-400 uppercase">
            Jogi információk
          </p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
            Általános Szerződési Feltételek
          </h1>
          <p className="mt-4 text-sm text-slate-400">
            Hatályos: {currentYear}. január 1-től visszavonásig
          </p>
        </div>
        <div className="road-stripe" />
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-500 prose-strong:text-slate-800">
          
          <p>
            Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) tartalmazzák a <strong>{contactData.companyNameFull}</strong> (továbbiakban: Szolgáltató) 
            által nyújtott útépítési és aszfaltozási szolgáltatások igénybevételének feltételeit.
          </p>

          <h2>1. A Szolgáltató adatai</h2>
          <ul className="list-none pl-0 space-y-1">
            <li><strong>Cégnév:</strong> {contactData.companyNameFull}</li>
            <li><strong>Székhely:</strong> {contactData.address}</li>
            <li><strong>Adószám:</strong> {contactData.taxNumber}</li>
            <li><strong>E-mail:</strong> {contactData.email}</li>
            <li><strong>Telefon:</strong> {contactData.contacts[0].phoneDisplay}</li>
          </ul>

          <h2>2. A szolgáltatás tárgya</h2>
          <p>
            A Szolgáltató útépítési, aszfaltozási, kátyúzási és kapcsolódó mélyépítési munkálatokat végez megrendelői részére. 
            A weboldalon feltüntetett információk és árak tájékoztató jellegűek, nem minősülnek közvetlen ajánlattételnek.
          </p>

          <h2>3. Ajánlatkérés és szerződéskötés</h2>
          <p>
            Az Ügyfél a weboldalon található űrlapon, e-mailben vagy telefonon keresztül kérhet ajánlatot. 
            Az ajánlatkérés nem jár kötelezettséggel. A Szolgáltató minden esetben egyedi, írásos árajánlatot készít, 
            amely tartalmazza a munka műszaki tartalmát, a vállalási árat és a várható kivitelezési határidőt.
          </p>
          <p>
            A szerződés a felek között az egyedi árajánlat Ügyfél általi írásos (e-mail) elfogadásával, vagy külön Vállalkozási Szerződés aláírásával jön létre.
          </p>

          <h2>4. Fizetési feltételek</h2>
          <p>
            A munkavégzés ellenértékének megfizetése az egyedi megállapodás szerint történhet készpénzben vagy banki átutalással, a kiállított számla alapján. 
            Nagyobb volumenű munkák esetén a Szolgáltató jogosult előleget kérni, melynek mértékét az árajánlat tartalmazza.
          </p>

          <h2>5. Garancia (Jótállás)</h2>
          <p>
            A Szolgáltató az elvégzett munkákra a jogszabályban előírt, illetve az egyedi szerződésben vállalt garanciát (jótállást) biztosítja. 
            A garancia nem terjed ki a rendeltetésellenes használatból, elemi kárból vagy külső fizikai behatásból származó sérülésekre.
          </p>

          <h2>6. Panaszkezelés</h2>
          <p>
            Az Ügyfél kifogásaival a Szolgáltató fenti elérhetőségein élhet. A Szolgáltató törekszik a vitás kérdések békés úton történő rendezésére. 
            Amennyiben ez nem vezet eredményre, a felek a hatályos magyar jogszabályok szerinti eljárást alkalmazzák.
          </p>

          <h2>7. Vegyes rendelkezések</h2>
          <p>
            Jelen ÁSZF-ben nem szabályozott kérdésekben a Polgári Törvénykönyv (Ptk.) és a vonatkozó magyar jogszabályok rendelkezései az irányadók.
          </p>

          <hr className="my-10 border-slate-200" />
          
          <div className="bg-slate-50 p-6 border border-slate-200 rounded text-sm text-slate-500">
            <p className="font-bold text-slate-900 mb-2">További kérdése van?</p>
            <p>
              Keressen minket bizalommal a <a href={`tel:${contactData.contacts[0].phone}`} className="font-bold text-orange-600">{contactData.contacts[0].phoneDisplay}</a> telefonszámon 
              vagy a <a href={`mailto:${contactData.email}`} className="font-bold text-orange-600">{contactData.email}</a> e-mail címen.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
