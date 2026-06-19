"use client";

import type { SupersplatShowcaseEntry } from "@/lib/supersplat-showcase";
import { SplatShowcaseThumbnail } from "./SplatShowcaseThumbnail";

type SplatShowcaseCardProps = {
  entry: SupersplatShowcaseEntry;
  index: number;
  onSelect: (entry: SupersplatShowcaseEntry) => void;
};

export function SplatShowcaseCard({
  entry,
  index,
  onSelect,
}: SplatShowcaseCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="wireframe-panel group w-full overflow-hidden text-left transition-colors hover:border-accent/30 hover:bg-surface-elevated"
      data-reveal-item
    >
      <div className="wireframe-thumb relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        <SplatShowcaseThumbnail entry={entry} priority={index < 4} />
        <span className="absolute right-2 top-2 z-10 rounded-sm border border-border bg-background/80 px-2 py-0.5 font-[family-name:var(--font-syne)] text-[9px] font-semibold uppercase tracking-wider text-muted backdrop-blur-sm">
          superspl.at
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-[family-name:var(--font-syne)] text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
          {entry.title}
        </h3>
        <p className="mt-1 text-xs text-muted">@{entry.author}</p>
      </div>
    </button>
  );
}
