import Image from "next/image";
import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatDurationMinutes } from "@/lib/academy/labels";

const FALLBACK_COVER = "/brand/re-quest/covers/first-90-days.png";

export type FeaturedProgramData = {
  slug: string;
  title: string;
  summary?: string | null;
  coverImageUrl?: string | null;
  estimatedDurationMinutes?: number | null;
  visibility?: string | null;
};

type HomeFeaturedProgramProps = {
  academySlug: string;
  course: FeaturedProgramData;
};

/**
 * Editorial featured program block — product launch feel, not a small catalog card.
 */
export function HomeFeaturedProgram({
  academySlug,
  course,
}: HomeFeaturedProgramProps) {
  const duration = formatDurationMinutes(course.estimatedDurationMinutes);
  const coverSrc = course.coverImageUrl || FALLBACK_COVER;
  const isRemoteCover = Boolean(course.coverImageUrl);

  return (
    <section className="bg-lichen/35">
      <Container className="py-section-mobile sm:py-section-tablet lg:py-section-desktop">
        <div className="overflow-hidden rounded-xl bg-surface shadow-lg ring-1 ring-border/70">
          <div className="grid lg:grid-cols-2 lg:items-stretch">
            <div className="relative min-h-[16rem] bg-sea-foam sm:min-h-[18rem] lg:min-h-full">
              {isRemoteCover ? (
                <MediaImage
                  src={coverSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <Image
                  src={FALLBACK_COVER}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>

            <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:p-12">
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-[0.16em] text-accent uppercase">
                  Featured pathway
                </p>
                <h2 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
                  {course.title}
                </h2>
                {course.summary ? (
                  <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                    {course.summary}
                  </p>
                ) : (
                  <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                    Foundations for business, technology, marketing, and growth.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted">
                {duration ? (
                  <span className="rounded-md bg-sea-foam px-3 py-1.5 font-medium text-primary">
                    {duration}
                  </span>
                ) : null}
                {course.visibility === "AUTHENTICATED" ? (
                  <span className="rounded-md bg-accent/15 px-3 py-1.5 font-medium text-accent">
                    Members
                  </span>
                ) : (
                  <span className="rounded-md bg-sea-foam px-3 py-1.5 font-medium text-primary">
                    Open pathway
                  </span>
                )}
              </div>

              <div>
                <Link
                  href={`/academy/${academySlug}/courses/${course.slug}`}
                  className={buttonClassName({ variant: "primary", size: "xl" })}
                >
                  View program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
