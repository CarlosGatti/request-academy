import { describe, expect, it, vi, afterEach } from "vitest";
import { resolveMediaUrl } from "@/lib/media/resolve-media-url";

describe("resolveMediaUrl (avatar)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null for empty", () => {
    expect(resolveMediaUrl(null)).toBeNull();
    expect(resolveMediaUrl("")).toBeNull();
    expect(resolveMediaUrl("   ")).toBeNull();
  });

  it("passes through absolute URLs", () => {
    expect(
      resolveMediaUrl("https://www.discart.me/uploads/avatars/a.jpg"),
    ).toBe("https://www.discart.me/uploads/avatars/a.jpg");
  });

  it("prefixes relative paths with API base", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://www.discart.me");
    expect(resolveMediaUrl("/uploads/avatars/file-1.jpg")).toBe(
      "https://www.discart.me/uploads/avatars/file-1.jpg",
    );
  });
});
