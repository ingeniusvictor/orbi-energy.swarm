const normalizeBaseUrl = (baseUrl: string): string =>
  baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

export const buildServiceWorkerUrl = (
  baseUrl: string,
  buildSha: string,
): string => {
  const buildId = buildSha.trim() || "unknown";
  return `${normalizeBaseUrl(baseUrl)}sw.js?build=${encodeURIComponent(buildId)}`;
};

export const registerOrbiServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const scope = normalizeBaseUrl(import.meta.env.BASE_URL || "/");

  try {
    return await navigator.serviceWorker.register(
      buildServiceWorkerUrl(scope, __ORBI_BUILD_SHA__),
      {
        scope,
        updateViaCache: "none",
      },
    );
  } catch (error) {
    console.warn(
      "ORBI PWA registration failed; continuing with normal network runtime.",
      error,
    );
    return null;
  }
};
