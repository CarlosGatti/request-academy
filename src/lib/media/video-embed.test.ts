import { describe, expect, it } from "vitest";
import { isEmbeddableVideoUrl, toVideoEmbedUrl } from "@/lib/media/video-embed";

describe("toVideoEmbedUrl", () => {
  it("converts youtube watch URLs", () => {
    expect(
      toVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("converts youtu.be short links", () => {
    expect(toVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });

  it("keeps existing embed URLs", () => {
    expect(
      toVideoEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ"),
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("converts vimeo URLs", () => {
    expect(toVideoEmbedUrl("https://vimeo.com/123456789")).toBe(
      "https://player.vimeo.com/video/123456789",
    );
  });

  it("returns null for direct mp4 links", () => {
    expect(toVideoEmbedUrl("https://cdn.example.com/lesson.mp4")).toBeNull();
    expect(isEmbeddableVideoUrl("https://cdn.example.com/lesson.mp4")).toBe(
      false,
    );
  });
});
