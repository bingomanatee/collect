import { detectType } from './utils/tests';
import { optionsObj, FormEnum, TypeEnum } from './types';
import MapCollection from './MapCollection';
import ScalarCollection from './ScalarCollection';
import StringCollection from './StringCollection';
import ArrayCollection from './ArrayCollection';
import ObjectCollection from './ObjectCollection';
import { Debug } from './utils/debug';

export default (store, comp: optionsObj = {}) => {
  if (Debug.create) console.log('-- creating store for ', store);
  let out;
  switch (detectType(store)) {
    case FormEnum.map:
      out = new MapCollection(store, comp);
      break;

    case TypeEnum.string:
      out = new StringCollection(store, comp);
      break;

    case FormEnum.array:
      out = new ArrayCollection(store, comp);
      break;

    case FormEnum.object:
      out = new ObjectCollection(store, comp);
      break;

    default:
      out = new ScalarCollection(store, comp);
  }

  return out;
};
