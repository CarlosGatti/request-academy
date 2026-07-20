"use client";

import { useQuery } from "@apollo/client/react";
import { Suspense } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { ReferralCapture } from "@/features/referrals/capture";
import {
  DefinedAcademyBySlugDocument,
  DefinedAcademyPublishedCoursesDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function CoursesListView({ academySlug }: { academySlug: string }) {
  const academyQuery = useQuery(DefinedAcademyBySlugDocument, {
    variables: { slug: academySlug },
  });
  const coursesQuery = useQuery(DefinedAcademyPublishedCoursesDocument, {
    variables: { academySlug },
  });

  const academyId = academyQuery.data?.definedAcademyBySlug?.id;
  const courses = coursesQuery.data?.definedAcademyPublishedCourses ?? [];

  if (coursesQuery.loading && !courses.length) {
    return (
      <Container className="py-10">
        <PageLoading />
      </Container>
    );
  }

  if (coursesQuery.error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load programs">
          {getGraphQLErrorMessage(coursesQuery.error)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-10">
      {academyId ? (
        <Suspense fallback={null}>
          <ReferralCapture academyId={academyId} />
        </Suspense>
      ) : null}
      <PageHeader
        title="Programs"
        description="Professional development pathways with practical materials and clear outcomes."
      />
      {courses.length === 0 ? (
        <EmptyState
          title="No programs available"
          description="Published programs will appear here."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} academySlug={academySlug} course={course} />
          ))}
        </div>
      )}
    </Container>
  );
}
