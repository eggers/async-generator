import asyncIterator from './asyncIterator';

export type PagingFunction<T> = (pageNumber: number) => Promise<T[]>;

export default function* asyncPager<T>(getPage: PagingFunction<T>): IterableIterator<Promise<T>> {

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

