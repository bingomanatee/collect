import Collection from './Collection';

export default class ScalarCollection extends Collection {
  get size() {
    return 0;
  }

  get(_key) {
    this.err('key');
    return 0;
  }

  set(_key, _item) {
    this.err('set');
    return this;
  }

  hasKey(_item) {
    this.err('hasKey');
    return null;
  }

  hasItem(_item) {
    this.err('hasItem');
    return null;
  }

  keyOf(_item) {
    this.err('keyOf');
    return undefined;
  }

  err(method) {
    throw new Error(`${method} not available for scalar collection`);
  }

  get keys() {
    this.err('keys');
    return [];
  }

  get items() {
    this.err('items');
    return [];
  }

  deleteKey() {
    this.err('delete');
  }

  clear() {
    this._store = undefined;
  }

  forEach() {
    this.err('forEach');
  }

  map() {
    this.err('map');
    return [];
  }

  reduce() {
    this.err('reduce');
    return null;
  }
}
