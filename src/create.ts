import { detectType } from './utils/tests';
import { FormEnum, TypeEnum } from './types';
import MapCollection from './MapCollection';
import ScalarCollection from './ScalarCollection';
import StringCollection from './StringCollection';
import ArrayCollection from './ArrayCollection';

export default store => {
  let out;
  switch (detectType(store)) {
    case FormEnum.map:
      out = new MapCollection(store);
      break;

    case TypeEnum.string:
      out = new StringCollection(store);
      break;

    case FormEnum.array:
      out = new ArrayCollection(store);
      break;

    default:
      out = new ScalarCollection(store);
  }

  return out;
};
