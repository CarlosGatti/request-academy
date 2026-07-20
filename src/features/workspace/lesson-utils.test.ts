import { describe, expect, it } from "vitest";
import {
  findAdjacentLessons,
  flattenCourseLessons,
} from "@/features/workspace/lesson-utils";

describe("flattenCourseLessons", () => {
  it("orders modules and lessons by sortOrder", () => {
    const flat = flattenCourseLessons([
      {
        id: 2,
        title: "Module B",
        sortOrder: 2,
        lessons: [
          { id: 3, slug: "c", title: "C", lessonType: "ARTICLE", isPreview: false, sortOrder: 2 },
          { id: 2, slug: "b", title: "B", lessonType: "VIDEO", isPreview: true, sortOrder: 1 },
        ],
      },
      {
        id: 1,
        title: "Module A",
        sortOrder: 1,
        lessons: [
          { id: 1, slug: "a", title: "A", lessonType: "ARTICLE", isPreview: false, sortOrder: 1 },
        ],
      },
    ]);

    expect(flat.map((lesson) => lesson.slug)).toEqual(["a", "b", "c"]);
  });

  it("finds previous and next lessons", () => {
    const lessons = flattenCourseLessons([
      {
        id: 1,
        title: "M",
        sortOrder: 1,
        lessons: [
          { id: 1, slug: "a", title: "A", lessonType: "VIDEO", isPreview: false, sortOrder: 1 },
          { id: 2, slug: "b", title: "B", lessonType: "VIDEO", isPreview: false, sortOrder: 2 },
          { id: 3, slug: "c", title: "C", lessonType: "VIDEO", isPreview: false, sortOrder: 3 },
        ],
      },
    ]);

    expect(findAdjacentLessons(lessons, "b").previous?.slug).toBe("a");
    expect(findAdjacentLessons(lessons, "b").next?.slug).toBe("c");
  });
});
