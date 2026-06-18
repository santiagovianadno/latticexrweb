import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewerShell } from "@/components/ViewerShell";
import { getAllSceneSlugs, getSceneBySlug } from "@/lib/scenes";

type ViewPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSceneSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ViewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const scene = getSceneBySlug(slug);

  if (!scene) {
    return { title: "Escena no encontrada" };
  }

  return {
    title: scene.title,
    description: scene.description,
    openGraph: {
      title: scene.title,
      description: scene.description,
      images: [{ url: scene.poster }],
    },
  };
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { slug } = await params;
  const scene = getSceneBySlug(slug);

  if (!scene) {
    notFound();
  }

  return <ViewerShell scene={scene} />;
}
