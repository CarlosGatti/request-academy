/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AttachDefinedAcademyReferralInput = {
  referralCode: string;
};

export type CaptureDefinedAcademyReferralInput = {
  academyId: number;
  campaignId?: number | null | undefined;
  metadata?: unknown;
  partnerId?: number | null | undefined;
  referralCode: string;
  referrerUserId?: number | null | undefined;
};

export type CreateDataAuditShareInput = {
  auditRunId?: number | null | undefined;
  expiresInDays?: number | null | undefined;
  inviteCtaLabel?: string | null | undefined;
  invitePath?: string | null | undefined;
  personalMessage?: string | null | undefined;
  recipientName?: string | null | undefined;
  title?: string | null | undefined;
};

export type CreateDefinedAcademyCourseInput = {
  coverImageUrl?: string | null | undefined;
  description?: string | null | undefined;
  estimatedDurationMinutes?: number | null | undefined;
  level?: string | null | undefined;
  slug: string;
  sortOrder?: number | null | undefined;
  summary?: string | null | undefined;
  title: string;
  visibility?: DefinedAcademyCourseVisibility | null | undefined;
};

export type CreateDefinedAcademyLessonInput = {
  bodyContent?: string | null | undefined;
  description?: string | null | undefined;
  isPreview?: boolean | null | undefined;
  lessonType?: DefinedAcademyLessonType | null | undefined;
  slug: string;
  sortOrder?: number | null | undefined;
  summary?: string | null | undefined;
  title: string;
  videoDurationSeconds?: number | null | undefined;
  videoProvider?: string | null | undefined;
  videoUrl?: string | null | undefined;
  visibility?: DefinedAcademyCourseVisibility | null | undefined;
};

export type CreateDefinedAcademyModuleInput = {
  description?: string | null | undefined;
  sortOrder?: number | null | undefined;
  status?: DefinedAcademyContentStatus | null | undefined;
  title: string;
};

export type CreateDefinedAcademyPartnerCategoryInput = {
  description?: string | null | undefined;
  name: string;
  slug: string;
  sortOrder?: number | null | undefined;
};

export type CreateDefinedAcademyPartnerInput = {
  categoryId?: number | null | undefined;
  contactUrl?: string | null | undefined;
  description?: string | null | undefined;
  featured?: boolean | null | undefined;
  location?: string | null | undefined;
  logoUrl?: string | null | undefined;
  name: string;
  slug: string;
  sortOrder?: number | null | undefined;
  status?: DefinedAcademyPartnerStatus | null | undefined;
  websiteUrl?: string | null | undefined;
};

export type CreateDefinedAcademyReferralCampaignInput = {
  code?: string | null | undefined;
  courseId?: number | null | undefined;
  description?: string | null | undefined;
  endsAt?: unknown;
  metadata?: unknown;
  name: string;
  partnerId?: number | null | undefined;
  resourceId?: number | null | undefined;
  sourceType?: DefinedAcademyReferralSourceType | null | undefined;
  startsAt?: unknown;
  status?: DefinedAcademyReferralCampaignStatus | null | undefined;
};

export type CreateDefinedAcademyResourceInput = {
  description?: string | null | undefined;
  downloadable?: boolean | null | undefined;
  externalUrl?: string | null | undefined;
  fileName?: string | null | undefined;
  fileSize?: number | null | undefined;
  fileUrl?: string | null | undefined;
  lessonId?: number | null | undefined;
  mimeType?: string | null | undefined;
  sortOrder?: number | null | undefined;
  textContent?: string | null | undefined;
  title: string;
  type: DefinedAcademyResourceType;
  visibility?: DefinedAcademyCourseVisibility | null | undefined;
};

export type CreateDefinedAcademyShortLinkInput = {
  courseId?: number | null | undefined;
  customCode?: string | null | undefined;
  destinationUrl: string;
  expiresAt?: unknown;
  partnerId?: number | null | undefined;
  referralCampaignId?: number | null | undefined;
  resourceId?: number | null | undefined;
};

export type DataAuditFieldClassification =
  | 'INTERNAL'
  | 'PERSONAL'
  | 'PUBLIC'
  | 'SECURITY_RELEVANT'
  | 'SENSITIVE'
  | 'UNKNOWN';

export type DataAuditFindingStatus =
  | 'ACCEPTED_RISK'
  | 'FALSE_POSITIVE'
  | 'FIXED'
  | 'OPEN'
  | 'REVIEWED';

export type DataAuditFindingsFilterInput = {
  auditRunId?: number | null | undefined;
  category?: string | null | undefined;
  exposureOnly?: boolean | null | undefined;
  ruleCode?: string | null | undefined;
  severity?: string | null | undefined;
  skip?: number | null | undefined;
  status?: string | null | undefined;
  take?: number | null | undefined;
};

export type DataAuditProfilesFilterInput = {
  agentType?: string | null | undefined;
  auditRunId?: number | null | undefined;
  hasDocumentReferences?: boolean | null | undefined;
  hasEmail?: boolean | null | undefined;
  hasPhone?: boolean | null | undefined;
  isProfileComplete?: boolean | null | undefined;
  isPublic?: boolean | null | undefined;
  isVerified?: boolean | null | undefined;
  search?: string | null | undefined;
  skip?: number | null | undefined;
  take?: number | null | undefined;
};

export type DataAuditRunStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'PENDING'
  | 'RUNNING';

export type DefinedAcademyCareerJourneyStatus =
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'DRAFT';

export type DefinedAcademyContentStatus =
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED';

export type DefinedAcademyCourseStatus =
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED';

export type DefinedAcademyCourseVisibility =
  | 'AUTHENTICATED'
  | 'PRIVATE'
  | 'PUBLIC';

export type DefinedAcademyLessonType =
  | 'ARTICLE'
  | 'MIXED'
  | 'RESOURCE'
  | 'VIDEO';

export type DefinedAcademyPartnerStatus =
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'DRAFT';

export type DefinedAcademyReferralCampaignStatus =
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'DRAFT';

export type DefinedAcademyReferralSourceType =
  | 'EMAIL'
  | 'EVENT'
  | 'LINKEDIN'
  | 'ORGANIC'
  | 'OTHER'
  | 'PARTNER'
  | 'PROFESSIONAL'
  | 'SCHOOL'
  | 'SOCIAL';

export type DefinedAcademyResourceStatus =
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED';

export type DefinedAcademyResourceType =
  | 'CHECKLIST'
  | 'EMBED'
  | 'EXTERNAL_LINK'
  | 'FILE'
  | 'GUIDE'
  | 'IMAGE'
  | 'PDF'
  | 'TEMPLATE'
  | 'TEXT';

export type DefinedAcademyShortLinkStatus =
  | 'ACTIVE'
  | 'DISABLED'
  | 'EXPIRED';

export type DefinedAcademyStatus =
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'DRAFT';

export type LoginUserInput = {
  email: string;
  password: string;
};

export type RegisterUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type ReorderDefinedAcademyItemInput = {
  id: number;
  sortOrder: number;
};

export type ReorderDefinedAcademyItemsInput = {
  items: Array<ReorderDefinedAcademyItemInput>;
  parentId: number;
};

export type UpdateDataAuditFindingStatusInput = {
  reviewNote?: string | null | undefined;
  status: DataAuditFindingStatus;
};

export type UpdateDataAuditSchemaFieldInput = {
  academyUseful?: boolean | null | undefined;
  classification?: DataAuditFieldClassification | null | undefined;
  expectedPublic?: boolean | null | undefined;
  notes?: string | null | undefined;
};

export type UpdateDefinedAcademyCourseInput = {
  coverImageUrl?: string | null | undefined;
  description?: string | null | undefined;
  estimatedDurationMinutes?: number | null | undefined;
  level?: string | null | undefined;
  slug?: string | null | undefined;
  sortOrder?: number | null | undefined;
  summary?: string | null | undefined;
  title?: string | null | undefined;
  visibility?: DefinedAcademyCourseVisibility | null | undefined;
};

