const ORBI_CACHE_PREFIX = "orbi-energy-swarm-";
const buildId =
  new URL(self.location.href).searchParams.get("build") || "unknown";
const cacheName = `${ORBI_CACHE_PREFIX}${buildId}`;
const scopedUrl = (path = "./") => new URL(path, self.registration.scope).href;
const rootUrl = scopedUrl("./");
const precacheUrls = [
  rootUrl,
  scopedUrl("manifest.webmanifest"),
  scopedUrl("icons/orbi-192.png"),
  scopedUrl("icons/orbi-512.png"),
];

const cacheSuccessfulResponse = async (request, response) => {
  if (response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        await cache.addAll(precacheUrls);
      } catch (error) {
        console.warn("ORBI PWA precache skipped; network remains authoritative.", error);
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter(
            (key) => key.startsWith(ORBI_CACHE_PREFIX) && key !== cacheName,
          )
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const {request} = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          return await cacheSuccessfulResponse(request, response);
        } catch {
          return (
            (await caches.match(request)) ||
            (await caches.match(rootUrl)) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  const isCacheableAsset =
    url.pathname.includes("/assets/") ||
    url.pathname.includes("/icons/") ||
    url.pathname.endsWith("/manifest.webmanifest");
  if (!isCacheableAsset) return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        return await cacheSuccessfulResponse(request, response);
      } catch {
        return Response.error();
      }
    })(),
  );
});
