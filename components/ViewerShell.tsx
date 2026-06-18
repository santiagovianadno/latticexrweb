"use client";

import Link from "next/link";
import { useState } from "react";
import type { Scene } from "@/lib/scenes";

type ViewerShellProps = {
  scene: Scene;
};

export function ViewerShell({ scene }: ViewerShellProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-background">
          <div className="h-8 w-8 animate-pulse-glow rounded-full border-2 border-accent border-t-transparent" />
          <p className="font-[family-name:var(--font-syne)] text-sm text-muted">
            Cargando escena…
          </p>
        </div>
      )}

      <iframe
        src={scene.htmlPath}
        title={scene.title}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
        onLoad={() => setIsLoading(false)}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-foreground backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          Volver
        </Link>
        <div className="pointer-events-none rounded-full border border-border bg-background/80 px-4 py-2 backdrop-blur-md">
          <span className="font-[family-name:var(--font-syne)] text-sm font-medium text-foreground">
            {scene.title}
          </span>
        </div>
      </div>
    </div>
  );
}
