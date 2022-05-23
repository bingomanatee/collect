import Collection from './Collection';

export default class ScalarCollection extends Collection {
  get size() {
    return 0;
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

  delete() {
    this.err('delete');
  }

  clear() {
    this.store = undefined;
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
