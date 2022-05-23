import { IntIndexedCollection } from './IntIndexedCollection';
import { collectionObj } from './types';
import { Stopper } from './utils/Stopper';

export default class ArrayCollection extends IntIndexedCollection
  implements collectionObj<any[], number, any> {
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
    this.store = next;
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
    this.store = [];
    return this;
  }

  delete(key) {
    if (Array.isArray(key)) {
      this.store = this.filter((_item, index) => key.includes(index)).store;
    }
    this.store.slice(key, 1);
    return this;
  }

  hasKey(key: number) {
    return key >= 0 && key < this.size && !(key % 1);
  }

  sort(sortFn) {
    this.store = this.store.sort(sortFn);
    return this;
  }

  clone() {
    return new ArrayCollection([...this.store]);
  }

  map(action) {
    const stopper = new Stopper();
    const newStore: any[] = [];
    for (let i = 0; i < this.size; ++i) {
      const item = action(this.get(i), i, this.store, stopper);
      if (stopper.isStopped) {
        break;
      }
      newStore[i] = item;
      if (!item.isActive) {
        break;
      }
    }
    return new ArrayCollection(newStore);
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
      if (!stopper.isActive) {
        break;
      }
    }
    return new ArrayCollection(newStore);
  }
}
