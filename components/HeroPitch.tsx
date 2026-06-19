"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroStepsJourney } from "@/components/HeroStepsJourney";
import { siteCopy } from "@/lib/site-copy";

const headlineWords = siteCopy.hero.headline.split(" ");
const HERO_POSTER = "/latticexr-hero-poster.webp";
const HERO_VIDEO = "/latticexr-hero.web.mp4";

export function HeroPitch() {
  const { hero } = siteCopy;
  const [scanDone, setScanDone] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVideoReady(true);
    }
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const videoLayer = videoLayerRef.current;
    if (!section || !videoLayer) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "55% bottom",
        end: "bottom top",
        scrub: 0.85,
        onUpdate: (self) => {
          gsap.set(videoLayer, { opacity: 1 - self.progress });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div ref={videoLayerRef} className="pointer-events-none absolute inset-0">
        <div className="relative sticky top-0 h-[100dvh] w-full overflow-hidden bg-background">
          <Image
            src={HERO_POSTER}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER}
            className={`hero-video-layer absolute inset-0 h-full w-full object-cover ${
              videoReady ? "is-ready" : ""
            }`}
            aria-hidden
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>

          <div className="hero-video-overlay absolute inset-0" aria-hidden />
          <div
            className="hero-video-grid absolute inset-0 opacity-40"
            aria-hidden
          />
        </div>
      </div>

      <div className="relative z-10">
        <div className="relative flex min-h-[100dvh] flex-col overflow-hidden">
          {!scanDone && (
            <div
              className="hero-scan-line pointer-events-none absolute inset-x-0 z-10 h-px"
              onAnimationEnd={() => setScanDone(true)}
              aria-hidden
            />
          )}

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-28 text-center md:px-10">
            <div className="hero-logo-in mb-10 md:mb-12">
              <Image
                src="/logo.png"
                alt="LatticeXR"
                width={320}
                height={80}
                priority
                className="h-auto w-[min(72vw,320px)] object-contain"
              />
            </div>

            <h1 className="max-w-5xl font-[family-name:var(--font-aldrich)] text-3xl uppercase leading-[1.15] tracking-[0.04em] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              {headlineWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="hero-headline-word inline-block"
                  style={{ animationDelay: `${1.1 + index * 0.12}s` }}
                >
                  {word}
                  {index < headlineWords.length - 1 ? "\u00a0" : ""}
                </span>
              ))}
            </h1>
          </div>

          <div className="hero-scroll-hint relative z-10 flex justify-center pb-8">
            <a
              href="#como-funciona"
              className="font-[family-name:var(--font-syne)] text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-foreground"
            >
              Scroll
            </a>
          </div>
        </div>

        <HeroStepsJourney exploreLabel={hero.ctaSecondary} />
      </div>

      <div className="hero-to-content-bridge pointer-events-none relative z-0" aria-hidden />
    </section>
  );
}
