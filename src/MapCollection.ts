import CompoundCollection from './CompoundCollection';
import { collectionObj, Iter, orderingFn, reduceAction } from './types';

export default class MapCollection extends CompoundCollection
  implements collectionObj<Map<any, any>, any, any> {
  get keys() {
    return Array.from(this.store.keys());
  }

  get items() {
    return Array.from(this.store.values());
  }

  keyOf(item: any): any {
    const key = undefined;

    return this.reduce((foundKey, mItem, mKey, _store, iter) => {
      if (mItem === item) {
        iter.final();
        return mKey;
      }
      return foundKey;
    }, key);
  }

  sort(sorter?: orderingFn): collectionObj<Map<any, any>, any, any> {
    const map = new Map();
    const sortedKeys = this.keys.sort(sorter);
    sortedKeys.forEach(key => map.set(key, this.store.get(key)));
    this.store = map;
    return this;
  }

  hasItem(item) {
    return this.reduce((matches, mItem, _key, _store, iter) => {
      if (mItem === item) {
        iter.final();
        return true;
      }
      return matches;
    }, false);
  }

  reduce(looper: reduceAction, initial?: any) {
    const iter = new Iter();

    let out = initial;

    const store = this.store;

    const iterator = store[Symbol.iterator]();
    for (const [key, item] of iterator) {
      const next = looper(out, item, key, store, iter);
      if (iter.isStopped) {
        return out;
      }
      if (!iter.isActive) {
        return next;
      }
      out = next;
    }
  }
}
