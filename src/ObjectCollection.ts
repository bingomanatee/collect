import CompoundCollection from './CompoundCollection';
import { collectionObj } from './types';
import { Match } from './utils/Match';

type obj = { [key: string]: any };
export default class ObjectCollection extends CompoundCollection
  implements collectionObj<obj, string, any> {
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

  keyOf(item) {
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

  clone() {
    return new ObjectCollection(
      { ...this.store },
      { compKeys: this.compKeys, compItems: this.compItems }
    );
  }

  clear() {
    this._store = {};
    return this;
  }

  // this is a little dicey but...
  sort(sortFn) {
    const keyArray = Array.from(this.keys).sort(sortFn);
    const newStore = {};
    for (const key in keyArray) {
      newStore[key] = this.get(key);
    }
    this._store = newStore;
    return this;
  }
}
