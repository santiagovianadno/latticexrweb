export type Scene = {
  slug: string;
  title: string;
  description: string;
  htmlPath: string;
  poster: string;
};

export const scenes: Scene[] = [
  {
    slug: "galeria-lo-contador",
    title: "Galería Lo Contador",
    description:
      "Recorrido inmersivo a altura de cabeza por la galería interior, con navegación WASD y límites de espacio.",
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
