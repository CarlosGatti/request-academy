"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { Select, Textarea } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import { AdminLessonBuilderPanel } from "@/features/admin/admin-lesson-builder-panel";
import {
  CreateDefinedAcademyLessonDocument,
  CreateDefinedAcademyModuleDocument,
  DefinedAcademyCourseAdminDocument,
  PublishDefinedAcademyCourseDocument,
  PublishDefinedAcademyLessonDocument,
  ReorderDefinedAcademyLessonsDocument,
  ReorderDefinedAcademyModulesDocument,
  UpdateDefinedAcademyCourseDocument,
  UpdateDefinedAcademyLessonDocument,
} from "@/graphql/generated/graphql";
import { uploadProgramCover } from "@/lib/academy/uploads";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function bySortOrder<T extends { sortOrder?: number | null }>(a: T, b: T) {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
}

function moveAdjacent<T extends { id: number; sortOrder?: number | null }>(
  items: T[],
  index: number,
  direction: -1 | 1,
) {
  const sorted = [...items].sort(bySortOrder);
  const next = index + direction;
  if (next < 0 || next >= sorted.length) return null;
  const swapped = [...sorted];
  [swapped[index], swapped[next]] = [swapped[next], swapped[index]];
  return swapped.map((item, i) => ({ id: item.id, sortOrder: i }));
}

