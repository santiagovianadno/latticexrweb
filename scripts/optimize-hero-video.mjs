#!/usr/bin/env node
/**
 * Genera poster WebP + MP4 web optimizado desde public/latticexr-hero.mp4
 * Uso: node scripts/optimize-hero-video.mjs
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const source = join(publicDir, "latticexr-hero.mp4");
const poster = join(publicDir, "latticexr-hero-poster.webp");
const web = join(publicDir, "latticexr-hero.web.mp4");

if (!existsSync(source)) {
  console.error("Missing public/latticexr-hero.mp4");
  process.exit(1);
}

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

run(
  `ffmpeg -y -i "${source}" -ss 00:00:01 -frames:v 1 -vf "scale=1920:-2" -q:v 80 "${poster}"`,
);
run(
  `ffmpeg -y -i "${source}" -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset medium -an -movflags +faststart -pix_fmt yuv420p "${web}"`,
);

console.log("\nDone: latticexr-hero-poster.webp + latticexr-hero.web.mp4");
