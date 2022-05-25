import CompoundCollection from './CompoundCollection';
import { collectionObj, optionsObj } from './types';
import { Match } from './utils/Match';
import { clone } from './utils/change';
import { orderingFn } from './types.methods';

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
    for (const oKey of Object.keys(this.store)) {
      const oItem = this.get(oKey);
      if (Match.sameItem(oItem, item, this)) {
        return oKey;
      }
    }
    return undefined;
  }

  hasItem(item) {
    for (const oItem of Object.values(this.store)) {
      if (Match.sameItem(oItem, item, this)) {
        return true;
      }
    }
    return false;
  }

  hasKey(key) {
    for (const oKey of Object.keys(this.store)) {
      if (Match.sameKey(oKey, key, this)) {
        return true;
      }
    }
    return false;
  }

  clear() {
    this.update({}, 'clear');
    return this;
  }

  // this is a little dicey but...
  sort(sortFn?: orderingFn) {
    const keyArray = Array.from(this.keys).sort(this.sorter(sortFn));
    const newStore = {};
    for (const key of keyArray) {
      newStore[key] = this.get(key);
    }
    this.update(newStore, 'sort', sortFn);
    return this;
  }

  clone(newOptions?: optionsObj) {
    return new ObjectCollection(
      clone(this._store),
      this.mergeOptions(newOptions)
    );
  }
  // iterators

  keyIter(): IterableIterator<any> | undefined {
    return Object.keys(this.store)[Symbol.iterator]();
  }

  itemIter(): IterableIterator<any> | undefined {
    return Object.values(this.store)[Symbol.iterator]();
  }

  storeIter(): IterableIterator<any> | undefined {
    return Object.entries(this.store)[Symbol.iterator]();
  }
}
