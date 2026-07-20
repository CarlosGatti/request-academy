"use client";

import { useQuery } from "@apollo/client/react";
import { PartnerCard } from "@/components/partners/partner-card";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { DefinedPublicAcademyPartnersDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function PartnersListView({ academySlug }: { academySlug: string }) {
  const { data, loading, error } = useQuery(DefinedPublicAcademyPartnersDocument, {
    variables: { academySlug },
  });

  const partners = data?.definedPublicAcademyPartners ?? [];
  const featured = partners.filter((partner) => partner.featured);
  const rest = partners.filter((partner) => !partner.featured);

  if (loading && !partners.length) {
    return (
      <Container className="py-10">
        <PageLoading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load partners">
          {getGraphQLErrorMessage(error)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-10">
      <PageHeader
        title="Professional network"
        description="Partners and specialists who support your professional growth."
      />
      {partners.length === 0 ? (
        <EmptyState
          title="No partners listed yet"
          description="Active partners will appear in this directory."
        />
      ) : (
        <div className="space-y-10">
          {featured.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display text-xl font-medium text-primary">
                Featured
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    academySlug={academySlug}
                    partner={partner}
                  />
                ))}
              </div>
            </section>
          ) : null}
          {(featured.length === 0 || rest.length > 0) && (
            <section className="space-y-4">
              {featured.length > 0 ? (
                <h2 className="font-display text-xl font-medium text-primary">
                  All partners
                </h2>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(featured.length > 0 ? rest : partners).map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    academySlug={academySlug}
                    partner={partner}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Container>
  );
}
