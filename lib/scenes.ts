export type Scene = {
  slug: string;
  title: string;
  description: string;
  htmlPath: string;
  poster: string;
  /** Short loop (mp4/webm) — video-style hover preview, preferred over a heavy iframe */
  previewVideo?: string;
  /** Mini case study of the exhibition layout */
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
  {
    slug: "sala-lampara",
    title: "Sala Lámpara",
    description: "",
    htmlPath: "/scenes/sala-lampara/index.html",
    poster: "/scenes/sala-lampara/poster.webp",
    previewVideo: "/scenes/sala-lampara/preview.mp4",
  },
];

export function getSceneBySlug(slug: string): Scene | undefined {
  return scenes.find((scene) => scene.slug === slug);
}

export function getAllSceneSlugs(): string[] {
  return scenes.map((scene) => scene.slug);
}
