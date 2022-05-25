import { collectionObj, optionsObj, DefEnum, FormEnum } from '../types';
import { clone } from './change';
import { Iter } from '../Iter';
import {
  filterAction,
  typesMethods,
  orderingFn,
  reduceAction,
} from '../types.methods';

export class StandinCollection implements collectionObj<any, any, any> {
  compItems = (a, b) => a === b;
  compKeys = (a, b) => a === b;
  withComp(fn, {}) {
    return fn();
  }
  constructor(store, options?: optionsObj) {
    this.store = store;
    if (options?.compKeys) {
      this.compKeys = options?.compKeys;
    }
    if (options?.compItems) {
      this.compItems = options?.compItems;
    }
  }

  clear(): collectionObj<any, any, any> {
    return this;
  }

  clone(): collectionObj<any, any, any> {
    return new StandinCollection(clone(this.store));
  }

  get c() {
    return this.clone();
  }

  deleteKey(_key: any): collectionObj<any, any, any> {
    return this;
  }

  deleteItem(_key: any): collectionObj<any, any, any> {
    return this;
  }

  filter(_action: filterAction): collectionObj<any, any, any> {
    return this;
  }

  forEach(_action: typesMethods): collectionObj<any, any, any> {
    return this;
  }

  form: FormEnum = FormEnum.object;

  get(_key: any): any {
    return null;
  }

  hasItem(_item: any): boolean {
    return false;
  }

  hasKey(_key: any): boolean {
    return false;
  }

  items: any[] = [];

  keyOf(_item: any): any {
    return undefined;
  }

  keys: any[] = [];

  map(_action: typesMethods): collectionObj<any, any, any> {
    return this;
  }

  reduce(_action: reduceAction, _initial: any): any {
    return null;
  }

  reduceC(_action: reduceAction, _initial: any): collectionObj<any, any, any> {
    return this;
  }

  set(_key: any, _value: any): collectionObj<any, any, any> {
    return this;
  }

  size = 0;

  sort(_sorter: orderingFn | undefined): collectionObj<any, any, any> {
    return this;
  }

  store: any;
  type: DefEnum = FormEnum.object;

  // iterators

  keyIter(fromIter?: boolean): IterableIterator<any> | undefined {
    if (fromIter) {
      return this.keys[Symbol.iterator]();
    }
    return Iter.keyIter(this);
  }

  itemIter(fromIter?: boolean): IterableIterator<any> | undefined {
    if (fromIter) {
      return this.items[Symbol.iterator]();
    }
    return Iter.itemIter(this);
  }

  storeIter(fromIter?: boolean) {
    if (fromIter) {
      return this.store[Symbol.iterator]();
    }
    return Iter.storeIter(this);
  }
}
