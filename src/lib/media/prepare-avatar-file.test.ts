import { describe, expect, it } from "vitest";
import { validateAvatarFile } from "@/lib/media/prepare-avatar-file";

function makeFile(type: string, size: number, name = "photo.jpg") {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("validateAvatarFile", () => {
  it("accepts jpeg under 10MB", () => {
    expect(validateAvatarFile(makeFile("image/jpeg", 1024))).toBeNull();
  });

  it("rejects non-images", () => {
    expect(validateAvatarFile(makeFile("application/pdf", 1024, "a.pdf"))).toBe(
      "Please choose a JPEG, PNG, WebP, or GIF image.",
    );
  });

  it("rejects files over 10MB", () => {
    expect(
      validateAvatarFile(makeFile("image/png", 10 * 1024 * 1024 + 1, "big.png")),
    ).toBe("Image must be 10 MB or smaller.");
  });
});
