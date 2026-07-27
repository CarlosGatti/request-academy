"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { ProgramCard } from "@/components/ui/program-card";
import { Select, Textarea } from "@/components/ui/select";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  ArchiveDefinedAcademyCourseDocument,
  CreateDefinedAcademyCourseDocument,
  DefinedAcademyCoursesAdminDocument,
  PublishDefinedAcademyCourseDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { requireGraphQLInt } from "@/lib/graphql/ids";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type StatusFilter = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED";
type SortKey = "newest" | "title" | "status";

export function AdminCoursesView() {
  const { academyId } = useAdminAcademy();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [pendingArchiveId, setPendingArchiveId] = useState<number | null>(null);

  const coursesQuery = useQuery(DefinedAcademyCoursesAdminDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });
  const [createCourse, { loading: creating }] = useMutation(
    CreateDefinedAcademyCourseDocument,
  );
  const [publishCourse] = useMutation(PublishDefinedAcademyCourseDocument);
  const [archiveCourse] = useMutation(ArchiveDefinedAcademyCourseDocument);

  const courses = coursesQuery.data?.definedAcademyCourses ?? [];

  const filteredCourses = useMemo(() => {
    const source = coursesQuery.data?.definedAcademyCourses ?? [];
    const query = search.trim().toLowerCase();
    const rows = source.filter((course) => {
      const status = course.status ?? "DRAFT";
      if (statusFilter !== "ALL" && status !== statusFilter) return false;
      if (!query) return true;
      return (
        course.title.toLowerCase().includes(query) ||
        course.slug.toLowerCase().includes(query) ||
        (course.summary ?? "").toLowerCase().includes(query)
      );
    });

    return [...rows].sort((a, b) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortKey === "status") {
        return (a.status ?? "").localeCompare(b.status ?? "");
      }
      const aTime = a.publishedAt
        ? new Date(String(a.publishedAt)).getTime()
        : a.id;
      const bTime = b.publishedAt
        ? new Date(String(b.publishedAt)).getTime()
        : b.id;
      return Number(bTime) - Number(aTime);
    });
  }, [coursesQuery.data?.definedAcademyCourses, search, sortKey, statusFilter]);

  const onCreate = async () => {
    if (!academyId) return;
    setFormError(null);
    try {
      await createCourse({
        variables: {
          academyId: requireGraphQLInt(academyId, "academyId"),
          input: {
            title,
            slug: slug || slugify(title),
            summary: summary || undefined,
            visibility: visibility as "PUBLIC" | "AUTHENTICATED" | "PRIVATE",
          },
        },
      });
      setTitle("");
      setSlug("");
      setSummary("");
      setShowForm(false);
      await coursesQuery.refetch();
    } catch (err) {
      setFormError(getGraphQLErrorMessage(err, "Unable to create program."));
    }
  };

  if (!academyId) {
    return <Alert tone="warning">Select an academy to manage programs.</Alert>;
  }

  if (coursesQuery.loading && !courses.length) return <PageLoading />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Learning"
        title="Programs"
        description="Create, structure, publish, and monitor professional development programs."
        actions={
          <Button variant="highlight" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Create program"}
          </Button>
        }
      />

      {coursesQuery.error ? (
        <Alert tone="danger">{getGraphQLErrorMessage(coursesQuery.error)}</Alert>
      ) : null}

      {showForm ? (
        <div className="space-y-4 rounded-xl bg-surface p-5 shadow-card ring-1 ring-border/70">
          <h2 className="font-display text-lg font-medium text-primary">
            New program
          </h2>
          {formError ? <Alert tone="danger">{formError}</Alert> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (!slug) setSlug(slugify(event.target.value));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              id="visibility"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
            >
              <option value="PUBLIC">Public</option>
              <option value="AUTHENTICATED">Authenticated</option>
              <option value="PRIVATE">Private</option>
            </Select>
          </div>
          <Button disabled={creating || !title} onClick={() => void onCreate()}>
            {creating ? "Creating…" : "Create program"}
          </Button>
        </div>
      ) : null}

      {courses.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl bg-surface p-3 shadow-card ring-1 ring-border/70 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="program-search">Search</Label>
            <Input
              id="program-search"
              placeholder="Search by title, slug, or summary"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="w-full space-y-2 sm:w-40">
            <Label htmlFor="program-status">Status</Label>
            <Select
              id="program-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
          <div className="w-full space-y-2 sm:w-40">
            <Label htmlFor="program-sort">Sort</Label>
            <Select
              id="program-sort"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
            >
              <option value="newest">Newest</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </Select>
          </div>
        </div>
      ) : null}

      {courses.length === 0 ? (
        <EmptyState
          title="No programs yet"
          description="Create the first professional development pathway for this academy."
          action={
            <Button variant="highlight" onClick={() => setShowForm(true)}>
              Create program
            </Button>
          }
        />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title="No matching programs"
          description="Try a different search or clear the status filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => {
            const moduleCount = course.modules?.length ?? 0;
            const lessonCount =
              course.modules?.reduce(
                (total, module) => total + (module.lessons?.length ?? 0),
                0,
              ) ?? 0;

            return (
              <div key={course.id} className="space-y-2">
                <ProgramCard
                  program={{
                    id: course.id,
                    title: course.title,
                    slug: course.slug,
                    summary: course.summary,
                    status: course.status,
                    visibility: course.visibility,
                    moduleCount,
                    lessonCount,
                    publishedAt: course.publishedAt,
                  }}
                  onPublish={() =>
                    void publishCourse({
                      variables: { academyId, courseId: course.id },
                    }).then(() => coursesQuery.refetch())
                  }
                  onArchive={() => setPendingArchiveId(course.id)}
                />
                {pendingArchiveId === course.id ? (
                  <div
                    role="alertdialog"
                    aria-labelledby={`archive-title-${course.id}`}
                    aria-describedby={`archive-desc-${course.id}`}
                    className="rounded-xl bg-sea-foam/70 p-4 ring-1 ring-border"
                  >
                    <p
                      id={`archive-title-${course.id}`}
                      className="font-medium text-primary"
                    >
                      Archive “{course.title}”?
                    </p>
                    <p
                      id={`archive-desc-${course.id}`}
                      className="mt-1 text-sm text-muted"
                    >
                      Archived programs leave the active catalog. You can still
                      open them from this list when filtering by Archived.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void archiveCourse({
                            variables: { academyId, courseId: course.id },
                          }).then(async () => {
                            setPendingArchiveId(null);
                            await coursesQuery.refetch();
                          })
                        }
                      >
                        Confirm archive
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPendingArchiveId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
