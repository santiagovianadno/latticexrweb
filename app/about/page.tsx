import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "LatticeXR — Proyecto de Título de Diseño UC por Santiago Viana.",
};

export default function AboutPage() {
  return (
    <div className="lattice-bg relative flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-20">
        <article className="animate-fade-up">
          <p className="mb-4 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Acerca del proyecto
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            LatticeXR
          </h1>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted">
            <p>
              <strong className="text-foreground">LatticeXR</strong> es el
              proyecto de título de{" "}
              <strong className="text-foreground">Santiago Viana</strong> para
              la carrera de Diseño de la{" "}
              <strong className="text-foreground">
                Pontificia Universidad Católica de Chile
              </strong>
              . El proyecto explora la reconstrucción y navegación de espacios
              interiores mediante Gaussian Splatting, ofreciendo una experiencia
              inmersiva accesible desde navegador web y dispositivos móviles.
            </p>

            <p>
              Cada escena es una exportación HTML generada en{" "}
              <a
                href="https://superspl.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                SuperSplat
              </a>
              , integrada en este visor como catálogo navegable.
            </p>

            <h2 className="pt-4 font-[family-name:var(--font-syne)] text-xl font-semibold text-foreground">
              Cómo navegar
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong className="text-foreground">Escritorio:</strong> usa{" "}
                <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground">
                  W A S D
                </kbd>{" "}
                para caminar a altura de cabeza, y el mouse para mirar alrededor.
                El movimiento vertical con Q/E está desactivado.
              </li>
              <li>
                <strong className="text-foreground">Móvil:</strong> arrastra
                para rotar la vista y usa el joystick táctil para moverte.
              </li>
              <li>
                Los límites del espacio interior se calculan automáticamente
                desde la escena. Puedes afinarlos en{" "}
                <code className="text-accent">lattice-config.json</code> de cada
                escena.
              </li>
            </ul>

            <h2 className="pt-4 font-[family-name:var(--font-syne)] text-xl font-semibold text-foreground">
              Créditos
            </h2>
            <p>
              Autor: Santiago Viana
              <br />
              Institución: Pontificia Universidad Católica de Chile
              <br />
              Programa: Diseño — Proyecto de Título
            </p>
          </div>

          <Link
            href="/"
            className="mt-12 inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-sm font-medium text-accent transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            Volver a las escenas
          </Link>
        </article>
      </main>
    </div>
  );
}
