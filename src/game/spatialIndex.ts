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
  entriesByOrder: Map<number, SpatialIndexEntry<T>>;
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

export interface CollisionSpatialResult<T> {
  item: T | null;
  entry: SpatialIndexEntry<T> | null;
  distanceSquared: number;
  candidateChecks: number;
}

export interface MultiCollisionSpatialResult<T> {
  entries: SpatialIndexEntry<T>[];
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
  entriesByOrder: new Map(),
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

  index.entriesByOrder.set(order, entry);
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
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(maxRange) ||
    maxRange <= 0 ||
    index.size === 0
  ) {
    return {
      item: null,
      distanceSquared: Number.POSITIVE_INFINITY,
      candidateChecks: 0,
    };
  }

  const minCellX = Math.floor(
    (x - maxRange) / index.cellSize,
  );
  const maxCellX = Math.floor(
    (x + maxRange) / index.cellSize,
  );
  const minCellY = Math.floor(
    (y - maxRange) / index.cellSize,
  );
  const maxCellY = Math.floor(
    (y + maxRange) / index.cellSize,
  );
  const maxRangeSquared = maxRange * maxRange;
  let bestEntry: SpatialIndexEntry<T> | null = null;
  let bestDistanceSquared =
    Number.POSITIVE_INFINITY;
  let candidateChecks = 0;

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
      if (!bucket) continue;

      candidateChecks += bucket.length;
      for (const entry of bucket) {
        if (include && !include(entry.item)) continue;

        const dx = entry.x - x;
        const dy = entry.y - y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared >= maxRangeSquared) {
          continue;
        }

        if (
          distanceSquared < bestDistanceSquared ||
          (
            distanceSquared === bestDistanceSquared &&
            bestEntry !== null &&
            entry.order < bestEntry.order
          )
        ) {
          bestEntry = entry;
          bestDistanceSquared = distanceSquared;
        }
      }
    }
  }

  return {
    item: bestEntry?.item ?? null,
    distanceSquared: bestDistanceSquared,
    candidateChecks,
  };
};


export const relocateSpatialIndexEntry = <T>(
  index: SpatialIndex<T>,
  order: number,
  x: number,
  y: number,
  radius?: number,
) => {
  const entry = index.entriesByOrder.get(order);
  if (
    !entry ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    return false;
  }

  const oldCellX = Math.floor(entry.x / index.cellSize);
  const oldCellY = Math.floor(entry.y / index.cellSize);
  const newCellX = Math.floor(x / index.cellSize);
  const newCellY = Math.floor(y / index.cellSize);
  const oldKey = keyForCell(oldCellX, oldCellY);
  const newKey = keyForCell(newCellX, newCellY);

  if (oldKey !== newKey) {
    const oldBucket = index.buckets.get(oldKey);
    if (oldBucket) {
      const position = oldBucket.indexOf(entry);
      if (position >= 0) {
        oldBucket.splice(position, 1);
      }
      if (oldBucket.length === 0) {
        index.buckets.delete(oldKey);
      }
    }

    const newBucket = index.buckets.get(newKey);
    if (newBucket) {
      newBucket.push(entry);
    } else {
      index.buckets.set(newKey, [entry]);
    }
  }

  entry.x = x;
  entry.y = y;
  if (radius !== undefined && Number.isFinite(radius)) {
    entry.radius = Math.max(0, radius);
    index.maxRadius = Math.max(
      index.maxRadius,
      entry.radius,
    );
  }

  return true;
};

export const findAllCollidingSpatialItems = <T>(
  index: SpatialIndex<T>,
  x: number,
  y: number,
  subjectRadius: number,
  include?: (item: T) => boolean,
): MultiCollisionSpatialResult<T> => {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(subjectRadius) ||
    subjectRadius < 0 ||
    index.size === 0
  ) {
    return {
      entries: [],
      candidateChecks: 0,
    };
  }

  const queryRadius =
    subjectRadius + index.maxRadius;
  const minCellX = Math.floor(
    (x - queryRadius) / index.cellSize,
  );
  const maxCellX = Math.floor(
    (x + queryRadius) / index.cellSize,
  );
  const minCellY = Math.floor(
    (y - queryRadius) / index.cellSize,
  );
  const maxCellY = Math.floor(
    (y + queryRadius) / index.cellSize,
  );
  const entries: SpatialIndexEntry<T>[] = [];
  let candidateChecks = 0;

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
      if (!bucket) continue;

      candidateChecks += bucket.length;
      for (const entry of bucket) {
        if (include && !include(entry.item)) continue;

        const dx = x - entry.x;
        const dy = y - entry.y;
        const collisionRadius =
          subjectRadius + entry.radius;

        if (
          dx * dx + dy * dy <
          collisionRadius * collisionRadius
        ) {
          entries.push(entry);
        }
      }
    }
  }

  if (entries.length > 1) {
    entries.sort(
      (left, right) =>
        left.order - right.order,
    );
  }

  return {
    entries,
    candidateChecks,
  };
};

export const findFirstCollidingSpatialItem = <T>(
  index: SpatialIndex<T>,
  x: number,
  y: number,
  subjectRadius: number,
  include?: (item: T) => boolean,
): CollisionSpatialResult<T> => {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(subjectRadius) ||
    subjectRadius < 0 ||
    index.size === 0
  ) {
    return {
      item: null,
      entry: null,
      distanceSquared: Number.POSITIVE_INFINITY,
      candidateChecks: 0,
    };
  }

  const queryRadius =
    subjectRadius + index.maxRadius;
  const minCellX = Math.floor(
    (x - queryRadius) / index.cellSize,
  );
  const maxCellX = Math.floor(
    (x + queryRadius) / index.cellSize,
  );
  const minCellY = Math.floor(
    (y - queryRadius) / index.cellSize,
  );
  const maxCellY = Math.floor(
    (y + queryRadius) / index.cellSize,
  );
  let firstEntry: SpatialIndexEntry<T> | null = null;
  let firstDistanceSquared =
    Number.POSITIVE_INFINITY;
  let candidateChecks = 0;

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
      if (!bucket) continue;

      candidateChecks += bucket.length;
      for (const entry of bucket) {
        if (include && !include(entry.item)) continue;

        const dx = x - entry.x;
        const dy = y - entry.y;
        const distanceSquared = dx * dx + dy * dy;
        const collisionRadius =
          subjectRadius + entry.radius;

        if (
          distanceSquared >=
          collisionRadius * collisionRadius
        ) {
          continue;
        }

        if (
          firstEntry === null ||
          entry.order < firstEntry.order
        ) {
          firstEntry = entry;
          firstDistanceSquared = distanceSquared;
        }
      }
    }
  }

  return {
    item: firstEntry?.item ?? null,
    entry: firstEntry,
    distanceSquared: firstDistanceSquared,
    candidateChecks,
  };
};
