# LatticeXR

Herramienta **MR** para prototipado ágil de montajes expositivos sobre espacios reconstruidos con Gaussian Splatting. Este repositorio incluye la **web accesible** del Proyecto de Título de Diseño UC de **Santiago Viana**: catálogo de escenas propias, explorador curado de obras en [SuperSplat](https://superspl.at) y descarga del APK para Quest 3.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Contenido editable

Reemplaza los placeholders sin tocar los componentes:

| Qué | Dónde |
| --- | --- |
| Pitch, pasos, textos de secciones, footer | [`lib/site-copy.ts`](lib/site-copy.ts) |
| Obras curadas de superspl.at (URLs reales desde Embed) | [`lib/supersplat-showcase.ts`](lib/supersplat-showcase.ts) |
| Contexto y tags de escenas propias | [`lib/scenes.ts`](lib/scenes.ts) |
| APK Quest 3 | [`public/downloads/latticexr-quest.apk`](public/downloads/) |
| Email y profesor guía | [`lib/site-copy.ts`](lib/site-copy.ts) → `footer` |
| Repositorio GitHub | [`lib/site-copy.ts`](lib/site-copy.ts) → `github.url` |

Las URLs de superspl.at deben copiarse desde el botón **Embed** de cada escena pública (`https://superspl.at/scene/…`).

## Agregar una escena propia

1. Configura la escena en **SuperSplat Studio** (cámara, colisión, controles).
2. Exporta como **Viewer App → HTML** (archivo único).
3. Coloca el archivo en `public/scenes/{slug}/index.html`.
4. Agrega una imagen de portada en `public/scenes/{slug}/poster.jpg` (o `.svg`).
5. Registra la escena en [`lib/scenes.ts`](lib/scenes.ts):

```ts
{
  slug: "mi-espacio",
  title: "Mi Espacio",
  description: "Descripción breve.",
  htmlPath: "/scenes/mi-espacio/index.html",
  poster: "/scenes/mi-espacio/poster.jpg",
}
```

## Ajustar cámara y límites (LatticeXR patch)

Cada escena puede incluir:

- `lattice-config.json` — altura de cabeza, padding de límites, yaw inicial
- `lattice-patch.js` — control first-person WASD sin Q/E

Tras exportar un HTML nuevo de SuperSplat, ejecuta:

```bash
node scripts/inject-lattice-patch.mjs public/scenes/<slug>
```

Parámetros útiles en `lattice-config.json`:

| Campo | Descripción |
| --- | --- |
| `headHeight` | Altura fija de cámara (metros/unidades de escena) |
| `headHeightOffsetFromFloor` | Alternativa: suelo + offset (default 1.65) |
| `boundaryPadding` | Margen interior para no salir del splat (default 0.8) |
| `initialYaw` | Dirección inicial al entrar |
| `initialPosition` | `[x, y, z]` opcional para punto de inicio |
| `fov` | Campo de visión en grados (default del export: 50; recomendado 70–85) |
| `playerRadius` | Radio del “cuerpo” para chocar con paredes (default 0.35) |
| `walkablePolygon` | Polígono `[[x,z], ...]` del suelo transitable; si es `null`, usa el rectángulo del bbox |
| `walls` | Paredes interiores: `{ "a": [x,z], "b": [x,z], "thickness": 0.2 }` |
| `debug` | `true` muestra coordenadas en pantalla; Shift+click en canvas las imprime en consola |

Ejemplo de paredes interiores:

```json
"walls": [
  { "a": [-3.5, 1.2], "b": [2.0, 1.2], "thickness": 0.25 },
  { "a": [2.0, 1.2], "b": [2.0, 6.5], "thickness": 0.25 }
]
```

Activa `"debug": true`, camina hasta una esquina de pared, Shift+click y copia las coordenadas desde la consola del navegador.

## Colisión y navegación WASD

**En LatticeXR:** la colisión básica se define en `lattice-config.json` (polígono del suelo + segmentos de pared). No es física voxel; es una aproximación geométrica que puedes afinar coordenada a coordenada.

**En SuperSplat Studio (opcional, más preciso):** puedes exportar colisión voxel real antes del HTML. Eso requiere re-exportar la escena desde [SuperSplat Studio](https://superspl.at):

1. Sube geometría de colisión en **Assets → Collision**.
2. Prueba el movimiento en el viewport.
3. Re-exporta como HTML.

Si un HTML ya exportado no tiene voxel collision, el patch de LatticeXR sigue siendo la vía principal para delimitar el espacio.

## Archivos grandes y Git LFS

Las exportaciones HTML de splats suelen pesar 50–200+ MB. GitHub bloquea archivos mayores a 100 MB.

Este proyecto usa **Git LFS** para archivos de escena:

```bash
git lfs install
git lfs track "public/scenes/**/*.html"
```

Si los archivos superan los límites de GitHub o Vercel, considera hospedar las escenas en [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) u otro CDN y actualiza `htmlPath` en `lib/scenes.ts` con la URL externa.

## Estructura

```
app/                        Páginas Next.js (home, visor, acerca de)
components/                 UI (HeroPitch, SplatExplorer, SceneCard…)
lib/site-copy.ts            Textos del sitio (placeholders editables)
lib/supersplat-showcase.ts  Obras curadas de superspl.at
lib/scenes.ts               Registro de escenas propias
public/scenes/              Exportaciones HTML de SuperSplat
public/downloads/           APK Quest 3
```

## Créditos

- **Autor:** Santiago Viana
- **Institución:** Pontificia Universidad Católica de Chile
- **Programa:** Diseño — Proyecto de Título
