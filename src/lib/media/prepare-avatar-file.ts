export const AVATAR_UPLOAD = {
  maxInputBytes: 10 * 1024 * 1024,
  maxOutputPx: 512,
  allowedMime: ["image/jpeg", "image/png", "image/webp", "image/gif"] as const,
  outputMime: "image/jpeg" as const,
  outputQuality: 0.85,
};

export function validateAvatarFile(file: File): string | null {
  if (
    !(AVATAR_UPLOAD.allowedMime as readonly string[]).includes(file.type)
  ) {
    return "Please choose a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > AVATAR_UPLOAD.maxInputBytes) {
    return "Image must be 10 MB or smaller.";
  }
  return null;
}

/** Center-crop to square then encode as JPEG. Returns a new File for upload. */
export async function prepareAvatarFile(file: File): Promise<File> {
  const validationError = validateAvatarFile(file);
  if (validationError) throw new Error(validationError);

  return cropImageToSquare(file, AVATAR_UPLOAD.maxOutputPx);
}

async function cropImageToSquare(file: File, size: number): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas not supported");
  }

  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
      AVATAR_UPLOAD.outputMime,
      AVATAR_UPLOAD.outputQuality,
    );
  });

  return new File([blob], "avatar.jpg", {
    type: AVATAR_UPLOAD.outputMime,
    lastModified: Date.now(),
  });
}
