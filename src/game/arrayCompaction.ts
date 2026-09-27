export const compactArrayInPlace = <T>(
  items: T[],
  keep: (item: T, index: number) => boolean,
): T[] => {
  let writeIndex = 0;

  for (
    let readIndex = 0;
    readIndex < items.length;
    readIndex += 1
  ) {
    const item = items[readIndex];
    if (!keep(item, readIndex)) {
      continue;
    }

    if (writeIndex !== readIndex) {
      items[writeIndex] = item;
    }
    writeIndex += 1;
  }

  items.length = writeIndex;
  return items;
};
