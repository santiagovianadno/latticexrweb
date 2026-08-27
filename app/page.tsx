import { SiteHeader } from "@/components/SiteHeader";
import { HeroPitch } from "@/components/HeroPitch";
import { SceneGrid } from "@/components/SceneGrid";
import { SectionReveal } from "@/components/SectionReveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SplatExplorer } from "@/components/SplatExplorer";
import { VrDownloadBanner } from "@/components/VrDownloadBanner";
import { buildScenePreviewUrl } from "@/lib/scene-preview-pool";
import { scenes } from "@/lib/scenes";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {scenes.map((scene) => (
        <link
          key={scene.slug}
          rel="prefetch"
          href={buildScenePreviewUrl(scene.htmlPath, scene.slug)}
        />
      ))}
      <div className="relative">
        <SiteHeader overlay />
        <HeroPitch />
      </div>

      <main className="content-after-hero relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-12 md:py-20">
        <section id="scenes" className="mb-16 scroll-mt-24">
          <SectionReveal staggerSelector="[data-reveal-item]">
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

      <SiteFooter />
    </div>
  );
}
