"use client";

import { useCallback, useEffect, useState } from "react";
import { siteCopy } from "@/lib/site-copy";
import {
  buildSupersplatEmbedUrl,
  supersplatShowcase,
  type SupersplatShowcaseEntry,
} from "@/lib/supersplat-showcase";
import { SplatShowcaseCard } from "./SplatShowcaseCard";
import { WireframePanel } from "./WireframePanel";

export function SplatExplorer() {
  const [selected, setSelected] = useState<SupersplatShowcaseEntry | null>(
    null,
  );
  const [embedBlocked, setEmbedBlocked] = useState(false);

  const closeModal = useCallback(() => {
    setSelected(null);
    setEmbedBlocked(false);
  }, []);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, closeModal]);

  const { explore } = siteCopy.sections;

  return (
    <section id="explorar" className="mb-16 scroll-mt-24">
      <div
        data-reveal-header
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-foreground">
            {explore.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">{explore.subtitle}</p>
        </div>
        <a
          href={explore.supersplatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lit inline-flex shrink-0 items-center justify-center rounded-sm px-5 py-3 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-widest"
        >
          {explore.supersplatButton}
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {supersplatShowcase.map((entry, index) => (
          <SplatShowcaseCard
            key={entry.id}
            entry={entry}
            index={index}
            onSelect={setSelected}
          />
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="splat-modal-title"
        >
          <WireframePanel className="flex h-[min(90dvh,720px)] w-full max-w-5xl flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
              <div>
                <h3
                  id="splat-modal-title"
                  className="font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground"
                >
                  {selected.title}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {explore.attribution.replace("{author}", selected.author)}{" "}
                  <a
                    href="https://superspl.at"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    SuperSplat
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 rounded-sm border border-border px-3 py-1.5 font-[family-name:var(--font-syne)] text-xs uppercase tracking-wider text-muted transition-colors hover:border-accent/40 hover:text-foreground"
              >
                Cerrar
              </button>
            </div>

            <div className="relative min-h-0 flex-1 bg-surface-elevated">
              {!embedBlocked ? (
                <iframe
                  src={buildSupersplatEmbedUrl(selected.supersplatUrl)}
                  title={selected.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                  onError={() => setEmbedBlocked(true)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="max-w-md text-sm text-muted">
                    {explore.embedBlocked}
                  </p>
                  <a
                    href={selected.supersplatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-sm border border-accent/60 px-5 py-2.5 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-background"
                  >
                    {explore.openExternal}
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
              <p className="text-xs text-muted">@{selected.author}</p>
              <a
                href={selected.supersplatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-syne)] text-xs uppercase tracking-wider text-accent hover:underline"
              >
                {explore.openExternal} →
              </a>
            </div>
          </WireframePanel>
        </div>
      )}
    </section>
  );
}
