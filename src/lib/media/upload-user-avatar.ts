import { getApiBase } from "@/lib/media/api-base";
import { prepareAvatarFile } from "@/lib/media/prepare-avatar-file";

export type UploadAvatarResult = {
  /** Absolute URL ready for `updateUser.profilePicture` */
  absoluteUrl: string;
  /** Relative path from API, e.g. `/uploads/avatars/file-xxx.jpg` */
  relativeUrl: string;
};

export class AvatarUploadError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AvatarUploadError";
    this.status = status;
  }
}

/**
 * POST `/uploads/avatars` with FormData field `file` + Bearer JWT.
 * Do not set Content-Type — browser sets multipart boundary.
 * JWT only — does not require DEFINED app access.
 */
export async function uploadUserAvatar(
  file: File,
  token: string,
): Promise<UploadAvatarResult> {
  const prepared = await prepareAvatarFile(file);
  const form = new FormData();
  form.append("file", prepared);

  const res = await fetch(`${getApiBase()}/uploads/avatars`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 401) {
      throw new AvatarUploadError(
        "Session expired. Please sign in again.",
        401,
      );
    }
    if (res.status === 403) {
      throw new AvatarUploadError("Not allowed to upload.", 403);
    }
    if (res.status === 400) {
      throw new AvatarUploadError(text || "Invalid image file.", 400);
    }
    throw new AvatarUploadError(
      text || `Upload failed (${res.status})`,
      res.status,
    );
  }

  const json = (await res.json()) as { url?: string };
  if (!json.url) throw new AvatarUploadError("Upload response missing url", 500);

  const relativeUrl = json.url.startsWith("/") ? json.url : `/${json.url}`;
  const absoluteUrl = `${getApiBase()}${relativeUrl}`;

  return { relativeUrl, absoluteUrl };
}
