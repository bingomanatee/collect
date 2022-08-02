import toString from 'lodash.tostring';
import { detectType, formIsCompound, isEmpty } from './tests';
import { DefEnum, FormEnum, TypeEnum } from '../constants';

const simpleTypeOrder: DefEnum[] = [
  TypeEnum.undefined,
  TypeEnum.null,
  TypeEnum.number,
  TypeEnum.string
];

function compareTypes (a, b, typeA?: DefEnum, typeB?: DefEnum) {
  if (!typeA) {
    typeA = detectType(a);
  }
  if (!typeB) {
    typeB = detectType(b);
  }

  if (typeA === TypeEnum.date) {
    if (typeB === TypeEnum.date) {
      return compareTypes(
        (a as Date).getTime(),
        (b as Date).getTime(),
        TypeEnum.number,
        TypeEnum.number
      );
    } else {
      return compareTypes((a as Date).getTime(), b, TypeEnum.number, typeB);
    }
  } else if (typeB === TypeEnum.date) {
    return compareTypes(a, (b as Date).getTime(), typeA, TypeEnum.number);
  }

  // order some types by type
  if (typeA !== typeB) {
    if (simpleTypeOrder.includes(typeA) && simpleTypeOrder.includes(typeB)) {
      const diff = simpleTypeOrder.indexOf(typeA) - simpleTypeOrder.indexOf(typeB);
      return diff / Math.abs(diff);
    }
  }

  // compare numbers by value.
  if (typeA === TypeEnum.number && typeB === TypeEnum.number) {
    return (a - b) / Math.abs(a - b);
  }

  // compare strings by value;
  // sort strings before non-strings
  if (typeA === TypeEnum.string) {
    if (typeB === TypeEnum.string) {
      if (a > b) {
        return 1;
      }
      return -1;
    } else {
      return -1;
    }
  } else if (typeB === TypeEnum.string) {
    return 1;
  }

  /* eslint-disable no-else-return */
  if (formIsCompound(typeA as FormEnum)) {
    if (formIsCompound(typeB as FormEnum)) {
      return compareTypes(
        toString(a),
        toString(b),
        TypeEnum.string,
        TypeEnum.string
      );
    } else {
      return 1;
    }
  } else if (formIsCompound(typeB as FormEnum)) {
    return compareTypes(a, toString(b), typeA, TypeEnum.string);
  }

  if (a > b) {
    return 1;
  }
  return -1;
}

/**
 * the rule or the sort function is :
 * if the values are equal, return 0;
 * if (b > a) return 1; -- sort is b, a
 * if (a > b) return -1; -- sort is a, b
 * @param a
 * @param b
 */
export default function compare (a, b) {
  if (a === b) {
    return 0;
  }

  if (isEmpty(a)) {
    if (isEmpty(b)) {
      return 0;
    }
    return -1;
  } else if (isEmpty(b)) {
    return 1;
  }

  return compareTypes(a, b);
}
