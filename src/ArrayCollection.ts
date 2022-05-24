import { IntIndexedCollection } from './IntIndexedCollection';
import { collectionObj, comparatorObj } from './types';
import { Stopper } from './utils/Stopper';
import { Match } from './utils/Match';

export default class ArrayCollection extends IntIndexedCollection
  implements collectionObj<any[], number, any> {
  protected _store: any[];
  constructor(store: any[], comps?: comparatorObj) {
    super();
    this._store = store;
    if (comps?.compKeys) {
      this._compKeys = comps?.compKeys;
    }
    if (comps?.compItems) {
      this._compItems = comps?.compItems;
    }
  }

  get size() {
    return this.store.length;
  }

  get items() {
    return [...this.store];
  }

  get(key: number) {
    return this.store[key];
  }

  set(key: number, item) {
    const next = [...this.store];
    next[key] = item;
    this._store = next;
    return this;
  }

  keyOf(item) {
    let index = this.store.indexOf(item);
    if (index === -1) {
      index = undefined;
    }
    return item;
  }

  hasItem(item) {
    return this.store.includes(item);
  }

  clear() {
    this._store = [];
    return this;
  }

  deleteKey(key: number | number[]) {
    return this.filter((_item, oKey) => !Match.sameKey(oKey, key, this));
  }

  deleteItem(item: any | any[]) {
    return this.store.filter(sItem => !Match.sameItem(sItem, item, this));
  }

  hasKey(key: number) {
    return key >= 0 && key < this.size && !(key % 1);
  }

  sort(sortFn) {
    this._store = this.store.sort(sortFn);
    return this;
  }

  clone() {
    return new ArrayCollection([...this.store]);
  }

  map(looper) {
    const stopper = new Stopper();
    const newStore: any[] = [];
    const originalStore = [...this.store];
    for (let i = 0; i < this.size; ++i) {
      const item = looper(this.get(i), i, originalStore, stopper);
      if (stopper.isStopped) {
        break;
      }
      newStore[i] = item;
      if (stopper.isComplete) {
        break;
      }
    }
    this._store = newStore;
    return this;
  }

  filter(filterTest) {
    const stopper = new Stopper();
    const newStore: any[] = [];
    for (let i = 0; i < this.size; ++i) {
      const item = this.get(i);
      const use = filterTest(item, i, this.store, stopper);
      if (stopper.isStopped) {
        break;
      }
      if (use) newStore.push(item);
      if (stopper.isLast) {
        break;
      }
    }
    this._store = newStore;
    return this;
  }
}
