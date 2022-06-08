import Collection from './Collection';
import Stopper from './utils/Stopper';
import type { iteratorMethods, reduceAction } from './types';

/**
 * this is the base class for items in which the keys are not named strings but are
 * implicit order numbers - such as Arrays and the character indexes of strings.
 */
export default abstract class IntIndexedCollection extends Collection {
  get keys() {
    const out: Array<number> = [];
    for (let i = 0; i < this.size; i += 1) {
      out.push(i);
    }
    return out;
  }

  forEach(action: iteratorMethods) {
    const stopper = new Stopper();

    const originalValue = this.store;
    const items = this.items;
    for (let i = 0; i < this.size; i += 1) {
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
    let done = false;
    do {
      const iterValue = iter.next();
      done = iterValue.done;
      if (done) {
        break;
      }
      const [key, keyItem] = iterValue.value;
      const item = looper(keyItem, key, this._store, stopper);
      if (stopper.isStopped) {
        break;
      }
      newStore[key] = item;
      if (stopper.isComplete) {
        break;
      }
    } while (!done);

    this.update(newStore, 'map', looper);
    return this;
  }

  reduce(looper: reduceAction, initial?: any): any {
    const stopper = new Stopper();
    const iter = this.storeIter();

    let out = initial;
    let done = false;
    do {
      const iterValue = iter.next();
      done = iterValue.done;
      if (done) {
        break;
      }
      const [key, keyItem] = iterValue.value;
      const next = looper(out, keyItem, key, this._store, stopper);
      if (stopper.isStopped) {
        break;
      }
      out = next;
      if (stopper.isComplete) {
        break;
      }
    } while (!done);
    return out;
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
