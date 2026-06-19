type MediaLoadingOverlayProps = {
  label: string;
  hint?: string;
  compact?: boolean;
};

export function MediaLoadingOverlay({
  label,
  hint,
  compact = false,
}: MediaLoadingOverlayProps) {
  return (
    <div
      className="media-loading-overlay pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-background/75 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={`media-loading-mark ${compact ? "media-loading-mark--compact" : ""}`}
        aria-hidden
      />
      <div className="text-center">
        <p className="font-[family-name:var(--font-syne)] text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/90">
          {label}
        </p>
        {hint ? (
          <p className="mt-1.5 max-w-[16rem] text-[10px] leading-relaxed text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
