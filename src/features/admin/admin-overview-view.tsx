"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import { DefinedAcademyAnalyticsSummaryDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

const metrics = [
  { key: "enrollments", label: "Enrollments" },
  { key: "courseStarts", label: "Course starts" },
  { key: "lessonCompletions", label: "Lesson completions" },
  { key: "courseCompletions", label: "Course completions" },
  { key: "publishedCourses", label: "Published programs" },
  { key: "activePartners", label: "Active partners" },
  { key: "shortLinkVisits", label: "Short link visits" },
  { key: "referralVisits", label: "Referral visits" },
  { key: "referralRegistrations", label: "Referral registrations" },
  { key: "referralEnrollments", label: "Referral enrollments" },
] as const;

export function AdminOverviewView() {
  const { academy, academyId, loading: academyLoading, error: academyError } =
    useAdminAcademy();
  const analyticsQuery = useQuery(DefinedAcademyAnalyticsSummaryDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });

  if (academyLoading) return <PageLoading />;

  if (academyError) {
    return (
      <Alert tone="danger" title="Unable to load academies">
        {getGraphQLErrorMessage(academyError)}
      </Alert>
    );
  }

  if (!academy) {
    return (
      <Alert tone="warning" title="No academy available">
        Seed or create an academy before managing content.
      </Alert>
    );
  }

  const summary = analyticsQuery.data?.definedAcademyAnalyticsSummary;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Academy administration"
        description={`${academy.name} · ${academy.slug}`}
      />

      {analyticsQuery.error ? (
        <Alert tone="danger" title="Unable to load analytics">
          {getGraphQLErrorMessage(analyticsQuery.error)}
        </Alert>
      ) : null}

      {analyticsQuery.loading && !summary ? (
        <PageLoading rows={2} />
      ) : summary ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.key} className="border border-border bg-surface p-4">
              <p className="text-2xl font-medium text-primary">
                {summary[metric.key]}
              </p>
              <p className="text-xs text-muted">{metric.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            href: "/admin/courses",
            title: "Programs",
            body: "Create, publish, and structure development paths.",
          },
          {
            href: "/admin/resources",
            title: "Resources",
            body: "Manage templates, guides, and downloadable files.",
          },
          {
            href: "/admin/partners",
            title: "Partners",
            body: "Maintain the professional network directory.",
          },
          {
            href: "/admin/short-links",
            title: "Short links",
            body: "Create tracked redirects and disable expired traffic.",
          },
          {
            href: "/admin/campaigns",
            title: "Referral campaigns",
            body: "Configure attribution campaigns and source codes.",
          },
          {
            href: "/admin/settings",
            title: "Academy settings",
            body: "Update branding, theme colors, and tenant profile.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-border bg-surface p-5 hover:bg-sea-foam"
          >
            <h2 className="font-display text-lg font-medium text-primary">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{item.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
