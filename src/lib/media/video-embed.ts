/**
 * Convert common YouTube / Vimeo share URLs into iframe-safe embed URLs.
 * Watch pages (`youtube.com/watch?v=…`) refuse to load inside iframes.
 */
export function toVideoEmbedUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}${url.search}`;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (url.pathname.startsWith("/embed/")) {
      return url.toString();
    }
    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/")[2];
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}`;
    }
    const id = url.searchParams.get("v");
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    if (host === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
      return url.toString();
    }
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (!id || !/^\d+$/.test(id)) return null;
    return `https://player.vimeo.com/video/${id}`;
  }

  return null;
}

export function isEmbeddableVideoUrl(url: string): boolean {
  return toVideoEmbedUrl(url) != null || url.includes("/embed/");
}
