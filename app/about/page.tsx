import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { siteCopy } from "@/lib/site-copy";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "LatticeXR — herramienta VR para prototipado de montajes expositivos por Santiago Viana.",
};

export default function AboutPage() {
  const { about, footer } = siteCopy;

  return (
    <div className="lattice-bg relative flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-20">
        <article className="animate-fade-up">
          <p className="mb-4 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {about.eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Lattice<span className="text-accent">XR</span>
          </h1>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}

            <h2 className="pt-4 font-[family-name:var(--font-syne)] text-xl font-semibold text-foreground">
              Créditos
            </h2>
            <p>
              Autor: Santiago Viana
              <br />
              {footer.advisorLabel}: {footer.advisorName}
              <br />
              Institución: Pontificia Universidad Católica de Chile
              <br />
              Programa: Diseño
              <br />
              Contacto:{" "}
              <a
                href={`mailto:${footer.contactEmail}`}
                className="text-accent hover:underline"
              >
                {footer.contactEmail}
              </a>
            </p>

            <p>
              Las escenas curadas en la galería provienen de la comunidad en{" "}
              <a
                href="https://superspl.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                SuperSplat
              </a>
              . Las escenas propias son exportaciones HTML integradas con el
              patch LatticeXR.
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
