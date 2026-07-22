"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Slide backgrounds use RE-Quest brand colors:
 * primary (tidal blue), highlight (sunny orange), accent (sprout green).
 */
const SLIDES = [
  {
    eyebrow: "Welcome",
    title: "See you inside…",
    body: "Step into your professional growth workspace.",
    panel: "bg-primary",
    band: "bg-accent/30",
  },
  {
    eyebrow: "Education portal",
    title: "Learn what moves your practice",
    body: "Programs built for real estate professionals—not classrooms.",
    panel: "bg-highlight",
    band: "bg-primary/25",
  },
  {
    eyebrow: "Practical materials",
    title: "Templates you can use today",
    body: "Guides, checklists, and resources ready for daily work.",
    panel: "bg-accent",
    band: "bg-primary/30",
  },
  {
    eyebrow: "Your path",
    title: "Grow with clear next steps",
    body: "Structured pathways that help you perform, not just watch.",
    panel: "bg-primary",
    band: "bg-highlight/35",
  },
] as const;

/** Slow enough to read; click/hover still lets people jump ahead. */
const INTERVAL_MS = 12_000;

function DoorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 72"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 8h28v56H12V8Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M40 12h10l6 8v40H40V12Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <circle cx="48" cy="40" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useEffectEvent(() => {
    setIndex((current) => (current + 1) % SLIDES.length);
  });

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      goNext();
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, index]);

  const slide = SLIDES[index];

  return (
    <div
      className={cn(
        "relative flex w-full min-h-[12.5rem] flex-col justify-between overflow-hidden px-7 py-6 text-white transition-colors duration-1000 ease-out sm:min-h-[13.5rem] sm:px-9 sm:py-7",
        slide.panel,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-[38%] transition-colors duration-1000 ease-out",
          slide.band,
        )}
      />

      <div className="relative flex flex-1 items-stretch gap-6">
        <div className="relative min-h-[6.5rem] min-w-0 flex-1">
          {SLIDES.map((item, slideIndex) => (
            <div
              key={item.title}
              aria-hidden={slideIndex !== index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out",
                slideIndex === index
                  ? "opacity-100"
                  : "pointer-events-none opacity-0",
              )}
            >
              <p className="text-xs font-medium tracking-[0.18em] text-white/75 uppercase">
                {item.eyebrow}
              </p>
              <p className="mt-2.5 max-w-xl font-display text-3xl font-medium tracking-tight text-white sm:text-[2.15rem] sm:leading-tight">
                {item.title}
              </p>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/90 sm:text-[0.95rem]">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pointer-events-none hidden shrink-0 items-end self-end text-white/35 sm:flex">
          <DoorMark className="h-[4.75rem] w-[4.25rem]" />
        </div>
      </div>

      <div className="relative mt-6 flex items-center gap-2">
        {SLIDES.map((item, slideIndex) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Show slide: ${item.title}`}
            aria-current={slideIndex === index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              slideIndex === index
                ? "w-8 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/70",
            )}
            onClick={() => setIndex(slideIndex)}
          />
        ))}
        <span className="sr-only">
          Slide {index + 1} of {SLIDES.length}: {slide.title}
        </span>
      </div>
    </div>
  );
}
