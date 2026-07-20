"use client";

import { useQuery } from "@apollo/client/react";
import { ResourceCard } from "@/components/resources/resource-card";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { DefinedPublicAcademyResourcesDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function ResourcesListView({ academySlug }: { academySlug: string }) {
  const { data, loading, error } = useQuery(DefinedPublicAcademyResourcesDocument, {
    variables: { academySlug },
  });

  const resources = data?.definedPublicAcademyResources ?? [];

  if (loading && !resources.length) {
    return (
      <Container className="py-10">
        <PageLoading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load resources">
          {getGraphQLErrorMessage(error)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-10">
      <PageHeader
        title="Practical materials"
        description="Templates, guides, checklists, and downloadable files for professional work."
      />
      {resources.length === 0 ? (
        <EmptyState
          title="No materials published yet"
          description="Reusable resources will appear here as they are published."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </Container>
  );
}
