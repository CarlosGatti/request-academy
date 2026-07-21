import { getAccessToken } from "@/lib/auth/token";
import { clientEnv } from "@/lib/env/client";
import { requireGraphQLInt } from "@/lib/graphql/ids";

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

/**
 * Uploads POST directly to the Nest API host (`discart.me` in production).
 * Production Nginx must allow the frontend origin for `/academy/upload`
 * (same pattern already used for `/graphql`).
 */
async function postMultipart<T>(
  path: string,
  form: FormData,
): Promise<T> {
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
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(", ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      // keep default message
    }
    throw new AcademyUploadError(message, response.status);
  }

  return (await response.json()) as T;
}

/** Append int fields as plain form numbers (not JSON strings). */
function appendInt(form: FormData, key: string, value: unknown) {
  form.append(key, String(requireGraphQLInt(value, key)));
}

export async function uploadProgramCover(input: {
  file: File;
  academyId: number;
  courseId: number;
}): Promise<ProgramCoverUploadResult> {
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  appendInt(form, "courseId", input.courseId);
  return postMultipart("/academy/upload/programs/cover", form);
}

export async function uploadAcademyLogo(input: {
  file: File;
  academyId: number;
}): Promise<AcademyLogoUploadResult> {
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  return postMultipart("/academy/upload/academy/logo", form);
}

export async function uploadPartnerLogo(input: {
  file: File;
  academyId: number;
  partnerId: number;
}): Promise<PartnerLogoUploadResult> {
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  appendInt(form, "partnerId", input.partnerId);
  return postMultipart("/academy/upload/partners/logo", form);
}

export async function uploadResourceFile(input: {
  file: File;
  academyId: number;
}): Promise<ResourceFileUploadResult> {
  const form = new FormData();
  form.append("file", input.file);
  appendInt(form, "academyId", input.academyId);
  return postMultipart("/academy/upload/resources/file", form);
}
