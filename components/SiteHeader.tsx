import Image from "next/image";
import Link from "next/link";
import { GitHubLink } from "@/components/GitHubLink";
import { siteCopy } from "@/lib/site-copy";

type SiteHeaderProps = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const { vrDownload } = siteCopy;

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
            href="/#montajes"
            className="hidden text-muted transition-colors hover:text-foreground sm:inline"
          >
            Escenas
          </Link>
          <Link
            href="/#explorar"
            className="text-muted transition-colors hover:text-foreground"
          >
            Explorar
          </Link>
          <Link
            href="/about"
            className="text-muted transition-colors hover:text-foreground"
          >
            Acerca de
          </Link>
          <GitHubLink variant="header" />
          <a
            href={vrDownload.href}
            download
            className="btn-lit hidden items-center rounded-sm px-3 py-1.5 font-[family-name:var(--font-syne)] text-[10px] font-semibold uppercase tracking-wider md:inline-flex"
          >
            Quest APK
          </a>
        </nav>
      </div>
    </header>
  );
}
