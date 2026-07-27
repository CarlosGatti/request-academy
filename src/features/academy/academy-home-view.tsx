"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { Suspense } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { Alert } from "@/components/ui/alert";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoading } from "@/components/ui/page-loading";
import { AcademyHomeHero } from "@/features/academy/academy-home-hero";
import { CareerHomePromo } from "@/features/academy/career/components/career-home-promo";
import { HomeFeaturedProgram } from "@/features/academy/home-featured-program";
import { HomePartnersSection } from "@/features/academy/home-partners-section";
import { HomePracticalOutcomes } from "@/features/academy/home-practical-outcomes";
import { HomeResourcesPreview } from "@/features/academy/home-resources-preview";
import { HomeValueStrip } from "@/features/academy/home-value-strip";
import { ReferralCapture } from "@/features/referrals/capture";
import {
  DefinedAcademyBySlugDocument,
  DefinedAcademyPublishedCoursesDocument,
  DefinedPublicAcademyPartnersDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

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

  const courses = coursesQuery.data?.definedAcademyPublishedCourses ?? [];
  const partners = partnersQuery.data?.definedPublicAcademyPartners ?? [];
  const featuredPartners = partners.filter((partner) => partner.featured);
  const partnerList = (
    featuredPartners.length ? featuredPartners : partners
  ).slice(0, 3);
  const featuredCourse = courses[0];
  /** Latest programs on the homepage; View all opens the full catalog. */
  const gridCourses = courses.slice(0, 3);

  return (
    <>
      <Suspense fallback={null}>
        <ReferralCapture academyId={academy.id} />
      </Suspense>

      <AcademyHomeHero academySlug={academySlug} />
      <HomeValueStrip />
      <CareerHomePromo academySlug={academySlug} />

      {featuredCourse ? (
        <HomeFeaturedProgram academySlug={academySlug} course={featuredCourse} />
      ) : null}

      <HomePracticalOutcomes academySlug={academySlug} />

      <section className="bg-sea-foam/40">
        <Container className="space-y-10 py-section-mobile sm:py-section-tablet lg:py-section-desktop">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
                Available programs
              </h2>
              <p className="text-lg leading-relaxed text-muted">
                Professional development pathways you can put to work.
              </p>
            </div>
            <Link
              href={`/academy/${academySlug}/courses`}
              className="inline-flex text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View all
            </Link>
          </div>
          {coursesQuery.loading && !courses.length ? (
            <PageLoading rows={2} />
          ) : gridCourses.length === 0 ? (
            <EmptyState
              title="No programs published yet"
              description="Check back soon for new professional development pathways."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridCourses.map((course) => (
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

      <HomeResourcesPreview academySlug={academySlug} />

      <HomePartnersSection academySlug={academySlug} partners={partnerList} />

      {/* Social proof: omitted until real testimonials/metrics exist. */}

      <section className="bg-primary text-sea-foam">
        <Container className="flex flex-col gap-6 py-section-mobile sm:flex-row sm:items-center sm:justify-between sm:py-section-tablet lg:py-section-desktop">
          <div className="max-w-xl space-y-3">
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              Ready to take your next step?
            </h2>
            <p className="text-lg leading-relaxed text-sea-foam/85">
              Explore programs, resources, and guidance built around your real
              estate career.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/academy/${academySlug}/courses`}
              className={buttonClassName({ variant: "highlight", size: "xl" })}
            >
              Explore programs
            </Link>
            <Link
              href="/login"
              className={buttonClassName({
                variant: "outline-on-dark",
                size: "xl",
              })}
            >
              Sign in
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
