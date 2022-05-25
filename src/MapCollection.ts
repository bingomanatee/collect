import CompoundCollection from './CompoundCollection';
import { collectionObj, optionsObj } from './types';
import { Match } from './utils/Match';
import { orderingFn } from './types.methods';
import { clone } from './utils/change';

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
    const compare = sorter ? (a, b) => sorter(a, b, this) : undefined;
    const sortedKeys = Array.from(this.keys).sort(compare);
    for (let i = 0; i < sortedKeys.length; i++) {
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
    for (const storeKey of this.keys) {
      if (Match.sameKey(storeKey, key, this)) {
        map.delete(storeKey);
      }
    }
    this.update(map, 'delete', key);
    return this;
  }

  // iterators

  keyIter(): IterableIterator<any> | undefined {
    return this._store.keys();
  }

  itemIter(): IterableIterator<any> | undefined {
    return this._store.values();
  }

  storeIter(): IterableIterator<any> | undefined {
    return this._store.entries();
  }
}
