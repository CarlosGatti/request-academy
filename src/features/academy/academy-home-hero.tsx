import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Handshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { HomeHeroCareerPath } from "@/features/academy/home-hero-career-path";
import { cn } from "@/lib/utils/cn";

const HERO_BG = "/bg-request.png";

const VALUE_POINTS = [
  {
    label: "Trusted by real estate professionals",
    Icon: ShieldCheck,
  },
  {
    label: "Practical resources",
    Icon: BookOpen,
  },
  {
    label: "Learning that works",
    Icon: Sparkles,
  },
  {
    label: "Community and support",
    Icon: Handshake,
  },
] as const;

type AcademyHomeHeroProps = {
  academySlug: string;
  className?: string;
};

/**
 * Immersive homepage hero with branded workspace background.
 * Preserves existing CTA destinations (programs + career).
 */
export function AcademyHomeHero({
  academySlug,
  className,
}: AcademyHomeHeroProps) {
  return (
    <section
      className={cn(
        /* Pull under the translucent sticky header so menu + hero feel like one plane */
        "relative isolate -mt-16 overflow-hidden bg-primary text-sea-foam sm:-mt-[4.5rem]",
        className,
      )}
    >
      {/* Background layer */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover",
            /* Keep laptop/workspace visible; favor right subject */
            "object-[72%_center] sm:object-[68%_center] lg:object-[60%_center] xl:object-[center_right]",
          )}
        />
        {/* Lighter readability overlay — less “heavy blue”, still readable on the left */}
        <div
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,41,61,0.88)_0%,rgba(0,41,61,0.72)_30%,rgba(0,41,61,0.42)_52%,rgba(0,41,61,0.14)_72%,rgba(0,41,61,0)_100%)] md:block"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,41,61,0.82)_0%,rgba(0,41,61,0.72)_40%,rgba(0,41,61,0.45)_70%,rgba(0,41,61,0.28)_100%)] md:hidden"
          aria-hidden="true"
        />
      </div>

      <Container className="relative z-10 flex min-h-[min(78vh,44rem)] flex-col justify-center pb-16 pt-24 sm:min-h-[min(72vh,42rem)] sm:pb-20 sm:pt-28 lg:min-h-[min(78vh,46rem)]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(12rem,0.55fr)_minmax(0,0.85fr)] lg:gap-6 xl:gap-8">
          {/* Left: primary copy */}
          <div
            className={cn(
              "max-w-xl space-y-6",
              "motion-safe:animate-[hero-fade-up_0.7s_ease-out_both]",
            )}
          >
            <p className="text-xs font-medium tracking-[0.2em] text-lichen uppercase sm:text-sm">
              Professional growth
            </p>
            <h1 className="font-display text-[2rem] font-medium leading-[1.12] tracking-tight text-sea-foam sm:text-4xl md:text-[2.65rem] md:leading-[1.1] lg:text-5xl lg:leading-[1.08]">
              Your real estate career, every step of the way.
            </h1>
            <p className="max-w-lg font-body text-base leading-relaxed text-sea-foam/88 sm:text-lg">
              RE-Quest Academy gives you the programs, resources, and guidance
              you need to grow with confidence—from your first step to long-term
              success.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/academy/${academySlug}/courses`}
                className="inline-flex h-11 min-h-11 items-center justify-center rounded-md bg-highlight px-5 text-sm font-medium text-white transition-colors hover:bg-highlight/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Explore programs
              </Link>
              <Link
                href={`/academy/${academySlug}/career`}
                className="inline-flex h-11 min-h-11 items-center justify-center rounded-md border border-lichen/40 bg-primary/35 px-5 text-sm font-medium text-sea-foam backdrop-blur-sm transition-colors hover:border-lichen/60 hover:bg-primary/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Start your journey
              </Link>
            </div>
          </div>

          {/* Center: career path (desktop) / stacked on smaller */}
          <div
            className={cn(
              "lg:justify-self-center",
              "motion-safe:animate-[hero-fade-up_0.7s_ease-out_0.12s_both]",
            )}
          >
            <HomeHeroCareerPath academySlug={academySlug} />
          </div>

          {/* Right: reserve visual space so copy never covers the laptop */}
          <div className="pointer-events-none hidden min-h-[12rem] lg:block" aria-hidden="true" />
        </div>

        {/* Value points — restrained, secondary to CTAs */}
        <ul
          className={cn(
            "mt-12 grid gap-3 border-t border-lichen/20 pt-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4",
            "motion-safe:animate-[hero-fade-up_0.7s_ease-out_0.2s_both]",
          )}
        >
          {VALUE_POINTS.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 text-xs text-sea-foam/75 sm:text-[13px]"
            >
              <Icon
                className="size-4 shrink-0 text-lichen"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </Container>

      {/* Soft transition into the next homepage section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-b from-transparent to-sea-foam/90 sm:h-12"
        aria-hidden="true"
      />
      <div
        className="relative z-20 -mb-px h-6 rounded-t-[1.75rem] bg-sea-foam sm:h-8 sm:rounded-t-[2.25rem]"
        aria-hidden="true"
      />
    </section>
  );
}
