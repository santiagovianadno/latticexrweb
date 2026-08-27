export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "latticexr-locale";

export function parseLocale(value?: string | null): Locale {
  return value === "es" || value === "en" ? value : DEFAULT_LOCALE;
}
