import {
  collectionObj,
  DefEnum,
  filterAction,
  FormEnum,
  loopAction,
  orderingFn,
  reduceAction,
} from '../types';
import { clone } from './change';

export class StandinCollection implements collectionObj<any, any, any> {
  compItems = (a, b) => a === b;
  compKeys = (a, b) => a === b;
  withComp(fn, {}) {
    return fn();
  }
  constructor(store) {
    this.store = store;
  }

  clear(): collectionObj<any, any, any> {
    return this;
  }

  clone(): collectionObj<any, any, any> {
    return new StandinCollection(clone(this.store));
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

  forEach(_action: loopAction): collectionObj<any, any, any> {
    return this;
  }

  form: FormEnum = FormEnum.object;

  get(_key: any): any {}

  hasItem(_item: any): boolean {
    return false;
  }

  hasKey(_key: any): boolean {
    return false;
  }

  items: any[] = [];

  keyOf(_item: any): any {}

  keys: any[] = [];

  map(_action: loopAction): collectionObj<any, any, any> {
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
}
