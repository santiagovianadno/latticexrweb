"use client";

import { useLocale } from "@/components/LocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale, copy } = useLocale();

  return (
    <div
      role="group"
      aria-label={copy.nav.language}
      className="flex items-center gap-1 font-[family-name:var(--font-syne)] text-[10px] font-semibold uppercase tracking-wider"
    >
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
        className={`transition-colors ${
          locale === "en"
            ? "text-foreground"
            : "text-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
      <span className="text-muted/50" aria-hidden>
        /
      </span>
      <button
        type="button"
        aria-pressed={locale === "es"}
        onClick={() => setLocale("es")}
        className={`transition-colors ${
          locale === "es"
            ? "text-foreground"
            : "text-muted hover:text-foreground"
        }`}
      >
        ES
      </button>
    </div>
  );
}
