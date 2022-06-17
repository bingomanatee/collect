import CompoundCollection from './CompoundCollection';
import type { collectionObj, optionsObj, orderingFn } from './types';
import Match from './utils/Match';
import { clone } from './utils/change';
import compare from './utils/compare';

export default class MapCollection extends CompoundCollection
  implements collectionObj<Map<any, any>, any, any> {
  protected _store: Map<any, any>;

  constructor(store: Map<any, any>, options?: optionsObj) {
    super(store, options);
    this.update(store, 'constructor', options);
    this._store = store;
  }

  get(key) {
    if (this._store.has(key)) {
      return this._store.get(key);
    }
    return super.get(key);
  }

  get keys() {
    return Array.from(this.store.keys());
  }

  get items() {
    return Array.from(this.store.values());
  }

  clone(newOptions?: optionsObj) {
    return new MapCollection(clone(this._store), this.mergeOptions(newOptions));
  }

  cloneShallow(newOptions?: optionsObj) {
    return new MapCollection(new Map(this.store), this.mergeOptions(newOptions));
  }

  cloneEmpty() {
    return new MapCollection((new Map()));
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

  sort(sorter: orderingFn = compare): collectionObj<Map<any, any>, any, any> {
    const map = new Map();
    const sortedKeys = Array.from(this.keys).sort(this.sorter(sorter));
    for (let i = 0; i < sortedKeys.length; i += 1) {
      const key = sortedKeys[i];
      map.set(key, this.store.get(key));
    }
    this.update(map, 'sort', sorter);
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
    this.forEach((_item, storeKey, _store, stopper) => {
      if (Match.sameKey(storeKey, key, this, Array.isArray(key))) {
        map.delete(storeKey);
        stopper.stop();
      }
    });
    this.update(map, 'delete', key);
    return this;
  }

  // iterators

  keyIter(): IterableIterator<any> {
    return this._store.keys();
  }

  itemIter(): IterableIterator<any> {
    return this._store.values();
  }

  storeIter(): IterableIterator<any> {
    return this._store.entries();
  }
}
