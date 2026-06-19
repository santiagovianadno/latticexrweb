"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteCopy } from "@/lib/site-copy";

type HeroStepsJourneyProps = {
  exploreLabel: string;
};

type Point = { x: number; y: number };
type Geometry = { p1: Point; p2: Point; p3: Point; vertical: boolean };

const SQUARE = 7;
const HALF = SQUARE / 2;

function measureAnchors(
  stage: HTMLElement,
  anchors: HTMLElement[],
): Point[] | null {
  const stageRect = stage.getBoundingClientRect();

  const points = anchors.map((anchor) => {
    const rect = anchor.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - stageRect.left,
      y: rect.top + rect.height / 2 - stageRect.top,
    };
  });

  if (points.some((p) => Number.isNaN(p.x) || Number.isNaN(p.y))) return null;
  return points;
}

function resolveGeometry(points: Point[]): Geometry | null {
  if (points.length !== 3) return null;

  const vertical =
    Math.abs(points[2].y - points[0].y) >
    Math.abs(points[2].x - points[0].x);

  if (vertical) {
    const lineX = points[0].x;
    return {
      vertical: true,
      p1: { x: lineX, y: points[0].y },
      p2: { x: lineX, y: points[1].y },
      p3: { x: lineX, y: points[2].y },
    };
  }

  const lineY = points[0].y;
  return {
    vertical: false,
    p1: { x: points[0].x, y: lineY },
    p2: { x: points[1].x, y: lineY },
    p3: { x: points[2].x, y: lineY },
  };
}

