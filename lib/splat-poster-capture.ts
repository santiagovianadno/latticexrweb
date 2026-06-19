const posterCache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

function buildStillPreviewUrl(htmlPath: string, slug: string) {
  const joiner = htmlPath.includes("?") ? "&" : "?";
  return `${htmlPath}${joiner}noui&noanim&preview=1&still=1&sceneSlug=${encodeURIComponent(slug)}`;
}

export function getCachedPoster(slug: string): string | undefined {
  return posterCache.get(slug);
}

export function captureSplatPoster(
  slug: string,
  htmlPath: string,
): Promise<string | null> {
  const cached = posterCache.get(slug);
  if (cached) return Promise.resolve(cached);

  const pending = inflight.get(slug);
  if (pending) return pending;

  const promise = new Promise<string | null>((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.src = buildStillPreviewUrl(htmlPath, slug);
    iframe.title = `Poster capture: ${slug}`;
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.cssText =
      "position:fixed;left:-9999px;top:0;width:640px;height:480px;opacity:0;pointer-events:none;border:0";

    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMessage);
      iframe.remove();
      inflight.delete(slug);
      if (value) {
        posterCache.set(slug, value);
        window.postMessage(
          { type: "latticexr-poster-captured", slug, dataUrl: value },
          "*",
        );
      }
      resolve(value);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "latticexr-poster-captured") return;
      if (event.data.slug && event.data.slug !== slug) return;
      if (!event.data.dataUrl) return;
      finish(event.data.dataUrl);
    };

    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);

    window.setTimeout(() => finish(null), 45000);
  });

  inflight.set(slug, promise);
  return promise;
}

export function queueSplatPosterCapture(slug: string, htmlPath: string) {
  if (posterCache.has(slug) || inflight.has(slug)) return;

  const run = () => {
    void captureSplatPoster(slug, htmlPath);
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 4000 });
  } else {
    setTimeout(run, 1500);
  }
}

export function storePoster(slug: string, dataUrl: string) {
  posterCache.set(slug, dataUrl);
}
