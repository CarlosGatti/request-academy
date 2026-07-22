"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { FileText, Link2, Plus, Video } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, Textarea } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import {
  ArchiveDefinedAcademyResourceDocument,
  CreateDefinedAcademyResourceDocument,
  DefinedAcademyResourcesAdminDocument,
  UpdateDefinedAcademyLessonDocument,
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

export type LessonBuilderLesson = {
  id: number;
  title: string;
  summary?: string | null;
  lessonType: string;
  videoUrl?: string | null;
  bodyContent?: string | null;
};

export function AdminLessonBuilderPanel({
  academyId,
  lesson,
  onSaved,
  onClose,
}: {
  academyId: number;
  lesson: LessonBuilderLesson;
  onSaved: () => Promise<unknown>;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(lesson.title);
  const [summary, setSummary] = useState(lesson.summary ?? "");
  const [lessonType, setLessonType] = useState(lesson.lessonType);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
  const [bodyContent, setBodyContent] = useState(lesson.bodyContent ?? "");
  const [contentError, setContentError] = useState<string | null>(null);

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] =
    useState<DefinedAcademyResourceType>("PDF");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [showAddResource, setShowAddResource] = useState(false);

  const [updateLesson, { loading: savingLesson }] = useMutation(
    UpdateDefinedAcademyLessonDocument,
  );
  const resourcesQuery = useQuery(DefinedAcademyResourcesAdminDocument, {
    variables: { academyId, lessonId: lesson.id },
  });
  const [createResource, { loading: creatingResource }] = useMutation(
    CreateDefinedAcademyResourceDocument,
  );
  const [archiveResource] = useMutation(ArchiveDefinedAcademyResourceDocument);

  const resources = (resourcesQuery.data?.definedAcademyResources ?? []).filter(
    (r) => r.status !== "ARCHIVED",
  );
  const showVideoField =
    lessonType === "VIDEO" || lessonType === "MIXED" || Boolean(videoUrl);

  return (
    <div className="space-y-6 border-t border-border bg-secondary/15 px-4 py-5">
      <div className="space-y-1">
        <p className="font-display text-base font-medium text-primary">
          Lesson content & materials
        </p>
        <p className="text-sm text-muted">
          Paste a hosted video URL and attach downloadable materials. Files are
          not uploaded here — host them (CDN/S3) and paste the link.
        </p>
      </div>

      {contentError ? <Alert tone="danger">{contentError}</Alert> : null}

      <section className="space-y-3 rounded-md border border-border bg-surface p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Video className="size-4 text-accent" />
          Content
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value)}
            >
              <option value="VIDEO">Video</option>
              <option value="ARTICLE">Article</option>
              <option value="RESOURCE">Resource</option>
              <option value="MIXED">Mixed (video + materials)</option>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Summary</Label>
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short learner-facing summary"
            />
          </div>
          {showVideoField ? (
            <div className="space-y-2 md:col-span-2">
              <Label>Video URL</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://player.vimeo.com/… or https://cdn.example.com/lesson.mp4"
              />
              <p className="text-xs text-muted">
                Supports YouTube/Vimeo links (watch or embed) or a direct MP4 URL.
              </p>
            </div>
          ) : null}
          <div className="space-y-2 md:col-span-2">
            <Label>Body / notes</Label>
            <Textarea
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="min-h-32 font-serif"
              placeholder="Transcript, checklist notes, or article body…"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={savingLesson || !title}
            onClick={() => {
              setContentError(null);
              void updateLesson({
                variables: {
                  academyId,
                  lessonId: lesson.id,
                  input: {
                    title,
                    summary: summary || undefined,
                    lessonType: lessonType as
                      | "VIDEO"
                      | "ARTICLE"
                      | "RESOURCE"
                      | "MIXED",
                    videoUrl: videoUrl || null,
                    bodyContent: bodyContent || null,
                  },
                },
              })
                .then(async () => {
                  toast("Lesson content saved", "success");
                  await onSaved();
                })
                .catch((err) =>
                  setContentError(
                    getGraphQLErrorMessage(err, "Unable to save lesson."),
                  ),
                );
            }}
          >
            {savingLesson ? "Saving…" : "Save content"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </section>

      <section className="space-y-3 rounded-md border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <FileText className="size-4 text-accent" />
            Lesson materials
            <span className="text-xs font-normal text-muted">
              ({resources.length})
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddResource((v) => !v)}
          >
            <Plus className="size-3.5" />
            {showAddResource ? "Cancel" : "Add material"}
          </Button>
        </div>

        {resourceError ? <Alert tone="danger">{resourceError}</Alert> : null}

        {showAddResource ? (
          <div className="space-y-3 border border-dashed border-border bg-secondary/20 p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="90-day checklist PDF"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={resourceType}
                  onChange={(e) =>
                    setResourceType(e.target.value as DefinedAcademyResourceType)
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
                      if (file.type === "application/pdf") setResourceType("PDF");
                      else if (file.type.startsWith("image/"))
                        setResourceType("IMAGE");
                      toast("File uploaded", "success");
                    } catch (err) {
                      setResourceError(
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
                  placeholder="https://… (optional link)"
                />
              </div>
            </div>
            <Button
              size="sm"
              disabled={
                creatingResource ||
                !resourceTitle ||
                (!fileUrl && !externalUrl)
              }
              onClick={() => {
                setResourceError(null);
                void createResource({
                  variables: {
                    academyId,
                    input: {
                      lessonId: lesson.id,
                      title: resourceTitle,
                      type: resourceType,
                      fileUrl: fileUrl || undefined,
                      externalUrl: externalUrl || undefined,
                      downloadable: Boolean(fileUrl),
                      mimeType: mimeType || undefined,
                      fileName: fileName || undefined,
                    },
                  },
                })
                  .then(async () => {
                    setResourceTitle("");
                    setFileUrl("");
                    setFileName("");
                    setMimeType("");
                    setExternalUrl("");
                    setShowAddResource(false);
                    toast("Material attached to lesson", "success");
                    await resourcesQuery.refetch();
                  })
                  .catch((err) =>
                    setResourceError(
                      getGraphQLErrorMessage(
                        err,
                        "Unable to create material.",
                      ),
                    ),
                  );
              }}
            >
              {creatingResource ? "Adding…" : "Attach material"}
            </Button>
          </div>
        ) : null}

        {resourcesQuery.loading && !resources.length ? (
          <p className="text-sm text-muted">Loading materials…</p>
        ) : resources.length === 0 ? (
          <p className="text-sm text-muted">
            No materials yet. Add templates, PDFs, or checklists for this
            lesson.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {resources.map((resource) => (
              <li
                key={resource.id}
                className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-primary">
                      {resource.title}
                    </p>
                    <span className="text-xs text-muted">{resource.type}</span>
                    <StatusBadge status={resource.status ?? "DRAFT"} />
                  </div>
                  {resource.fileUrl || resource.externalUrl ? (
                    <p className="flex items-center gap-1 text-xs text-muted">
                      <Link2 className="size-3 shrink-0" />
                      <span className="truncate">
                        {resource.fileUrl || resource.externalUrl}
                      </span>
                    </p>
                  ) : null}
                </div>
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
                        toast("Material archived", "success");
                        await resourcesQuery.refetch();
                      })
                      .catch((err) =>
                        setResourceError(
                          getGraphQLErrorMessage(
                            err,
                            "Unable to archive material.",
                          ),
                        ),
                      )
                  }
                >
                  Archive
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
