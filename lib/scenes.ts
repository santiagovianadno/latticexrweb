export type Scene = {
  slug: string;
  title: string;
  description: string;
  htmlPath: string;
  poster: string;
  /** Loop corto (mp4/webm) — preview tipo video al hover, ideal vs iframe pesado */
  previewVideo?: string;
  /** Mini case study del montaje expositivo */
  context?: string;
  tags?: string[];
};

export const scenes: Scene[] = [
  {
    slug: "galeria-lo-contador",
    title: "Galería Lo Contador",
    description: "",
    htmlPath: "/scenes/galeria-lo-contador/index.html",
    poster: "/scenes/galeria-lo-contador/poster.svg",
  },
];

export function getSceneBySlug(slug: string): Scene | undefined {
  return scenes.find((scene) => scene.slug === slug);
}

export function getAllSceneSlugs(): string[] {
  return scenes.map((scene) => scene.slug);
}
