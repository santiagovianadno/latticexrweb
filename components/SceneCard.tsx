"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Scene } from "@/lib/scenes";
import {
  attachPreviewToContainer,
  isScenePreviewReady,
  onScenePreviewReady,
} from "@/lib/scene-preview-pool";

type SceneCardProps = {
  scene: Scene;
  index: number;
};

export function SceneCard({ scene, index }: SceneCardProps) {
  const [canHoverPreview, setCanHoverPreview] = useState(false);
  const [previewReady, setPreviewReady] = useState(() =>
    isScenePreviewReady(scene.slug),
  );
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const useVideo = Boolean(scene.previewVideo);

  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)",
    );
    const update = () => setCanHoverPreview(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (useVideo) return;

    const container = previewContainerRef.current;
    if (!container) return;

    const iframe = attachPreviewToContainer(
      scene.slug,
      scene.htmlPath,
      container,
      previewReady,
    );
    previewIframeRef.current = iframe;

    return () => {
      if (previewIframeRef.current?.parentElement === container) {
        container.removeChild(previewIframeRef.current);
      }
    };
  }, [scene.slug, scene.htmlPath, useVideo]);

  useEffect(() => {
    if (useVideo) return;
    return onScenePreviewReady(scene.slug, () => setPreviewReady(true));
  }, [scene.slug, useVideo]);

  useEffect(() => {
    const iframe = previewIframeRef.current;
    if (!iframe) return;
    iframe.className = `scene-card-preview-frame pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
      previewReady ? "opacity-100" : "opacity-0"
    }`;
  }, [previewReady]);

  const postToPreview = useCallback((type: string) => {
    previewIframeRef.current?.contentWindow?.postMessage({ type }, "*");
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (useVideo) {
      videoRef.current?.play().catch(() => {});
      return;
    }
    if (canHoverPreview && previewReady) {
      postToPreview("latticexr-preview-play");
    }
  }, [canHoverPreview, previewReady, postToPreview, useVideo]);

  const handleMouseLeave = useCallback(() => {
    if (useVideo) {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      return;
    }
    if (canHoverPreview && previewReady) {
      postToPreview("latticexr-preview-pause");
    }
  }, [canHoverPreview, previewReady, postToPreview, useVideo]);

  return (
    <article
      className="wireframe-panel group overflow-hidden transition-all duration-300 hover:border-accent/30 hover:bg-surface-elevated"
      data-reveal-item
      style={{ animationDelay: `${index * 100 + 200}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="scene-card-preview relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        {useVideo && scene.previewVideo ? (
          <video
            ref={videoRef}
            src={scene.previewVideo}
            poster={scene.poster}
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            onLoadedData={(event) => {
              event.currentTarget.pause();
            }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scene.poster}
              alt={scene.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                previewReady ? "opacity-0" : "opacity-100"
              }`}
              loading="eager"
              decoding="async"
            />

            <div ref={previewContainerRef} className="absolute inset-0" />
          </>
        )}

        {!previewReady && !useVideo && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-background/50">
            <div className="scene-card-preview-bar h-full bg-accent/80" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />

        <Link
          href={`/view/${scene.slug}`}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-sm border border-accent/50 bg-background/85 px-4 py-2 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-md transition-colors hover:bg-accent hover:text-background"
        >
          Entrar
        </Link>
      </div>

      <Link href={`/view/${scene.slug}`} className="block p-5">
        <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {scene.title}
        </h2>
        {scene.description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {scene.description}
          </p>
        ) : null}
        {scene.context && (
          <p className="mt-3 text-xs leading-relaxed text-muted/80">
            {scene.context}
          </p>
        )}
        {scene.tags && scene.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {scene.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-border px-1.5 py-0.5 font-[family-name:var(--font-syne)] text-[9px] uppercase tracking-wider text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
