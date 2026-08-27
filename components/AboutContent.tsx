"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { useSiteCopy } from "@/components/LocaleProvider";
import { ADVISOR_NAME, CONTACT_EMAIL } from "@/lib/site-copy";

export function AboutContent() {
  const { about, footer } = useSiteCopy();

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
              {about.credits}
            </h2>
            <p>
              {about.authorLabel}: {about.authorName}
              <br />
              {footer.advisorLabel}: {ADVISOR_NAME}
              <br />
              {about.institutionLabel}: {about.institutionName}
              <br />
              {about.programLabel}: {about.programName}
              <br />
              {footer.contactLabel}:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>

            <p>
              {about.communityBefore}{" "}
              <a
                href="https://superspl.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                SuperSplat
              </a>
              {about.communityAfter}
            </p>
          </div>

          <Link
            href="/"
            className="mt-12 inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-sm font-medium text-accent transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            {about.backToScenes}
          </Link>
        </article>
      </main>
    </div>
  );
}
