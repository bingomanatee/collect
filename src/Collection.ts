import { DefEnum, FormEnum } from './types';
import { detectForm, detectType } from './utils/tests';
// import create from './create';

export default abstract class Collection {
  store: any;

  abstract get size(): number;

  abstract get keys(): number[];
  abstract get items(): any[];

  constructor(store: any) {
    this.store = store;
  }

  get form(): FormEnum {
    return detectForm(this.store);
  }

  get type(): DefEnum {
    return detectType(this.store);
  }

  static create = store => {
    return { store };
  };
}
