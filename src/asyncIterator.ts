
export default function* asyncIterator<T>(collection: Promise<T[]>): IterableIterator<Promise<T>> {
  let length: number = 1;
  collection = collection.then(function(items: T[]): T[] {
    if (items) {
      length = items.length;
    }

    return items;
  });

  for (let i: number = 0; i < length; i++) {
    yield collection.then((items: T[]): T => {
      if (!items) {
        return undefined;
      }
      return items[i];
    });

  }
}
