import CompoundCollection from './CompoundCollection';
import { collectionObj, comparatorObj } from './types';
import { Stopper } from './utils/Stopper';
import { Match } from './utils/Match';
import { Iter } from './Iter';
import { orderingFn, reduceAction } from './types.methods';

export default class MapCollection extends CompoundCollection
  implements collectionObj<Map<any, any>, any, any> {
  protected _store: Map<any, any>;

  constructor(store: Map<any, any>, comps?: comparatorObj) {
    super();
    this._store = store;
    if (comps?.compKeys) {
      this._compKeys = comps?.compKeys;
    }
    if (comps?.compItems) {
      this._compItems = comps?.compItems;
    }
  }

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
    const iterator = this.store[Symbol.iterator]();
    for (const [key, item] of iterator) {
      const next = looper(out, item, key, this.store, iter);
      if (iter.isStopped) {
        return out;
      }
      if (!iter.isActive) {
        return next;
      }
      out = next;
    }
  }
  // iterators

  keyIter(fromIter?: boolean): IterableIterator<any> | undefined {
    if (fromIter) {
      return this._store.keys();
    }
    return Iter.keyIter(this);
  }

  itemIter(fromIter?: boolean): IterableIterator<any> | undefined {
    if (fromIter) {
      return this._store.values();
    }
    return Iter.itemIter(this);
  }

  storeIter(fromIter?: boolean): IterableIterator<any> | undefined {
    if (fromIter) {
      return this._store[Symbol.iterator]();
    }
    return this.store;
  }
}
