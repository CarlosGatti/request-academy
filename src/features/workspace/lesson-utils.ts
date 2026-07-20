export type FlatLesson = {
  id: number;
  slug: string;
  title: string;
  lessonType: string;
  moduleTitle: string;
  moduleId: number;
  sortOrder: number;
  isPreview: boolean;
};

export function flattenCourseLessons(
  modules: Array<{
    id: number;
    title: string;
    sortOrder?: number | null;
    lessons?: Array<{
      id: number;
      slug: string;
      title: string;
      lessonType: string;
      isPreview: boolean;
      sortOrder?: number | null;
    }> | null;
  }> | null | undefined,
): FlatLesson[] {
  const sortedModules = [...(modules ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return sortedModules.flatMap((module) => {
    const lessons = [...(module.lessons ?? [])].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
    return lessons.map((lesson) => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      lessonType: lesson.lessonType,
      moduleTitle: module.title,
      moduleId: module.id,
      sortOrder: lesson.sortOrder ?? 0,
      isPreview: lesson.isPreview,
    }));
  });
}

export function findAdjacentLessons(lessons: FlatLesson[], currentSlug: string) {
  const index = lessons.findIndex((lesson) => lesson.slug === currentSlug);
  if (index < 0) {
    return { previous: null, next: null, current: null, index: -1 };
  }
  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
    current: lessons[index],
    index,
  };
}
