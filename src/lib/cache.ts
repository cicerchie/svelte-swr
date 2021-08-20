export const cache = new Map<string, any>();

export function getValuesFromCacheByKeysStartingWith<T>(
  searchKey: string
): T[] {
  const values = [];

  cache.forEach((v, k) => {
    if (k.startsWith(searchKey)) {
      values.push(v);
    }
  });

  return values;
}
