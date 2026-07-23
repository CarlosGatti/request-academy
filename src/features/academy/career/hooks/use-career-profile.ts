"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  CompleteMyDefinedAcademyCareerStageDocument,
  InitializeMyDefinedAcademyCareerProfileDocument,
  MyDefinedAcademyCareerProfileDocument,
  MyDefinedAcademyCareerRecommendationsDocument,
  SetMyDefinedAcademyCareerStageDocument,
} from "@/graphql/generated/graphql";
import { toGraphQLInt } from "@/lib/graphql/ids";

export function useCareerProfile(academyId: number | null | undefined) {
  const id = toGraphQLInt(academyId);
  const profileQuery = useQuery(MyDefinedAcademyCareerProfileDocument, {
    variables: { academyId: id ?? 0 },
    skip: id == null,
  });

  const profile = profileQuery.data?.myDefinedAcademyCareerProfile ?? null;
  const needsOnboarding = !profileQuery.loading && !profile && id != null;

  const recommendationsQuery = useQuery(
    MyDefinedAcademyCareerRecommendationsDocument,
    {
      variables: { academyId: id ?? 0 },
      skip: id == null || !profile?.currentStageId,
    },
  );

  const [initializeProfile, initializeState] = useMutation(
    InitializeMyDefinedAcademyCareerProfileDocument,
  );
  const [setStage, setStageState] = useMutation(
    SetMyDefinedAcademyCareerStageDocument,
  );
  const [completeStage, completeStageState] = useMutation(
    CompleteMyDefinedAcademyCareerStageDocument,
  );

  return {
    academyId: id,
    profile,
    needsOnboarding,
    loading: profileQuery.loading,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    recommendations:
      recommendationsQuery.data?.myDefinedAcademyCareerRecommendations ?? null,
    recommendationsLoading: recommendationsQuery.loading,
    refetchRecommendations: recommendationsQuery.refetch,
    initializeProfile,
    initializeLoading: initializeState.loading,
    setStage,
    setStageLoading: setStageState.loading,
    completeStage,
    completeStageLoading: completeStageState.loading,
  };
}
