import { isNum } from './utils/tests';
import {
  booleanMode,
  collectionObj,
  filterAction,
  loopAction,
  orderingFn,
} from './types';
import { IntIndexedCollection } from './IntIndexedCollection';

export default class StringCollection extends IntIndexedCollection
  implements collectionObj<string, number, string> {
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
   * @param endKey
   */
  set(key: number, item: string, endKey?: number) {
    if (!isNum(endKey)) {
      endKey = key;
    }

    const prefix = this.store.substring(0, key) || '';
    const suffix =
      this.store.substring(typeof endKey === 'number' ? endKey : key) || '';
    this.store = prefix + item + suffix;
    return this;
  }

  get(key: number, endKey?: number) {
    return this.store.substring(
      key,
      typeof endKey === 'number' ? endKey : key + 1
    );
  }

  delete(key: number | Array<number>, endKey?: number) {
    if (Array.isArray(key)) {
      this.store = this.store.split.filter((_char, index) => {
        return !key.includes(index);
      });
      return this;
    }
    if (typeof endKey !== 'number') {
      endKey = key + 1;
    }
    return this.set(key, '', endKey);
  }

  deleteItem(
    item: Array<string> | string
  ): collectionObj<string, number, string> {
    const without = this.reduce(
      (memo: string, char: string, _index: number, _value: string, _stop) => {
        if (Array.isArray(item)) {
          if (item.includes(char)) {
            return memo;
          }
        } else {
          if (char === item) {
            return memo;
          }
        }
        return memo + char;
      },
      ''
    );
    this.store = without.store;
    return this;
  }

  clear() {
    this.store = '';
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
    const withoutColl = this.reduce((memo, item: string, key: number, iter) => {
      if (test(item, key, originalValue, iter)) {
        if (!iter.isStopped) {
          return memo + item;
        }
      }
      return memo;
    }, '');
    this.store = withoutColl.store;
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
      const chars = [...this.store.split(''), ...other];
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

  map(action: loopAction): collectionObj<string, number, string> {
    const out = this.items;
    const processed = out.reduce((memo, char, index, _value, iter) => {
      const suffix = action(char, index, this.store, iter);
      if (iter.isStopped) {
        return memo;
      }
      return memo + suffix;
    });
    return new StringCollection(processed);
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
