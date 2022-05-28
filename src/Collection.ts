/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefEnum, FormEnum, optionsObj } from './types';
import { detectForm, detectType, e, isFn } from './utils/tests';
import { clone } from './utils/change';
import { StandinCollection } from './utils/StandinCollection';
import { comparatorFn, onChangeFn, orderingFn } from './types.methods';

const simpleComparator = (a, b) => a === b;

// note - Collection is NOT compatible with the full collectionObj signature
export default abstract class Collection {
  constructor(_store, options) {
    // note - does NOT set store, as that should be done at the implementor level, for type reasons
    if (options?.compKeys) {
      this.compKeys = options?.compKeys || simpleComparator;
    }
    if (options?.compItems) {
      this.compItems = options?.compItems || simpleComparator;
    }
    this.quiet = !!options?.quiet;
  }

  public onChange?: onChangeFn;

  change(newStore) {
    if (typeof newStore === 'function') {
      try {
        const cloned = clone(this.store);
        let updated = newStore(cloned);
        if (updated === undefined) updated = cloned;

        if (updated === newStore) {
          throw e('circular change', { newStore, target: this });
        }

        return this.change(updated);
      } catch (err) {
        throw e('functional newStore throws error:', {
          err,
          newStore,
          target: this,
        });
      }
    }
    const newType = detectType(newStore);
    if (newType !== this.type) {
      throw e('attempt to setStore different type than exists now', {
        target: this,
        newStore,
        type: newType,
      });
    }
    return this.update(newStore, 'change');
  }
  protected update(newStore, source?: string, ...input) {
    try {
      if (!this.quiet && this.onChange && source) {
        this.onChange(newStore, source, input);
      }
    } catch (err) {
      console.warn('update: onChange error', err);
      return this;
    }
    this._store = newStore;
    return this;
  }

  protected sorter(sortFn?: orderingFn) {
    return sortFn ? (a, b) => sortFn(a, b, this) : undefined;
  }

  get store(): any {
    return this._store;
  }
  protected _store: any;

  abstract get size(): number;

  abstract get keys(): number[];
  abstract get items(): any[];

  // options and comparator

  mergeOptions(mergeOptions?: optionsObj) {
    const newOptions = { ...this.options };
    if (!mergeOptions) return newOptions;
    for (const newKey of Object.keys(mergeOptions)) {
      newOptions[newKey] = mergeOptions[newKey];
    }
    return newOptions;
  }

  get options() {
    return {
      quiet: this.quiet,
      compKeys: this.compKeys,
      compItems: this.compItems,
    };
  }
  public quiet = false;

  protected _compKeys: comparatorFn = simpleComparator;

  get compKeys(): comparatorFn {
    return this._compKeys || simpleComparator;
  }

  set compKeys(value: comparatorFn) {
    if (!isFn(value)) {
      throw e('improper compKeys function', { target: this, fn: value });
    }
    this._compKeys = value;
  }

  protected _compItems: comparatorFn = simpleComparator;

  get compItems(): comparatorFn {
    return this._compItems || simpleComparator;
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

  withComp(action, comp: optionsObj) {
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
  static create = (store, options?: optionsObj) => {
    return new StandinCollection(store, options);
  };
}
