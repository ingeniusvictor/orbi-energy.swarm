declare const __ORBI_BUILD_SHA__: string;
declare const __ORBI_PRODUCT_VERSION__: string;

export const LOCAL_BUILD_SHA = "local-development";
export const LOCAL_PRODUCT_VERSION = "0.0.0-local";

export interface OrbiBuildProvenance {
  buildSha: string;
  productVersion: string;
}

const readEmbeddedBuildSha = () =>
  typeof __ORBI_BUILD_SHA__ === "string" && __ORBI_BUILD_SHA__.trim()
    ? __ORBI_BUILD_SHA__.trim()
    : LOCAL_BUILD_SHA;

const readEmbeddedProductVersion = () =>
  typeof __ORBI_PRODUCT_VERSION__ === "string" &&
  __ORBI_PRODUCT_VERSION__.trim()
    ? __ORBI_PRODUCT_VERSION__.trim()
    : LOCAL_PRODUCT_VERSION;

export const getEmbeddedBuildProvenance = (): OrbiBuildProvenance => ({
  buildSha: readEmbeddedBuildSha(),
  productVersion: readEmbeddedProductVersion(),
});

export const isCanonicalBuildSha = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{40}$/i.test(value);

export const isReleaseProductVersion = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value !== LOCAL_PRODUCT_VERSION;
