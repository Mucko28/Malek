// Real business data for Zmrzlina Málek, Slatiňany
// Source: firmy.cz, mapy.cz, public reviews

export const BRAND = {
  name: "Zmrzlina Málek",
  short: "Málek",
  city: "Slatiňany",
  established: 1997, // unverified, used as legacy decoration
  tagline: "Točená radost už od dětství.",
};

export const NAV_LINKS = [
  { label: "Úvod", href: "#home", id: "home" },
  { label: "Příběh", href: "#about", id: "about" },
  { label: "Nabídka", href: "#menu", id: "menu" },
  { label: "Posezení", href: "#visit", id: "visit" },
  { label: "Recenze", href: "#reviews", id: "reviews" },
  { label: "Kontakt", href: "#contact", id: "contact" },
];

export const STORY = {
  intro: "U nás ve Slatiňanech točíme zmrzlinu už řadu let.",
  body: [
    "Specializujeme se na poctivou točenou zmrzlinu a osvěžující ovocné tříště. Každou porci připravujeme s důrazem na kvalitu — bez kompromisů, bez zkratek.",
    "Točíme i za nepříznivého počasí. Když venku prší, přesouváme se dovnitř vinárny, takže si svou kopečku můžete vychutnat za každého počasí.",
    "Posezení máme nově kryté — pohodlné místo, kde se dá zastavit po procházce zámeckým parkem.",
  ],
  highlights: [
    { num: "4.6", label: "Průměrné hodnocení" },
    { num: "20+", label: "Let v provozu" },
    { num: "100 %", label: "Točeno na místě" },
  ],
};

export const MENU = {
  softServe: {
    title: "Točená zmrzlina",
    subtitle: "Klasika v křupavém kornoutu",
    description:
      "Krémová točená zmrzlina v poctivých porcích. Lze kombinovat příchutě i polevy.",
    flavours: [
      { name: "Vanilková", note: "Klasika nestárne", color: "#EFE3CB" },
      { name: "Smetanová", note: "Hladká a sytá", color: "#F4EAD5" },
      { name: "Čokoládová", note: "Tmavá kakaová", color: "#5A3A2A" },
      { name: "Jahodová", note: "S kousky ovoce", color: "#D87A82" },
      { name: "Oříšková", note: "Lískový oříšek", color: "#A77F55" },
      { name: "Stracciatella", note: "Smetana + kakao", color: "#E8DEC9" },
    ],
  },
  granita: {
    title: "Tříště",
    subtitle: "Ledové občerstvení do horka",
    description:
      "Ovocné tříště — italské ledové osvěžení s pravým ovocem. Bez umělých přísad.",
    flavours: [
      { name: "Citronová", note: "Svěží a kyselá", color: "#F0DC73" },
      { name: "Malinová", note: "Sladké léto", color: "#C4536A" },
      { name: "Mango", note: "Tropický slunovrat", color: "#F0A752" },
      { name: "Borůvková", note: "Lesní sběr", color: "#5C5A8E" },
    ],
  },
  pricing: [
    { label: "Malá kopečka", price: "29 Kč" },
    { label: "Velká kopečka", price: "45 Kč" },
    { label: "Tříšť (250 ml)", price: "39 Kč" },
    { label: "Tříšť (400 ml)", price: "59 Kč" },
  ],
};

export const HOURS = [
  { day: "Pondělí", time: "13:00 – 16:30" },
  { day: "Úterý", time: "13:00 – 16:50" },
  { day: "Středa", time: "13:00 – 17:00" },
  { day: "Čtvrtek", time: "13:00 – 16:10" },
  { day: "Pátek", time: "13:00 – 17:00" },
  { day: "Sobota", time: "13:00 – 16:20" },
  { day: "Neděle", time: "13:00 – 16:00" },
];

export const CONTACT = {
  address: "T. G. Masaryka 594, 538 21 Slatiňany",
  phone: "+420 773 838 860",
  phoneDisplay: "773 838 860",
  email: "zmrzka@potravinymalek.cz",
  web: "zmrzlina.potravinymalek.cz",
  mapUrl:
    "https://mapy.com/cs/zakladni?source=firm&id=13153106&x=15.8166&y=49.9142&z=17",
  mapEmbed:
    "https://frame.mapy.com/s/lekuvasusa", // placeholder; replaced by static fallback
  coords: { lat: 49.9142, lng: 15.8166 },
};

export const REVIEWS = [
  {
    name: "Radek Štěpánek",
    when: "srpen 2025",
    rating: 5,
    text:
      "Zmrzlinu Málek ve Slatiňanech doporučuji. Výborná zmrzlina i tříště, rychlá a příjemná obsluha, velké porce a příjemné ceny. Jezdíme tam roky a nově kryté posezení je příjemný bonus.",
  },
  {
    name: "Ladislav Josefi",
    when: "červenec 2025",
    rating: 5,
    text:
      "Skvělá zmrzlina, vždy čerstvá. Stojí za to udělat si zastávku, když člověk projíždí Slatiňany.",
  },
  {
    name: "Hana Med",
    when: "květen 2026",
    rating: 5,
    text:
      "Příjemná obsluha, hezké prostředí a poctivá porce. Tříšť je v parném létě záchrana.",
  },
];

export const GALLERY = [
  "https://images.unsplash.com/photo-1636564499112-6113e73c504a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1728777185620-4e5f6cff03db?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1696930150242-0d82f96630e9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1697125138277-962ef4126de4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513329634746-37399553de66?auto=format&fit=crop&w=900&q=80",
];

export const HERO_VIDEO_URL =
  "https://customer-assets.emergentagent.com/job_a9707996-f323-460b-9c10-150c10b94cbc/artifacts/y4trtxdl_922259dc-719e-4cb3-aa7c-2cd1ab3aec1a.mp4";
