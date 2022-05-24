import { collectionBaseIterProvider, FormEnum } from './types';

export abstract class Iter {
  static storeIter(coll: collectionBaseIterProvider<any, any, any>) {
    const iter = coll.store[Symbol.iterator];
    if (iter) {
      return iter;
    }
    const clone = coll.clone();
    const keyIter = Iter.keyIter(clone);
    const valueIter = Iter.itemIter(clone);

    let lastKey: IteratorResult<any> | undefined = undefined;
    let lastValue: IteratorResult<any> | undefined = undefined;

    return {
      next() {
        if (lastKey && !lastKey.done) {
          lastKey = keyIter?.next();
        }
        if (lastValue && !lastValue.done) {
          lastValue = valueIter?.next();
        }
        if (!Iter.resultHasValue(lastKey) && !Iter.resultHasValue(lastValue)) {
          return { value: undefined, done: true };
        }
        return {
          value: [lastValue?.value, lastKey?.value],
          done: false,
        };
      },
    };
  }

  static itemIter(coll: collectionBaseIterProvider<any, any, any>) {
    let iter: IterableIterator<any> | undefined = coll.itemIter(true);
    if (!iter) {
      switch (coll.form) {
        case FormEnum.map:
          const map = coll.store as Map<any, any>;
          iter = map.values();
          break;
        case FormEnum.object:
          const obj = coll.store as object;
          iter = Object.values(obj)[Symbol.iterator]();
          break;
        case FormEnum.array:
          const storeArray = coll.store as any[];
          iter = storeArray[Symbol.iterator]();
          break;
        default:
          return Array.from(coll.items)[Symbol.iterator]();
      }
    }
    return iter;
  }

  static keyIter(coll: collectionBaseIterProvider<any, any, any>) {
    let iter: IterableIterator<any> | undefined = undefined;
    try {
      iter = coll.keyIter(true);
    } catch (err) {
      console.log('error on Iter.keyIter to target', coll, err);
    }
    return iter || Array.from(coll.keys)[Symbol.iterator]();
  }

  private static resultHasValue(result: IteratorResult<any> | undefined) {
    return result && !result.done;
  }
}
