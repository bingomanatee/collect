import { booleanMode, collectionObj, comparatorObj } from './types';
import { IntIndexedCollection } from './IntIndexedCollection';
import { Match } from './utils/Match';
import { filterAction, typesMethods, orderingFn } from './types.methods';

export default class StringCollection extends IntIndexedCollection
  implements collectionObj<string, number, string> {
  constructor(store: string, comps?: comparatorObj) {
    super();
    this._store = store;
    if (comps?.compKeys) {
      this._compKeys = comps?.compKeys;
    }
    if (comps?.compItems) {
      this._compItems = comps?.compItems;
    }
  }

  // region inspection
  get size() {
    return this.store.length;
  }

  hasItem(str) {
    if (str instanceof RegExp) {
      return str.test(this.store);
    }
    return this.store.includes(str);
  }

  hasKey(i: number) {
    if (i % 1) return false;
    return i >= 0 && i < this.size;
  }

  get items() {
    return this.store.split('');
  }

  keyOf(item: string) {
    const indexOf = this.store.indexOf(item);
    if (indexOf === -1) {
      return undefined;
    }
    return indexOf;
  }

  // endregion

  // region changes

  /**
   * acts like array.splice; inserts a string into/over part of the item;
   * @param key
   * @param item
   */
  set(key: number, item: string) {
    const prefix = this.store.substring(0, key) || '';
    const suffix = this.store.substring(key + 1) || '';
    this._store = prefix + item + suffix;
    return this;
  }

  get(key: number) {
    if (key < 0 || key > this.size) return undefined;
    return this.store.substring(key, key + 1);
  }

  deleteKey(key: number | Array<number>) {
    if (Array.isArray(key)) {
      return this.filter((_item, itemKey) => {
        const use = !Match.sameKey(itemKey, key, this);
        return use;
      });
    }
    return this.set(key, '');
  }

  deleteItem(
    item: Array<string> | string
  ): collectionObj<string, number, string> {
    if (Array.isArray(item)) {
      return this.filter(otherItem => !Match.sameItem(otherItem, item, this));
    }
    let newStore: string = this.store;
    let length = newStore.length;
    do {
      length = newStore.length;
      newStore = newStore.replace(item, '');
    } while (newStore && newStore.length < length);

    this._store = newStore;
    return this;
  }

  clear() {
    this._store = '';
    return this;
  }

  reverse(): collectionObj<string, number, string> {
    const chars = this.store.split('');
    return new StringCollection(chars.reverse().join(''));
  }

  sort(sorter?: orderingFn): collectionObj<string, number, string> {
    const chars = this.store.split('');
    return new StringCollection(chars.sort(sorter).join(''));
  }

  // endregion

  // region iteration

  // endregion

  // region duplication

  clone() {
    return new StringCollection(this.store);
  }

  filter(test: filterAction) {
    const originalValue = this.store;
    this._store = this.reduce(
      (memo, item: string, key: number, _phrase, stopper) => {
        const use = test(item, key, originalValue, stopper);
        if (use && stopper.isActive) {
          return `${memo}${item}`;
        }
        return memo;
      },
      ''
    );
    return this;
  }

  // endregion

  // region boolean

  difference(
    itemsToRemove: collectionObj<any, any, any> | string | string[],
    _mode: booleanMode = booleanMode.byKey
  ): collectionObj<string, number, string> {
    if (typeof itemsToRemove === 'string' || Array.isArray(itemsToRemove)) {
      const next = new StringCollection(this.store);
      next.deleteItem(itemsToRemove);
      return next;
    }
    return this.difference(itemsToRemove.store);
  }

  union(
    other: collectionObj<any, any, any> | string | string[],
    _mode: booleanMode = booleanMode.byKey
  ): collectionObj<string, number, string> {
    if (typeof other === 'string') {
      return this.union(other.split(''));
    }
    if (Array.isArray(other)) {
      const chars = [...this.items, ...other];
      const unique: string = chars.reduce((memo, char: string) => {
        if (memo.includes(char)) {
          return memo;
        }
        return memo + char;
      }, '');
      return new StringCollection(unique);
    }
    return this.union(other.store);
  }

  map(action: typesMethods): collectionObj<string, number, string> {
    const out = this.items;
    this._store = out.reduce((memo, char, index, _value, stopper) => {
      if (stopper.isComplete) return memo;
      const suffix = action(char, index, this.store, stopper);
      return stopper.isStopped ? memo : memo + suffix;
    });
    return this;
  }

  intersection(
    other: collectionObj<any, any, any> | string | string[]
  ): collectionObj<string, number, string> {
    if (typeof other === 'string') {
      return this.intersection(other.split(''));
    }
    if (Array.isArray(other)) {
      const chars = [...this.store.split('')];
      const unique: string[] = chars.filter(char => other.includes(char));
      return new StringCollection(unique.join(''));
    }
    return this.intersection(other.items);
  }

  // endregion
}
