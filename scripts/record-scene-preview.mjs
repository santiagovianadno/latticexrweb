#!/usr/bin/env node
/**
 * Record a short LatticeXR preview loop (rotation from the entry pose).
 *
 * Yaw advances per frame (not in real browser time) so speed matches the
 * gallery (~rotateSpeed deg/s), even if screenshots are slow.
 *
 * Usage:
 *   node scripts/record-scene-preview.mjs public/scenes/sala-lampara
 *   node scripts/record-scene-preview.mjs public/scenes/sala-lampara --port 3000
 *
 * Requires: npm run dev (or a server on --port) + playwright + ffmpeg
 */
import { spawn } from "node:child_process";
import { mkdirSync, existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const sceneDir = resolve(process.argv[2] || "");
const portArg = process.argv.indexOf("--port");
const port = portArg >= 0 ? process.argv[portArg + 1] : "3000";
/** Same speed as Galería Lo Contador (lib/scene-preview-pool.ts). */
const rotateSpeed = 8;
/** Smooth back-and-forth pan so the loop does not jump. */
const sweepSec = 5;
const durationSec = sweepSec * 2;
const fps = 24;
const width = 960;
const height = 720;

if (!sceneDir || !existsSync(join(sceneDir, "index.html"))) {
  console.error(
    "Usage: node scripts/record-scene-preview.mjs public/scenes/<slug> [--port 3000]",
  );
  process.exit(1);
}

const slug = sceneDir.split(/[/\\]/).filter(Boolean).at(-1);
const outDir = sceneDir;
const framesDir = join(outDir, ".preview-frames");
const outVideo = join(outDir, "preview.mp4");
const outPoster = join(outDir, "poster.webp");

// hold=1: the scene does not auto-rotate; the script moves yaw per frame.
const previewPath = `/scenes/${slug}/index.html?noui&noanim&preview=1&hold=1&rotateSpeed=${rotateSpeed}&sceneSlug=${encodeURIComponent(slug)}`;
const url = `http://localhost:${port}${previewPath}`;

function run(cmd, args, opts = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: false, ...opts });
    child.on("exit", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

function yawForFrame(i) {
  const t = i / fps;
  const half = sweepSec;
  if (t <= half) return rotateSpeed * t;
  return rotateSpeed * (2 * half - t);
}

async function waitForReady(page, timeoutMs = 180000) {
  await page.evaluate(() => {
    window.__latticexrPreviewReady = false;
    window.addEventListener("message", (event) => {
      if (event.data?.type === "latticexr-preview-ready") {
        window.__latticexrPreviewReady = true;
      }
    });
  });

  await page.waitForFunction(
    () => {
      const canvas = document.querySelector("canvas");
      return !!(
        canvas &&
        canvas.width > 0 &&
        canvas.height > 0 &&
        window.LatticeXR
      );
    },
    { timeout: timeoutMs },
  );

  await page
    .waitForFunction(() => window.__latticexrPreviewReady === true, {
      timeout: timeoutMs,
    })
    .catch(() => {});

  await page.waitForFunction(
    () => typeof window.LatticeXR?.setPreviewYawOffset === "function",
    { timeout: timeoutMs },
  );

  // Extra settle time for first WebGL frames after boot.
  await page.waitForTimeout(5000);
}

async function main() {
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    console.error("Installing playwright…");
    await run("npm", ["install", "-D", "playwright"]);
    await run("npx", ["playwright", "install", "chromium"]);
    playwright = await import("playwright");
  }

  if (existsSync(framesDir)) rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  console.log(`Opening ${url}`);
  console.log(
    `Yaw: ${rotateSpeed}°/s · ${durationSec}s ping-pong (${rotateSpeed * sweepSec}° sweep)`,
  );
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") console.warn("page:", msg.text());
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await waitForReady(page);

  await page.addStyleTag({
    content: `
      #ui, #infoPanel, #joystickBase, #joystickStick, .control-item { display: none !important; }
      body, html, canvas { background: #0a0b0c !important; }
    `,
  });

  const totalFrames = durationSec * fps;
  console.log(`Capturing ${totalFrames} frames @ ${fps}fps…`);

  for (let i = 0; i < totalFrames; i++) {
    const yaw = yawForFrame(i);
    await page.evaluate((deg) => {
      window.LatticeXR.setPreviewYawOffset(deg);
    }, yaw);
    // Let SuperSplat paint the frame with the new yaw.
    await page.waitForTimeout(40);
    const file = join(framesDir, `frame-${String(i).padStart(4, "0")}.png`);
    await page.screenshot({ path: file, type: "png" });
    if (i % fps === 0) console.log(`  ${i}/${totalFrames}  yaw=${yaw.toFixed(1)}°`);
  }

  const firstFrame = join(framesDir, "frame-0000.png");
  console.log("Encoding poster + mp4…");
  await run("ffmpeg", [
    "-y",
    "-i",
    firstFrame,
    "-vf",
    "scale=960:-2",
    "-q:v",
    "80",
    outPoster,
  ]);

  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(fps),
    "-i",
    join(framesDir, "frame-%04d.png"),
    "-vf",
    "scale=960:-2",
    "-c:v",
    "libx264",
    "-crf",
    "26",
    "-preset",
    "medium",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    outVideo,
  ]);

  await browser.close();
  rmSync(framesDir, { recursive: true, force: true });

  const scenesPath = resolve("lib/scenes.ts");
  console.log(`\nDone:\n  ${outVideo}\n  ${outPoster}`);
  console.log(
    `\nRegister in lib/scenes.ts:\n  previewVideo: "/scenes/${slug}/preview.mp4",\n  poster: "/scenes/${slug}/poster.webp",`,
  );
  console.log(`Scene dir: ${pathToFileURL(scenesPath).href}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
