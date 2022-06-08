import Collection from './Collection';
import { optionsObj } from './types';

export default class ScalarCollection extends Collection {
  protected _store: any;

  constructor(store: any, options?: optionsObj) {
    super(store, options);
    this._store = store;
  }

  get size() {
    return 0;
  }

  get(_key) {
    ScalarCollection.err('key');
    return 0;
  }

  set(_key, _item) {
    ScalarCollection.err('set');
    return this;
  }

  hasKey(_item) {
    ScalarCollection.err('hasKey');
    return null;
  }

  hasItem(_item) {
    ScalarCollection.err('hasItem');
    return null;
  }

  keyOf(_item) {
    ScalarCollection.err('keyOf');
    return undefined;
  }

  static err(method) {
    throw new Error(`${method} not available for scalar collection`);
  }

  get keys() {
    ScalarCollection.err('keys');
    return [];
  }

  get items() {
    ScalarCollection.err('items');
    return [];
  }

  deleteKey() {
    ScalarCollection.err('delete');
  }

  clear() {
    this.update(undefined, 'clear');
  }

  forEach() {
    ScalarCollection.err('forEach');
  }

  map() {
    ScalarCollection.err('map');
    return [];
  }

  reduce() {
    ScalarCollection.err('reduce');
    return null;
  }
}
