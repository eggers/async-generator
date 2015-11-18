/// <reference path="../typings/main.d.ts"/>
import {asyncPager, asyncIterator} from './index';
import {expect} from 'chai';

async function getTwoPagesFourItemsTotal(pageNumber: number): Promise<number[]> {
  if (pageNumber > 1) {
    return null;

  } else if (pageNumber > 0) {
    return new Promise<number[]>((r: any) => setTimeout(r, 10, [4]));

  }
  return new Promise<number[]>((r: any) => setTimeout(r, 10, [1, 2, 3]));
}

async function getTwoPagesFirstPageEmptyTwoItemsTotal(pageNumber: number): Promise<number[]> {
  if (pageNumber > 1) {
    return null;

  } else if (pageNumber > 0) {
    return new Promise<number[]>((r: any) => setTimeout(r, 10, [1, 2]));

  }
  return new Promise<number[]>((r: any) => setTimeout(r, 10, []));
}

async function getNullPromise(): Promise<number[]> {
  return null;
}

describe('async-generator', () => {

  describe('asyncIterator', () => {
    it('should transform Promise<T[]> to Promise<T>[]', async() => {
      const items: Promise<number[]> = getTwoPagesFourItemsTotal(0);
      let item: number = 0;

      for (const promise of asyncIterator(items)) {
        const value: number = await promise;
        expect(++item).to.equal(value);
      }

      expect(item).to.equal(3);

    });

    it('should handle null promises', async() => {
      const items: Promise<number[]> = getNullPromise();
      for (const promise of asyncIterator(items)) {
        expect(await promise).to.equal(undefined);
      }

    });
  });

  describe('asyncPager', () => {

    it('should return two pages', async() => {
      let items: number[] = [];
      let item: number = 0;

      for (const promise of asyncPager(getTwoPagesFourItemsTotal)) {
        const value: number = await promise;
        expect(++item).to.equal(value);
        items.push(value);
      }

      expect(items).to.have.length(4);

    });

    it('should return handle empty pages', async() => {
      let items: number = 0;

      for (let promise of asyncPager(getTwoPagesFirstPageEmptyTwoItemsTotal)) {
        const value: number = await promise;

        if (value !== undefined) {
          expect(++items).to.equal(value);
        }
      }


      expect(items).to.equal(2);

    });
  });
});
