import Collection from './Collection';
import { Stopper } from './utils/Stopper';
import { typesMethods, reduceAction } from './types.methods';

/**
 * this is the base class for items in which the keys are not named strings but are
 * implicit order numbers - such as Arrays and the character indexes of strings.
 */
export abstract class IntIndexedCollection extends Collection {
  get keys() {
    const out: Array<number> = [];
    for (let i = 0; i < this.size; ++i) {
      out.push(i);
    }
    return out;
  }

  forEach(action: typesMethods) {
    const stopper = new Stopper();

    const originalValue = this.store;
    const items = this.items;
    for (let i = 0; i < this.size; ++i) {
      action(items[i], i, originalValue, stopper);
      if (stopper.isStopped) {
        break;
      }
    }

    return this;
  }

  map(looper) {
    const stopper = new Stopper();
    const newStore: any[] = [];
    const iter = this.storeIter();
    if (iter) {
      for (const [key, keyItem] of iter) {
        const item = looper(keyItem, key, this._store, stopper);
        if (stopper.isStopped) {
          break;
        }
        newStore[key] = item;
        if (stopper.isComplete) {
          break;
        }
      }
    }

    this.update(newStore, 'map', looper);
    return this;
  }

  reduce(looper: reduceAction, initial?: any): any {
    const stopper = new Stopper();
    const iter = this.storeIter();
    if (iter) {
      let out = initial;
      for (const [key, keyItem] of iter) {
        const next = looper(out, keyItem, key, this._store, stopper);
        if (stopper.isStopped) {
          break;
        }
        out = next;
        if (stopper.isComplete) {
          break;
        }
      }
      return out;
    }
    return null;
  }

  reduceC(looper, start) {
    const out = this.reduce(looper, start);
    return Collection.create(out);
  }

  // iterators

  storeIter() {
    return this._store.entries();
  }

  keyIter() {
    return this._store.keys();
  }

  itemIter() {
    return this._store.values();
  }
}
