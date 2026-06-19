export type SupersplatShowcaseEntry = {
  id: string;
  title: string;
  author: string;
  /** URL pública en superspl.at (formato /s?id=…) */
  supersplatUrl: string;
  thumbnail?: string;
};

/** Orden curado — distinto al listado original del autor. */
export const supersplatShowcase: SupersplatShowcaseEntry[] = [
  {
    id: "ferstel-passage",
    title: "Ferstel Passage",
    author: "Mikolaj Kep",
    supersplatUrl: "https://superspl.at/s?id=642da410",
  },
  {
    id: "mononoke-forest",
    title: "Mononoke Forest",
    author: "studioduckbill",
    supersplatUrl: "https://superspl.at/s?id=23ebe85c",
  },
  {
    id: "cast-museum-amsterdam",
    title: "Cast Museum Amsterdam",
    author: "Matthew Brennan",
    supersplatUrl: "https://superspl.at/s?id=fd7a0b4c",
  },
  {
    id: "collectables-cafe",
    title: "Collectables Cafe",
    author: "EK Haussmann",
    supersplatUrl: "https://superspl.at/s?id=e4bfb4b5",
  },
  {
    id: "milano-painting-academy",
    title: "Milano Painting Academy",
    author: "Mubariz Alizada",
    supersplatUrl: "https://superspl.at/s?id=bda8f156",
  },
  {
    id: "haussmann-apartment",
    title: "HAUSSMANN APARTMENT",
    author: "Stéphane Agullo",
    supersplatUrl: "https://superspl.at/s?id=4de797f4",
  },
  {
    id: "elephant-bird-exhibit",
    title: "Elephant Bird Exhibit",
    author: "Zoltan Pogonyi",
    supersplatUrl: "https://superspl.at/s?id=bd0494af",
  },
  {
    id: "iwate-tsunami-memorial",
    title: "Iwate Tsunami Memorial",
    author: "Patrick Francisco",
    supersplatUrl: "https://superspl.at/s?id=a729e221",
  },
  {
    id: "church-trzesowka",
    title: "Church in Trzesowka, Poland",
    author: "Marcin_Zygmunt",
    supersplatUrl: "https://superspl.at/s?id=49d19bef",
  },
  {
    id: "arti-2026",
    title: "Arti 2026",
    author: "Lodewijk Luijt",
    supersplatUrl: "https://superspl.at/s?id=41475426",
  },
  {
    id: "rue-capponi-lyon",
    title: "Rue Capponi, Lyon",
    author: "Clément Jolivet",
    supersplatUrl: "https://superspl.at/s?id=2ee6eec8",
  },
  {
    id: "m3-gallery",
    title: "M3 Gallery",
    author: "Zoltan Pogonyi",
    supersplatUrl: "https://superspl.at/s?id=c21b8da1",
  },
];

export function buildSupersplatEmbedUrl(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set("noui", "1");
  return parsed.toString();
}

export { getSupersplatThumbnailUrl, resolveShowcaseThumbnail } from "./supersplat-thumbnail";

export function filterShowcase(
  entries: SupersplatShowcaseEntry[],
  query: string,
): SupersplatShowcaseEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;

  return entries.filter((entry) => {
    const haystack = [entry.title, entry.author].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
