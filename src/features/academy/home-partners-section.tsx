import Link from "next/link";
import { PartnerCard, type PartnerCardData } from "@/components/partners/partner-card";
import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";

type HomePartnersSectionProps = {
  academySlug: string;
  partners: PartnerCardData[];
};

/**
 * Partners ecosystem — featured horizontal when a single partner, grid when more.
 */
export function HomePartnersSection({
  academySlug,
  partners,
}: HomePartnersSectionProps) {
  if (partners.length === 0) return null;

  const single = partners.length === 1 ? partners[0] : null;

  return (
    <section className="bg-surface">
      <Container className="space-y-10 py-section-mobile sm:py-section-tablet lg:py-section-desktop">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
            Professional partners
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            A support network for real-world work.
          </p>
        </div>

        {single ? (
          <article className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl bg-sea-foam/70 p-6 shadow-sm ring-1 ring-border/60 sm:flex-row sm:items-center sm:p-8">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface ring-1 ring-border/70 sm:size-24">
              {single.logoUrl ? (
                <MediaImage
                  src={single.logoUrl}
                  alt=""
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted">
                  Partner
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-medium text-primary">
                  {single.name}
                </h3>
                {single.featured ? (
                  <span className="rounded-md bg-highlight/15 px-2 py-0.5 text-xs font-medium text-highlight">
                    Featured
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted">
                {single.category?.name ? <span>{single.category.name}</span> : null}
                {single.location ? <span>{single.location}</span> : null}
              </div>
              {single.description ? (
                <p className="text-sm leading-relaxed text-muted line-clamp-3">
                  {single.description}
                </p>
              ) : (
                <p className="text-sm text-muted">
                  Part of the growing RE-Quest partner network.
                </p>
              )}
              <Link
                href={`/academy/${academySlug}/partners/${single.slug}`}
                className="inline-flex pt-1 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View partner
              </Link>
            </div>
          </article>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <PartnerCard
                key={partner.slug}
                academySlug={academySlug}
                partner={partner}
              />
            ))}
          </div>
        )}

        <Link
          href={`/academy/${academySlug}/partners`}
          className="inline-flex text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View partners
        </Link>
      </Container>
    </section>
  );
}
