"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaImage } from "@/components/ui/media-image";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { DefinedAcademyPartnerBySlugDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function PartnerDetailView({
  academySlug,
  partnerSlug,
}: {
  academySlug: string;
  partnerSlug: string;
}) {
  const { data, loading, error } = useQuery(DefinedAcademyPartnerBySlugDocument, {
    variables: { academySlug, partnerSlug },
  });

  const partner = data?.definedAcademyPartnerBySlug;

  if (loading && !partner) {
    return (
      <Container className="py-10">
        <PageLoading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load partner">
          {getGraphQLErrorMessage(error)}
        </Alert>
      </Container>
    );
  }

  if (!partner) {
    return (
      <Container className="py-10">
        <EmptyState
          title="Partner not found"
          description="This partner may be inactive or the link is incorrect."
          action={
            <Link
              href={`/academy/${academySlug}/partners`}
              className="text-sm font-medium text-accent hover:underline"
            >
              Back to partners
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-10">
      <Link
        href={`/academy/${academySlug}/partners`}
        className="text-sm font-medium text-accent hover:underline"
      >
        Back to partners
      </Link>
      <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="relative size-28 overflow-hidden border border-border bg-surface">
          {partner.logoUrl ? (
            <MediaImage
              src={partner.logoUrl}
              alt=""
              fill
              className="object-contain p-2"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">
              Logo
            </div>
          )}
        </div>
        <div className="space-y-4">
          <PageHeader
            title={partner.name}
            description={partner.category?.name || undefined}
          />
          <div className="flex flex-wrap gap-3 text-sm text-muted">
            {partner.location ? <span>{partner.location}</span> : null}
            {partner.featured ? (
              <span className="font-medium text-highlight">Featured</span>
            ) : null}
          </div>
          {partner.description ? (
            <p className="max-w-3xl leading-relaxed text-muted whitespace-pre-wrap">
              {partner.description}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {partner.websiteUrl ? (
              <a
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-sea-foam"
              >
                Website
                <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : null}
            {partner.contactUrl ? (
              <a
                href={partner.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-primary"
              >
                Contact
                <ExternalLink className="size-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}
