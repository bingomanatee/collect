/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DefEnum, FormEnum, TypeEnum } from '../types';
import { ABSENT } from '../types';

export function typeTest(type) {
  return value => typeof value === type;
}

export function isThere(item) {
  return ![ABSENT, undefined].includes(item);
}

// isEmpty is NOT a simple syntactic inverse of isThere; it includes null,
// which is not a qualifier of isThere.
export function isEmpty(item) {
  return [ABSENT, null, undefined].includes(item);
}

export const isNum = typeTest('number');

/**
 * a type check; if nonEmpty = true, only true if array has indexed values.
 * @param a
 * @param nonEmpty
 * @returns {boolean}
 */
export function isArr(a, nonEmpty = false) {
  return !!(Array.isArray(a) && (!nonEmpty || a.length));
}

export const isMap = m => m && m instanceof Map;

/**
 * returns true if the object is a POJO object -- that is,
 * its non-null, is an instance of Object, and is not an array.
 *
 * @param o
 * @param isAnyObj {boolean} whether arrays, maps should be included as objecg
 * @returns {boolean}
 */
export function isObj(o, isAnyObj = false) {
  return o && typeof o === 'object' && (isAnyObj || !(isArr(o) || isMap(o)));
}

export const isFn = typeTest('function');

export const isDate = d => d instanceof Date;

export const isSet = d => d instanceof Set;

export const isSymbol = typeTest('symbol');

export function isWhole(value) {
  if (!isNum(value)) {
    return false;
  }
  return value >= 0 && !(value % 2);
}

/**
 * returns a decorated error; an Error instance with extra annotations
 * @param err
 * @param notes
 */
export const e = (err, notes = {}) => {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  if (!isThere(notes)) {
    notes = {};
  } else if (!isObj(notes)) {
    notes = { notes };
  }
  return Object.assign(err, notes);
};

export function isStr(s, nonEmpty = false) {
  if (typeof s === 'string') {
    return nonEmpty ? !!s : true;
  }
  return false;
}

export const isUndefined = typeTest('undefined');

export const TESTS = [
  { name: TypeEnum.undefined, test: isUndefined, isForm: false },
  { name: FormEnum.map, test: isMap, isForm: true },
  { name: TypeEnum.symbol, test: isSymbol, isForm: false },
  { name: FormEnum.array, test: isArr, isForm: true },
  { name: FormEnum.function, test: isFn, isForm: true },
  { name: TypeEnum.date, test: isDate, isForm: false },
  { name: FormEnum.set, test: isSet, isForm: true },
  { name: FormEnum.object, test: isObj, isForm: true },
  { name: TypeEnum.string, test: isStr, isForm: false },
  { name: TypeEnum.number, test: isNum, isForm: false },
  { name: FormEnum.scalar, test: () => true, isForm: true },
];

/**
 * detectForm is only concerned with containment patterns.
 * @param value
 */
export function detectForm(value: any): FormEnum {
  for (let i = 0; i < TESTS.length; ++i) {
    const def = TESTS[i];
    if (!def.isForm) {
      continue;
    }
    if (def.test(value)) {
      return def.name as FormEnum;
    }
  }

  return FormEnum.scalar;
}

export function formIsCompound(form: FormEnum) {
  return [
    FormEnum.map,
    FormEnum.map,
    FormEnum.array,
    FormEnum.object,
    FormEnum.set,
  ].includes(form);
}

export function detectType(value: any) {
  for (let i = 0; i < TESTS.length; ++i) {
    const def = TESTS[i];
    if (def.isForm) {
      continue;
    }
    try {
      if (def.test(value)) {
        return def.name;
      }
    } catch (err) {
      console.log('error in def', def, err);
    }
  }

  return detectForm(value) as DefEnum;
}

// const FIND_SYMBOL = /Symbol\((.*:)?(.*)\)/;

export function returnOrError(fn, ...args) {
  if (typeof fn !== 'function') {
    throw new Error('returnOrError MUST be passed a function');
  }
  try {
    return fn(...args);
  } catch (err) {
    return err;
  }
}

/**
 * allow custom form/type definitions by application developer;
 * @param name
 * @param test
 * @param isForm
 * @param order
 export function addTest(name, test, isForm = false, order = 0) {
  TESTS.push(name, {name: name, test, isForm, order));
}
 */
