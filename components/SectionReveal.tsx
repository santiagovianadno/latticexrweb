"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  staggerSelector?: string;
};

export function SectionReveal({
  children,
  className = "",
  staggerSelector = "[data-reveal-item]",
}: SectionRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const header = root.querySelector<HTMLElement>("[data-reveal-header]");
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(staggerSelector),
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([header, ...items].filter(Boolean), {
          opacity: 1,
          y: 0,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set([header, ...items].filter(Boolean), {
        opacity: 0,
        y: 28,
        filter: "blur(4px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 84%",
          once: true,
        },
      });

      if (header) {
        tl.to(header, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power2.out",
        });
      }

      if (items.length > 0) {
        tl.to(
          items,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
          },
          header ? "-=0.4" : 0,
        );
      } else if (!header) {
        tl.to(root, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power2.out",
        });
      }
    }, root);

    return () => ctx.revert();
  }, [staggerSelector]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
