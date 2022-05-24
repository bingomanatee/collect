import Collection from './Collection';
import { clone, makeEmpty } from './utils/change';
import { filterAction, loopAction, reduceAction } from './types';
import { Stopper, stopperEnum } from './utils/Stopper';
import { Match } from './utils/Match';

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
    if (this.store.has(key)) return true;
    for (const storeKey of this.keys) {
      if (Match.sameKey(storeKey, key, this)) {
        return true;
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
        stopper.stopAfterThis();
        return item;
      }
      return found;
    }, undefined);
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
    const tempC = Collection.create(makeEmpty(this.store, this.type));
    const stopper = new Stopper();
    for (const key of this.keys) {
      const item = this.get(key);
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
    this._store = tempC.store;
    return this;
  }

  forEach(loop: loopAction) {
    const stopper = new Stopper();
    for (const key in this.keys) {
      loop(this.get(key), key, this.store, stopper);
      if (stopper.isComplete) {
        break;
      }
    }
    return this;
  }

  clone() {
    const obj = {};
    // @ts-ignore
    obj.__proto__ = this.prototype;
    // @ts-ignore
    const result = this.call(obj, clone(this.store));
    return typeof result !== 'undefined' ? result : obj;
  }

  map(loop: loopAction) {
    const stopper = new Stopper();
    const outCollection = this.clone().clear();
    for (const key in this.keys) {
      const keyValue = this.get(key);
      const item = loop(keyValue, key, this.store, stopper);
      if (stopper.state !== stopperEnum.stop) {
        outCollection.set(key, item);
      }
      if (stopper.isComplete) {
        return outCollection;
      }
    }
    return outCollection;
  }

  reduce(looper: reduceAction, initial?: any) {
    let out = initial;
    const iter = new Stopper();

    for (const key of this.keys) {
      const next = looper(out, this.get(key), key, this.store, iter);
      if (iter.isStopped) {
        return out;
      }
      out = next;
      if (!iter.isActive) {
        break;
      }
    }

    return out;
  }

  reduceC(action, start) {
    const value = this.reduce(action, start);
    return Collection.create(value);
  }
}
