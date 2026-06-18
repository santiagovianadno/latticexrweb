import { scenes } from "@/lib/scenes";
import { SceneCard } from "./SceneCard";

export function SceneGrid() {
  if (scenes.length === 0) {
    return (
      <p className="text-muted">
        No hay escenas publicadas aún. Agrega una exportación HTML de SuperSplat
        en <code className="text-accent">public/scenes/</code> y regístrala en{" "}
        <code className="text-accent">lib/scenes.ts</code>.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {scenes.map((scene, index) => (
        <SceneCard key={scene.slug} scene={scene} index={index} />
      ))}
    </div>
  );
}