export type UpdateDefinedAcademyInput = {
  description?: string | null | undefined;
  logoUrl?: string | null | undefined;
  name?: string | null | undefined;
  settings?: unknown;
  slug?: string | null | undefined;
  status?: DefinedAcademyStatus | null | undefined;
};

export type UpdateDefinedAcademyLessonInput = {
  bodyContent?: string | null | undefined;
  description?: string | null | undefined;
  isPreview?: boolean | null | undefined;
  lessonType?: DefinedAcademyLessonType | null | undefined;
  slug?: string | null | undefined;
  sortOrder?: number | null | undefined;
  status?: DefinedAcademyContentStatus | null | undefined;
  summary?: string | null | undefined;
  title?: string | null | undefined;
  videoDurationSeconds?: number | null | undefined;
  videoProvider?: string | null | undefined;
  videoUrl?: string | null | undefined;
  visibility?: DefinedAcademyCourseVisibility | null | undefined;
};

export type UpdateDefinedAcademyLessonProgressInput = {
  lastPositionSeconds?: number | null | undefined;
  progressPercentage?: number | null | undefined;
};

export type UpdateDefinedAcademyModuleInput = {
  description?: string | null | undefined;
  sortOrder?: number | null | undefined;
  status?: DefinedAcademyContentStatus | null | undefined;
  title?: string | null | undefined;
};

export type UpdateDefinedAcademyPartnerInput = {
  categoryId?: number | null | undefined;
  contactUrl?: string | null | undefined;
  description?: string | null | undefined;
  featured?: boolean | null | undefined;
  location?: string | null | undefined;
  logoUrl?: string | null | undefined;
  name?: string | null | undefined;
  slug?: string | null | undefined;
  sortOrder?: number | null | undefined;
  status?: DefinedAcademyPartnerStatus | null | undefined;
  websiteUrl?: string | null | undefined;
};

export type UpdateDefinedAcademyReferralCampaignInput = {
  code?: string | null | undefined;
  courseId?: number | null | undefined;
  description?: string | null | undefined;
  endsAt?: unknown;
  metadata?: unknown;
  name?: string | null | undefined;
  partnerId?: number | null | undefined;
  resourceId?: number | null | undefined;
  sourceType?: DefinedAcademyReferralSourceType | null | undefined;
  startsAt?: unknown;
  status?: DefinedAcademyReferralCampaignStatus | null | undefined;
};

export type DefinedAcademyBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type DefinedAcademyBySlugQuery = { definedAcademyBySlug: { id: number, slug: string, name: string, description: string | null, logoUrl: string | null, status: DefinedAcademyStatus, settings: unknown } | null };

export type DefinedAcademyPublishedCoursesQueryVariables = Exact<{
  academySlug: string;
}>;


export type DefinedAcademyPublishedCoursesQuery = { definedAcademyPublishedCourses: Array<{ id: number, slug: string, title: string, summary: string | null, coverImageUrl: string | null, visibility: DefinedAcademyCourseVisibility, estimatedDurationMinutes: number | null, sortOrder: number | null }> };

export type DefinedAcademyCourseBySlugQueryVariables = Exact<{
  academySlug: string;
  courseSlug: string;
}>;


export type DefinedAcademyCourseBySlugQuery = { definedAcademyCourseBySlug: { id: number, slug: string, title: string, summary: string | null, description: string | null, coverImageUrl: string | null, visibility: DefinedAcademyCourseVisibility, estimatedDurationMinutes: number | null, modules: Array<{ id: number, title: string, sortOrder: number | null, lessons: Array<{ id: number, slug: string, title: string, summary: string | null, lessonType: DefinedAcademyLessonType, isPreview: boolean, visibility: DefinedAcademyCourseVisibility | null, sortOrder: number | null, videoDurationSeconds: number | null }> | null }> | null } | null };

export type DefinedAcademyLessonBySlugQueryVariables = Exact<{
  academySlug: string;
  courseSlug: string;
  lessonSlug: string;
}>;


export type DefinedAcademyLessonBySlugQuery = { definedAcademyLessonBySlug: { id: number, slug: string, title: string, summary: string | null, description: string | null, lessonType: DefinedAcademyLessonType, videoUrl: string | null, videoProvider: string | null, videoDurationSeconds: number | null, bodyContent: string | null, isPreview: boolean, visibility: DefinedAcademyCourseVisibility | null, resources: Array<{ id: number, title: string, description: string | null, type: DefinedAcademyResourceType, fileUrl: string | null, externalUrl: string | null, textContent: string | null, mimeType: string | null, fileName: string | null, downloadable: boolean | null, sortOrder: number | null }> | null } | null };

export type DefinedPublicAcademyResourcesQueryVariables = Exact<{
  academySlug: string;
  lessonId?: number | null | undefined;
}>;


export type DefinedPublicAcademyResourcesQuery = { definedPublicAcademyResources: Array<{ id: number, title: string, description: string | null, type: DefinedAcademyResourceType, fileUrl: string | null, externalUrl: string | null, textContent: string | null, mimeType: string | null, fileName: string | null, downloadable: boolean | null, sortOrder: number | null }> };

export type DefinedPublicAcademyPartnersQueryVariables = Exact<{
  academySlug: string;
}>;


export type DefinedPublicAcademyPartnersQuery = { definedPublicAcademyPartners: Array<{ id: number, slug: string, name: string, description: string | null, websiteUrl: string | null, contactUrl: string | null, logoUrl: string | null, location: string | null, featured: boolean | null, sortOrder: number | null, category: { id: number, name: string, slug: string } | null }> };

export type DefinedAcademyPartnerBySlugQueryVariables = Exact<{
  academySlug: string;
  partnerSlug: string;
}>;


export type DefinedAcademyPartnerBySlugQuery = { definedAcademyPartnerBySlug: { id: number, slug: string, name: string, description: string | null, websiteUrl: string | null, contactUrl: string | null, logoUrl: string | null, location: string | null, featured: boolean | null, category: { id: number, name: string, slug: string } | null } | null };

export type ResolveDefinedAcademyShortLinkQueryVariables = Exact<{
  code: string;
}>;


export type ResolveDefinedAcademyShortLinkQuery = { resolveDefinedAcademyShortLink: { code: string, destinationUrl: string, status: DefinedAcademyShortLinkStatus } | null };

export type DefinedAcademiesQueryVariables = Exact<{
  status?: DefinedAcademyStatus | null | undefined;
}>;


export type DefinedAcademiesQuery = { definedAcademies: Array<{ id: number, slug: string, name: string, description: string | null, logoUrl: string | null, status: DefinedAcademyStatus }> };

export type DefinedAcademyAdminQueryVariables = Exact<{
  id: number;
}>;


export type DefinedAcademyAdminQuery = { definedAcademy: { id: number, slug: string, name: string, description: string | null, logoUrl: string | null, status: DefinedAcademyStatus, settings: unknown } | null };

export type DefinedAcademyAnalyticsSummaryQueryVariables = Exact<{
  academyId: number;
}>;


export type DefinedAcademyAnalyticsSummaryQuery = { definedAcademyAnalyticsSummary: { enrollments: number, courseStarts: number, lessonCompletions: number, courseCompletions: number, shortLinkVisits: number, referralVisits: number, referralRegistrations: number, referralEnrollments: number, activePartners: number, publishedCourses: number } };

export type DefinedAcademyCoursesAdminQueryVariables = Exact<{
  academyId: number;
}>;


export type DefinedAcademyCoursesAdminQuery = { definedAcademyCourses: Array<{ id: number, slug: string, title: string, summary: string | null, coverImageUrl: string | null, visibility: DefinedAcademyCourseVisibility, status: DefinedAcademyCourseStatus | null, estimatedDurationMinutes: number | null, sortOrder: number | null, publishedAt: unknown, modules: Array<{ id: number, title: string, sortOrder: number | null, status: DefinedAcademyContentStatus | null, lessons: Array<{ id: number, slug: string, title: string, lessonType: DefinedAcademyLessonType, status: DefinedAcademyContentStatus | null, isPreview: boolean, sortOrder: number | null }> | null }> | null }> };

