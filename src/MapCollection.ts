import CompoundCollection from './CompoundCollection';
import { collectionObj, orderingFn, reduceAction } from './types';
import { Stopper } from './utils/Stopper';
import { Match } from './utils/Match';

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
      if (Match.sameItem(mItem, item, this)) {
        iter.final();
        return mKey;
      }
      return foundKey;
    }, key);
  }

  sort(sorter?: orderingFn): collectionObj<Map<any, any>, any, any> {
    const map = new Map();
    const sortedKeys = Array.from(this.keys).sort(sorter);
    for (let i = 0; i < sortedKeys.length; i++) {
      const key = sortedKeys[i];
      map.set(key, this.store.get(key));
    }
    this._store = map;
    return this;
  }

  hasItem(item) {
    return this.reduce((matches, mItem, _key, _store, iter) => {
      if (Match.sameItem(mItem, item, this)) {
        iter.final();
        return true;
      }
      return matches;
    }, false);
  }

  deleteKey(key) {
    const map = new Map(this.store);
    for (const storeKey of this.keys) {
      if (Match.sameKey(storeKey, key, this)) {
        map.delete(storeKey);
      }
    }
    this._store = map;
    return this;
  }

  reduce(looper: reduceAction, initial?: any) {
    const iter = new Stopper();

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
