"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/select";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  CreateDefinedAcademyCourseDocument,
  DefinedAcademyCoursesAdminDocument,
  PublishDefinedAcademyCourseDocument,
  ArchiveDefinedAcademyCourseDocument,
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

export function AdminCoursesView() {
  const { academyId } = useAdminAcademy();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [formError, setFormError] = useState<string | null>(null);

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
        title="Programs"
        description="Create and publish professional development pathways."
        actions={
          <Button variant="highlight" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "New program"}
          </Button>
        }
      />

      {coursesQuery.error ? (
        <Alert tone="danger">{getGraphQLErrorMessage(coursesQuery.error)}</Alert>
      ) : null}

      {showForm ? (
        <div className="space-y-4 border border-border bg-surface p-5">
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

      <div className="space-y-3">
        {courses.length === 0 ? (
          <Alert tone="info">No programs yet. Create the first development path.</Alert>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="font-display text-lg font-medium text-primary hover:underline"
                  >
                    {course.title}
                  </Link>
                  <StatusBadge status={course.status ?? "DRAFT"} />
                </div>
                <p className="text-sm text-muted">
                  {course.slug} · {course.modules?.length ?? 0} modules
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium"
                >
                  Edit
                </Link>
                {course.status !== "PUBLISHED" ? (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() =>
                      void publishCourse({
                        variables: { academyId, courseId: course.id },
                      }).then(() => coursesQuery.refetch())
                    }
                  >
                    Publish
                  </Button>
                ) : null}
                {course.status !== "ARCHIVED" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void archiveCourse({
                        variables: { academyId, courseId: course.id },
                      }).then(() => coursesQuery.refetch())
                    }
                  >
                    Archive
                  </Button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
