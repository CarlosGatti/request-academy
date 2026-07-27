"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useMemo } from "react";
import { PartnerCard } from "@/components/partners/partner-card";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaImage } from "@/components/ui/media-image";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { StatusBadge } from "@/components/ui/status-badge";
import { EnrollmentProgress } from "@/features/workspace/enrollment-progress";
import { useDefaultAcademy } from "@/features/workspace/use-default-academy";
import {
  DefinedAcademyPublishedCoursesDocument,
  DefinedPublicAcademyPartnersDocument,
  DefinedPublicAcademyResourcesDocument,
  MyDefinedAcademyEnrollmentsDocument,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

function enrollmentTimestamp(value: unknown): number {
  if (!value) return 0;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function WorkspaceHomeView() {
  const { user } = useAuth();
  const { slug, academyId, loading: academyLoading, error: academyError } =
    useDefaultAcademy();

  const enrollmentsQuery = useQuery(MyDefinedAcademyEnrollmentsDocument, {
    variables: { academyId: academyId ?? undefined },
    skip: academyId == null,
  });
  const coursesQuery = useQuery(DefinedAcademyPublishedCoursesDocument, {
    variables: { academySlug: slug },
  });
  const resourcesQuery = useQuery(DefinedPublicAcademyResourcesDocument, {
    variables: { academySlug: slug },
  });
  const partnersQuery = useQuery(DefinedPublicAcademyPartnersDocument, {
    variables: { academySlug: slug },
  });

  const enrollments = useMemo(() => {
    const list = [...(enrollmentsQuery.data?.myDefinedAcademyEnrollments ?? [])];
    return list.sort(
      (a, b) =>
        enrollmentTimestamp(b.lastAccessedAt ?? b.enrolledAt) -
        enrollmentTimestamp(a.lastAccessedAt ?? a.enrolledAt),
    );
  }, [enrollmentsQuery.data]);

  const continueEnrollment = enrollments.find(
    (item) => item.status === "IN_PROGRESS" || item.status === "ENROLLED",
  );
  const enrolledCourseIds = new Set(enrollments.map((item) => item.courseId));
  const availableCourses = (coursesQuery.data?.definedAcademyPublishedCourses ?? []).filter(
    (course) => !enrolledCourseIds.has(course.id),
  );
  const resources = (resourcesQuery.data?.definedPublicAcademyResources ?? []).slice(0, 4);
  const partners = (partnersQuery.data?.definedPublicAcademyPartners ?? [])
    .filter((partner) => partner.featured)
    .slice(0, 3);

  if (academyLoading || (enrollmentsQuery.loading && !enrollmentsQuery.data)) {
    return <PageLoading rows={4} />;
  }

  if (academyError) {
    return (
      <Alert tone="danger" title="Unable to load academy">
        {getGraphQLErrorMessage(academyError)}
      </Alert>
    );
  }

  if (enrollmentsQuery.error) {
    return (
      <Alert tone="danger" title="Unable to load enrollments">
        {getGraphQLErrorMessage(enrollmentsQuery.error)}
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title={`Welcome${user?.firstName ? `, ${user.firstName}` : ""}`}
        description="Your professional development workspace — programs, materials, and network."
      />

      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-primary">
          Continue where you left off
        </h2>
        {continueEnrollment?.course ? (
          <div className="flex flex-col gap-4 border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="relative hidden size-20 shrink-0 overflow-hidden bg-secondary sm:block">
                {continueEnrollment.course.coverImageUrl ? (
                  <MediaImage
                    src={continueEnrollment.course.coverImageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : null}
              </div>
              <div className="space-y-2">
                <StatusBadge status={continueEnrollment.status} />
                <h3 className="font-display text-lg font-medium text-primary">
                  {continueEnrollment.course.title}
                </h3>
                <EnrollmentProgress courseId={continueEnrollment.courseId} />
              </div>
            </div>
            <Link
              href={`/workspace/programs/${continueEnrollment.course.slug}`}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-highlight px-4 text-sm font-medium text-white"
            >
              Continue
            </Link>
          </div>
        ) : (
          <EmptyState
            title="No active program yet"
            description="Enroll in a development path to start tracking progress here."
            action={
              <Link
                href={`/academy/${slug}/courses`}
                className="text-sm font-medium text-accent hover:underline"
              >
                Browse programs
              </Link>
            }
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-medium text-primary">
            Active professional programs
          </h2>
          <Link
            href="/workspace/programs"
            className="text-sm font-medium text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        {enrollments.length === 0 ? (
          <EmptyState
            title="No enrollments"
            description="Your enrolled programs will appear in this list."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {enrollments.slice(0, 4).map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/workspace/programs/${enrollment.course?.slug ?? enrollment.courseId}`}
                className="space-y-3 border border-border bg-surface p-4 hover:bg-sea-foam"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-medium text-primary">
                    {enrollment.course?.title ?? `Program ${enrollment.courseId}`}
                  </h3>
                  <StatusBadge status={enrollment.status} />
                </div>
                <EnrollmentProgress courseId={enrollment.courseId} compact />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-medium text-primary">
              Recommended materials
            </h2>
            <Link
              href="/workspace/resources"
              className="text-sm font-medium text-accent hover:underline"
            >
              Toolkit
            </Link>
          </div>
          {resources.length === 0 ? (
            <p className="text-sm text-muted">No published materials yet.</p>
          ) : (
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li
                  key={resource.id}
                  className="border border-border bg-surface px-4 py-3 text-sm"
                >
                  <span className="font-medium text-primary">{resource.title}</span>
                  <span className="ml-2 text-muted">{resource.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-medium text-primary">
            Progress overview
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border bg-surface p-4">
              <p className="text-2xl font-medium text-primary">{enrollments.length}</p>
              <p className="text-xs text-muted">Programs</p>
            </div>
            <div className="border border-border bg-surface p-4">
              <p className="text-2xl font-medium text-primary">
                {enrollments.filter((item) => item.status === "IN_PROGRESS").length}
              </p>
              <p className="text-xs text-muted">In progress</p>
            </div>
            <div className="border border-border bg-surface p-4">
              <p className="text-2xl font-medium text-primary">
                {enrollments.filter((item) => item.status === "COMPLETED").length}
              </p>
              <p className="text-xs text-muted">Completed</p>
            </div>
          </div>
          {availableCourses.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted">Available to enroll</p>
              <ul className="space-y-2">
                {availableCourses.slice(0, 3).map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/academy/${slug}/courses/${course.slug}`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      {course.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {partners.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-medium text-primary">
              Professional network
            </h2>
            <Link
              href="/workspace/partners"
              className="text-sm font-medium text-accent hover:underline"
            >
              View network
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} academySlug={slug} partner={partner} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
