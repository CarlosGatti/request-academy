import { describe, expect, it } from "vitest";
import { resolveMediaUrl } from "@/lib/academy/resolve-media-url";

describe("resolveMediaUrl", () => {
  it("passes through absolute URLs", () => {
    expect(resolveMediaUrl("https://cdn.example.com/a.jpg")).toBe(
      "https://cdn.example.com/a.jpg",
    );
  });

  it("returns undefined for empty", () => {
    expect(resolveMediaUrl(null)).toBeUndefined();
    expect(resolveMediaUrl("")).toBeUndefined();
  });

  it("prefixes relative upload paths with API origin", () => {
    const resolved = resolveMediaUrl(
      "/uploads/academy/logo/1/x.webp",
      "https://www.discart.me",
    );
    expect(resolved).toBe("https://www.discart.me/uploads/academy/logo/1/x.webp");
  });
});