export function HeroStepsJourney({ exploreLabel }: HeroStepsJourneyProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);
  const travelerRef = useRef<SVGRectElement>(null);
  const nodeRefs = useRef<(SVGRectElement | null)[]>([]);
  const dotAnchorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exploreRef = useRef<HTMLDivElement>(null);

  const { howItWorks } = siteCopy;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const stage = stageRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const traveler = travelerRef.current;
    const explore = exploreRef.current;
    const dotAnchors = dotAnchorRefs.current.filter(Boolean) as HTMLSpanElement[];
    const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];
    const contents = contentRefs.current.filter(Boolean) as HTMLDivElement[];
    const nodes = nodeRefs.current.filter(Boolean) as SVGRectElement[];

    if (
      !track ||
      !stage ||
      !line1 ||
      !line2 ||
      !traveler ||
      !explore ||
      dotAnchors.length !== 3 ||
      numbers.length !== 3 ||
      contents.length !== 3 ||
      nodes.length !== 3
    ) {
      return;
    }

    const setTravelerPos = (x: number, y: number) => {
      traveler.setAttribute("x", String(x - HALF));
      traveler.setAttribute("y", String(y - HALF));
    };

    const applyGeometry = (): Geometry | null => {
      const measured = measureAnchors(stage, dotAnchors);
      if (!measured) return null;

      const geometry = resolveGeometry(measured);
      if (!geometry) return null;

      const { p1, p2, p3 } = geometry;

      line1.setAttribute("x1", String(p1.x));
      line1.setAttribute("y1", String(p1.y));
      line1.setAttribute("x2", String(p2.x));
      line1.setAttribute("y2", String(p2.y));

      line2.setAttribute("x1", String(p2.x));
      line2.setAttribute("y1", String(p2.y));
      line2.setAttribute("x2", String(p3.x));
      line2.setAttribute("y2", String(p3.y));

      [p1, p2, p3].forEach((p, index) => {
        const node = nodes[index];
        node.setAttribute("x", String(p.x - HALF));
        node.setAttribute("y", String(p.y - HALF));
      });

      if (svgRef.current) {
        svgRef.current.setAttribute(
          "viewBox",
          `0 0 ${stage.clientWidth} ${stage.clientHeight}`,
        );
      }

      return geometry;
    };

    const seg1 = { t: 0 };
    const seg2 = { t: 0 };
    let geometry = applyGeometry();
    if (!geometry) return;

    const syncDash = () => {
      const len1 = line1.getTotalLength();
      const len2 = line2.getTotalLength();
      gsap.set(line1, { strokeDasharray: len1, strokeDashoffset: len1 });
      gsap.set(line2, { strokeDasharray: len2, strokeDashoffset: len2 });
    };

    syncDash();
    setTravelerPos(geometry.p1.x, geometry.p1.y);

    const updateSeg1 = () => {
      if (!geometry) return;
      setTravelerPos(
        gsap.utils.interpolate(geometry.p1.x, geometry.p2.x, seg1.t),
        gsap.utils.interpolate(geometry.p1.y, geometry.p2.y, seg1.t),
      );
    };

    const updateSeg2 = () => {
      if (!geometry) return;
      setTravelerPos(
        gsap.utils.interpolate(geometry.p2.x, geometry.p3.x, seg2.t),
        gsap.utils.interpolate(geometry.p2.y, geometry.p3.y, seg2.t),
      );
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([line1, line2], { strokeDashoffset: 0, opacity: 0.6 });
        gsap.set(traveler, { opacity: 0 });
        gsap.set(nodes, { opacity: 1 });
        gsap.set(numbers, { opacity: 1, y: 0 });
        gsap.set(contents, { opacity: 1, y: 0 });
        gsap.set(explore, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(line1, { opacity: 0.7 });
      gsap.set(line2, { opacity: 0.7 });
      gsap.set(traveler, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
        transformBox: "fill-box",
      });
      gsap.set(nodes, { opacity: 0.35 });
      gsap.set(numbers, { opacity: 0, y: 18 });
      gsap.set(contents, { opacity: 0, y: 18 });
      gsap.set(explore, { opacity: 0, y: 16 });

      const revealStep = (
        tl: gsap.core.Timeline,
        index: number,
        position?: gsap.Position,
      ) =>
        tl
          .to(
            numbers[index],
            { opacity: 1, y: 0, duration: 0.07, ease: "power2.out" },
            position,
          )
          .to(
            contents[index],
            { opacity: 1, y: 0, duration: 0.07, ease: "power2.out" },
            "<",
          );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });

      tl.to(traveler, {
        opacity: 1,
        scale: 1,
        duration: 0.07,
        ease: "power2.out",
      }).to(
        nodes[0],
        { opacity: 1, duration: 0.06, ease: "power2.out" },
        "<",
      );

      revealStep(tl, 0, "<")
        .to(
          line1,
          { strokeDashoffset: 0, duration: 0.24, ease: "none" },
          "+=0.02",
        )
        .to(
          seg1,
          {
            t: 1,
            duration: 0.24,
            ease: "none",
            onUpdate: updateSeg1,
          },
          "<",
        )
        .to(
          nodes[1],
          { opacity: 1, duration: 0.06, ease: "power2.out" },
          "-=0.05",
        );

      revealStep(tl, 1, "<")
        .to(
          line2,
          { strokeDashoffset: 0, duration: 0.24, ease: "none" },
          "+=0.02",
        )
        .to(
          seg2,
          {
            t: 1,
            duration: 0.24,
            ease: "none",
            onUpdate: updateSeg2,
          },
          "<",
        )
        .to(
          nodes[2],
          { opacity: 1, duration: 0.06, ease: "power2.out" },
          "-=0.05",
        );

      revealStep(tl, 2, "<").to(
        explore,
        { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
        "+=0.04",
      );
    }, stage);

    const onResize = () => {
      geometry = applyGeometry();
      if (!geometry) return;
      syncDash();
      updateSeg1();
      updateSeg2();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="como-funciona"
      ref={trackRef}
      className="relative h-[320vh] scroll-mt-24"
    >
      <div className="sticky top-0 flex min-h-[100dvh] flex-col items-center justify-start px-4 pb-16 pt-[12vh] md:px-6 md:pt-[14vh]">
        <div ref={stageRef} className="relative mx-auto w-full max-w-6xl">
          <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
          >
            <line
              ref={line1Ref}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1"
            />
            <line
              ref={line2Ref}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1"
            />
            {[0, 1, 2].map((index) => (
              <rect
                key={index}
                ref={(el) => {
                  nodeRefs.current[index] = el;
                }}
                width={SQUARE}
                height={SQUARE}
                fill="transparent"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1"
              />
            ))}
            <rect
              ref={travelerRef}
              width={SQUARE}
              height={SQUARE}
              fill="white"
              className="hero-path-traveler"
            />
          </svg>

          <div className="relative -translate-y-6 grid grid-cols-1 gap-14 md:-translate-y-10 md:grid-cols-3 md:gap-8 md:pt-20">
            {howItWorks.steps.map((step, index) => (
              <div
                key={step.title}
                className="relative max-md:grid max-md:grid-cols-[auto_1fr] max-md:gap-x-5 md:flex md:flex-col md:items-start md:px-2 md:pt-16"
              >
                <span
                  ref={(el) => {
                    dotAnchorRefs.current[index] = el;
                  }}
                  aria-hidden
                  className="inline-block h-[7px] w-[7px] shrink-0 max-md:col-start-1 max-md:row-start-1 max-md:self-center md:mt-20 md:translate-x-6"
                />
                <span
                  ref={(el) => {
                    numberRefs.current[index] = el;
                  }}
                  className="inline-block max-md:col-start-2 max-md:row-start-1 md:mt-14 will-change-transform font-[family-name:var(--font-aldrich)] text-4xl leading-none text-foreground md:text-5xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }}
                  className="mt-4 w-full max-md:col-start-2 max-md:row-start-2 max-md:mt-3 will-change-transform md:mt-12 md:pl-10"
                >
                  <h2 className="font-[family-name:var(--font-aldrich)] text-sm uppercase tracking-wide text-foreground md:text-base">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={exploreRef}
            className="relative mt-16 flex justify-center will-change-transform md:mt-24"
          >
            <a
              href="#montajes"
              className="btn-lit inline-flex min-w-[190px] items-center justify-center rounded-sm px-8 py-3.5 font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-[0.18em] md:min-w-[210px] md:px-10 md:py-4"
            >
              {exploreLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
