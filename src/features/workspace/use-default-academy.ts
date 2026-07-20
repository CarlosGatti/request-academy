"use client";

import { useQuery } from "@apollo/client/react";
import { DefinedAcademyBySlugDocument } from "@/graphql/generated/graphql";
import { clientEnv } from "@/lib/env/client";
import { toGraphQLInt } from "@/lib/graphql/ids";

export function useDefaultAcademy() {
  const slug = clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG;
  const query = useQuery(DefinedAcademyBySlugDocument, {
    variables: { slug },
  });

  const academy = query.data?.definedAcademyBySlug ?? null;

  return {
    slug,
    academy,
    academyId: toGraphQLInt(academy?.id),
    loading: query.loading,
    error: query.error,
  };
}