export type DefinedAcademyCourseAdminQueryVariables = Exact<{
  academyId: number;
  courseId: number;
}>;


export type DefinedAcademyCourseAdminQuery = { definedAcademyCourse: { id: number, slug: string, title: string, summary: string | null, description: string | null, coverImageUrl: string | null, visibility: DefinedAcademyCourseVisibility, status: DefinedAcademyCourseStatus | null, level: string | null, estimatedDurationMinutes: number | null, sortOrder: number | null, publishedAt: unknown, modules: Array<{ id: number, title: string, description: string | null, sortOrder: number | null, status: DefinedAcademyContentStatus | null, lessons: Array<{ id: number, slug: string, title: string, summary: string | null, lessonType: DefinedAcademyLessonType, videoUrl: string | null, bodyContent: string | null, status: DefinedAcademyContentStatus | null, isPreview: boolean, visibility: DefinedAcademyCourseVisibility | null, sortOrder: number | null }> | null }> | null } | null };

export type CreateDefinedAcademyCourseMutationVariables = Exact<{
  academyId: number;
  input: CreateDefinedAcademyCourseInput;
}>;


export type CreateDefinedAcademyCourseMutation = { createDefinedAcademyCourse: { id: number, slug: string, title: string, status: DefinedAcademyCourseStatus | null } };

export type UpdateDefinedAcademyCourseMutationVariables = Exact<{
  academyId: number;
  courseId: number;
  input: UpdateDefinedAcademyCourseInput;
}>;


export type UpdateDefinedAcademyCourseMutation = { updateDefinedAcademyCourse: { id: number, title: string, status: DefinedAcademyCourseStatus | null } };

export type PublishDefinedAcademyCourseMutationVariables = Exact<{
  academyId: number;
  courseId: number;
}>;


export type PublishDefinedAcademyCourseMutation = { publishDefinedAcademyCourse: { id: number, status: DefinedAcademyCourseStatus | null, publishedAt: unknown } };

export type ArchiveDefinedAcademyCourseMutationVariables = Exact<{
  academyId: number;
  courseId: number;
}>;


export type ArchiveDefinedAcademyCourseMutation = { archiveDefinedAcademyCourse: { id: number, status: DefinedAcademyCourseStatus | null } };

export type CreateDefinedAcademyModuleMutationVariables = Exact<{
  academyId: number;
  courseId: number;
  input: CreateDefinedAcademyModuleInput;
}>;


export type CreateDefinedAcademyModuleMutation = { createDefinedAcademyModule: { id: number, title: string, status: DefinedAcademyContentStatus | null } };

export type CreateDefinedAcademyLessonMutationVariables = Exact<{
  academyId: number;
  moduleId: number;
  input: CreateDefinedAcademyLessonInput;
}>;


export type CreateDefinedAcademyLessonMutation = { createDefinedAcademyLesson: { id: number, slug: string, title: string, lessonType: DefinedAcademyLessonType, status: DefinedAcademyContentStatus | null } };

export type PublishDefinedAcademyLessonMutationVariables = Exact<{
  academyId: number;
  lessonId: number;
}>;


export type PublishDefinedAcademyLessonMutation = { publishDefinedAcademyLesson: { id: number, status: DefinedAcademyContentStatus | null } };

export type UpdateDefinedAcademyLessonMutationVariables = Exact<{
  academyId: number;
  lessonId: number;
  input: UpdateDefinedAcademyLessonInput;
}>;


export type UpdateDefinedAcademyLessonMutation = { updateDefinedAcademyLesson: { id: number, title: string, summary: string | null, lessonType: DefinedAcademyLessonType, videoUrl: string | null, bodyContent: string | null, status: DefinedAcademyContentStatus | null, isPreview: boolean } };

export type UpdateDefinedAcademyMutationVariables = Exact<{
  id: number;
  input: UpdateDefinedAcademyInput;
}>;


export type UpdateDefinedAcademyMutation = { updateDefinedAcademy: { id: number, name: string, slug: string, description: string | null, logoUrl: string | null, status: DefinedAcademyStatus, settings: unknown } };

export type UpdateDefinedAcademyModuleMutationVariables = Exact<{
  academyId: number;
  moduleId: number;
  input: UpdateDefinedAcademyModuleInput;
}>;


export type UpdateDefinedAcademyModuleMutation = { updateDefinedAcademyModule: { id: number, title: string, sortOrder: number | null, status: DefinedAcademyContentStatus | null } };

export type ReorderDefinedAcademyModulesMutationVariables = Exact<{
  academyId: number;
  input: ReorderDefinedAcademyItemsInput;
}>;


export type ReorderDefinedAcademyModulesMutation = { reorderDefinedAcademyModules: Array<{ id: number, sortOrder: number | null }> };

export type ReorderDefinedAcademyLessonsMutationVariables = Exact<{
  academyId: number;
  input: ReorderDefinedAcademyItemsInput;
}>;


export type ReorderDefinedAcademyLessonsMutation = { reorderDefinedAcademyLessons: Array<{ id: number, sortOrder: number | null }> };

export type DefinedAcademyResourcesAdminQueryVariables = Exact<{
  academyId: number;
  lessonId?: number | null | undefined;
}>;


export type DefinedAcademyResourcesAdminQuery = { definedAcademyResources: Array<{ id: number, title: string, description: string | null, type: DefinedAcademyResourceType, fileUrl: string | null, externalUrl: string | null, textContent: string | null, mimeType: string | null, fileName: string | null, downloadable: boolean | null, status: DefinedAcademyResourceStatus | null, lessonId: number | null, sortOrder: number | null }> };

export type CreateDefinedAcademyResourceMutationVariables = Exact<{
  academyId: number;
  input: CreateDefinedAcademyResourceInput;
}>;


export type CreateDefinedAcademyResourceMutation = { createDefinedAcademyResource: { id: number, title: string, type: DefinedAcademyResourceType, status: DefinedAcademyResourceStatus | null } };

export type ArchiveDefinedAcademyResourceMutationVariables = Exact<{
  academyId: number;
  resourceId: number;
}>;


export type ArchiveDefinedAcademyResourceMutation = { archiveDefinedAcademyResource: { id: number, status: DefinedAcademyResourceStatus | null } };

export type DefinedAcademyPartnersAdminQueryVariables = Exact<{
  academyId: number;
}>;


export type DefinedAcademyPartnersAdminQuery = { definedAcademyPartners: Array<{ id: number, slug: string, name: string, description: string | null, websiteUrl: string | null, contactUrl: string | null, logoUrl: string | null, location: string | null, featured: boolean | null, status: DefinedAcademyPartnerStatus | null, sortOrder: number | null, category: { id: number, name: string, slug: string } | null }> };

export type CreateDefinedAcademyPartnerCategoryMutationVariables = Exact<{
  academyId: number;
  input: CreateDefinedAcademyPartnerCategoryInput;
}>;


export type CreateDefinedAcademyPartnerCategoryMutation = { createDefinedAcademyPartnerCategory: { id: number, name: string, slug: string } };

export type CreateDefinedAcademyPartnerMutationVariables = Exact<{
  academyId: number;
  input: CreateDefinedAcademyPartnerInput;
}>;


export type CreateDefinedAcademyPartnerMutation = { createDefinedAcademyPartner: { id: number, slug: string, name: string, status: DefinedAcademyPartnerStatus | null } };

export type UpdateDefinedAcademyPartnerMutationVariables = Exact<{
  academyId: number;
  partnerId: number;
  input: UpdateDefinedAcademyPartnerInput;
}>;


