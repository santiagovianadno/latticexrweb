import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SceneGrid } from "@/components/SceneGrid";

export default function Home() {
  return (
    <div className="lattice-bg relative flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-20">
        <section className="mb-16 max-w-2xl animate-fade-up">
          <p className="mb-4 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Proyecto de Título de Diseño UC
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-7xl">
            Lattice<span className="text-accent">XR</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
            Visor web y móvil de espacios interiores reconstruidos con Gaussian
            Splatting. Navega las escenas con WASD y explora la arquitectura
            desde cualquier dispositivo.
          </p>
          <p className="mt-4 text-sm text-muted">
            Santiago Viana ·{" "}
            <Link
              href="/about"
              className="text-accent underline-offset-4 transition-colors hover:underline"
            >
              Sobre el proyecto
            </Link>
          </p>
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-foreground">
              Escenas
            </h2>
            <span className="text-sm text-muted">
              Selecciona un espacio para entrar
            </span>
          </div>
          <SceneGrid />
        </section>
      </main>

      <footer className="relative z-10 border-t border-border px-6 py-8 text-center text-sm text-muted">
        LatticeXR · Santiago Viana · Diseño UC · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
