import type {
  DefinedAcademyLessonType,
  DefinedAcademyResourceType,
} from "@/graphql/generated/graphql";

const lessonLabels: Record<DefinedAcademyLessonType, string> = {
  VIDEO: "Video",
  ARTICLE: "Article",
  RESOURCE: "Resource",
  MIXED: "Mixed",
};

const resourceLabels: Record<DefinedAcademyResourceType, string> = {
  PDF: "PDF",
  IMAGE: "Image",
  FILE: "File",
  TEXT: "Guide",
  GUIDE: "Guide",
  TEMPLATE: "Template",
  CHECKLIST: "Checklist",
  EXTERNAL_LINK: "Link",
  EMBED: "Embed",
};

export function lessonTypeLabel(type: DefinedAcademyLessonType | string): string {
  return lessonLabels[type as DefinedAcademyLessonType] ?? type;
}

export function resourceTypeLabel(type: DefinedAcademyResourceType | string): string {
  return resourceLabels[type as DefinedAcademyResourceType] ?? type;
}

export function formatDurationMinutes(minutes?: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function formatDurationSeconds(seconds?: number | null): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.round(seconds / 60);
  return formatDurationMinutes(mins);
}
