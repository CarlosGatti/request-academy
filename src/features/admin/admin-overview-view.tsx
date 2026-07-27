"use client";

import { useQuery } from "@apollo/client/react";
import {
  BarChart3,
  BookOpen,
  Building2,
  FolderOpen,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { ActivityFeed } from "@/components/ui/activity-feed";
import { Alert } from "@/components/ui/alert";
import { buttonClassName } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { InsightCard } from "@/components/ui/insight-card";
import { MetricCard, MetricCardGrid } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { QuickActionCard } from "@/components/ui/quick-action-card";
import { SectionHeader } from "@/components/ui/section-header";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  DataAuditOverviewDocument,
  DefinedAcademyAnalyticsSummaryDocument,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { cn } from "@/lib/utils/cn";

type ContentInsight = {
  title?: string;
  observation?: string;
  recommendation?: string;
  confidence?: string;
  affectedCount?: number;
  percentage?: number;
};

const primaryMetrics = [
  {
    key: "enrollments" as const,
    label: "Enrollments",
    supportingText: "Total learner enrollments",
  },
  {
    key: "courseStarts" as const,
    label: "Course starts",
    supportingText: "Programs begun by learners",
  },
  {
    key: "lessonCompletions" as const,
    label: "Lesson completions",
    supportingText: "Completed lesson events",
  },
  {
    key: "courseCompletions" as const,
    label: "Program completions",
    supportingText: "Fully completed programs",
  },
  {
    key: "publishedCourses" as const,
    label: "Published programs",
    supportingText: "Live in the academy catalog",
  },
  {
    key: "activePartners" as const,
    label: "Active partners",
    supportingText: "Partners currently listed",
  },
];

const secondaryMetrics = [
  {
    key: "shortLinkVisits" as const,
    label: "Short link visits",
  },
  {
    key: "referralVisits" as const,
    label: "Referral visits",
  },
  {
    key: "referralRegistrations" as const,
    label: "Referral registrations",
  },
  {
    key: "referralEnrollments" as const,
    label: "Referral enrollments",
  },
] as const;

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function asInsights(value: unknown): ContentInsight[] {
  return Array.isArray(value) ? (value as ContentInsight[]) : [];
}

export function AdminOverviewView() {
  const { user } = useAuth();
  const { academy, academyId, loading: academyLoading, error: academyError } =
    useAdminAcademy();
  const analyticsQuery = useQuery(DefinedAcademyAnalyticsSummaryDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });
  const auditQuery = useQuery(DataAuditOverviewDocument, {
    // Soft dependency — hide panel if unavailable; do not block overview.
    errorPolicy: "ignore",
  });

  if (academyLoading) return <PageLoading />;

  if (academyError) {
    return (
      <ErrorState title="Unable to load academies">
        {getGraphQLErrorMessage(academyError)}
      </ErrorState>
    );
  }

  if (!academy || !academyId) {
    return (
      <Alert tone="warning" title="No academy selected">
        Create or select an academy to open the operating dashboard.
      </Alert>
    );
  }

  const summary = analyticsQuery.data?.definedAcademyAnalyticsSummary;
  const analyticsLoading = analyticsQuery.loading && !summary;
  const analyticsError = Boolean(analyticsQuery.error);
  const firstName = user?.firstName?.trim();
  const greeting = greetingForHour(new Date().getHours());

  const healthChecks = summary
    ? [
        {
          id: "published",
          label: "At least one published program",
          done: summary.publishedCourses > 0,
          href: "/admin/courses",
        },
        {
          id: "partners",
          label: "At least one active partner",
          done: summary.activePartners > 0,
          href: "/admin/partners",
        },
        {
          id: "enrollments",
          label: "Enrollment activity recorded",
          done: summary.enrollments > 0,
          href: "/admin/courses",
        },
        {
          id: "workspace",
          label: "Academy workspace is active",
          done: academy.status === "ACTIVE",
          href: "/admin/settings",
        },
      ]
    : [];

  const healthComplete = healthChecks.filter((check) => check.done).length;
  const insights = asInsights(
    auditQuery.data?.dataAuditOverview?.contentInsights,
  ).slice(0, 3);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Dashboard"
        title={firstName ? `${greeting}, ${firstName}` : "Academy overview"}
        description={`Here’s what is happening across ${academy.name}.`}
      />

      <section className="space-y-4" aria-labelledby="overview-kpis">
        <SectionHeader
          id="overview-kpis"
          title="Academy performance"
          description="Live metrics from this workspace. Trends are omitted until historical data is available."
        />

        {analyticsError ? (
          <ErrorState title="Unable to load analytics">
            {getGraphQLErrorMessage(analyticsQuery.error)}
          </ErrorState>
        ) : null}

        <MetricCardGrid>
          {primaryMetrics.map((metric) => (
            <MetricCard
              key={metric.key}
              label={metric.label}
              supportingText={metric.supportingText}
              value={summary?.[metric.key]}
              loading={analyticsLoading}
              error={analyticsError && !summary}
            />
          ))}
        </MetricCardGrid>

        {!analyticsLoading && summary ? (
          <MetricCardGrid className="xl:grid-cols-4">
            {secondaryMetrics.map((metric) => (
              <MetricCard
                key={metric.key}
                label={metric.label}
                value={summary[metric.key]}
              />
            ))}
          </MetricCardGrid>
        ) : null}
      </section>

      <section className="space-y-4" aria-labelledby="overview-actions">
        <SectionHeader
          id="overview-actions"
          title="Quick actions"
          description="Jump into the workflows you use most."
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            href="/admin/courses"
            title="Create program"
            description="Structure and publish a development pathway."
            icon={BookOpen}
          />
          <QuickActionCard
            href="/admin/resources"
            title="Upload resource"
            description="Add templates, guides, or downloadable files."
            icon={FolderOpen}
          />
          <QuickActionCard
            href="/admin/partners"
            title="Add partner"
            description="Grow the professional network directory."
            icon={Building2}
          />
          <QuickActionCard
            href="/admin/campaigns"
            title="Create campaign"
            description="Configure first-touch attribution codes."
            icon={Megaphone}
          />
          <QuickActionCard
            href="/admin/data-audit"
            title="Open Data Audit Lab"
            description="Review public data insights and opportunities."
            icon={BarChart3}
          />
        </div>
      </section>

      {healthChecks.length > 0 ? (
        <section className="space-y-4" aria-labelledby="overview-health">
          <SectionHeader
            id="overview-health"
            title="Academy setup"
            description={`${healthComplete} of ${healthChecks.length} readiness checks complete.`}
          />
          <ul className="overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-border/70">
            {healthChecks.map((check) => (
              <li
                key={check.id}
                className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      check.done
                        ? "bg-accent/15 text-accent"
                        : "bg-secondary text-muted",
                    )}
                    aria-hidden
                  >
                    {check.done ? "✓" : "·"}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      check.done ? "text-primary" : "text-muted",
                    )}
                  >
                    {check.label}
                    <span className="sr-only">
                      {check.done ? ", complete" : ", incomplete"}
                    </span>
                  </span>
                </div>
                {!check.done ? (
                  <Link
                    href={check.href}
                    className="shrink-0 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Fix
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4" aria-labelledby="overview-activity">
        <SectionHeader
          id="overview-activity"
          title="Recent activity"
          description="Operational events across programs, content, and growth."
        />
        <ActivityFeed
          items={[]}
          emptyAction={
            <Link
              href="/admin/courses"
              className={buttonClassName({ variant: "outline", size: "sm" })}
            >
              Go to programs
            </Link>
          }
        />
      </section>

      {insights.length > 0 ? (
        <section className="space-y-4" aria-labelledby="overview-insights">
          <SectionHeader
            id="overview-insights"
            title="Content opportunities"
            description="Aggregated findings from the latest public Data Audit Lab run. No private contact details are shown."
            actions={
              <Link
                href="/admin/data-audit"
                className={buttonClassName({ variant: "outline", size: "sm" })}
              >
                View full audit
              </Link>
            }
          />
          <div className="grid gap-3 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <InsightCard
                key={`${insight.title ?? "insight"}-${index}`}
                title={insight.title ?? "Insight"}
                observation={insight.observation}
                recommendation={insight.recommendation}
                confidence={insight.confidence}
                affectedLabel={
                  insight.affectedCount != null
                    ? `${insight.affectedCount} profiles${
                        insight.percentage != null
                          ? ` (${insight.percentage}%)`
                          : ""
                      }`
                    : undefined
                }
                href="/admin/data-audit"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
