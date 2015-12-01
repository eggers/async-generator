/// <reference path="../typings/main.d.ts"/>

import wrapObservable from '../lib/wrapObservable';
import {expect} from 'chai';
import * as Rx from 'rx-lite';

function* iterableThrowError(throwError: boolean): IterableIterator<string> {
  if (throwError) {
    throw 'Error';
  }
  yield 'abc';
}

function* iterableYieldTrueThenFalse(): IterableIterator<boolean> {
  yield true;
  yield true;
  yield false;
}

describe('wrapObservable', () => {
  it('should iterate through observable', async() => {
    const observable: Rx.Observable<number> = Rx.Observable.range(1, 3);
    let count: number = 0;

    for (const promise of wrapObservable<number>(observable)) {
      const item = await promise;
      expect(++count).to.equal(item);
    }

    expect(count).to.equal(3);

  });

  it('should dispose of subscription when breaking the loop', async() => {
    const element: any = {
      listener: Function,
      addEventListenerCalled: false,
      removeEventListenerCalled: false,
      addEventListener(name: string, listener: Function): void {
        this.listener = listener;
        this.addEventListenerCalled = true;
      },
      removeEventListener(): void {
        this.removeEventListenerCalled = true;
      },
      trigger(...args: any[]): void {
        this.listener.apply(null, args);
      }
    };


    const observable: Rx.Observable<any> = Rx.Observable.fromEvent(element, 'test');
    const subscription = wrapObservable<any>(observable);


    for (const promise of subscription) {
      element.trigger('test');
      expect(element.addEventListenerCalled).to.equal(true);
      expect(element.removeEventListenerCalled).to.equal(false);
      const value: boolean = await promise;
      break;
    }


    expect(element.removeEventListenerCalled).to.equal(true);

  });

  it('should be marked as done when breaking the loop', async() => {
    const observable: Rx.Observable<any> = Rx.Observable.from(iterableYieldTrueThenFalse());
    const subscription = wrapObservable<boolean>(observable);

    for (const promise of subscription) {
      const value: boolean = await promise;
      expect(value).to.equal(true);
      break;
    }

    const next = subscription.next();
    expect(next.value).to.equal(undefined);
    expect(next.done).to.equal(true);

  });

  it('should not loop again after breaking', async() => {
    const observable: Rx.Observable<number> = (<any>Rx.Observable).timer(1, 100);
    const subscription = wrapObservable<number>(observable);

    for (const promise of subscription) {
      const time = await promise;
      expect(time).to.equal(0);
      break;
    }

    for (const promise of subscription) {
      const time = await promise;
      expect('continuing iteration').to.equal(false);
      break;
    }
  });

  it('should throw an error when observable throws an error', async() => {
    const observable: Rx.Observable<any> = Rx.Observable.from(iterableThrowError(true));

    for (const promise of wrapObservable(observable)) {
      let value: any = null;
      try {
        value = await promise;
      } catch (error) {
        expect(error).to.equal('Error');
        return;
      }

      expect('Error thrown').to.equal(true);

      break;
    }
  });
});
