export const PHOTO_FILTER_ORDER = [
  "ORIGINAL",
  "NEON_NOIR",
  "SOLAR_FILM",
  "CYANOTYPE",
  "MONOCHROME",
] as const;

export type PhotoFilterId = (typeof PHOTO_FILTER_ORDER)[number];

export interface PhotoFilterProfile {
  id: PhotoFilterId;
  label: string;
  description: string;
}

export const DEFAULT_PHOTO_FILTER_ID: PhotoFilterId = "ORIGINAL";

const PHOTO_FILTER_PROFILE_MAP: Record<PhotoFilterId, PhotoFilterProfile> = {
  ORIGINAL: {
    id: "ORIGINAL",
    label: "ORIGINAL",
    description: "Unmodified battlefield presentation.",
  },
  NEON_NOIR: {
    id: "NEON_NOIR",
    label: "NEON NOIR",
    description: "Deep blacks with restrained cyan-violet energy.",
  },
  SOLAR_FILM: {
    id: "SOLAR_FILM",
    label: "SOLAR FILM",
    description: "Warm amber cinematic response.",
  },
  CYANOTYPE: {
    id: "CYANOTYPE",
    label: "CYANOTYPE",
    description: "Cool blue-cyan photographic treatment.",
  },
  MONOCHROME: {
    id: "MONOCHROME",
    label: "MONOCHROME",
    description: "High-contrast grayscale capture treatment.",
  },
};

export const PHOTO_FILTER_PROFILES: readonly PhotoFilterProfile[] =
  PHOTO_FILTER_ORDER.map((id) => PHOTO_FILTER_PROFILE_MAP[id]);

export function getPhotoFilterProfile(
  id: PhotoFilterId,
): PhotoFilterProfile {
  return PHOTO_FILTER_PROFILE_MAP[id];
}

export function cyclePhotoFilter(
  current: PhotoFilterId,
  direction: -1 | 1,
): PhotoFilterId {
  const currentIndex = PHOTO_FILTER_ORDER.indexOf(current);
  const nextIndex =
    (currentIndex + direction + PHOTO_FILTER_ORDER.length) %
    PHOTO_FILTER_ORDER.length;
  return PHOTO_FILTER_ORDER[nextIndex];
}
