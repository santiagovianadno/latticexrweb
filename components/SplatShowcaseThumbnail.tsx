"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveShowcaseThumbnail } from "@/lib/supersplat-thumbnail";
import type { SupersplatShowcaseEntry } from "@/lib/supersplat-showcase";

type SplatShowcaseThumbnailProps = {
  entry: SupersplatShowcaseEntry;
  priority?: boolean;
};

export function SplatShowcaseThumbnail({
  entry,
  priority = false,
}: SplatShowcaseThumbnailProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = resolveShowcaseThumbnail(entry);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
        <span className="font-[family-name:var(--font-syne)] text-[10px] font-semibold uppercase tracking-[0.25em] text-muted/60">
          splat mesh
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-surface-elevated"
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-90 group-hover:opacity-100" : "opacity-0"
        }`}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
