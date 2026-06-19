import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SCENE_HTML = join(
  process.cwd(),
  "public/scenes/galeria-lo-contador/index.html",
);

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit" });
}

function isLfsPointer(filePath) {
  if (!existsSync(filePath)) return false;
  const head = readFileSync(filePath, "utf8").slice(0, 80);
  return head.startsWith("version https://git-lfs.github.com/spec/v1");
}

function pullLfsAssets() {
  try {
    execSync("git lfs version", { stdio: "ignore" });
  } catch {
    console.warn(
      "[ensure-scene-assets] git-lfs CLI not found; skipping LFS pull.",
    );
    return;
  }

  run("git lfs install");

  const owner = process.env.VERCEL_GIT_REPO_OWNER || "santiagovianadno";
  const repo = process.env.VERCEL_GIT_REPO_SLUG || "latticexrweb";
  const ref = process.env.VERCEL_GIT_COMMIT_REF || "main";
  const repoUrl = `https://github.com/${owner}/${repo}.git`;

  try {
    run(`git remote set-url origin ${repoUrl}`);
  } catch {
    try {
      run(`git remote add origin ${repoUrl}`);
    } catch {
      /* remote already configured */
    }
  }

  run(`git config lfs.url ${repoUrl}/info/lfs`);

  try {
    run(`git lfs fetch origin ${ref}`);
    run("git lfs checkout");
  } catch {
    run(`git lfs pull origin ${ref}`);
  }
}

pullLfsAssets();

if (isLfsPointer(SCENE_HTML)) {
  console.error(
    "\n[ensure-scene-assets] public/scenes/galeria-lo-contador/index.html is still a Git LFS pointer.",
  );
  console.error(
    "Ensure Git LFS is enabled on GitHub and the scene blob was pushed with `git lfs push origin main`.",
  );
  process.exit(1);
}

if (existsSync(SCENE_HTML)) {
  console.log("[ensure-scene-assets] Scene HTML OK.");
}
