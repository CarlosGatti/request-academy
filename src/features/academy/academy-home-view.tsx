"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { Suspense } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { PartnerCard } from "@/components/partners/partner-card";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoading } from "@/components/ui/page-loading";
import { HeroBanner } from "@/features/academy/hero-banner";
import { ReferralCapture } from "@/features/referrals/capture";
import {
  DefinedAcademyBySlugDocument,
  DefinedAcademyPublishedCoursesDocument,
  DefinedPublicAcademyPartnersDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { resolveAcademyTheme } from "@/lib/tenant/theme";

export function AcademyHomeView({ academySlug }: { academySlug: string }) {
  const academyQuery = useQuery(DefinedAcademyBySlugDocument, {
    variables: { slug: academySlug },
  });
  const coursesQuery = useQuery(DefinedAcademyPublishedCoursesDocument, {
    variables: { academySlug },
  });
  const partnersQuery = useQuery(DefinedPublicAcademyPartnersDocument, {
    variables: { academySlug },
  });

  if (academyQuery.loading && !academyQuery.data) {
    return (
      <Container className="py-10">
        <PageLoading rows={4} />
      </Container>
    );
  }

  if (academyQuery.error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load academy">
          {getGraphQLErrorMessage(academyQuery.error)}
        </Alert>
      </Container>
    );
  }

  const academy = academyQuery.data?.definedAcademyBySlug;
  if (!academy) {
    return (
      <Container className="py-10">
        <EmptyState
          title="Academy not found"
          description={`No active academy matches “${academySlug}”.`}
        />
      </Container>
    );
  }

  const theme = resolveAcademyTheme(academy);
  const courses = coursesQuery.data?.definedAcademyPublishedCourses ?? [];
  const partners = partnersQuery.data?.definedPublicAcademyPartners ?? [];
  const featuredPartners = partners.filter((partner) => partner.featured).slice(0, 3);
  const featuredCourse = courses[0];

  return (
    <>
      <Suspense fallback={null}>
        <ReferralCapture academyId={academy.id} />
      </Suspense>

      <section className="border-b border-border bg-surface">
        <Container className="grid gap-8 py-12 lg:grid-cols-[0.95fr_1.15fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-medium tracking-wide text-accent uppercase">
              Professional growth
            </p>
            <h1 className="font-display text-4xl font-medium tracking-tight text-primary md:text-5xl">
              {theme.name}
            </h1>
            {academy.description ? (
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                {academy.description}
              </p>
            ) : (
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                Practical professional knowledge and reusable materials that help
                you perform real work.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/academy/${academySlug}/courses`}
                className="inline-flex h-11 items-center rounded-md bg-highlight px-5 text-sm font-medium text-white hover:bg-highlight/90"
              >
                Explore programs
              </Link>
              <Link
                href={`/register?returnUrl=${encodeURIComponent(`/academy/${academySlug}`)}`}
                className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-primary hover:bg-sea-foam"
              >
                Create account
              </Link>
            </div>
          </div>
          <div className="w-full min-w-0">
            <HeroBanner />
          </div>
        </Container>
      </section>

      {featuredCourse ? (
        <section className="border-b border-border bg-secondary/40">
          <Container className="grid gap-8 py-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-medium text-accent uppercase tracking-wide">
                Featured pathway
              </p>
              <h2 className="font-display text-3xl font-medium text-primary">
                {featuredCourse.title}
              </h2>
              {featuredCourse.summary ? (
                <p className="text-muted leading-relaxed">{featuredCourse.summary}</p>
              ) : null}
              <Link
                href={`/academy/${academySlug}/courses/${featuredCourse.slug}`}
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-sea-foam"
              >
                View program
              </Link>
            </div>
            <CourseCard academySlug={academySlug} course={featuredCourse} />
          </Container>
        </section>
      ) : null}

      <section>
        <Container className="space-y-6 py-12">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-medium text-primary">
              Practical outcomes
            </h2>
            <p className="max-w-2xl text-muted">
              Templates, checklists, guides, and downloadable materials sit
              alongside structured programs—built for daily professional work.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Reusable materials",
                body: "Download templates and checklists you can apply immediately.",
              },
              {
                title: "Structured guidance",
                body: "Clear development paths without classroom theatrics.",
              },
              {
                title: "Professional network",
                body: "Partners and specialists ready to support your growth.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-surface p-5">
                <h3 className="font-display text-lg font-medium text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <Link
            href={`/academy/${academySlug}/resources`}
            className="inline-flex text-sm font-medium text-accent hover:underline"
          >
            Browse practical materials
          </Link>
        </Container>
      </section>

      <section className="border-t border-border bg-surface">
        <Container className="space-y-6 py-12">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-medium text-primary">
                Available programs
              </h2>
              <p className="text-muted">
                Professional development pathways you can put to work.
              </p>
            </div>
            <Link
              href={`/academy/${academySlug}/courses`}
              className="hidden text-sm font-medium text-accent hover:underline sm:inline"
            >
              View all
            </Link>
          </div>
          {coursesQuery.loading && !courses.length ? (
            <PageLoading rows={2} />
          ) : courses.length === 0 ? (
            <EmptyState
              title="No programs published yet"
              description="Check back soon for new professional development pathways."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 6).map((course) => (
                <CourseCard
                  key={course.id}
                  academySlug={academySlug}
                  course={course}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      {(featuredPartners.length > 0 || partners.length > 0) && (
        <section className="border-t border-border">
          <Container className="space-y-6 py-12">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-medium text-primary">
                Professional partners
              </h2>
              <p className="text-muted">
                A support network for real-world work.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {(featuredPartners.length ? featuredPartners : partners.slice(0, 3)).map(
                (partner) => (
                  <PartnerCard
                    key={partner.id}
                    academySlug={academySlug}
                    partner={partner}
                  />
                ),
              )}
            </div>
            <Link
              href={`/academy/${academySlug}/partners`}
              className="inline-flex text-sm font-medium text-accent hover:underline"
            >
              View partners
            </Link>
          </Container>
        </section>
      )}

      <section className="border-t border-border bg-primary text-sea-foam">
        <Container className="flex flex-col gap-4 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-medium">Ready to begin?</h2>
            <p className="text-sea-foam/80">
              Sign in to enroll and access your professional workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-md bg-highlight px-4 text-sm font-medium text-white"
            >
              Sign in
            </Link>
            <Link
              href="/workspace"
              className="inline-flex h-10 items-center rounded-md border border-sea-foam/30 px-4 text-sm font-medium"
            >
              Open workspace
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
