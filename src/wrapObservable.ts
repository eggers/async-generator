/// <reference path="../typings/main/ambient/rx-lite/rx-lite.d.ts"/>

type ResolvePromise<T> = (value: T) => void;
type RejectPromise<T> = (value: any) => void;
type PromiseArguments<T> = [ResolvePromise<T>, RejectPromise<T>];


export default function* wrapObservable<T>(observable: Rx.Observable<T>): IterableIterator<Promise<T>> {
  let subscription: Rx.IDisposable;

  try {

    let done: boolean = false;

    const sentPromises: PromiseArguments<T>[] = [];
    const completedPromises: Promise<T>[] = [];

    subscription = observable.subscribe(
      (item: T) => {
        if (sentPromises.length > 0) {
          let [resolve, ] = sentPromises.shift();

          resolve(item);
        } else {
          completedPromises.push(Promise.resolve<T>(item));
        }

      },
      (error: any) => {
        if (sentPromises.length > 0) {
          let [, reject] = sentPromises.shift();

          reject(error);
        } else {
          completedPromises.push(Promise.reject<T>(error));
        }
      },
      () => {
        done = true;
      });

    while (!done || completedPromises.length > 0) {
      if (completedPromises.length > 0) {
        yield completedPromises.shift();
      } else {
        yield new Promise((r: ResolvePromise<T>, e: RejectPromise<T>) => sentPromises.push([r, e]));
      }
    }
  } finally {
    subscription.dispose();
  }

}