function CourseEditForm({
  academyId,
  courseId,
  course,
  onSaved,
}: {
  academyId: number;
  courseId: number;
  course: {
    title: string;
    summary?: string | null;
    description?: string | null;
    coverImageUrl?: string | null;
    visibility: string;
    estimatedDurationMinutes?: number | null;
  };
  onSaved: () => Promise<unknown>;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(course.title);
  const [summary, setSummary] = useState(course.summary ?? "");
  const [description, setDescription] = useState(course.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(course.coverImageUrl ?? "");
  const [visibility, setVisibility] = useState(course.visibility);
  const [duration, setDuration] = useState(
    course.estimatedDurationMinutes != null
      ? String(course.estimatedDurationMinutes)
      : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [updateCourse, { loading }] = useMutation(
    UpdateDefinedAcademyCourseDocument,
  );

  return (
    <section className="space-y-4 border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-medium text-primary">
        Edit program
      </h2>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="PUBLIC">Public</option>
            <option value="AUTHENTICATED">Authenticated</option>
            <option value="PRIVATE">Private</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Cover image</Label>
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-[16rem] flex-1 space-y-2">
              <Input
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://… or /uploads/…"
              />
              <FileUploadButton
                accept="image/jpeg,image/png,image/webp"
                label="Upload cover"
                hint="JPEG/PNG/WebP · max 8MB. Upload updates the program cover automatically."
                onFile={async (file) => {
                  try {
                    const result = await uploadProgramCover({
                      file,
                      academyId,
                      courseId,
                    });
                    setCoverImageUrl(result.url);
                    toast("Cover uploaded", "success");
                    await onSaved();
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Unable to upload cover.",
                    );
                  }
                }}
              />
            </div>
            {coverImageUrl ? (
              <div className="relative aspect-[16/9] w-full max-w-xs overflow-hidden border border-border bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Summary</Label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32"
          />
        </div>
      </div>
      <Button
        disabled={loading || !title}
        onClick={() => {
          setError(null);
          void updateCourse({
            variables: {
              academyId,
              courseId,
              input: {
                title,
                summary: summary || undefined,
                description: description || undefined,
                coverImageUrl: coverImageUrl || undefined,
                visibility: visibility as
                  | "PUBLIC"
                  | "AUTHENTICATED"
                  | "PRIVATE",
                estimatedDurationMinutes: duration
                  ? Number(duration)
                  : undefined,
              },
            },
          })
            .then(async () => {
              toast("Program saved", "success");
              await onSaved();
            })
            .catch((err) =>
              setError(getGraphQLErrorMessage(err, "Unable to save program.")),
            );
        }}
      >
        {loading ? "Saving…" : "Save program"}
      </Button>
    </section>
  );
}

export function AdminCourseDetailView({ courseId }: { courseId: number }) {
  const { academyId } = useAdminAcademy();
  const { toast } = useToast();
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonModuleId, setLessonModuleId] = useState<number | "">("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");
  const [lessonType, setLessonType] = useState("VIDEO");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const courseQuery = useQuery(DefinedAcademyCourseAdminDocument, {
    variables: { academyId: academyId ?? 0, courseId },
    skip: !academyId,
  });
  const [createModule, { loading: creatingModule }] = useMutation(
    CreateDefinedAcademyModuleDocument,
  );
  const [createLesson, { loading: creatingLesson }] = useMutation(
    CreateDefinedAcademyLessonDocument,
  );
  const [publishCourse] = useMutation(PublishDefinedAcademyCourseDocument);
  const [publishLesson] = useMutation(PublishDefinedAcademyLessonDocument);
  const [updateLesson] = useMutation(UpdateDefinedAcademyLessonDocument);
  const [reorderModules] = useMutation(ReorderDefinedAcademyModulesDocument);
  const [reorderLessons] = useMutation(ReorderDefinedAcademyLessonsDocument);

  const course = courseQuery.data?.definedAcademyCourse;
  const modules = [...(course?.modules ?? [])].sort(bySortOrder);

  if (!academyId) {
    return <Alert tone="warning">Select an academy first.</Alert>;
  }

  if (courseQuery.loading && !course) return <PageLoading rows={4} />;

  if (courseQuery.error) {
    return (
      <Alert tone="danger" title="Unable to load program">
        {getGraphQLErrorMessage(courseQuery.error)}
      </Alert>
    );
  }

  if (!course) {
    return <Alert tone="warning">Program not found.</Alert>;
  }

  const refetch = () => courseQuery.refetch();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/admin/courses"
          className="text-sm font-medium text-accent hover:underline"
        >
          Back to programs
        </Link>
        <PageHeader
          title={course.title}
          description={course.summary || course.slug}
          actions={<StatusBadge status={course.status ?? "DRAFT"} />}
        />
        <div className="flex flex-wrap gap-2">
          {course.status !== "PUBLISHED" ? (
            <Button
              variant="accent"
              onClick={() =>
                void publishCourse({
                  variables: { academyId, courseId },
                })
                  .then(async () => {
                    toast("Program published", "success");
                    await refetch();
                  })
                  .catch((err) =>
                    setError(
                      getGraphQLErrorMessage(err, "Unable to publish program."),
                    ),
                  )
              }
            >
              Publish program
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <Alert tone="danger">{error}</Alert> : null}

      <CourseEditForm
        key={`${course.id}-${course.title}`}
        academyId={academyId}
        courseId={courseId}
        course={course}
        onSaved={refetch}
      />

      <section className="space-y-4 border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium text-primary">
          Add module
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Module title"
            value={moduleTitle}
            onChange={(event) => setModuleTitle(event.target.value)}
          />
          <Button
            disabled={creatingModule || !moduleTitle}
            onClick={() => {
              setError(null);
              void createModule({
                variables: {
                  academyId,
                  courseId,
                  input: { title: moduleTitle },
                },
              })
                .then(async () => {
                  setModuleTitle("");
                  toast("Module added", "success");
                  await refetch();
                })
                .catch((err) =>
                  setError(
                    getGraphQLErrorMessage(err, "Unable to create module."),
                  ),
                );
            }}
          >
            {creatingModule ? "Adding…" : "Add module"}
          </Button>
        </div>
      </section>

      <section className="space-y-4 border border-border bg-surface p-5">
        <div className="space-y-1">
          <h2 className="font-display text-lg font-medium text-primary">
            Add lesson
          </h2>
          <p className="text-sm text-muted">
            After creating a lesson, open <strong>Content & materials</strong> to
            set the video URL and attach PDFs or templates.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
              value={lessonModuleId === "" ? "" : String(lessonModuleId)}
              onChange={(event) =>
                setLessonModuleId(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
            >
              <option value="">Select module</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={lessonType}
              onChange={(event) => setLessonType(event.target.value)}
            >
              <option value="VIDEO">Video</option>
              <option value="ARTICLE">Article</option>
              <option value="RESOURCE">Resource</option>
              <option value="MIXED">Mixed (video + materials)</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={lessonTitle}
              onChange={(event) => {
                setLessonTitle(event.target.value);
                if (!lessonSlug) setLessonSlug(slugify(event.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={lessonSlug}
              onChange={(event) => setLessonSlug(event.target.value)}
            />
          </div>
          {lessonType === "VIDEO" || lessonType === "MIXED" ? (
            <div className="space-y-2 md:col-span-2">
              <Label>Video URL (optional)</Label>
              <Input
                value={lessonVideoUrl}
                onChange={(event) => setLessonVideoUrl(event.target.value)}
                placeholder="https://player.vimeo.com/… or direct MP4"
              />
            </div>
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPreview}
            onChange={(event) => setIsPreview(event.target.checked)}
          />
          Preview lesson (public)
        </label>
        <Button
          disabled={creatingLesson || !lessonModuleId || !lessonTitle}
          onClick={() => {
            if (!lessonModuleId) return;
            setError(null);
            void createLesson({
              variables: {
                academyId,
                moduleId: lessonModuleId,
                input: {
                  title: lessonTitle,
                  slug: lessonSlug || slugify(lessonTitle),
                  lessonType: lessonType as
                    | "VIDEO"
                    | "ARTICLE"
                    | "RESOURCE"
                    | "MIXED",
                  videoUrl: lessonVideoUrl || undefined,
                  isPreview,
                },
              },
            })
              .then(async (result) => {
                const newId = result.data?.createDefinedAcademyLesson.id;
                setLessonTitle("");
                setLessonSlug("");
                setLessonVideoUrl("");
                setIsPreview(false);
                toast("Lesson added — open Content & materials to finish", "success");
                await refetch();
                if (newId) setEditingLessonId(newId);
              })
              .catch((err) =>
                setError(
                  getGraphQLErrorMessage(err, "Unable to create lesson."),
                ),
              );
          }}
        >
          {creatingLesson ? "Adding…" : "Add lesson"}
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-primary">
          Structure
        </h2>
        {modules.length === 0 ? (
          <Alert tone="info">Add a module to start building the syllabus.</Alert>
        ) : (
          modules.map((module, moduleIndex) => {
            const lessons = [...(module.lessons ?? [])].sort(bySortOrder);
            return (
              <div key={module.id} className="border border-border bg-surface">
                <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-3">
                  <h3 className="font-display text-lg font-medium text-primary">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Move module up"
                        disabled={moduleIndex === 0}
                        onClick={() => {
                          const items = moveAdjacent(
                            modules,
                            moduleIndex,
                            -1,
                          );
                          if (!items) return;
                          void reorderModules({
                            variables: {
                              academyId,
                              input: { parentId: courseId, items },
                            },
                          })
                            .then(async () => {
                              toast("Modules reordered", "success");
                              await refetch();
                            })
                            .catch((err) =>
                              setError(
                                getGraphQLErrorMessage(
                                  err,
                                  "Unable to reorder modules.",
                                ),
                              ),
                            );
                        }}
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Move module down"
                        disabled={moduleIndex === modules.length - 1}
                        onClick={() => {
                          const items = moveAdjacent(
                            modules,
                            moduleIndex,
                            1,
                          );
                          if (!items) return;
                          void reorderModules({
                            variables: {
                              academyId,
                              input: { parentId: courseId, items },
                            },
                          })
                            .then(async () => {
                              toast("Modules reordered", "success");
                              await refetch();
                            })
                            .catch((err) =>
                              setError(
                                getGraphQLErrorMessage(
                                  err,
                                  "Unable to reorder modules.",
                                ),
                              ),
                            );
                        }}
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                    </div>
                    <StatusBadge status={module.status ?? "DRAFT"} />
                  </div>
                </div>
                <ul className="divide-y divide-border">
                  {lessons.map((lesson, lessonIndex) => (
                    <li key={lesson.id}>
                      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <p className="font-medium text-primary">
                            {lesson.title}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted">
                            <span>{lesson.lessonType}</span>
                            <StatusBadge status={lesson.status ?? "DRAFT"} />
                            {lesson.videoUrl ? (
                              <span className="text-accent">Has video</span>
                            ) : lesson.lessonType === "VIDEO" ||
                              lesson.lessonType === "MIXED" ? (
                              <span className="text-highlight">Needs video URL</span>
                            ) : null}
                            {lesson.isPreview ? (
                              <span className="text-accent">Preview</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Move lesson up"
                            disabled={lessonIndex === 0}
                            onClick={() => {
                              const items = moveAdjacent(
                                lessons,
                                lessonIndex,
                                -1,
                              );
                              if (!items) return;
                              void reorderLessons({
                                variables: {
                                  academyId,
                                  input: {
                                    parentId: module.id,
                                    items,
                                  },
                                },
                              })
                                .then(async () => {
                                  toast("Lessons reordered", "success");
                                  await refetch();
                                })
                                .catch((err) =>
                                  setError(
                                    getGraphQLErrorMessage(
                                      err,
                                      "Unable to reorder lessons.",
                                    ),
                                  ),
                                );
                            }}
                          >
                            <ChevronUp className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Move lesson down"
                            disabled={lessonIndex === lessons.length - 1}
                            onClick={() => {
                              const items = moveAdjacent(
                                lessons,
                                lessonIndex,
                                1,
                              );
                              if (!items) return;
                              void reorderLessons({
                                variables: {
                                  academyId,
                                  input: {
                                    parentId: module.id,
                                    items,
                                  },
                                },
                              })
                                .then(async () => {
                                  toast("Lessons reordered", "success");
                                  await refetch();
                                })
                                .catch((err) =>
                                  setError(
                                    getGraphQLErrorMessage(
                                      err,
                                      "Unable to reorder lessons.",
                                    ),
                                  ),
                                );
                            }}
                          >
                            <ChevronDown className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setEditingLessonId(
                                editingLessonId === lesson.id
                                  ? null
                                  : lesson.id,
                              )
                            }
                          >
                            {editingLessonId === lesson.id
                              ? "Close"
                              : "Content & materials"}
                          </Button>
                          {lesson.status !== "PUBLISHED" ? (
                            <Button
                              size="sm"
                              variant="accent"
                              onClick={() =>
                                void publishLesson({
                                  variables: {
                                    academyId,
                                    lessonId: lesson.id,
                                  },
                                })
                                  .then(async () => {
                                    toast("Lesson published", "success");
                                    await refetch();
                                  })
                                  .catch((err) =>
                                    setError(
                                      getGraphQLErrorMessage(
                                        err,
                                        "Unable to publish lesson.",
                                      ),
                                    ),
                                  )
                              }
                            >
                              Publish
                            </Button>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              void updateLesson({
                                variables: {
                                  academyId,
                                  lessonId: lesson.id,
                                  input: { isPreview: !lesson.isPreview },
                                },
                              })
                                .then(async () => {
                                  toast(
                                    lesson.isPreview
                                      ? "Preview unset"
                                      : "Marked as preview",
                                    "success",
                                  );
                                  await refetch();
                                })
                                .catch((err) =>
                                  setError(
                                    getGraphQLErrorMessage(
                                      err,
                                      "Unable to update lesson.",
                                    ),
                                  ),
                                )
                            }
                          >
                            {lesson.isPreview
                              ? "Unset preview"
                              : "Set preview"}
                          </Button>
                        </div>
                      </div>
                      {editingLessonId === lesson.id ? (
                        <AdminLessonBuilderPanel
                          key={lesson.id}
                          academyId={academyId}
                          lesson={lesson}
                          onSaved={refetch}
                          onClose={() => setEditingLessonId(null)}
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
