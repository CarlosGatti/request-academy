"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
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

export function AdminResourcesView() {
  const { academyId } = useAdminAcademy();
  const { toast } = useToast();
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

  if (!academyId) {
    return <Alert tone="warning">Select an academy to manage resources.</Alert>;
  }

  if (resourcesQuery.loading && !resources.length) return <PageLoading />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resources"
        description="Academy-wide materials and lesson attachments. Prefer attaching inside a program via Content & materials when the file belongs to a specific lesson."
      />

      <Alert tone="info">
        Upload PDFs/images here (or inside a lesson via{" "}
        <strong>Content & materials</strong>). Files go to the academy upload
        API; create the resource afterward with the returned URL.
      </Alert>

      <div className="space-y-4 border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium text-primary">
          Add resource
        </h2>
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onChange={(e) =>
                setType(e.target.value as DefinedAcademyResourceType)
              }
            >
              {RESOURCE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>File URL</Label>
            <Input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://…/file.pdf"
            />
            <FileUploadButton
              accept="image/jpeg,image/png,image/webp,application/pdf"
              label="Upload file"
              hint="PDF/JPEG/PNG/WebP · max 12MB"
              onFile={async (file) => {
                try {
                  const result = await uploadResourceFile({
                    file,
                    academyId,
                  });
                  setFileUrl(result.url);
                  setFileName(result.fileName);
                  setMimeType(result.mimeType);
                  if (file.type === "application/pdf") setType("PDF");
                  else if (file.type.startsWith("image/")) setType("IMAGE");
                  toast("File uploaded — create the resource to attach it", "success");
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Unable to upload file.",
                  );
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>External URL</Label>
            <Input
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://… (optional)"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Attach to lesson (optional)</Label>
            <Select
              value={lessonId === "" ? "" : String(lessonId)}
              onChange={(e) =>
                setLessonId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">Academy toolkit only (no lesson)</option>
              {lessonOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={downloadable}
            onChange={(e) => setDownloadable(e.target.checked)}
          />
          Downloadable
        </label>
        <Button
          disabled={loading || !title || (!fileUrl && !externalUrl)}
          onClick={() => {
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
                setTitle("");
                setFileUrl("");
                setFileName("");
                setMimeType("");
                setExternalUrl("");
                setDescription("");
                setLessonId("");
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
          {loading ? "Saving…" : "Create resource"}
        </Button>
      </div>

      <div className="space-y-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-primary">{resource.title}</p>
                <StatusBadge status={resource.status ?? "DRAFT"} />
                <span className="text-xs text-muted">{resource.type}</span>
              </div>
              {resource.lessonId ? (
                <p className="text-xs text-accent">
                  Lesson:{" "}
                  {lessonLabelById.get(resource.lessonId) ??
                    `#${resource.lessonId}`}
                </p>
              ) : (
                <p className="text-xs text-muted">Academy toolkit</p>
              )}
              {resource.description ? (
                <p className="text-sm text-muted line-clamp-2">
                  {resource.description}
                </p>
              ) : null}
            </div>
            {resource.status !== "ARCHIVED" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void archiveResource({
                    variables: { academyId, resourceId: resource.id },
                  })
                    .then(async () => {
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
                Archive
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
