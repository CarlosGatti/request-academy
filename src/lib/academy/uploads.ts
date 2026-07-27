import { getAccessToken } from "@/lib/auth/token";
import { clientEnv } from "@/lib/env/client";
import { toInt } from "@/lib/graphql/ids";

export type ProgramCoverUploadResult = {
  academyId: number;
  courseId: number;
  url: string;
};

export type AcademyLogoUploadResult = {
  academyId: number;
  url: string;
};

export type PartnerLogoUploadResult = {
  academyId: number;
  partnerId: number;
  url: string;
};

export type ResourceFileUploadResult = {
  academyId: number;
  url: string;
  mimeType: string;
  fileName: string;
};

export class AcademyUploadError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AcademyUploadError";
    this.status = status;
  }
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const RESOURCE_TYPES = [...IMAGE_TYPES, "application/pdf"] as const;
const MAX_COVER_BYTES = 8 * 1024 * 1024;
const MAX_RESOURCE_BYTES = 12 * 1024 * 1024;

export function validateImageFile(file: File, maxBytes = MAX_COVER_BYTES) {
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) {
    throw new AcademyUploadError("Use JPEG, PNG, or WebP", 400);
  }
  if (file.size > maxBytes) {
    throw new AcademyUploadError(
      `File must be under ${maxBytes / 1024 / 1024}MB`,
      400,
    );
  }
}

export function validateResourceFile(file: File) {
  if (!(RESOURCE_TYPES as readonly string[]).includes(file.type)) {
    throw new AcademyUploadError("Use JPEG, PNG, WebP, or PDF", 400);
  }
  if (file.size > MAX_RESOURCE_BYTES) {
    throw new AcademyUploadError("File must be under 12MB", 400);
  }
}

/**
 * Uploads POST directly to the Nest API host (`discart.me` in production).
 * Do not set Content-Type — browser sets multipart boundary.
 */
async function postMultipart<T>(path: string, form: FormData): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new AcademyUploadError("Sign in required to upload files.", 401);
  }

  const response = await fetch(`${clientEnv.apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    let message = `Upload failed (${response.status})`;
    if (response.status === 403) {
      message = "Defined backoffice access required";
    } else if (response.status === 401) {
      message = "Sign in required to upload files.";
    } else {
      try {
        const body = (await response.json()) as {
          message?: string | string[];
        };
        if (Array.isArray(body.message)) message = body.message.join(", ");
        else if (typeof body.message === "string") message = body.message;
      } catch {
        // keep default message
      }
    }
    throw new AcademyUploadError(message, response.status);
  }

  return (await response.json()) as T;
}

function appendInt(form: FormData, key: string, value: unknown) {
  form.append(key, String(toInt(value, key)));
}

export async function uploadProgramCover(input: {
  file: File;
  academyId: number | string;
  courseId: number | string;
}): Promise<ProgramCoverUploadResult> {
  validateImageFile(input.file);
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  appendInt(form, "courseId", input.courseId);
  return postMultipart("/academy/upload/programs/cover", form);
}

export async function uploadAcademyLogo(input: {
  file: File;
  academyId: number | string;
}): Promise<AcademyLogoUploadResult> {
  validateImageFile(input.file);
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  return postMultipart("/academy/upload/academy/logo", form);
}

export async function uploadPartnerLogo(input: {
  file: File;
  academyId: number | string;
  partnerId: number | string;
}): Promise<PartnerLogoUploadResult> {
  validateImageFile(input.file);
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  appendInt(form, "partnerId", input.partnerId);
  return postMultipart("/academy/upload/partners/logo", form);
}

export async function uploadResourceFile(input: {
  file: File;
  academyId: number | string;
}): Promise<ResourceFileUploadResult> {
  validateResourceFile(input.file);
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  return postMultipart("/academy/upload/resources/file", form);
}
