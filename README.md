# Async Generator [![Build Status](https://travis-ci.org/eggers/async-generator.svg)](https://travis-ci.org/eggers/async-generator)

Motivated by the Async Generator ES7 proposal https://github.com/jhusain/asyncgenerator

A couple helper functions to bring async support to ES6 generators today:

* `asyncIterator`: Converts `Promise<T[]>` to `Promise<T>[]`.
* `asyncPager`: Creates a generator function will iterate through a paging function.
* `wrapObservable`: Creates a generator function by wrapping an observable.

```
npm install async-generator
```


## Examples

You'll need to include a polyfill for the regeneratorRuntime such as [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

#### `asyncIterator`: Converts `Promise<T[]>` to `Promise<T>[]`.
```typescript
import {asyncIterator} from 'async-generator';

const items: Promise<T[]> = ...;

for (let promise of asyncIterator(items)) {
  const value: number = await promise;

  // value will be undefined if the array returned is empty or undefined.
  if (value !== undefined) {
    doSomething(value);
  }
}
```

#### `asyncPager`: Repeatedly calls a paging function.

```typescript
import {asyncPager} from 'async-generator';

// data consumer
async function getPage(pageNumber: number) {
  // ...e.g. web request
  return null; // return null/undefined when there are no more pages.
}

for (let promise of asyncPager(getPage)) {
  const value: number = await promise;

  // value will be undefined if any page is empty.
  if (value !== undefined) {
    doSomething(value);
  }
}
```

#### `wrapObservable`: Wraps an Observable with an iterator

```typescript
import {wrapObservable} from 'async-generator';

// data consumer
const observable = ...;

for (let promise of wrapObservable(observable)) {
  const value: number = await promise;

  // value will be undefined if any page is empty.
  if (value !== undefined) {
    doSomething(value);
  }
}
```
