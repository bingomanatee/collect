import CompoundCollection from './CompoundCollection';
import type { collectionObj, optionsObj, orderingFn } from './types';
import Match from './utils/Match';
import { clone } from './utils/change';
import compare from './utils/compare';

type obj = { [key: string]: any };
export default class ObjectCollection extends CompoundCollection
  implements collectionObj<obj, string, any> {
  protected _store: object;

  constructor(store: object, options?: optionsObj) {
    super(store, options);
    this.update(store, 'constructor', options);
    this._store = store;
  }

  get size() {
    return Array.from(this.keys).length;
  }

  get keys() {
    return Array.from(Object.keys(this.store));
  }

  get items() {
    return Array.from(Object.values(this.store));
  }

  get(key) {
    return this.store[key];
  }

  set(key: string, item) {
    this._store[key] = item;
    return this;
  }

  keyOf(item): string | undefined {
    const keys = this.keys;
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const oItem = this.get(key);
      if (Match.sameItem(oItem, item, this)) {
        return key;
      }
    }
    return undefined;
  }

  hasItem(item) {
    return this.items.some((oItem) => Match.sameItem(oItem, item, this));
  }

  hasKey(key) {
    return this.keys.some((oKey) => Match.sameKey(oKey, key, this));
  }

  clear() {
    this.update({}, 'clear');
    return this;
  }

  // this is a little dicey but...
  sort(sortFn: orderingFn = compare) {
    const keyArray = Array.from(this.keys).sort(this.sorter(sortFn));
    const newStore = {};
    keyArray.forEach((key) => {
      newStore[key] = this.get(key);
    });

    this.update(newStore, 'sort', sortFn);
    return this;
  }

  clone(newOptions?: optionsObj) {
    return new ObjectCollection(
      clone(this._store),
      this.mergeOptions(newOptions),
    );
  }
  // iterators

  keyIter(): IterableIterator<any> {
    return Object.keys(this.store)[Symbol.iterator]();
  }

  itemIter(): IterableIterator<any> {
    return Object.values(this.store)[Symbol.iterator]();
  }

  storeIter(): IterableIterator<any> {
    return Object.entries(this.store)[Symbol.iterator]();
  }
}