export type UpdateDefinedAcademyPartnerMutation = { updateDefinedAcademyPartner: { id: number, slug: string, name: string, description: string | null, websiteUrl: string | null, contactUrl: string | null, logoUrl: string | null, location: string | null, status: DefinedAcademyPartnerStatus | null, featured: boolean | null, sortOrder: number | null } };

export type DefinedAcademyShortLinksAdminQueryVariables = Exact<{
  academyId: number;
}>;


export type DefinedAcademyShortLinksAdminQuery = { definedAcademyShortLinks: Array<{ id: number, code: string, destinationUrl: string, status: DefinedAcademyShortLinkStatus, visitCount: number, expiresAt: unknown, courseId: number | null, partnerId: number | null, createdAt: unknown }> };

export type CreateDefinedAcademyShortLinkMutationVariables = Exact<{
  academyId: number;
  input: CreateDefinedAcademyShortLinkInput;
}>;


export type CreateDefinedAcademyShortLinkMutation = { createDefinedAcademyShortLink: { id: number, code: string, destinationUrl: string, status: DefinedAcademyShortLinkStatus } };

export type DisableDefinedAcademyShortLinkMutationVariables = Exact<{
  academyId: number;
  shortLinkId: number;
}>;


export type DisableDefinedAcademyShortLinkMutation = { disableDefinedAcademyShortLink: { id: number, status: DefinedAcademyShortLinkStatus } };

export type DefinedAcademyReferralCampaignsAdminQueryVariables = Exact<{
  academyId: number;
}>;


export type DefinedAcademyReferralCampaignsAdminQuery = { definedAcademyReferralCampaigns: Array<{ id: number, name: string, code: string, description: string | null, sourceType: DefinedAcademyReferralSourceType, status: DefinedAcademyReferralCampaignStatus, partnerId: number | null, courseId: number | null, startsAt: unknown, endsAt: unknown }> };

export type CreateDefinedAcademyReferralCampaignMutationVariables = Exact<{
  academyId: number;
  input: CreateDefinedAcademyReferralCampaignInput;
}>;


export type CreateDefinedAcademyReferralCampaignMutation = { createDefinedAcademyReferralCampaign: { id: number, name: string, code: string, status: DefinedAcademyReferralCampaignStatus } };

export type UpdateDefinedAcademyReferralCampaignMutationVariables = Exact<{
  academyId: number;
  campaignId: number;
  input: UpdateDefinedAcademyReferralCampaignInput;
}>;


export type UpdateDefinedAcademyReferralCampaignMutation = { updateDefinedAcademyReferralCampaign: { id: number, name: string, status: DefinedAcademyReferralCampaignStatus } };

export type LoginMutationVariables = Exact<{
  user: LoginUserInput;
}>;


export type LoginMutation = { login: { token: string, user: { id: number, email: string, firstName: string | null, lastName: string | null, isAdmin: boolean | null, apps: Array<string> } } };

export type RegisterMutationVariables = Exact<{
  user: RegisterUserInput;
  appCode?: string | null | undefined;
}>;


export type RegisterMutation = { register: { success: boolean, message: string | null, email: string | null, requiresVerification: boolean | null, token: string | null, user: { id: number, email: string, firstName: string | null, lastName: string | null, apps: Array<string> } | null } };

export type VerifyEmailMutationVariables = Exact<{
  token: string;
}>;


export type VerifyEmailMutation = { verifyEmail: { success: boolean, message: string | null } };

export type ResendVerificationEmailMutationVariables = Exact<{
  email: string;
}>;


export type ResendVerificationEmailMutation = { resendVerificationEmail: { success: boolean, message: string | null } };

export type RequestPasswordResetMutationVariables = Exact<{
  email: string;
}>;


export type RequestPasswordResetMutation = { requestPasswordReset: { success: boolean, message: string | null } };

export type ResetPasswordMutationVariables = Exact<{
  token: string;
  password: string;
}>;


export type ResetPasswordMutation = { resetPassword: { success: boolean, message: string | null } };

export type CareerStageFieldsFragment = { id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number };

export type DefinedAcademyCareerJourneyByAcademySlugQueryVariables = Exact<{
  academySlug: string;
}>;


export type DefinedAcademyCareerJourneyByAcademySlugQuery = { definedAcademyCareerJourneyByAcademySlug: { id: number, title: string, slug: string, description: string | null, status: DefinedAcademyCareerJourneyStatus, stages: Array<{ id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number }> | null } | null };

export type MyDefinedAcademyCareerProfileQueryVariables = Exact<{
  academyId: number;
}>;


export type MyDefinedAcademyCareerProfileQuery = { myDefinedAcademyCareerProfile: { id: number, userId: number, academyId: number, journeyId: number, currentStageId: number | null, notes: string | null, currentStage: { id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number } | null, completions: Array<{ id: number, stageId: number, completedAt: unknown, stage: { id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number } | null }> | null, journey: { id: number, title: string, stages: Array<{ id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number }> | null } | null } | null };

export type MyDefinedAcademyCareerRecommendationsQueryVariables = Exact<{
  academyId: number;
}>;


export type MyDefinedAcademyCareerRecommendationsQuery = { myDefinedAcademyCareerRecommendations: { stage: { id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number } | null, courses: Array<{ id: number, title: string, slug: string, summary: string | null, coverImageUrl: string | null, estimatedDurationMinutes: number | null }>, resources: Array<{ id: number, title: string, type: DefinedAcademyResourceType, fileUrl: string | null, externalUrl: string | null }> } };

export type InitializeMyDefinedAcademyCareerProfileMutationVariables = Exact<{
  academyId: number;
  stageId?: number | null | undefined;
}>;


export type InitializeMyDefinedAcademyCareerProfileMutation = { initializeMyDefinedAcademyCareerProfile: { id: number, currentStageId: number | null, currentStage: { id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number } | null } };

export type SetMyDefinedAcademyCareerStageMutationVariables = Exact<{
  academyId: number;
  stageId: number;
}>;


export type SetMyDefinedAcademyCareerStageMutation = { setMyDefinedAcademyCareerStage: { id: number, currentStageId: number | null, currentStage: { id: number, journeyId: number, title: string, slug: string, description: string | null, summary: string | null, iconKey: string | null, sortOrder: number } | null } };

export type CompleteMyDefinedAcademyCareerStageMutationVariables = Exact<{
  academyId: number;
  stageId: number;
  notes?: string | null | undefined;
}>;


export type CompleteMyDefinedAcademyCareerStageMutation = { completeMyDefinedAcademyCareerStage: { id: number, currentStageId: number | null, currentStage: { title: string, slug: string } | null, completions: Array<{ stageId: number, completedAt: unknown }> | null } };

export type DataAuditOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type DataAuditOverviewQuery = { dataAuditOverview: { lastSuccessfulAuditAt: unknown, currentStatus: DataAuditRunStatus | null, currentRunId: number | null, overviewMetrics: unknown, contentInsights: unknown, latestRun: { id: number, status: DataAuditRunStatus, profileCount: number, agentCount: number, lenderCount: number, discrepancyCount: number, exposureFindingCount: number, completedAt: unknown, requestedByName: string | null, requestedByEmail: string | null, errorMessage: string | null } | null } };

export type DataAuditRunsQueryVariables = Exact<{
  take?: number | null | undefined;
}>;


export type DataAuditRunsQuery = { dataAuditRuns: Array<{ id: number, status: DataAuditRunStatus, source: string, startedAt: unknown, completedAt: unknown, failedAt: unknown, requestedByUserId: number | null, requestedByName: string | null, requestedByEmail: string | null, requestCount: number, profileCount: number, agentCount: number, lenderCount: number, newProfileCount: number, changedProfileCount: number, removedProfileCount: number, discrepancyCount: number, exposureFindingCount: number, schemaFieldCount: number, errorMessage: string | null, createdAt: unknown }> };

export type DataAuditProfilesQueryVariables = Exact<{
  filter?: DataAuditProfilesFilterInput | null | undefined;
}>;


