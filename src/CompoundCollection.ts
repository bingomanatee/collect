import Collection from './Collection';
import { clone } from './utils/change';
import {
  filterAction,
  Iter,
  iterFlow,
  loopAction,
  reduceAction,
} from './types';

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
    return this.store.has(item);
  }

  hasKey(key: any) {
    return this.keys.includes(key);
  }

  set(key, item) {
    this.store.set(key, item);
    return this;
  }

  get(key) {
    return this.store.get(key);
  }

  delete(key) {
    this.store.delete(key);
    return this;
  }

  clear() {
    this.store.clear();
    return this;
  }

  filter(test: filterAction) {
    const out = this.clone();
    out.store = this.store.filter(test);
    return out;
  }

  forEach(loop: loopAction) {
    const iter = new Iter();
    for (const key in this.keys) {
      loop(this.get(key), key, this.store, iter);
      if (!iter.isActive) {
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
    const iter = new Iter();
    const outCollection = this.clone().clear();
    for (const key in this.keys) {
      const keyValue = this.get(key);
      const item = loop(keyValue, key, this.store, iter);
      if (iter.state !== iterFlow.stop) outCollection.set(key, item);
      if (!iter.isActive) return outCollection;
    }
    return outCollection;
  }

  reduce(looper: reduceAction, initial?: any) {
    let out = initial;
    const iter = new Iter();

    for (const key in this.keys) {
      const next = looper(out, this.get(key), key, this.store, iter);
      if (iter.isStopped) return out;
      out = next;
      if (!iter.isActive) {
        break;
      }
    }

    return out;
  }
}
