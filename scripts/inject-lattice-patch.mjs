import fs from "fs";
import path from "path";

const sceneDir = process.argv[2];

if (!sceneDir) {
  console.error("Usage: node scripts/inject-lattice-patch.mjs <scene-directory>");
  process.exit(1);
}

const htmlPath = path.join(sceneDir, "index.html");

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing ${htmlPath}`);
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, "utf8");

html = html.replace(
  /^\s*<script src="\.\/lattice-patch\.js"><\/script>\s*\n\s*<script>\s*\n\s*const \{ config, settings \} = window\.sse;/m,
  "            const { config, settings } = window.sse;",
);

if (!html.includes('src="./lattice-patch.js"')) {
  html = html.replace(
    "        <!-- Application Script -->\r\n        <script type=\"module\">",
    '        <script src="./lattice-patch.js"></script>\r\n        <!-- Application Script -->\r\n        <script type="module">',
  );
}

const viewerCall =
  "const viewer = await main(appElement.app, cameraElement.entity, settingsJson, config);";

const patchedCall = `${viewerCall}
                if (window.LatticeXR?.patchViewer) {
                    await window.LatticeXR.patchViewer(viewer);
                }`;

if (!html.includes("LatticeXR.patchViewer")) {
  html = html.replace(viewerCall, patchedCall);
}

fs.writeFileSync(htmlPath, html);
console.log(`Patched ${htmlPath}`);
