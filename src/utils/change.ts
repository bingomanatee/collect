import cloneDeep from 'lodash.clonedeep';
import { detectForm, detectType, isThere } from './tests';
import {
  DefEnum,
  FormEnum,
  TypeEnum
} from '../constants';
import { ABSENT } from "../constants.export";

export const clone = cloneDeep;

export function makeEmpty(likeThis, type?: DefEnum) {
  if (!isThere(type)) {
    type = detectType(likeThis);
  }
  let out = likeThis;
  switch (type) {
    case TypeEnum.number:
      out = 0;
      break;

    case TypeEnum.string:
      out = '';
      break;

    case FormEnum.map:
      out = new Map();
      break;

    case FormEnum.object:
      out = {};
      break;

    case FormEnum.array:
      out = [];
      break;

    case TypeEnum.date:
      out = new Date();
      break;

    case FormEnum.set:
      out = new Set();
      break;

    case TypeEnum.symbol:
      out = Symbol('');
      break;

    default:
      out = null;
  }
  return out;
}

/**
 * merge similar form
 * @param value
 * @param change
 * @param form
 */
export function amend(value, change, form: string | symbol = ABSENT) {
  if (!isThere(form)) {
    form = detectForm(value);
  }
  let out = value;
  switch (form) {
    case FormEnum.map:
      out = new Map(value);
      change.forEach((keyValue, key) => {
        out.set(key, keyValue);
      });
      break;

    case FormEnum.object:
      out = { ...value };
      Object.keys(change).forEach((key) => {
        out[key] = change[key];
      });
      break;

    case FormEnum.array:
      out = [...value];
      change.forEach((item, index) => {
        out[index] = item;
      });
      break;

    default:
      console.warn('unhandled amend form:', form);
  }
  return out;
}
