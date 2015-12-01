/// <reference path="../typings/main.d.ts"/>
import asyncPager from '../lib/asyncPager';
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
