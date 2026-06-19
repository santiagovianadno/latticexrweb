import { siteCopy } from "@/lib/site-copy";
import { WireframePanel } from "./WireframePanel";

export function VrDownloadBanner() {
  const { vrDownload } = siteCopy;

  return (
    <section id="descargar-vr" className="mb-16 scroll-mt-24">
      <WireframePanel
        data-reveal-header
        className="lattice-bg-dense flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8"
      >
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-foreground">
            {vrDownload.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            {vrDownload.description}
          </p>
        </div>
        <a
          href={vrDownload.href}
          download
          className="inline-flex shrink-0 items-center justify-center rounded-sm border border-accent/60 bg-transparent px-6 py-3 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-background"
        >
          {vrDownload.button}
        </a>
      </WireframePanel>
    </section>
  );
}
