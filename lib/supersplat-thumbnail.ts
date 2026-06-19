const POSTER_CDN =
  "https://s3-eu-west-1.amazonaws.com/images.playcanvas.com/splat";

/** Extrae el id de escena desde URLs superspl.at (/s?id=… o /scene/…). */
export function getSupersplatSceneId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const fromQuery = parsed.searchParams.get("id");
    if (fromQuery) return fromQuery;

    const parts = parsed.pathname.split("/").filter(Boolean);
    const sceneIdx = parts.indexOf("scene");
    if (sceneIdx >= 0 && parts[sceneIdx + 1]) {
      return parts[sceneIdx + 1];
    }

    return null;
  } catch {
    return null;
  }
}

/** Poster oficial usado por el visor embebido de superspl.at. */
export function getSupersplatThumbnailUrl(
  supersplatUrl: string,
  variant: "xl" = "xl",
): string | null {
  const id = getSupersplatSceneId(supersplatUrl);
  if (!id) return null;
  return `${POSTER_CDN}/${id}/v1/${variant}.webp`;
}

export function resolveShowcaseThumbnail(entry: {
  supersplatUrl: string;
  thumbnail?: string;
}): string | null {
  return entry.thumbnail ?? getSupersplatThumbnailUrl(entry.supersplatUrl);
}
