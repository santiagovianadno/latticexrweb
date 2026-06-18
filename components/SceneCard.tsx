import Image from "next/image";
import Link from "next/link";
import type { Scene } from "@/lib/scenes";

type SceneCardProps = {
  scene: Scene;
  index: number;
};

export function SceneCard({ scene, index }: SceneCardProps) {
  return (
    <Link
      href={`/view/${scene.slug}`}
      className="group animate-fade-up block overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:border-accent/40 hover:bg-surface-elevated"
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        <Image
          src={scene.poster}
          alt={scene.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="font-[family-name:var(--font-syne)] text-xs font-semibold uppercase tracking-widest text-accent">
            Explorar
          </span>
        </div>
      </div>
      <div className="p-5">
        <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground">
          {scene.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {scene.description}
        </p>
      </div>
    </Link>
  );
}
