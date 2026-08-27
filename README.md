# LatticeXR

**MR** tool for agile prototyping of exhibition layouts on spaces reconstructed with Gaussian Splatting.

This repository (**latticexrweb**) is the **accessible web** of **Santiago Viana**'s UC Design graduation project: a catalog of original scenes, a curated explorer of works on [SuperSplat](https://superspl.at), and a download link for the Quest 3 APK.

The Unity / Quest app lives in **[santiagovianadno/LATTICEXR](https://github.com/santiagovianadno/LATTICEXR)**.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editable content

Replace placeholders without touching the components:

| What | Where |
| --- | --- |
| Pitch, steps, section copy, footer | [`lib/site-copy.ts`](lib/site-copy.ts) |
| Curated superspl.at works (real URLs from Embed) | [`lib/supersplat-showcase.ts`](lib/supersplat-showcase.ts) |
| Context and tags for original scenes | [`lib/scenes.ts`](lib/scenes.ts) |
| Quest 3 APK | Release in [LATTICEXR](https://github.com/santiagovianadno/LATTICEXR/releases) (`LatticeXRv0.999.apk`) — not in this repo (exceeds the Vercel limit) |
| Email and thesis advisor | [`lib/site-copy.ts`](lib/site-copy.ts) → `footer` |
| GitHub repository (Unity app) | [`lib/site-copy.ts`](lib/site-copy.ts) → `github.url` → [LATTICEXR](https://github.com/santiagovianadno/LATTICEXR) |

Copy superspl.at URLs from the **Embed** button on each public scene (`https://superspl.at/scene/…`).

## Add an original scene

1. Set up the scene in **SuperSplat Studio** (camera, collision, controls).
2. Export as **Viewer App → HTML** (single file).
3. Place the file in `public/scenes/{slug}/index.html`.
4. Add a cover image in `public/scenes/{slug}/poster.jpg` (or `.svg`).
5. Register the scene in [`lib/scenes.ts`](lib/scenes.ts):

```ts
{
  slug: "my-space",
  title: "My Space",
  description: "Short description.",
  htmlPath: "/scenes/my-space/index.html",
  poster: "/scenes/my-space/poster.jpg",
}
```

## Adjust camera and bounds (LatticeXR patch)

Each scene can include:

- `lattice-config.json` — head height, bound padding, initial yaw
- `lattice-patch.js` — first-person WASD control without Q/E

After exporting a new SuperSplat HTML file, run:

```bash
node scripts/inject-lattice-patch.mjs public/scenes/<slug>
```

Useful parameters in `lattice-config.json`:

| Field | Description |
| --- | --- |
| `headHeight` | Fixed camera height (meters / scene units) |
| `headHeightOffsetFromFloor` | Alternative: floor + offset (default 1.65) |
| `boundaryPadding` | Inner margin so you do not walk out of the splat (default 0.8) |
| `initialYaw` | Initial facing direction on enter |
| `initialPosition` | Optional `[x, y, z]` start point |
| `fov` | Field of view in degrees (export default: 50; recommended 70–85) |
| `playerRadius` | “Body” radius for wall collisions (default 0.35) |
| `walkablePolygon` | Walkable floor polygon `[[x,z], ...]`; if `null`, uses the bbox rectangle |
| `walls` | Interior walls: `{ "a": [x,z], "b": [x,z], "thickness": 0.2 }` |
| `debug` | `true` shows coordinates on screen; Shift+click on the canvas prints them to the console |

Example interior walls:

```json
"walls": [
  { "a": [-3.5, 1.2], "b": [2.0, 1.2], "thickness": 0.25 },
  { "a": [2.0, 1.2], "b": [2.0, 6.5], "thickness": 0.25 }
]
```

Turn on `"debug": true`, walk to a wall corner, Shift+click, and copy the coordinates from the browser console.

## Collision and WASD navigation

**In LatticeXR:** basic collision is defined in `lattice-config.json` (floor polygon + wall segments). It is not voxel physics; it is a geometric approximation you can tune coordinate by coordinate.

**In SuperSplat Studio (optional, more precise):** you can export real voxel collision before the HTML. That requires re-exporting the scene from [SuperSplat Studio](https://superspl.at):

1. Upload collision geometry in **Assets → Collision**.
2. Test movement in the viewport.
3. Re-export as HTML.

If an already exported HTML file has no voxel collision, the LatticeXR patch remains the main way to bound the space.

## Large files and Git LFS

Splat HTML exports often weigh 50–200+ MB. GitHub blocks files larger than 100 MB.

This project uses **Git LFS** for scene files:

```bash
git lfs install
git lfs track "public/scenes/**/*.html"
```

If files exceed GitHub or Vercel limits, consider hosting the scenes on [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or another CDN, then update `htmlPath` in `lib/scenes.ts` with the external URL.

## Structure

```
app/                        Next.js pages (home, viewer, about)
components/                 UI (HeroPitch, SplatExplorer, SceneCard…)
lib/site-copy.ts            Site copy (editable placeholders)
lib/supersplat-showcase.ts  Curated superspl.at works
lib/scenes.ts               Original scene registry
public/scenes/              SuperSplat HTML exports
public/downloads/           Quest 3 APK
```

## Credits

- **Author:** Santiago Viana
- **Institution:** Pontificia Universidad Católica de Chile
- **Program:** Design — Graduation Project
