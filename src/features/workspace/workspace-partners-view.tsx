"use client";

import { useQuery } from "@apollo/client/react";
import { PartnerCard } from "@/components/partners/partner-card";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { useDefaultAcademy } from "@/features/workspace/use-default-academy";
import { DefinedPublicAcademyPartnersDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function WorkspacePartnersView() {
  const { slug } = useDefaultAcademy();
  const { data, loading, error } = useQuery(DefinedPublicAcademyPartnersDocument, {
    variables: { academySlug: slug },
  });

  const partners = data?.definedPublicAcademyPartners ?? [];

  if (loading && !partners.length) return <PageLoading />;
  if (error) {
    return (
      <Alert tone="danger" title="Unable to load network">
        {getGraphQLErrorMessage(error)}
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Professional network"
        description="Partners and specialists supporting your development path."
      />
      {partners.length === 0 ? (
        <EmptyState
          title="No partners listed"
          description="Your academy network will appear here when partners are published."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} academySlug={slug} partner={partner} />
          ))}
        </div>
      )}
    </div>
  );
}
