/* eslint-disable @typescript-eslint/no-unused-vars */
import { comparatorObj, DefEnum, FormEnum } from './types';
import { detectForm, detectType, e, isFn } from './utils/tests';
import { clone } from './utils/change';
import { StandinCollection } from './utils/StandinCollection';
import { comparatorFn } from './types.methods';
// import create from './create';

// note - Collection is NOT compatible with the full collectionObj signature
export default abstract class Collection {
  get store(): any {
    return this._store;
  }
  protected _store: any;

  abstract get size(): number;

  abstract get keys(): number[];
  abstract get items(): any[];

  protected _compKeys: comparatorFn = (a, b) => a === b;

  get compKeys(): comparatorFn {
    return this._compKeys;
  }

  set compKeys(value: comparatorFn) {
    if (!isFn(value)) {
      throw e('improper compKeys function', { target: this, fn: value });
    }
    this._compKeys = value;
  }

  protected _compItems: comparatorFn = (a, b) => a === b;

  get compItems(): comparatorFn {
    return this._compItems;
  }

  set compItems(value: comparatorFn) {
    if (!isFn(value)) {
      throw e('improper compItems function', { target: this, fn: value });
    }
    this._compItems = value;
  }

  get form(): FormEnum {
    return detectForm(this._store);
  }

  get type(): DefEnum {
    return detectType(this._store);
  }

  get c() {
    return Collection.create(clone(this._store));
  }

  withComp(action, comp: comparatorObj) {
    let out = null;

    const { compKeys, compItems } = this;
    try {
      if (comp.compKeys) this.compKeys = comp.compKeys;
      if (comp.compItems) this.compItems = comp.compItems;
      out = action();
    } catch (err) {
      this.compKeys = compKeys;
      this.compItems = compItems;
      throw err;
    }

    return out;
  }

  // must be overridden before any collections are created with a working create method
  static create = store => {
    return new StandinCollection(store);
  };
}
