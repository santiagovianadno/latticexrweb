"use client";

import { useLayoutEffect } from "react";
import { warmScenePreviews } from "@/lib/scene-preview-pool";
import { scenes } from "@/lib/scenes";

export function HomePreviewWarmup() {
  useLayoutEffect(() => {
    warmScenePreviews(scenes);
  }, []);

  return null;
}
