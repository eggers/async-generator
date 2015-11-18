export type PagingFunction<T> = (pageNumber: number) => Promise<T[]>;

export function* asyncPager<T>(getPage: PagingFunction<T>): IterableIterator<Promise<T>> {

  let hasNextPage: boolean = true;
  let pageNumber: number = 0;
  let nextPage: Promise<T[]> = getPage(0);

  while (hasNextPage) {
    const page: Promise<T[]> = nextPage;

    nextPage = getPage(++pageNumber)
      .then(function(items: T[]): T[] {
        if (items === null || items === undefined) {
          hasNextPage = false;
        }

        return items;
      });

    yield* asyncIterator(page);

  }
}

export function* asyncIterator<T>(collection: Promise<T[]>): IterableIterator<Promise<T>> {
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
