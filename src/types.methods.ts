import { Stopper } from './utils/Stopper';
import { keyType } from './types';

export type typesMethods = (
  item: any,
  key: keyType,
  store: any,
  flow: Stopper
) => any;
export type reduceAction = (
  memo: any,
  item: any,
  key: keyType,
  store: any,
  iter: Stopper
) => any;
export type filterAction = (
  item: string,
  key: number,
  value: string,
  iter: Stopper
) => boolean;
export type combinerFn = any; // a generator function
export type orderingFn = (item1: any, item2: any) => number;
export type comparatorFn = (k1, k2) => boolean;
