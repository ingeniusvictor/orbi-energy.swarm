export interface SpatialIndexEntry<T> {
  item: T;
  order: number;
  x: number;
  y: number;
  radius: number;
}

export interface SpatialIndex<T> {
  cellSize: number;
  buckets: Map<string, SpatialIndexEntry<T>[]>;
  size: number;
  maxRadius: number;
}

export interface BuildSpatialIndexOptions<T> {
  cellSize: number;
  getX: (item: T) => number;
  getY: (item: T) => number;
  getRadius?: (item: T) => number;
  include?: (item: T) => boolean;
}

export interface SpatialQueryResult<T> {
  entries: SpatialIndexEntry<T>[];
  candidateChecks: number;
}

export interface NearestSpatialResult<T> {
  item: T | null;
  distanceSquared: number;
  candidateChecks: number;
}

export const ENEMY_SPATIAL_CELL_SIZE = 128;

const keyForCell = (cellX: number, cellY: number) =>
  `${cellX},${cellY}`;

const normalizeCellSize = (cellSize: number) =>
  Number.isFinite(cellSize) && cellSize > 0
    ? cellSize
    : ENEMY_SPATIAL_CELL_SIZE;

export const createSpatialIndex = <T>(
  cellSize: number,
): SpatialIndex<T> => ({
  cellSize: normalizeCellSize(cellSize),
  buckets: new Map(),
  size: 0,
  maxRadius: 0,
});

export const insertSpatialIndexEntry = <T>(
  index: SpatialIndex<T>,
  item: T,
  order: number,
  x: number,
  y: number,
  radius = 0,
) => {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(order)
  ) {
    return;
  }

  const safeRadius =
    Number.isFinite(radius) && radius > 0 ? radius : 0;
  const cellX = Math.floor(x / index.cellSize);
  const cellY = Math.floor(y / index.cellSize);
  const key = keyForCell(cellX, cellY);
  const bucket = index.buckets.get(key);
  const entry: SpatialIndexEntry<T> = {
    item,
    order,
    x,
    y,
    radius: safeRadius,
  };

  if (bucket) {
    bucket.push(entry);
  } else {
    index.buckets.set(key, [entry]);
  }

  index.size += 1;
  index.maxRadius = Math.max(
    index.maxRadius,
    safeRadius,
  );
};

export const buildSpatialIndex = <T>(
  items: readonly T[],
  options: BuildSpatialIndexOptions<T>,
): SpatialIndex<T> => {
  const index = createSpatialIndex<T>(options.cellSize);

  items.forEach((item, order) => {
    if (options.include && !options.include(item)) return;

    insertSpatialIndexEntry(
      index,
      item,
      order,
      options.getX(item),
      options.getY(item),
      options.getRadius?.(item) ?? 0,
    );
  });

  return index;
};

export const querySpatialIndex = <T>(
  index: SpatialIndex<T>,
  x: number,
  y: number,
  radius: number,
): SpatialQueryResult<T> => {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(radius) ||
    radius < 0 ||
    index.size === 0
  ) {
    return {
      entries: [],
      candidateChecks: 0,
    };
  }

  const minCellX = Math.floor(
    (x - radius) / index.cellSize,
  );
  const maxCellX = Math.floor(
    (x + radius) / index.cellSize,
  );
  const minCellY = Math.floor(
    (y - radius) / index.cellSize,
  );
  const maxCellY = Math.floor(
    (y + radius) / index.cellSize,
  );

  const entries: SpatialIndexEntry<T>[] = [];

  for (
    let cellY = minCellY;
    cellY <= maxCellY;
    cellY += 1
  ) {
    for (
      let cellX = minCellX;
      cellX <= maxCellX;
      cellX += 1
    ) {
      const bucket = index.buckets.get(
        keyForCell(cellX, cellY),
      );
      if (bucket) {
        entries.push(...bucket);
      }
    }
  }

  return {
    entries,
    candidateChecks: entries.length,
  };
};

export const findNearestSpatialItem = <T>(
  index: SpatialIndex<T>,
  x: number,
  y: number,
  maxRange: number,
  include?: (item: T) => boolean,
): NearestSpatialResult<T> => {
  if (
    !Number.isFinite(maxRange) ||
    maxRange <= 0
  ) {
    return {
      item: null,
      distanceSquared: Number.POSITIVE_INFINITY,
      candidateChecks: 0,
    };
  }

  const query = querySpatialIndex(
    index,
    x,
    y,
    maxRange,
  );
  const maxRangeSquared = maxRange * maxRange;
  let bestEntry: SpatialIndexEntry<T> | null = null;
  let bestDistanceSquared =
    Number.POSITIVE_INFINITY;

  for (const entry of query.entries) {
    if (include && !include(entry.item)) continue;

    const dx = entry.x - x;
    const dy = entry.y - y;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared >= maxRangeSquared) {
      continue;
    }

    if (
      distanceSquared < bestDistanceSquared ||
      (distanceSquared === bestDistanceSquared &&
        bestEntry !== null &&
        entry.order < bestEntry.order)
    ) {
      bestEntry = entry;
      bestDistanceSquared = distanceSquared;
    }
  }

  return {
    item: bestEntry?.item ?? null,
    distanceSquared: bestDistanceSquared,
    candidateChecks: query.candidateChecks,
  };
};
