import { IntIndexedCollection } from './IntIndexedCollection';
import { collectionObj, optionsObj } from './types';
import { Stopper } from './utils/Stopper';
import { Match } from './utils/Match';
import { orderingFn } from './types.methods';
import compare from './utils/compare';

export default class ArrayCollection extends IntIndexedCollection
  implements collectionObj<any[], number, any> {
  protected _store: any[];
  constructor(store: any[], options?: optionsObj) {
    super(store, options);
    this.update(store, 'constructor');
    this._store = store; // because typescript is a weak chump
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
    this.update(next, 'set', key, item);
    return this;
  }

  keyOf(item) {
    let index = this.store.indexOf(item);
    if (index === -1) {
      index = undefined;
    }
    return index;
  }

  hasItem(item) {
    return this.store.includes(item);
  }

  clear() {
    this.update([], 'clear');
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

  sort(sortFn: orderingFn = compare) {
    this.update(this.store.sort(this.sorter(sortFn)), 'sort', sortFn);
    return this;
  }

  clone(newOptions?: optionsObj) {
    return new ArrayCollection([...this.store], this.mergeOptions(newOptions));
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
    this.update(newStore, 'filter', filterTest);
    return this;
  }
}
