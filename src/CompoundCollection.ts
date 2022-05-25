import Collection from './Collection';
import { Stopper } from './utils/Stopper';
import { Match } from './utils/Match';
import { filterAction, typesMethods, reduceAction } from './types.methods';
import { collectionObj, optionsObj } from './types';

/**
 * This is a baseline
 */
export default abstract class CompoundCollection extends Collection {
  get size() {
    return this.store.size;
  }

  get keys(): any[] {
    return this.store.keys();
  }

  get items(): any[] {
    return this.store.values();
  }

  hasItem(item: any) {
    return Array.from(this.items).some(storeItem =>
      Match.sameItem(storeItem, item, this)
    );
  }

  hasKey(key: any) {
    if (this.store.has(key)) {
      return true;
    }
    const iter = this.keyIter();
    if (iter) {
      for (const storeKey of iter) {
        if (Match.sameKey(storeKey, key, this)) {
          return true;
        }
      }
    }
    return false;
  }

  set(key, item) {
    for (const storeKey of this.keys) {
      if (Match.sameKey(storeKey, key, this)) {
        this.store.set(storeKey, item);
        return this;
      }
    }
    this.store.set(key, item);
    return this;
  }

  get(key) {
    return this.reduce((found, item, itemKey, _store, stopper) => {
      if (Match.sameKey(itemKey, key, this)) {
        stopper.final();
        return item;
      }
      return found;
    }, undefined);
  }

  keyOf(item): any | undefined {
    const index = this.items.indexOf(item);
    if (index === -1) {
      return undefined;
    }
    return index;
  }

  deleteKey(key) {
    this.store.deleteKey(key);
    return this;
  }

  deleteItem(item: any | any[]) {
    return this.filter(oItem => !Match.sameItem(oItem, item, this));
  }

  clear() {
    this.store.clear();
    return this;
  }

  filter(test: filterAction) {
    const tempC = this.clone({ quiet: true }).clear();

    const stopper = new Stopper();

    const iter = this.storeIter();
    if (iter) {
      for (const [key, item] of iter) {
        const use = test(item, key, this.store, stopper);
        if (stopper.isStopped) {
          break;
        }
        if (use) {
          tempC.set(key, item);
        }
        if (stopper.isLast) {
          break;
        }
      }
    }
    this.update(tempC.store, 'filter', test);
    return this;
  }

  forEach(loop: typesMethods) {
    const stopper = new Stopper();
    const iter = this.storeIter();
    if (iter) {
      for (const [key, item] of iter) {
        loop(item, key, this.store, stopper);
        if (stopper.isComplete) {
          break;
        }
      }
    }

    return this;
  }

  abstract clone(opts?: optionsObj): collectionObj<any, any, any>;

  map(loop: typesMethods) {
    const stopper = new Stopper();
    const iter = this.storeIter();
    if (iter) {
      const nextMapCollection = this.clone({ quiet: true }).clear();

      for (const [key, keyItem] of iter) {
        const newItem = loop(keyItem, key, this.store, stopper);
        if (stopper.isComplete) {
          break;
        }
        nextMapCollection.set(key, newItem);
        if (stopper.isComplete) {
          break;
        }
      }
      this.update(nextMapCollection.store, 'map', loop);
    }
    return this;
  }

  reduce(looper: reduceAction, initial?: any) {
    const stopper = new Stopper();

    let out = initial;
    const iter = this.storeIter();
    if (iter) {
      for (const [key, item] of iter) {
        const next = looper(out, item, key, this.store, stopper);
        if (stopper.isStopped) {
          return out;
        }
        out = next;
        if (stopper.isComplete) {
          return next;
        }
      }
    }
    return out;
  }

  reduceC(action, start) {
    const value = this.reduce(action, start);
    return Collection.create(value);
  }

  // iterators

  abstract keyIter(fromIter?: boolean): IterableIterator<any> | undefined;

  abstract itemIter(fromIter?: boolean): IterableIterator<any> | undefined;

  abstract storeIter(fromIter?: boolean): IterableIterator<any> | undefined;
}
