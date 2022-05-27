import { booleanMode, collectionObj, optionsObj } from './types';
import { IntIndexedCollection } from './IntIndexedCollection';
import { Match } from './utils/Match';
import { filterAction, orderingFn } from './types.methods';
import { Stopper } from './utils/Stopper';
import Collection from './Collection';

export default class StringCollection extends IntIndexedCollection
  implements collectionObj<string, number, string> {
  constructor(store: string, options?: optionsObj) {
    super(store, options);
    this._store = store;
  }

  // region inspection
  get size() {
    return this.store.length;
  }

  get items() {
    return this.store.split('');
  }

  hasItem(str) {
    if (str instanceof RegExp) {
      return str.test(this.store);
    }
    return this.store.includes(str);
  }

  hasKey(i: number) {
    if (i % 1) {
      return false;
    }
    return i >= 0 && i < this.size;
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
    const suffix = this.store.substring(key + Math.max(item.length, 1)) || '';
    this.update(prefix + item + suffix, 'set', key, item);
    return this;
  }

  get(key: number) {
    if (key < 0 || key > this.size) {
      return undefined;
    }
    return this.store.substring(key, key + 1);
  }

  deleteKey(key: number | Array<number>) {
    if (Array.isArray(key)) {
      return this.filter((_item, itemKey) => {
        return !Match.sameKey(itemKey, key, this);
      });
    }
    return this.set(key, '');
  }

  deleteItem(
    item: Array<string> | string
  ): collectionObj<string, number, string> {
    if (Array.isArray(item)) {
      const cloned = this.clone({ quiet: true });
      cloned.filter(otherItem => !Match.sameItem(otherItem, item, this));
      this.update(cloned.store, 'deleteItem', item);
    }
    let newStore: string = this.store;
    let length = newStore.length;
    do {
      length = newStore.length;
      newStore = newStore.replace(item as string, '');
    } while (newStore && newStore.length < length);

    this.update(newStore, 'deleteItem', item);
    return this;
  }

  clear() {
    this.update('', 'clear');
    return this;
  }

  reverse(): collectionObj<string, number, string> {
    return new StringCollection(this.items.reverse().join(''));
  }

  // note - this is the one version of sort where the item types are known to be 1-char strings
  // so the default array sort works fine as a default
  sort(sort?: orderingFn): collectionObj<string, number, string> {
    const letters = Collection.create(
      this.store.split(''),
      this.mergeOptions({ quiet: true })
    );
    letters.sort(this.sorter(sort));
    this.update(letters.store.join(''), 'sort', sort);
    return this;
  }

  // endregion

  // region iteration

  // endregion

  // region duplication

  clone(options?: optionsObj) {
    return new StringCollection(this.store, this.mergeOptions(options));
  }

  filter(test: filterAction) {
    const newStore = this.reduce((memo, letter, key, _original, stopper) => {
      const use = test(letter, key, this.store, stopper);
      if (use && stopper.isActive) {
        return `${memo}${letter}`;
      }
      return memo;
    }, '');

    this.update(newStore, 'filter', test);
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

  map(looper) {
    const stopper = new Stopper();
    const newStore: string[] = [];
    const iter = this.storeIter();
    if (iter) {
      for (const [key, keyItem] of iter) {
        const item = looper(keyItem, key, this._store, stopper);
        if (stopper.isStopped) {
          break;
        }
        newStore.push(item);
        if (stopper.isComplete) {
          break;
        }
      }
    }

    this.update(newStore.join(''), 'map', looper);
    return this;
  }

  intersection(
    other: collectionObj<any, any, any> | string | string[]
  ): collectionObj<string, number, string> {
    if (typeof other === 'string') {
      return this.intersection(other.split(''));
    }
    if (Array.isArray(other)) {
      const unique: string[] = this.items.filter(char => other.includes(char));
      return new StringCollection(unique.join(''));
    }
    return this.intersection(other.items);
  }

  // endregion

  storeIter() {
    return this.items.entries();
  }

  keyIter() {
    return this.keys[Symbol.iterator]();
  }

  itemIter() {
    return this.items[Symbol.iterator]();
  }
}