export type DataAuditProfilesQuery = { dataAuditProfiles: { auditRunId: number | null, total: number, items: Array<{ id: number, sourceProfileId: string, displayName: string | null, slug: string | null, agentType: string | null, agencyName: string | null, avatarUrl: string | null, avatarPath: string | null, yearsInBusiness: number | null, yearsInArea: number | null, contractsCompleted: number | null, cities: unknown, clientSpecializations: unknown, isVerified: boolean | null, isProfileComplete: boolean | null, profileCompleteness: number | null, hasEmail: boolean, hasPhone: boolean, hasDocumentReferences: boolean, documentReferenceCount: number, findingCount: number, highestSeverity: string | null }> } };

export type DataAuditProfileQueryVariables = Exact<{
  id: number;
  includeRaw?: boolean | null | undefined;
}>;


export type DataAuditProfileQuery = { dataAuditProfile: { id: number, sourceProfileId: string, displayName: string | null, firstName: string | null, lastName: string | null, slug: string | null, avatarUrl: string | null, avatarPath: string | null, agentType: string | null, agencyName: string | null, yearsInBusiness: number | null, yearsInArea: number | null, contractsCompleted: number | null, states: unknown, cities: unknown, clientSpecializations: unknown, propertyTypes: unknown, pricePoints: unknown, loanTypes: unknown, certifications: unknown, isPublic: boolean | null, isVerified: boolean | null, verificationStatus: string | null, isProfileComplete: boolean | null, profileCompleteness: number | null, hasEmail: boolean, hasPhone: boolean, hasVerificationNote: boolean, hasVerifiedBy: boolean, hasDocumentReferences: boolean, hasTokenLikeFields: boolean, documentReferenceCount: number, normalizedPayload: unknown, rawMasked: unknown, findings: Array<{ id: number, ruleCode: string, severity: string, status: DataAuditFindingStatus, title: string, description: string, recommendation: string | null, category: string, fieldPath: string | null }> } | null };

export type DataAuditSchemaFieldsQueryVariables = Exact<{
  auditRunId?: number | null | undefined;
}>;


export type DataAuditSchemaFieldsQuery = { dataAuditSchemaFields: Array<{ id: number, fieldPath: string, detectedTypes: unknown, occurrenceCount: number, profileCoverage: number, classification: DataAuditFieldClassification, expectedPublic: boolean | null, academyUseful: boolean | null, sampleValueMasked: string | null, notes: string | null }> };

export type DataAuditFindingsQueryVariables = Exact<{
  filter?: DataAuditFindingsFilterInput | null | undefined;
}>;


export type DataAuditFindingsQuery = { dataAuditFindings: { auditRunId: number | null, total: number, items: Array<{ id: number, severity: string, category: string, ruleCode: string, title: string, description: string, fieldPath: string | null, status: DataAuditFindingStatus, recommendation: string | null, createdAt: unknown, profile: { id: number, displayName: string | null, slug: string | null } | null }> } };

export type StartDataAuditRunMutationVariables = Exact<{ [key: string]: never; }>;


export type StartDataAuditRunMutation = { startDataAuditRun: { id: number, status: DataAuditRunStatus, createdAt: unknown } };

export type UpdateDataAuditFindingStatusMutationVariables = Exact<{
  id: number;
  input: UpdateDataAuditFindingStatusInput;
}>;


export type UpdateDataAuditFindingStatusMutation = { updateDataAuditFindingStatus: { id: number, status: DataAuditFindingStatus, reviewedAt: unknown, reviewNote: string | null } };

export type UpdateDataAuditSchemaFieldMutationVariables = Exact<{
  id: number;
  input: UpdateDataAuditSchemaFieldInput;
}>;


export type UpdateDataAuditSchemaFieldMutation = { updateDataAuditSchemaField: { id: number, classification: DataAuditFieldClassification, expectedPublic: boolean | null, academyUseful: boolean | null, notes: string | null } };

export type DataAuditSharesQueryVariables = Exact<{
  take?: number | null | undefined;
}>;


export type DataAuditSharesQuery = { dataAuditShares: Array<{ id: number, auditRunId: number, token: string, title: string, recipientName: string | null, personalMessage: string | null, inviteCtaLabel: string | null, shareUrl: string, viewCount: number, lastViewedAt: unknown, expiresAt: unknown, revokedAt: unknown, createdAt: unknown, isActive: boolean }> };

export type CreateDataAuditShareLinkMutationVariables = Exact<{
  input?: CreateDataAuditShareInput | null | undefined;
}>;


export type CreateDataAuditShareLinkMutation = { createDataAuditShareLink: { id: number, auditRunId: number, token: string, title: string, recipientName: string | null, personalMessage: string | null, inviteCtaLabel: string | null, shareUrl: string, viewCount: number, expiresAt: unknown, revokedAt: unknown, createdAt: unknown, isActive: boolean } };

export type RevokeDataAuditShareLinkMutationVariables = Exact<{
  id: number;
}>;


export type RevokeDataAuditShareLinkMutation = { revokeDataAuditShareLink: { id: number, revokedAt: unknown, isActive: boolean } };

export type DataAuditSharePublicQueryVariables = Exact<{
  token: string;
}>;


export type DataAuditSharePublicQuery = { dataAuditSharePublic: { title: string, recipientName: string | null, personalMessage: string | null, inviteCtaLabel: string, inviteUrl: string, expiresAt: unknown, report: unknown } };

export type EnrollInDefinedAcademyCourseMutationVariables = Exact<{
  courseId: number;
}>;


export type EnrollInDefinedAcademyCourseMutation = { enrollInDefinedAcademyCourse: { id: number, courseId: number, status: string, enrolledAt: unknown, lastAccessedAt: unknown } };

export type MyDefinedAcademyEnrollmentsQueryVariables = Exact<{
  academyId?: number | null | undefined;
}>;


export type MyDefinedAcademyEnrollmentsQuery = { myDefinedAcademyEnrollments: Array<{ id: number, courseId: number, status: string, enrolledAt: unknown, startedAt: unknown, completedAt: unknown, lastAccessedAt: unknown, course: { id: number, slug: string, title: string, summary: string | null, coverImageUrl: string | null, estimatedDurationMinutes: number | null, academyId: number | null } | null }> };

export type MyDefinedAcademyCourseProgressQueryVariables = Exact<{
  courseId: number;
}>;


export type MyDefinedAcademyCourseProgressQuery = { myDefinedAcademyCourseProgress: { enrollmentId: number, courseId: number, completedLessons: number, totalLessons: number, progressPercentage: number, enrollmentStatus: string } | null };

export type MyDefinedAcademyLessonProgressQueryVariables = Exact<{
  enrollmentId: number;
  lessonId: number;
}>;


export type MyDefinedAcademyLessonProgressQuery = { myDefinedAcademyLessonProgress: { id: number, lessonId: number, status: string, progressPercentage: number | null, lastPositionSeconds: number | null, startedAt: unknown, completedAt: unknown } | null };

export type StartDefinedAcademyLessonMutationVariables = Exact<{
  enrollmentId: number;
  lessonId: number;
}>;


export type StartDefinedAcademyLessonMutation = { startDefinedAcademyLesson: { id: number, lessonId: number, status: string, progressPercentage: number | null, lastPositionSeconds: number | null, startedAt: unknown } };

export type UpdateDefinedAcademyLessonProgressMutationVariables = Exact<{
  enrollmentId: number;
  lessonId: number;
  input: UpdateDefinedAcademyLessonProgressInput;
}>;


export type UpdateDefinedAcademyLessonProgressMutation = { updateDefinedAcademyLessonProgress: { id: number, lessonId: number, status: string, progressPercentage: number | null, lastPositionSeconds: number | null } };

export type CompleteDefinedAcademyLessonMutationVariables = Exact<{
  enrollmentId: number;
  lessonId: number;
}>;


