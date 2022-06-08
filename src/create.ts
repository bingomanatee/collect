import { detectType } from './utils/tests';
import type { optionsObj } from './types';
import MapCollection from './MapCollection';
import ScalarCollection from './ScalarCollection';
import StringCollection from './StringCollection';
import ArrayCollection from './ArrayCollection';
import ObjectCollection from './ObjectCollection';
import SetCollection from './SetCollection';
import { FormEnum, TypeEnum } from './constants';

export default (store, options?: optionsObj) => {
  let out;

  switch (detectType(store)) {
    case FormEnum.map:
      out = new MapCollection(store, options);
      break;

    case TypeEnum.string:
      out = new StringCollection(store, options);
      break;

    case FormEnum.array:
      out = new ArrayCollection(store, options);
      break;

    case FormEnum.object:
      out = new ObjectCollection(store, options);
      break;

    case FormEnum.set:
      out = new SetCollection(store, options);
      break;

    default:
      out = new ScalarCollection(store, options);
  }

  return out;
};
