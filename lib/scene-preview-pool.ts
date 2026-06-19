const pool = new Map<string, HTMLIFrameElement>();
const readySlugs = new Set<string>();
const readyListeners = new Map<string, Set<() => void>>();

let messageListenerInstalled = false;

export function buildScenePreviewUrl(htmlPath: string, slug: string): string {
  const joiner = htmlPath.includes("?") ? "&" : "?";
  return `${htmlPath}${joiner}noui&noanim&preview=1&hold=1&rotateSpeed=8&sceneSlug=${encodeURIComponent(slug)}`;
}

function installMessageListener() {
  if (messageListenerInstalled || typeof window === "undefined") return;
  messageListenerInstalled = true;

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "latticexr-preview-ready") return;
    const slug = event.data.slug as string | undefined;
    if (!slug) return;

    readySlugs.add(slug);
    readyListeners.get(slug)?.forEach((listener) => listener());
  });
}

function applyHiddenPreviewStyle(iframe: HTMLIFrameElement) {
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:640px;height:480px;opacity:0;pointer-events:none;border:0;visibility:hidden";
}

export function ensurePreviewIframe(
  slug: string,
  htmlPath: string,
): HTMLIFrameElement {
  installMessageListener();

  let iframe = pool.get(slug);
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.src = buildScenePreviewUrl(htmlPath, slug);
    iframe.title = `Preview: ${slug}`;
    iframe.setAttribute("loading", "eager");
    iframe.setAttribute("fetchpriority", "high");
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    pool.set(slug, iframe);
  }

  return iframe;
}

export function warmScenePreviews(
  sceneList: readonly { slug: string; htmlPath: string }[],
) {
  if (typeof document === "undefined") return;

  for (const scene of sceneList) {
    const iframe = ensurePreviewIframe(scene.slug, scene.htmlPath);
    if (!iframe.isConnected) {
      applyHiddenPreviewStyle(iframe);
      document.body.appendChild(iframe);
    }
  }
}

export function attachPreviewToContainer(
  slug: string,
  htmlPath: string,
  container: HTMLElement,
  visible: boolean,
): HTMLIFrameElement {
  const iframe = ensurePreviewIframe(slug, htmlPath);
  iframe.className = `scene-card-preview-frame pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
    visible ? "opacity-100" : "opacity-0"
  }`;
  iframe.style.cssText = "";
  iframe.removeAttribute("aria-hidden");
  container.appendChild(iframe);
  return iframe;
}

export function isScenePreviewReady(slug: string): boolean {
  return readySlugs.has(slug);
}

export function onScenePreviewReady(slug: string, listener: () => void): () => void {
  installMessageListener();

  if (readySlugs.has(slug)) {
    listener();
    return () => {};
  }

  if (!readyListeners.has(slug)) {
    readyListeners.set(slug, new Set());
  }
  readyListeners.get(slug)!.add(listener);

  return () => {
    readyListeners.get(slug)?.delete(listener);
  };
}
