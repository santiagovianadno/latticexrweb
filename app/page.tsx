import { SiteHeader } from "@/components/SiteHeader";
import { GitHubLink } from "@/components/GitHubLink";
import { HeroPitch } from "@/components/HeroPitch";
import { SceneGrid } from "@/components/SceneGrid";
import { SectionReveal } from "@/components/SectionReveal";
import { SplatExplorer } from "@/components/SplatExplorer";
import { VrDownloadBanner } from "@/components/VrDownloadBanner";
import { siteCopy } from "@/lib/site-copy";

export default function Home() {
  const { sections, footer } = siteCopy;

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="relative">
        <SiteHeader overlay />
        <HeroPitch />
      </div>

      <main className="content-after-hero relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-20">
        <section id="montajes" className="mb-16 scroll-mt-24">
          <SectionReveal staggerSelector="[data-reveal-item]">
            <div
              data-reveal-header
              className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <h2 className="font-[family-name:var(--font-aldrich)] text-2xl uppercase tracking-wide text-foreground">
                  {sections.latticeScenes.title}
                </h2>
              </div>
            </div>
            <SceneGrid />
          </SectionReveal>
        </section>

        <SectionReveal staggerSelector="[data-reveal-item]">
          <SplatExplorer />
        </SectionReveal>

        <SectionReveal>
          <VrDownloadBanner />
        </SectionReveal>
      </main>

      <footer className="relative z-10 border-t border-border bg-background px-6 py-10 text-center">
        <div className="mb-6 flex justify-center">
          <GitHubLink variant="footer" />
        </div>
        <p className="text-sm text-muted">{footer.line}</p>
        <p className="mt-2 text-xs text-muted">
          {footer.advisorLabel}: {footer.advisorName}
        </p>
        <p className="mt-3 text-sm">
          <a
            href={`mailto:${footer.contactEmail}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {footer.contactLabel}: {footer.contactEmail}
          </a>
        </p>
      </footer>
    </div>
  );
}
