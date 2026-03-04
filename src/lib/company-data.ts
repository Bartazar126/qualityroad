export const introParagraphs = [
  "Cégünk, a QUALITY ROAD INTACT KFT 2018-ban alapított vállalkozás, szakmai tapasztalatunk azonban közel 15 éves múltra tekint vissza.",
  "Fő profilunk út- és autópálya építés. Szolgáltatásaink közé tartozik az útfelújítás, kerékpárút építés, közműépítés utáni út-helyreállítás, valamint az útépítéshez kapcsolódó földmunka, aszfaltozás, szegélyépítés és parkosítás.",
  "Elsődleges célunk ügyfeleink magas szintű kiszolgálása. Üzleti szemléletünk fókuszában a kiváló minőségre törekvés és a precizitás áll.",
  "A kifogástalan minőség biztosításával kívánjuk elnyerni és megtartani jelenlegi és leendő ügyfeleink bizalmát. Munkáink során a megbízhatóságra és korrekt partnerségre törekszünk, amely a hosszú távú együttműködés alapja.",
  "Társaságunk örömmel vállal kihívást jelentő feladatokat is, hogy megrendelőink igényeinek teljes körűen megfeleljünk.",
];

export const referenceList = [
  "Zom Kft - 7173 Zomba, Andor major (szárító telep bekötő út aszfaltozás, 2400 m2)",
  "Wellis Magyarország Zrt - Dabas Mánteleki út (útalap készítés, aszfaltozás, parkoló jelek felfestése, 7000 m2 + süllyesztett szegélykő; bekötő út marása és visszaaszfaltozása, 2800 m2)",
  "Zom Kft - 7173 Zomba, Andor major (gépműhely aszfaltozás és bekötő út kiépítés, 1950 m2)",
  "Berekfürdő - önkormányzati utak aszfaltozása",
  "Umbroll Kft - teljes telephely betonozása, zöldövezet kialakítás, aszfaltozás",
  "Airvent Zrt - telephelyi utak javítása, aszfaltozás, útburkolat szélesítés",
  "Urbán és Úrban Kft - teljes telephely javítása és rakodó felületek aszfaltozása",
  "CASA-TECH Kft - teljes telephely kialakítás (útalap, beton, aszfalt), 3800 m2",
  "Könnyű Mihály (Debrecen) - kamion parkoló aszfaltozás, 2000 m2",
  "SCHENK és TÁRSA Kft - telephely javítás",
  "Ózdi Acélművek Zrt",
];

export const prices = [
  {
    name: "Hengerelt aszfaltozás (kézi bedolgozás)",
    value: "10.000 Ft/m2-től + ÁFA",
    details: "5 cm vastagság, AC-11 aszfaltminőség, komplett kivitelezés",
  },
  {
    name: "Hengerelt aszfaltozás (gépi bedolgozás, finisher)",
    value: "12.000 Ft/m2-től + ÁFA",
    details: "5 cm vastagság, 1-8 tonnás hengeres tömörítéssel",
  },
  {
    name: "Kátyúzás vágással és elszállítással",
    value: "120.000 Ft/tonna-tól + ÁFA",
    details: "Terület feltörésével, AC-11 anyagminőséggel",
  },
  {
    name: "Útépítés mart aszfaltból",
    value: "4.500 Ft/m2-től + ÁFA",
    details: "5 cm vastagság, anyaggal és emulziós locsolással",
  },
  {
    name: "Alapréteg készítése 0/80-as kőből",
    value: "6.000 Ft/m2-től + ÁFA",
    details: "25 cm vastagság, tükörkiszedéssel, anyaggal együtt",
  },
  {
    name: "Kiegyenlítő réteg 0-22 kőzúzalék",
    value: "3.500 Ft/m2-től + ÁFA",
    details: "5 cm vastagság, anyaggal együtt bedolgozva",
  },
  {
    name: "Térbeton készítés",
    value: "28.000 Ft/m2-től + ÁFA",
    details: "Teljes kivitelezéssel, 20 cm vastagságban",
  },
];

export const services = [
  "Út- és autópálya építés",
  "Aszfaltozás kézi és gépi technológiával",
  "Útfelújítás és burkolatjavítás",
  "Kerékpárút építés",
  "Közműépítés utáni út-helyreállítás",
  "Földmunka, szegélyépítés, parkosítás",
];

export const strengths = [
  "Közel 15 év szakmai tapasztalat",
  "Stabil, megbízható kivitelezői háttér",
  "Nagy hangsúly a minőségen és precizitáson",
  "Rugalmas, korrekt partneri hozzáállás",
];

/**
 * Folder-based projects: images are loaded dynamically from
 * public/uploads/<folder> at render time via getProjectFolderImages().
 * Add new entries here whenever a new project folder is created.
 */
export const folderProjects = [
  {
    id: "bmw-beruhazas",
    name: "BMW Beruházás",
    folder: "BMW Beruházás",
    year: "2025–2026",
    summary: "2770 m² útburkolat építés",
    logoSrc: "",
    tags: ["Útburkolat", "Aszfaltozás", "Ipari beruházás"],
  },
  {
    id: "budapest-2025",
    name: "Budapest 2025 Beruházás",
    folder: "Budapest 2025 Beruházás",
    year: "2025",
    summary: "Budapesti útépítési és burkolat-felújítási munkák",
    logoSrc: "",
    tags: ["Útfelújítás", "Budapest", "Aszfaltozás"],
  },
] as const;

export const contactData = {
  companyName: "QUALITY ROAD INTACT KFT",
  companyNameFull: "Quality Road Intact Korlátolt Felelősségű Társaság",
  foundedYear: "2018",
  taxNumber: "26387275-2-13",
  mainActivity: "4211 — Út, autópálya építése",
  address: "2161 Csomád, Kossuth Lajos út 79.",
  /** kept for backwards-compat with existing single-contact displays */
  contactPerson: "Molnár Norbert ügyvezető",
  phone: "+36 70 434 0766",
  phoneDisplay: "06/70-434-07-66",
  contacts: [
    { name: "Molnár Norbert", role: "Ügyvezető" },
    { name: "Botos Lajos",    role: "Kapcsolattartó" },
  ],
};
