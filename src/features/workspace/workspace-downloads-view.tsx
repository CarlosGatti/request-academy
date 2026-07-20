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

export function WorkspaceDownloadsView() {
  const { slug } = useDefaultAcademy();
  const { data, loading, error } = useQuery(DefinedPublicAcademyResourcesDocument, {
    variables: { academySlug: slug },
  });

  const downloads = (data?.definedPublicAcademyResources ?? []).filter(
    (resource) =>
      Boolean(resource.downloadable && resource.fileUrl) ||
      resource.type === "PDF" ||
      resource.type === "FILE" ||
      resource.type === "TEMPLATE" ||
      resource.type === "CHECKLIST",
  );

  if (loading && !data) return <PageLoading />;
  if (error) {
    return (
      <Alert tone="danger" title="Unable to load downloads">
        {getGraphQLErrorMessage(error)}
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Downloads"
        description="Files and templates ready for reuse in your professional work."
      />
      {downloads.length === 0 ? (
        <EmptyState
          title="No downloads available"
          description="Downloadable PDFs, templates, and files will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {downloads.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