export type CompleteDefinedAcademyLessonMutation = { completeDefinedAcademyLesson: { id: number, lessonId: number, status: string, progressPercentage: number | null, completedAt: unknown } };

export type CaptureDefinedAcademyReferralMutationVariables = Exact<{
  input: CaptureDefinedAcademyReferralInput;
}>;


export type CaptureDefinedAcademyReferralMutation = { captureDefinedAcademyReferral: { id: number, referralCode: string, status: string, attributionExpiresAt: unknown, firstVisitedAt: unknown } };

export type AttachDefinedAcademyReferralToCurrentUserMutationVariables = Exact<{
  input: AttachDefinedAcademyReferralInput;
}>;


export type AttachDefinedAcademyReferralToCurrentUserMutation = { attachDefinedAcademyReferralToCurrentUser: { id: number, referralCode: string, status: string, registeredAt: unknown } | null };

export const CareerStageFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CareerStageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DefinedAcademyCareerStage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"iconKey"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]} as unknown as DocumentNode<CareerStageFieldsFragment, unknown>;
export const DefinedAcademyBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyBySlugQuery, DefinedAcademyBySlugQueryVariables>;
export const DefinedAcademyPublishedCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyPublishedCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyPublishedCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"coverImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyPublishedCoursesQuery, DefinedAcademyPublishedCoursesQueryVariables>;
export const DefinedAcademyCourseBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyCourseBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyCourseBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"coverImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"lessonType"}},{"kind":"Field","name":{"kind":"Name","value":"isPreview"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"videoDurationSeconds"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyCourseBySlugQuery, DefinedAcademyCourseBySlugQueryVariables>;
export const DefinedAcademyLessonBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyLessonBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyLessonBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"lessonType"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"videoProvider"}},{"kind":"Field","name":{"kind":"Name","value":"videoDurationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"bodyContent"}},{"kind":"Field","name":{"kind":"Name","value":"isPreview"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"externalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"downloadable"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyLessonBySlugQuery, DefinedAcademyLessonBySlugQueryVariables>;
export const DefinedPublicAcademyResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedPublicAcademyResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedPublicAcademyResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"externalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"downloadable"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]} as unknown as DocumentNode<DefinedPublicAcademyResourcesQuery, DefinedPublicAcademyResourcesQueryVariables>;
export const DefinedPublicAcademyPartnersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedPublicAcademyPartners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedPublicAcademyPartners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"contactUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<DefinedPublicAcademyPartnersQuery, DefinedPublicAcademyPartnersQueryVariables>;
export const DefinedAcademyPartnerBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyPartnerBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partnerSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyPartnerBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"partnerSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partnerSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"contactUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyPartnerBySlugQuery, DefinedAcademyPartnerBySlugQueryVariables>;
export const ResolveDefinedAcademyShortLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ResolveDefinedAcademyShortLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolveDefinedAcademyShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"destinationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ResolveDefinedAcademyShortLinkQuery, ResolveDefinedAcademyShortLinkQueryVariables>;
export const DefinedAcademiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DefinedAcademyStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademiesQuery, DefinedAcademiesQueryVariables>;
export const DefinedAcademyAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyAdminQuery, DefinedAcademyAdminQueryVariables>;
export const DefinedAcademyAnalyticsSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyAnalyticsSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyAnalyticsSummary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollments"}},{"kind":"Field","name":{"kind":"Name","value":"courseStarts"}},{"kind":"Field","name":{"kind":"Name","value":"lessonCompletions"}},{"kind":"Field","name":{"kind":"Name","value":"courseCompletions"}},{"kind":"Field","name":{"kind":"Name","value":"shortLinkVisits"}},{"kind":"Field","name":{"kind":"Name","value":"referralVisits"}},{"kind":"Field","name":{"kind":"Name","value":"referralRegistrations"}},{"kind":"Field","name":{"kind":"Name","value":"referralEnrollments"}},{"kind":"Field","name":{"kind":"Name","value":"activePartners"}},{"kind":"Field","name":{"kind":"Name","value":"publishedCourses"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyAnalyticsSummaryQuery, DefinedAcademyAnalyticsSummaryQueryVariables>;
export const DefinedAcademyCoursesAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyCoursesAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"coverImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"lessonType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isPreview"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyCoursesAdminQuery, DefinedAcademyCoursesAdminQueryVariables>;
export const DefinedAcademyCourseAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyCourseAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"coverImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"modules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"lessonType"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bodyContent"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isPreview"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyCourseAdminQuery, DefinedAcademyCourseAdminQueryVariables>;
export const CreateDefinedAcademyCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyCourseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyCourseMutation, CreateDefinedAcademyCourseMutationVariables>;
export const UpdateDefinedAcademyCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDefinedAcademyCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDefinedAcademyCourseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDefinedAcademyCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateDefinedAcademyCourseMutation, UpdateDefinedAcademyCourseMutationVariables>;
export const PublishDefinedAcademyCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishDefinedAcademyCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publishDefinedAcademyCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}}]}}]}}]} as unknown as DocumentNode<PublishDefinedAcademyCourseMutation, PublishDefinedAcademyCourseMutationVariables>;
export const ArchiveDefinedAcademyCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveDefinedAcademyCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveDefinedAcademyCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ArchiveDefinedAcademyCourseMutation, ArchiveDefinedAcademyCourseMutationVariables>;
export const CreateDefinedAcademyModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyModuleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyModuleMutation, CreateDefinedAcademyModuleMutationVariables>;
export const CreateDefinedAcademyLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moduleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyLessonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"moduleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moduleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"lessonType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyLessonMutation, CreateDefinedAcademyLessonMutationVariables>;
export const PublishDefinedAcademyLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishDefinedAcademyLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publishDefinedAcademyLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<PublishDefinedAcademyLessonMutation, PublishDefinedAcademyLessonMutationVariables>;
export const UpdateDefinedAcademyLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDefinedAcademyLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDefinedAcademyLessonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDefinedAcademyLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"lessonType"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bodyContent"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isPreview"}}]}}]}}]} as unknown as DocumentNode<UpdateDefinedAcademyLessonMutation, UpdateDefinedAcademyLessonMutationVariables>;
export const UpdateDefinedAcademyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDefinedAcademy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDefinedAcademyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDefinedAcademy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}}]}}]}}]} as unknown as DocumentNode<UpdateDefinedAcademyMutation, UpdateDefinedAcademyMutationVariables>;
export const UpdateDefinedAcademyModuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDefinedAcademyModule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moduleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDefinedAcademyModuleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDefinedAcademyModule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"moduleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moduleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateDefinedAcademyModuleMutation, UpdateDefinedAcademyModuleMutationVariables>;
export const ReorderDefinedAcademyModulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderDefinedAcademyModules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderDefinedAcademyItemsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderDefinedAcademyModules"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]} as unknown as DocumentNode<ReorderDefinedAcademyModulesMutation, ReorderDefinedAcademyModulesMutationVariables>;
export const ReorderDefinedAcademyLessonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderDefinedAcademyLessons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderDefinedAcademyItemsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderDefinedAcademyLessons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]} as unknown as DocumentNode<ReorderDefinedAcademyLessonsMutation, ReorderDefinedAcademyLessonsMutationVariables>;
export const DefinedAcademyResourcesAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyResourcesAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"externalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"downloadable"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyResourcesAdminQuery, DefinedAcademyResourcesAdminQueryVariables>;
export const CreateDefinedAcademyResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyResourceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyResourceMutation, CreateDefinedAcademyResourceMutationVariables>;
export const ArchiveDefinedAcademyResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveDefinedAcademyResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveDefinedAcademyResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"resourceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resourceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ArchiveDefinedAcademyResourceMutation, ArchiveDefinedAcademyResourceMutationVariables>;
export const DefinedAcademyPartnersAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyPartnersAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyPartners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"contactUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyPartnersAdminQuery, DefinedAcademyPartnersAdminQueryVariables>;
export const CreateDefinedAcademyPartnerCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyPartnerCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyPartnerCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyPartnerCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyPartnerCategoryMutation, CreateDefinedAcademyPartnerCategoryMutationVariables>;
export const CreateDefinedAcademyPartnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyPartner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyPartnerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyPartner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyPartnerMutation, CreateDefinedAcademyPartnerMutationVariables>;
export const UpdateDefinedAcademyPartnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDefinedAcademyPartner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partnerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDefinedAcademyPartnerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDefinedAcademyPartner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"partnerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partnerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"contactUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]} as unknown as DocumentNode<UpdateDefinedAcademyPartnerMutation, UpdateDefinedAcademyPartnerMutationVariables>;
export const DefinedAcademyShortLinksAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyShortLinksAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyShortLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"destinationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitCount"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"partnerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyShortLinksAdminQuery, DefinedAcademyShortLinksAdminQueryVariables>;
export const CreateDefinedAcademyShortLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyShortLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyShortLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"destinationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyShortLinkMutation, CreateDefinedAcademyShortLinkMutationVariables>;
export const DisableDefinedAcademyShortLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisableDefinedAcademyShortLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shortLinkId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableDefinedAcademyShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"shortLinkId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shortLinkId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<DisableDefinedAcademyShortLinkMutation, DisableDefinedAcademyShortLinkMutationVariables>;
export const DefinedAcademyReferralCampaignsAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyReferralCampaignsAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyReferralCampaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sourceType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"partnerId"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}}]}}]}}]} as unknown as DocumentNode<DefinedAcademyReferralCampaignsAdminQuery, DefinedAcademyReferralCampaignsAdminQueryVariables>;
export const CreateDefinedAcademyReferralCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDefinedAcademyReferralCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedAcademyReferralCampaignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDefinedAcademyReferralCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateDefinedAcademyReferralCampaignMutation, CreateDefinedAcademyReferralCampaignMutationVariables>;
export const UpdateDefinedAcademyReferralCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDefinedAcademyReferralCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"campaignId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDefinedAcademyReferralCampaignInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDefinedAcademyReferralCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"campaignId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"campaignId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateDefinedAcademyReferralCampaignMutation, UpdateDefinedAcademyReferralCampaignMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"apps"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"appCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"requiresVerification"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"apps"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const ResendVerificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendVerificationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendVerificationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const RequestPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const DefinedAcademyCareerJourneyByAcademySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefinedAcademyCareerJourneyByAcademySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"definedAcademyCareerJourneyByAcademySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academySlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academySlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CareerStageFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CareerStageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DefinedAcademyCareerStage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"iconKey"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]} as unknown as DocumentNode<DefinedAcademyCareerJourneyByAcademySlugQuery, DefinedAcademyCareerJourneyByAcademySlugQueryVariables>;
export const MyDefinedAcademyCareerProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDefinedAcademyCareerProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDefinedAcademyCareerProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"academyId"}},{"kind":"Field","name":{"kind":"Name","value":"journeyId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStageId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CareerStageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stageId"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CareerStageFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"journey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"stages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CareerStageFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CareerStageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DefinedAcademyCareerStage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"iconKey"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]} as unknown as DocumentNode<MyDefinedAcademyCareerProfileQuery, MyDefinedAcademyCareerProfileQueryVariables>;
export const MyDefinedAcademyCareerRecommendationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDefinedAcademyCareerRecommendations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDefinedAcademyCareerRecommendations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CareerStageFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"coverImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"externalUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CareerStageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DefinedAcademyCareerStage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"iconKey"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]} as unknown as DocumentNode<MyDefinedAcademyCareerRecommendationsQuery, MyDefinedAcademyCareerRecommendationsQueryVariables>;
export const InitializeMyDefinedAcademyCareerProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitializeMyDefinedAcademyCareerProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initializeMyDefinedAcademyCareerProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentStageId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CareerStageFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CareerStageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DefinedAcademyCareerStage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"iconKey"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]} as unknown as DocumentNode<InitializeMyDefinedAcademyCareerProfileMutation, InitializeMyDefinedAcademyCareerProfileMutationVariables>;
export const SetMyDefinedAcademyCareerStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetMyDefinedAcademyCareerStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMyDefinedAcademyCareerStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentStageId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CareerStageFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CareerStageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DefinedAcademyCareerStage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"iconKey"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]} as unknown as DocumentNode<SetMyDefinedAcademyCareerStageMutation, SetMyDefinedAcademyCareerStageMutationVariables>;
export const CompleteMyDefinedAcademyCareerStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteMyDefinedAcademyCareerStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeMyDefinedAcademyCareerStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"stageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentStageId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stageId"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CompleteMyDefinedAcademyCareerStageMutation, CompleteMyDefinedAcademyCareerStageMutationVariables>;
export const DataAuditOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastSuccessfulAuditAt"}},{"kind":"Field","name":{"kind":"Name","value":"currentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"currentRunId"}},{"kind":"Field","name":{"kind":"Name","value":"overviewMetrics"}},{"kind":"Field","name":{"kind":"Name","value":"contentInsights"}},{"kind":"Field","name":{"kind":"Name","value":"latestRun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"profileCount"}},{"kind":"Field","name":{"kind":"Name","value":"agentCount"}},{"kind":"Field","name":{"kind":"Name","value":"lenderCount"}},{"kind":"Field","name":{"kind":"Name","value":"discrepancyCount"}},{"kind":"Field","name":{"kind":"Name","value":"exposureFindingCount"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByName"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByEmail"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<DataAuditOverviewQuery, DataAuditOverviewQueryVariables>;
export const DataAuditRunsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditRuns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditRuns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"failedAt"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByName"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requestCount"}},{"kind":"Field","name":{"kind":"Name","value":"profileCount"}},{"kind":"Field","name":{"kind":"Name","value":"agentCount"}},{"kind":"Field","name":{"kind":"Name","value":"lenderCount"}},{"kind":"Field","name":{"kind":"Name","value":"newProfileCount"}},{"kind":"Field","name":{"kind":"Name","value":"changedProfileCount"}},{"kind":"Field","name":{"kind":"Name","value":"removedProfileCount"}},{"kind":"Field","name":{"kind":"Name","value":"discrepancyCount"}},{"kind":"Field","name":{"kind":"Name","value":"exposureFindingCount"}},{"kind":"Field","name":{"kind":"Name","value":"schemaFieldCount"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<DataAuditRunsQuery, DataAuditRunsQueryVariables>;
export const DataAuditProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditProfiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DataAuditProfilesFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditProfiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditRunId"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sourceProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"agentType"}},{"kind":"Field","name":{"kind":"Name","value":"agencyName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"avatarPath"}},{"kind":"Field","name":{"kind":"Name","value":"yearsInBusiness"}},{"kind":"Field","name":{"kind":"Name","value":"yearsInArea"}},{"kind":"Field","name":{"kind":"Name","value":"contractsCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"cities"}},{"kind":"Field","name":{"kind":"Name","value":"clientSpecializations"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"isProfileComplete"}},{"kind":"Field","name":{"kind":"Name","value":"profileCompleteness"}},{"kind":"Field","name":{"kind":"Name","value":"hasEmail"}},{"kind":"Field","name":{"kind":"Name","value":"hasPhone"}},{"kind":"Field","name":{"kind":"Name","value":"hasDocumentReferences"}},{"kind":"Field","name":{"kind":"Name","value":"documentReferenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"findingCount"}},{"kind":"Field","name":{"kind":"Name","value":"highestSeverity"}}]}}]}}]}}]} as unknown as DocumentNode<DataAuditProfilesQuery, DataAuditProfilesQueryVariables>;
export const DataAuditProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeRaw"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeRaw"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeRaw"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sourceProfileId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"avatarPath"}},{"kind":"Field","name":{"kind":"Name","value":"agentType"}},{"kind":"Field","name":{"kind":"Name","value":"agencyName"}},{"kind":"Field","name":{"kind":"Name","value":"yearsInBusiness"}},{"kind":"Field","name":{"kind":"Name","value":"yearsInArea"}},{"kind":"Field","name":{"kind":"Name","value":"contractsCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"states"}},{"kind":"Field","name":{"kind":"Name","value":"cities"}},{"kind":"Field","name":{"kind":"Name","value":"clientSpecializations"}},{"kind":"Field","name":{"kind":"Name","value":"propertyTypes"}},{"kind":"Field","name":{"kind":"Name","value":"pricePoints"}},{"kind":"Field","name":{"kind":"Name","value":"loanTypes"}},{"kind":"Field","name":{"kind":"Name","value":"certifications"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"verificationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"isProfileComplete"}},{"kind":"Field","name":{"kind":"Name","value":"profileCompleteness"}},{"kind":"Field","name":{"kind":"Name","value":"hasEmail"}},{"kind":"Field","name":{"kind":"Name","value":"hasPhone"}},{"kind":"Field","name":{"kind":"Name","value":"hasVerificationNote"}},{"kind":"Field","name":{"kind":"Name","value":"hasVerifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"hasDocumentReferences"}},{"kind":"Field","name":{"kind":"Name","value":"hasTokenLikeFields"}},{"kind":"Field","name":{"kind":"Name","value":"documentReferenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"normalizedPayload"}},{"kind":"Field","name":{"kind":"Name","value":"rawMasked"}},{"kind":"Field","name":{"kind":"Name","value":"findings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ruleCode"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"recommendation"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"fieldPath"}}]}}]}}]}}]} as unknown as DocumentNode<DataAuditProfileQuery, DataAuditProfileQueryVariables>;
export const DataAuditSchemaFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditSchemaFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auditRunId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditSchemaFields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"auditRunId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auditRunId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldPath"}},{"kind":"Field","name":{"kind":"Name","value":"detectedTypes"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"profileCoverage"}},{"kind":"Field","name":{"kind":"Name","value":"classification"}},{"kind":"Field","name":{"kind":"Name","value":"expectedPublic"}},{"kind":"Field","name":{"kind":"Name","value":"academyUseful"}},{"kind":"Field","name":{"kind":"Name","value":"sampleValueMasked"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<DataAuditSchemaFieldsQuery, DataAuditSchemaFieldsQueryVariables>;
export const DataAuditFindingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditFindings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DataAuditFindingsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditFindings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditRunId"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"ruleCode"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fieldPath"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"recommendation"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DataAuditFindingsQuery, DataAuditFindingsQueryVariables>;
export const StartDataAuditRunDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartDataAuditRun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDataAuditRun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<StartDataAuditRunMutation, StartDataAuditRunMutationVariables>;
export const UpdateDataAuditFindingStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDataAuditFindingStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDataAuditFindingStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDataAuditFindingStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewNote"}}]}}]}}]} as unknown as DocumentNode<UpdateDataAuditFindingStatusMutation, UpdateDataAuditFindingStatusMutationVariables>;
export const UpdateDataAuditSchemaFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDataAuditSchemaField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDataAuditSchemaFieldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDataAuditSchemaField"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"classification"}},{"kind":"Field","name":{"kind":"Name","value":"expectedPublic"}},{"kind":"Field","name":{"kind":"Name","value":"academyUseful"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<UpdateDataAuditSchemaFieldMutation, UpdateDataAuditSchemaFieldMutationVariables>;
export const DataAuditSharesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditShares"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditShares"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auditRunId"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"recipientName"}},{"kind":"Field","name":{"kind":"Name","value":"personalMessage"}},{"kind":"Field","name":{"kind":"Name","value":"inviteCtaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"shareUrl"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastViewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<DataAuditSharesQuery, DataAuditSharesQueryVariables>;
export const CreateDataAuditShareLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDataAuditShareLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDataAuditShareInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDataAuditShareLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auditRunId"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"recipientName"}},{"kind":"Field","name":{"kind":"Name","value":"personalMessage"}},{"kind":"Field","name":{"kind":"Name","value":"inviteCtaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"shareUrl"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateDataAuditShareLinkMutation, CreateDataAuditShareLinkMutationVariables>;
export const RevokeDataAuditShareLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeDataAuditShareLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeDataAuditShareLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<RevokeDataAuditShareLinkMutation, RevokeDataAuditShareLinkMutationVariables>;
export const DataAuditSharePublicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DataAuditSharePublic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataAuditSharePublic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"recipientName"}},{"kind":"Field","name":{"kind":"Name","value":"personalMessage"}},{"kind":"Field","name":{"kind":"Name","value":"inviteCtaLabel"}},{"kind":"Field","name":{"kind":"Name","value":"inviteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"report"}}]}}]}}]} as unknown as DocumentNode<DataAuditSharePublicQuery, DataAuditSharePublicQueryVariables>;
export const EnrollInDefinedAcademyCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnrollInDefinedAcademyCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollInDefinedAcademyCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"enrolledAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastAccessedAt"}}]}}]}}]} as unknown as DocumentNode<EnrollInDefinedAcademyCourseMutation, EnrollInDefinedAcademyCourseMutationVariables>;
export const MyDefinedAcademyEnrollmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDefinedAcademyEnrollments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDefinedAcademyEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"academyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"academyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"enrolledAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastAccessedAt"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"coverImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"academyId"}}]}}]}}]}}]} as unknown as DocumentNode<MyDefinedAcademyEnrollmentsQuery, MyDefinedAcademyEnrollmentsQueryVariables>;
export const MyDefinedAcademyCourseProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDefinedAcademyCourseProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDefinedAcademyCourseProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollmentId"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"completedLessons"}},{"kind":"Field","name":{"kind":"Name","value":"totalLessons"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentStatus"}}]}}]}}]} as unknown as DocumentNode<MyDefinedAcademyCourseProgressQuery, MyDefinedAcademyCourseProgressQueryVariables>;
export const MyDefinedAcademyLessonProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDefinedAcademyLessonProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDefinedAcademyLessonProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enrollmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"lastPositionSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]} as unknown as DocumentNode<MyDefinedAcademyLessonProgressQuery, MyDefinedAcademyLessonProgressQueryVariables>;
export const StartDefinedAcademyLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartDefinedAcademyLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDefinedAcademyLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enrollmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"lastPositionSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}}]}}]}}]} as unknown as DocumentNode<StartDefinedAcademyLessonMutation, StartDefinedAcademyLessonMutationVariables>;
export const UpdateDefinedAcademyLessonProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDefinedAcademyLessonProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDefinedAcademyLessonProgressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDefinedAcademyLessonProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enrollmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"lastPositionSeconds"}}]}}]}}]} as unknown as DocumentNode<UpdateDefinedAcademyLessonProgressMutation, UpdateDefinedAcademyLessonProgressMutationVariables>;
export const CompleteDefinedAcademyLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteDefinedAcademyLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeDefinedAcademyLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enrollmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]} as unknown as DocumentNode<CompleteDefinedAcademyLessonMutation, CompleteDefinedAcademyLessonMutationVariables>;
export const CaptureDefinedAcademyReferralDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CaptureDefinedAcademyReferral"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CaptureDefinedAcademyReferralInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"captureDefinedAcademyReferral"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"referralCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attributionExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstVisitedAt"}}]}}]}}]} as unknown as DocumentNode<CaptureDefinedAcademyReferralMutation, CaptureDefinedAcademyReferralMutationVariables>;
export const AttachDefinedAcademyReferralToCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AttachDefinedAcademyReferralToCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachDefinedAcademyReferralInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachDefinedAcademyReferralToCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"referralCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"registeredAt"}}]}}]}}]} as unknown as DocumentNode<AttachDefinedAcademyReferralToCurrentUserMutation, AttachDefinedAcademyReferralToCurrentUserMutationVariables>;