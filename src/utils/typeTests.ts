import { FormEnum, TypeEnum } from '../types';
import {
  isArr,
  isDate,
  isFn,
  isMap,
  isNum,
  isObj,
  isSet,
  isStr,
  isSymbol,
  isUndefined,
} from './tests';

// @ts-ignore
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

console.log('TESTS:', TESTS);
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
