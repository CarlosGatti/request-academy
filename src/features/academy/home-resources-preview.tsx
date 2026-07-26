"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { ResourceCard } from "@/components/resources/resource-card";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageLoading } from "@/components/ui/page-loading";
import { DefinedPublicAcademyResourcesDocument } from "@/graphql/generated/graphql";

const CATEGORY_TEASERS = [
  { label: "Guides", hint: "Practical how-to materials" },
  { label: "Templates", hint: "Ready-to-use documents" },
  { label: "Checklists", hint: "Stay organized in the field" },
  { label: "Business tools", hint: "Support everyday work" },
] as const;

type HomeResourcesPreviewProps = {
  academySlug: string;
};

/**
 * Resource library preview — live resources when available, category teasers otherwise.
 * No fake download counts or unsupported claims.
 */
export function HomeResourcesPreview({ academySlug }: HomeResourcesPreviewProps) {
  const { data, loading } = useQuery(DefinedPublicAcademyResourcesDocument, {
    variables: { academySlug },
  });

  const resources = (data?.definedPublicAcademyResources ?? []).slice(0, 6);

  return (
    <section className="bg-sea-foam/60">
      <Container className="space-y-10 py-section-mobile sm:py-section-tablet lg:py-section-desktop">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium tracking-[0.16em] text-accent uppercase">
              Resource library
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
              Tools for real work
            </h2>
            <p className="text-lg leading-relaxed text-muted">
              Practical materials that sit alongside your programs—not only
              lessons to watch.
            </p>
          </div>
          <Link
            href={`/academy/${academySlug}/resources`}
            className={buttonClassName({ variant: "primary", size: "lg" })}
          >
            Browse resources
          </Link>
        </div>

        {loading && !resources.length ? (
          <PageLoading rows={2} />
        ) : resources.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                className="rounded-xl border-0 bg-surface p-5 shadow-sm ring-1 ring-border/60"
              />
            ))}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_TEASERS.map((item) => (
              <li
                key={item.label}
                className="rounded-xl bg-surface p-5 shadow-sm ring-1 ring-border/60"
              >
                <p className="font-display text-lg font-medium text-primary">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-muted">{item.hint}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
