import { ABSENT, DefEnum, FormEnum, TypeEnum } from '../types';
import { detectForm, detectType, isThere } from './tests';

export function clone(value, type?: DefEnum) {
  if (!isThere(type)) {
    type = detectType(value);
  }
  let out = value;
  switch (type) {
    case FormEnum.map:
      out = new Map(value);
      break;

    case FormEnum.object:
      out = { ...value };
      break;

    case FormEnum.array:
      out = [...value];
      break;

    case TypeEnum.date:
      out = new Date(value);
      break;
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
      Object.keys(change).forEach(key => {
        out[key] = change[key];
      });
      break;

    case FormEnum.array:
      out = [...value];
      change.forEach((item, index) => {
        out[index] = item;
      });
      break;
  }
  return out;
}
