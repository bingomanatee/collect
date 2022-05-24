import { collectionBaseIterProvider, FormEnum } from './types';

export abstract class Iter {
  static storeIter(
    coll: collectionBaseIterProvider<any, any, any>
  ): IterableIterator<any> {
    const iter: IterableIterator<any> | undefined = coll.storeIter(true);
    if (!iter) {
      console.error('must implement iter for ', coll);
      throw new Error('must implement iter');
    }
    return iter;
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
    const iter: IterableIterator<any> | undefined = coll.keyIter(true);
    return iter || Array.from(coll.keys)[Symbol.iterator]();
  }
}
