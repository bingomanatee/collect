import Collection from './Collection';
import { collectionObj, Iter, loopAction, reduceAction } from './types';

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

  forEach(action: loopAction) {
    const iter = new Iter();

    const originalValue = this.store;
    const items = this.items;
    for (let i = 0; i < this.size; ++i) {
      action(items[i], i, originalValue, iter);
      if (iter.isStopped) {
        break;
      }
    }

    return this;
  }

  reduce(
    action: reduceAction,
    initial: any = ''
  ): collectionObj<any, any, any> {
    const iter = new Iter();

    const originalValue = this.store;
    const items = this.items;
    let out = initial;
    for (let i = 0; i < items.length; ++i) {
      const nextOut = action(out, items[i], i, originalValue, iter);
      if (iter.isStopped) {
        break;
      }
      out = nextOut;
      if (!iter.isActive) {
        break;
      }
    }

    return out;
  }
}
