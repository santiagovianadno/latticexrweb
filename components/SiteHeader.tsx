"use client";

import Image from "next/image";
import Link from "next/link";
import { GitHubLink } from "@/components/GitHubLink";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useSiteCopy } from "@/components/LocaleProvider";
import { APK_HREF } from "@/lib/site-copy";

type SiteHeaderProps = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const { nav } = useSiteCopy();

  return (
    <header
      className={`relative z-10 ${overlay ? "site-header-overlay" : ""}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/logo-hero.svg"
            alt="LatticeXR"
            width={48}
            height={25}
            priority={overlay}
            className="h-5 w-auto object-contain md:h-6"
          />
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          <Link
            href="/#scenes"
            className="hidden text-muted transition-colors hover:text-foreground sm:inline"
          >
            {nav.scenes}
          </Link>
          <Link
            href="/#explore"
            className="text-muted transition-colors hover:text-foreground"
          >
            {nav.explore}
          </Link>
          <Link
            href="/about"
            className="text-muted transition-colors hover:text-foreground"
          >
            {nav.about}
          </Link>
          <LanguageToggle />
          <GitHubLink variant="header" />
          <a
            href={APK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lit hidden items-center rounded-sm px-3 py-1.5 font-[family-name:var(--font-syne)] text-[10px] font-semibold uppercase tracking-wider md:inline-flex"
          >
            Quest APK
          </a>
        </nav>
      </div>
    </header>
  );
}
