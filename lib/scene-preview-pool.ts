export function buildScenePreviewUrl(htmlPath: string, slug: string): string {
  const joiner = htmlPath.includes("?") ? "&" : "?";
  return `${htmlPath}${joiner}noui&noanim&preview=1&hold=1&rotateSpeed=8&sceneSlug=${encodeURIComponent(slug)}`;
}
