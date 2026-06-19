"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MediaLoadingOverlay } from "@/components/MediaLoadingOverlay";
import type { Scene } from "@/lib/scenes";
import { buildScenePreviewUrl } from "@/lib/scene-preview-pool";
import { siteCopy } from "@/lib/site-copy";

type SceneCardProps = {
  scene: Scene;
  index: number;
};

const PREVIEW_FAIL_MS = 45000;
const PREVIEW_ROOT_MARGIN = "640px 0px";

export function SceneCard({ scene, index }: SceneCardProps) {
  const { loading } = siteCopy;
  const [canHoverPreview, setCanHoverPreview] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [loadPreview, setLoadPreview] = useState(false);
  const previewRootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewUrl = buildScenePreviewUrl(scene.htmlPath, scene.slug);
  const useVideo = Boolean(scene.previewVideo);
  const showLivePreview = previewReady && !previewFailed;
  const showLoadingOverlay =
    loadPreview && !showLivePreview && !previewFailed;

  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)",
    );
    const update = () => setCanHoverPreview(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (useVideo) return;

    const node = previewRootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoadPreview(true);
          observer.disconnect();
        }
      },
      { rootMargin: PREVIEW_ROOT_MARGIN },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [useVideo]);

  useEffect(() => {
    if (useVideo || !loadPreview) return;

    let ready = false;

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "latticexr-preview-ready") return;
      if (event.data.slug !== scene.slug) return;
      ready = true;
      setPreviewReady(true);
    };

    const failTimer = window.setTimeout(() => {
      if (!ready) setPreviewFailed(true);
    }, PREVIEW_FAIL_MS);

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(failTimer);
    };
  }, [scene.slug, useVideo, loadPreview]);

  const postToPreview = useCallback((type: string) => {
    iframeRef.current?.contentWindow?.postMessage({ type }, "*");
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (useVideo) {
      videoRef.current?.play().catch(() => {});
      return;
    }
    if (canHoverPreview && showLivePreview) {
      postToPreview("latticexr-preview-play");
    }
  }, [canHoverPreview, showLivePreview, postToPreview, useVideo]);

  const handleMouseLeave = useCallback(() => {
    if (useVideo) {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      return;
    }
    if (canHoverPreview && showLivePreview) {
      postToPreview("latticexr-preview-pause");
    }
  }, [canHoverPreview, showLivePreview, postToPreview, useVideo]);

  return (
    <article
      className="wireframe-panel group overflow-hidden transition-all duration-300 hover:border-accent/30 hover:bg-surface-elevated"
      data-reveal-item
      style={{ animationDelay: `${index * 100 + 200}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={previewRootRef}
        className="scene-card-preview relative aspect-[4/3] overflow-hidden bg-surface-elevated"
      >
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
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                showLivePreview ? "opacity-0" : "opacity-100"
              }`}
              loading="eager"
              decoding="async"
            />

            {loadPreview ? (
              <iframe
                ref={iframeRef}
                src={previewUrl}
                title={`Preview: ${scene.title}`}
                className={`scene-card-preview-frame pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${
                  showLivePreview ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                tabIndex={-1}
              />
            ) : null}
          </>
        )}

        {showLoadingOverlay ? (
          <MediaLoadingOverlay
            label={loading.scenePreview}
            hint={loading.scenePreviewHint}
            compact
          />
        ) : null}

        {previewFailed && !useVideo ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[2] flex justify-center">
            <span className="rounded-sm border border-border bg-background/85 px-2 py-1 font-[family-name:var(--font-syne)] text-[9px] uppercase tracking-wider text-muted backdrop-blur-sm">
              {loading.scenePreviewFailed}
            </span>
          </div>
        ) : null}

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
