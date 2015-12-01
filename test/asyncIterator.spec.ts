/// <reference path="../typings/main.d.ts"/>
import asyncIterator from '../lib/asyncIterator';
import {expect} from 'chai';


async function getThreeItems(): Promise<number[]> {
  return [1, 2, 3];
}

async function getNullPromise(): Promise<number[]> {
  return null;
}

describe('asyncIterator', () => {
  it('should transform Promise<T[]> to Promise<T>[]', async() => {
    const items: Promise<number[]> = getThreeItems();
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

