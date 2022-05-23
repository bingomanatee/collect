import { collectionObj, DefEnum, FormEnum, reduceAction } from './types';
import { detectForm, detectType } from './utils/tests';
import { clone } from './utils/change';
// import create from './create';

export default abstract class Collection {
  store: any;

  abstract get size(): number;

  abstract get keys(): number[];
  abstract get items(): any[];
  abstract reduce(
    action: reduceAction,
    initial: any
  ): collectionObj<any, any, any>;

  constructor(store: any) {
    this.store = store;
  }

  get form(): FormEnum {
    return detectForm(this.store);
  }

  get type(): DefEnum {
    return detectType(this.store);
  }

  reduceC(action, start) {
    const value = this.reduce(action, start);
    return Collection.create(value);
  }

  get c() {
    return Collection.create(clone(this.store));
  }

  static create = store => {
    return { store };
  };
}
