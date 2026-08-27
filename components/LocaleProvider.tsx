"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/locale";
import { siteCopy, type SiteCopy } from "@/lib/site-copy";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: SiteCopy;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

type LocaleProviderProps = {
  initialLocale?: Locale;
  children: ReactNode;
};

export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocaleState(next);
        persistLocale(next);
      },
      copy: siteCopy[locale],
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useSiteCopy() {
  return useLocale().copy;
}
