import CompoundCollection from './CompoundCollection';
import type { collectionObj, optionsObj, orderingFn } from './types';
import Match from './utils/Match';
import { clone } from './utils/change';
import compare from './utils/compare';

type obj = { [key: string]: any };
export default class ObjectCollection extends CompoundCollection
  implements collectionObj<obj, any, any> {
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

  deleteKey(key) {
    const store = {...this.store};
    delete store[key];
    this.update(store, 'deleteKey', key);
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

  cloneShallow(newOptions?: optionsObj) {
    return new ObjectCollection({...this.store}, this.mergeOptions(newOptions));
  }

  cloneEmpty(newOptions?: optionsObj) {
    return new ObjectCollection(
      {},
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

  // append/prepend

  // assume that adding a value by key adds to the end of the item
  addAfter(item: any, key?: string) {
    if (key === undefined) {
      throw new Error('you must define a key to addAfter an item for a compound collection');
    }
    this.set(String(key), item);
    return this
  }

  addBefore(item: any, key?: string) {
    if (key === undefined) {
      throw new Error('you must define a key to addAfter an item for a compound collection');
    }
    const temp = this.cloneEmpty({quiet: true});

    temp.set(String(key), item);
    this.forEach((fItem, fKey) => {
      if (!this.compKeys(key, fKey)) {
        temp.set(fKey, fItem);
      }
    });
    this.update(temp.store, 'addBefore');
    return this;
  }
}
