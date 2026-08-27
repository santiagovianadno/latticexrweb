"use client";

import { useSiteCopy } from "@/components/LocaleProvider";
import { scenes } from "@/lib/scenes";
import { SceneCard } from "./SceneCard";

export function SceneGrid() {
  const { sections } = useSiteCopy();

  if (scenes.length === 0) {
    return <p className="text-muted">{sections.emptyScenes}</p>;
  }

  return (
    <>
      <div
        data-reveal-header
        className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <h2 className="font-[family-name:var(--font-aldrich)] text-2xl uppercase tracking-wide text-foreground">
          {sections.latticeScenes.title}
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {scenes.map((scene, index) => (
          <SceneCard key={scene.slug} scene={scene} index={index} />
        ))}
      </div>
    </>
  );
}
