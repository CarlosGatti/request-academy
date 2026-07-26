import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export type PartnerCardData = {
  slug: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  location?: string | null;
  featured?: boolean | null;
  category?: { name: string } | null;
};

export function PartnerCard({
  academySlug,
  partner,
  className,
}: {
  academySlug: string;
  partner: PartnerCardData;
  className?: string;
}) {
  const href = `/academy/${academySlug}/partners/${partner.slug}`;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-card ring-1 ring-border/70 transition-shadow hover:shadow-lg",
        partner.featured && "bg-sea-foam/80 ring-accent/25",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-sea-foam ring-1 ring-border/70">
          {partner.logoUrl ? (
            <MediaImage
              src={partner.logoUrl}
              alt=""
              fill
              className="object-contain p-1.5"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">
              Partner
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-1">
          <h3 className="font-display text-lg font-medium text-primary">
            <Link
              href={href}
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {partner.name}
            </Link>
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            {partner.category?.name ? <span>{partner.category.name}</span> : null}
            {partner.location ? <span>{partner.location}</span> : null}
            {partner.featured ? (
              <span className="font-medium text-highlight">Featured</span>
            ) : null}
          </div>
        </div>
      </div>
      {partner.description ? (
        <p className="text-sm leading-relaxed text-muted line-clamp-3">
          {partner.description}
        </p>
      ) : null}
      <Link
        href={href}
        className="mt-auto text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        View partner
      </Link>
    </article>
  );
}
