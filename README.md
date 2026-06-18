# LatticeXR

Visor web y móvil de Gaussian Splats para el **Proyecto de Título de Diseño UC** de **Santiago Viana**.

Explora espacios interiores reconstruidos con Gaussian Splatting. Cada escena es una exportación HTML de [SuperSplat](https://superspl.at), integrada en un catálogo navegable con Next.js.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Agregar una escena

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

## Colisión y navegación WASD

La navegación con **WASD** y los límites de paredes se configuran en **SuperSplat Studio antes de exportar**, no en este repositorio.

1. Abre la escena en [SuperSplat Studio](https://superspl.at).
2. Sube geometría de colisión en **Assets → Collision** (datos voxel).
3. Ajusta la cámara inicial y prueba el movimiento en el viewport.
4. Guarda y re-exporta como HTML solo cuando la colisión sea correcta.

Si un HTML ya exportado no tiene colisión, debes **re-exportarlo** desde SuperSplat.

## Archivos grandes y Git LFS

Las exportaciones HTML de splats suelen pesar 50–200+ MB. GitHub bloquea archivos mayores a 100 MB.

Este proyecto usa **Git LFS** para archivos de escena:

```bash
git lfs install
git lfs track "public/scenes/**/*.html"
```

Si los archivos superan los límites de GitHub o Vercel, considera hospedar las escenas en [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) u otro CDN y actualiza `htmlPath` en `lib/scenes.ts` con la URL externa.

## Despliegue en Vercel

### 1. Repositorio en GitHub

```bash
git branch -M main
gh repo create latticexr --public --source=. --remote=origin --push
```

O crea el repositorio manualmente en GitHub y luego:

```bash
git remote add origin https://github.com/<tu-usuario>/latticexr.git
git push -u origin main
```

### 2. Conectar Vercel

1. Ve a [vercel.com/new](https://vercel.com/new).
2. Importa el repositorio `latticexr`.
3. Framework: **Next.js** (detectado automáticamente).
4. Despliega — no se requieren variables de entorno para la v1.

## Estructura

```
app/           Páginas Next.js (galería, visor, acerca de)
components/    UI reutilizable
lib/scenes.ts  Registro de escenas
public/scenes/ Exportaciones HTML de SuperSplat
```

## Créditos

- **Autor:** Santiago Viana
- **Institución:** Pontificia Universidad Católica de Chile
- **Programa:** Diseño — Proyecto de Título
