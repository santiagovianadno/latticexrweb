import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SCENE_HTML = join(
  process.cwd(),
  "public/scenes/galeria-lo-contador/index.html",
);

function isLfsPointer(filePath) {
  if (!existsSync(filePath)) return false;
  const head = readFileSync(filePath, "utf8").slice(0, 80);
  return head.startsWith("version https://git-lfs.github.com/spec/v1");
}

function tryGitLfsPull() {
  try {
    execSync("git lfs version", { stdio: "ignore" });
  } catch {
    console.warn(
      "[ensure-scene-assets] git-lfs CLI not found; skipping git lfs pull.",
    );
    return;
  }

  try {
    execSync("git lfs install --local", { stdio: "ignore" });
    execSync("git lfs pull", { stdio: "inherit" });
  } catch (error) {
    console.warn("[ensure-scene-assets] git lfs pull failed:", error.message);
  }
}

tryGitLfsPull();

if (isLfsPointer(SCENE_HTML)) {
  console.error(
    "\n[ensure-scene-assets] public/scenes/galeria-lo-contador/index.html is still a Git LFS pointer.",
  );
  console.error(
    "Vercel must download LFS blobs during build. Enable Git LFS on the repo and redeploy.",
  );
  process.exit(1);
}

if (existsSync(SCENE_HTML)) {
  console.log("[ensure-scene-assets] Scene HTML OK.");
}
