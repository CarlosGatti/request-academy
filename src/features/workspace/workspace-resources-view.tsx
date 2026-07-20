"use client";

import { useQuery } from "@apollo/client/react";
import { ResourceCard } from "@/components/resources/resource-card";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { useDefaultAcademy } from "@/features/workspace/use-default-academy";
import { DefinedPublicAcademyResourcesDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function WorkspaceResourcesView() {
  const { slug } = useDefaultAcademy();
  const { data, loading, error } = useQuery(DefinedPublicAcademyResourcesDocument, {
    variables: { academySlug: slug },
  });

  const resources = data?.definedPublicAcademyResources ?? [];

  if (loading && !resources.length) return <PageLoading />;
  if (error) {
    return (
      <Alert tone="danger" title="Unable to load toolkit">
        {getGraphQLErrorMessage(error)}
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Toolkit"
        description="Practical materials for daily professional work — guides, templates, and checklists."
      />
      {resources.length === 0 ? (
        <EmptyState
          title="No materials yet"
          description="Published resources from your academy will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
