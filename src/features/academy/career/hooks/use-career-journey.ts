"use client";

import { useQuery } from "@apollo/client/react";
import { DefinedAcademyCareerJourneyByAcademySlugDocument } from "@/graphql/generated/graphql";
import { sortCareerStages } from "@/features/academy/career/utils/career-stage-state";
import { toGraphQLInt } from "@/lib/graphql/ids";

export function useCareerJourney(academySlug: string) {
  const query = useQuery(DefinedAcademyCareerJourneyByAcademySlugDocument, {
    variables: { academySlug },
  });

  const journey = query.data?.definedAcademyCareerJourneyByAcademySlug ?? null;
  const stages = sortCareerStages(
    (journey?.stages ?? []).flatMap((stage) => {
      const id = toGraphQLInt(stage.id);
      if (id == null) return [];
      return [{ ...stage, id }];
    }),
  );

  return {
    journey,
    stages,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  };
}
