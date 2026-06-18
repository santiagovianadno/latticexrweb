import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
        >
          Lattice<span className="text-accent">XR</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted transition-colors hover:text-foreground"
          >
            Escenas
          </Link>
          <Link
            href="/about"
            className="text-muted transition-colors hover:text-foreground"
          >
            Acerca de
          </Link>
        </nav>
      </div>
    </header>
  );
}
