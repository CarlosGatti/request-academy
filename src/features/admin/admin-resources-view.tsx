"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { ResourceCard } from "@/components/ui/resource-card";
import { Select, Textarea } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  ArchiveDefinedAcademyResourceDocument,
  CreateDefinedAcademyResourceDocument,
  DefinedAcademyCoursesAdminDocument,
  DefinedAcademyResourcesAdminDocument,
  type DefinedAcademyResourceType,
} from "@/graphql/generated/graphql";
import { uploadResourceFile } from "@/lib/academy/uploads";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

const RESOURCE_TYPES: DefinedAcademyResourceType[] = [
  "PDF",
  "TEMPLATE",
  "CHECKLIST",
  "GUIDE",
  "FILE",
  "IMAGE",
  "EXTERNAL_LINK",
  "EMBED",
  "TEXT",
];

type AttachmentFilter = "ALL" | "ACADEMY" | "LESSON";
type SortKey = "newest" | "title" | "type";

export function AdminResourcesView() {
  const { academyId } = useAdminAcademy();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DefinedAcademyResourceType>("TEMPLATE");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [description, setDescription] = useState("");
  const [lessonId, setLessonId] = useState<number | "">("");
  const [downloadable, setDownloadable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [attachmentFilter, setAttachmentFilter] =
    useState<AttachmentFilter>("ALL");
  const [downloadableFilter, setDownloadableFilter] = useState<
    "ALL" | "YES" | "NO"
  >("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [pendingArchiveId, setPendingArchiveId] = useState<number | null>(null);

  const resourcesQuery = useQuery(DefinedAcademyResourcesAdminDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });
  const coursesQuery = useQuery(DefinedAcademyCoursesAdminDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });
  const [createResource, { loading }] = useMutation(
    CreateDefinedAcademyResourceDocument,
  );
  const [archiveResource] = useMutation(ArchiveDefinedAcademyResourceDocument);

  const resources = resourcesQuery.data?.definedAcademyResources ?? [];
  const lessonOptions = useMemo(() => {
    const options: { id: number; label: string }[] = [];
    for (const course of coursesQuery.data?.definedAcademyCourses ?? []) {
      for (const courseModule of course.modules ?? []) {
        for (const lesson of courseModule.lessons ?? []) {
          options.push({
            id: lesson.id,
            label: `${course.title} · ${courseModule.title} · ${lesson.title}`,
          });
        }
      }
    }
    return options;
  }, [coursesQuery.data?.definedAcademyCourses]);

  const lessonLabelById = useMemo(() => {
    const map = new Map<number, string>();
    for (const option of lessonOptions) map.set(option.id, option.label);
    return map;
  }, [lessonOptions]);

  const filteredResources = useMemo(() => {
    const source = resourcesQuery.data?.definedAcademyResources ?? [];
    const query = search.trim().toLowerCase();
    const rows = source.filter((resource) => {
      if (typeFilter !== "ALL" && resource.type !== typeFilter) return false;
      if (attachmentFilter === "ACADEMY" && resource.lessonId) return false;
      if (attachmentFilter === "LESSON" && !resource.lessonId) return false;
      if (downloadableFilter === "YES" && !resource.downloadable) return false;
      if (downloadableFilter === "NO" && resource.downloadable) return false;
      if (!query) return true;
      return (
        resource.title.toLowerCase().includes(query) ||
        (resource.description ?? "").toLowerCase().includes(query) ||
        resource.type.toLowerCase().includes(query)
      );
    });

    return [...rows].sort((a, b) => {
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "type") return a.type.localeCompare(b.type);
      return b.id - a.id;
    });
  }, [
    attachmentFilter,
    downloadableFilter,
    resourcesQuery.data?.definedAcademyResources,
    search,
    sortKey,
    typeFilter,
  ]);

  const resetForm = () => {
    setTitle("");
    setFileUrl("");
    setFileName("");
    setMimeType("");
    setExternalUrl("");
    setDescription("");
    setLessonId("");
    setDownloadable(true);
    setType("TEMPLATE");
    setError(null);
  };

  const sourceValid = Boolean(fileUrl.trim() || externalUrl.trim());

  if (!academyId) {
    return <Alert tone="warning">Select an academy to manage resources.</Alert>;
  }

  if (resourcesQuery.loading && !resources.length) return <PageLoading />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content"
        title="Resources"
        description="Manage Academy-wide templates, guides, and downloadable materials."
        actions={
          <Button
            variant="highlight"
            onClick={() => {
              setShowForm((value) => !value);
              setError(null);
            }}
          >
            {showForm ? "Close form" : "Upload resource"}
          </Button>
        }
      />

      {resourcesQuery.error ? (
        <Alert tone="danger">
          {getGraphQLErrorMessage(resourcesQuery.error)}
        </Alert>
      ) : null}

      {resources.length > 0 ? (
        <div className="grid gap-3 rounded-xl bg-surface p-3 shadow-card ring-1 ring-border/70 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="resource-search">Search</Label>
            <Input
              id="resource-search"
              placeholder="Search resources"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resource-type">Type</Label>
            <Select
              id="resource-type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="ALL">All types</option>
              {RESOURCE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resource-attachment">Attachment</Label>
            <Select
              id="resource-attachment"
              value={attachmentFilter}
              onChange={(event) =>
                setAttachmentFilter(event.target.value as AttachmentFilter)
              }
            >
              <option value="ALL">All placements</option>
              <option value="ACADEMY">Academy-wide</option>
              <option value="LESSON">Attached to lesson</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resource-downloadable">Downloadable</Label>
            <Select
              id="resource-downloadable"
              value={downloadableFilter}
              onChange={(event) =>
                setDownloadableFilter(
                  event.target.value as "ALL" | "YES" | "NO",
                )
              }
            >
              <option value="ALL">Any</option>
              <option value="YES">Downloadable</option>
              <option value="NO">View only</option>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="resource-sort">Sort</Label>
            <Select
              id="resource-sort"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
            >
              <option value="newest">Newest</option>
              <option value="title">Title</option>
              <option value="type">Type</option>
            </Select>
          </div>
        </div>
      ) : null}

      {resources.length === 0 && !showForm ? (
        <EmptyState
          title="No resources yet"
          description="Upload templates, guides, and files for the academy toolkit or attach them to lessons."
          action={
            <Button variant="highlight" onClick={() => setShowForm(true)}>
              Upload resource
            </Button>
          }
        />
      ) : filteredResources.length === 0 && resources.length > 0 ? (
        <EmptyState
          title="No matching resources"
          description="Try a different search or clear filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setAttachmentFilter("ALL");
                setDownloadableFilter("ALL");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="space-y-2">
              <ResourceCard
                resource={{
                  id: resource.id,
                  title: resource.title,
                  type: resource.type,
                  description: resource.description,
                  fileUrl: resource.fileUrl,
                  externalUrl: resource.externalUrl,
                  downloadable: resource.downloadable,
                  status: resource.status,
                  placementLabel: resource.lessonId
                    ? `Lesson · ${
                        lessonLabelById.get(resource.lessonId) ??
                        `#${resource.lessonId}`
                      }`
                    : "Academy-wide",
                }}
                onArchive={() => setPendingArchiveId(resource.id)}
              />
              {pendingArchiveId === resource.id ? (
                <div
                  role="alertdialog"
                  aria-labelledby={`archive-resource-${resource.id}`}
                  className="rounded-xl bg-sea-foam/70 p-4 ring-1 ring-border"
                >
                  <p
                    id={`archive-resource-${resource.id}`}
                    className="font-medium text-primary"
                  >
                    Archive “{resource.title}”?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void archiveResource({
                          variables: {
                            academyId,
                            resourceId: resource.id,
                          },
                        })
                          .then(async () => {
                            setPendingArchiveId(null);
                            toast("Resource archived", "success");
                            await resourcesQuery.refetch();
                          })
                          .catch((err) =>
                            setError(
                              getGraphQLErrorMessage(
                                err,
                                "Unable to archive resource.",
                              ),
                            ),
                          )
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
          ))}
        </div>
      )}

      {showForm ? (
        <form
          className="space-y-6 rounded-xl bg-surface p-5 shadow-card ring-1 ring-border/70"
          onSubmit={(event) => {
            event.preventDefault();
            if (!sourceValid || !title.trim()) {
              setError("Title and either an uploaded file or external URL are required.");
              return;
            }
            setError(null);
            void createResource({
              variables: {
                academyId,
                input: {
                  title,
                  type,
                  fileUrl: fileUrl || undefined,
                  externalUrl: externalUrl || undefined,
                  description: description || undefined,
                  downloadable,
                  lessonId: lessonId === "" ? undefined : lessonId,
                  mimeType: mimeType || undefined,
                  fileName: fileName || undefined,
                },
              },
            })
              .then(async () => {
                resetForm();
                setShowForm(false);
                toast("Resource created", "success");
                await resourcesQuery.refetch();
              })
              .catch((err) =>
                setError(
                  getGraphQLErrorMessage(err, "Unable to create resource."),
                ),
              );
          }}
        >
          <div>
            <h2 className="font-display text-lg font-medium text-primary">
              Add resource
            </h2>
            <p className="mt-1 text-sm text-muted">
              Prefer attaching inside a program via Content & materials when the
              file belongs to a specific lesson.
            </p>
          </div>

          {error ? <Alert tone="danger">{error}</Alert> : null}

          <fieldset className="space-y-4">
            <legend className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
              Resource details
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="resource-title">Title</Label>
                <Input
                  id="resource-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-form-type">Resource type</Label>
                <Select
                  id="resource-form-type"
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as DefinedAcademyResourceType)
                  }
                >
                  {RESOURCE_TYPES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="resource-description">Description</Label>
                <Textarea
                  id="resource-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
              Source
            </legend>
            <p className="text-sm text-muted">
              Provide an uploaded file, an external URL, or both. At least one
              is required.
            </p>
            <FileUpload
              accept="image/jpeg,image/png,image/webp,application/pdf"
              label="Drop a file here or click to upload"
              hint="PDF / JPEG / PNG / WebP · max 12MB"
              fileName={fileName || null}
              onClear={() => {
                setFileUrl("");
                setFileName("");
                setMimeType("");
              }}
              onFile={async (file) => {
                const result = await uploadResourceFile({
                  file,
                  academyId,
                });
                setFileUrl(result.url);
                setFileName(result.fileName);
                setMimeType(result.mimeType);
                if (file.type === "application/pdf") setType("PDF");
                else if (file.type.startsWith("image/")) setType("IMAGE");
                toast("File uploaded — save the resource to attach it", "success");
              }}
            />
            {fileUrl ? (
              <p className="truncate text-xs text-muted">URL: {fileUrl}</p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="resource-external">External URL</Label>
              <Input
                id="resource-external"
                value={externalUrl}
                onChange={(event) => setExternalUrl(event.target.value)}
                placeholder="https://…"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
              Placement
            </legend>
            <div className="space-y-2">
              <Label htmlFor="resource-lesson">Attach to a lesson</Label>
              <Select
                id="resource-lesson"
                value={lessonId === "" ? "" : String(lessonId)}
                onChange={(event) =>
                  setLessonId(
                    event.target.value ? Number(event.target.value) : "",
                  )
                }
              >
                <option value="">Academy-wide resource</option>
                {lessonOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
              Access
            </legend>
            <label className="flex items-center gap-2 text-sm text-primary">
              <input
                type="checkbox"
                checked={downloadable}
                onChange={(event) => setDownloadable(event.target.checked)}
              />
              Downloadable
            </label>
          </fieldset>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading || !title || !sourceValid}>
              {loading ? "Saving…" : "Create resource"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
