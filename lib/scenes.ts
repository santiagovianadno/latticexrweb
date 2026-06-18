export type Scene = {
  slug: string;
  title: string;
  description: string;
  htmlPath: string;
  poster: string;
};

export const scenes: Scene[] = [
  {
    slug: "ejemplo",
    title: "Espacio de Ejemplo",
    description:
      "Escena de demostración. Reemplaza este archivo con tu exportación HTML de SuperSplat.",
    htmlPath: "/scenes/ejemplo/index.html",
    poster: "/scenes/ejemplo/poster.svg",
  },
];

export function getSceneBySlug(slug: string): Scene | undefined {
  return scenes.find((scene) => scene.slug === slug);
}

export function getAllSceneSlugs(): string[] {
  return scenes.map((scene) => scene.slug);
}
