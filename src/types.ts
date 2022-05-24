import {
  comparatorFn,
  filterAction,
  typesMethods,
  orderingFn,
  reduceAction,
} from './types.methods';

export enum TypeEnum {
  string = 'string',
  number = 'number',
  date = 'date',
  null = 'null',
  symbol = 'symbol',
  any = 'any',
  undefined = 'undefined',
}

export enum FormEnum {
  array = 'Array',
  map = 'Map',
  object = 'object',
  set = 'set',
  scalar = 'scalar',
  function = 'function',
  any = 'any',
}

export type DefEnum = TypeEnum | FormEnum;

export const ABSENT = Symbol('ABSENT');

export type keyType = any;

export type someValues = Array<any>;
export type valueType = any;
export type oneOrMoreValues = valueType | someValues;

export enum booleanMode {
  byValue = 'value',
  byKey = 'key',
  byBoth = 'both',
}

export type comparatorObj = {
  compKeys?: comparatorFn;
  compItems?: comparatorFn;
};

export type collectionBaseObj<StoreType, KeyType, ItemType> = {
  readonly store: StoreType;
  keys: KeyType[];
  items: ItemType[];

  // reflection
  form: FormEnum;
  type: DefEnum;
  size: number;
};
export type collectionIterProvider<StoreType, KeyType, ItemType> = {
  storeIter: (fromIter?: boolean) => IterableIterator<any> | undefined;
  itemIter: (fromIter?: boolean) => IterableIterator<ItemType> | undefined;
  keyIter: (fromIter?: boolean) => IterableIterator<KeyType> | undefined;
  clone: () => collectionObj<StoreType, KeyType, ItemType>; // new collection with cloned item
};

export type collectionBaseIterProvider<
  StoreType,
  KeyType,
  ItemType
> = collectionIterProvider<StoreType, KeyType, ItemType> &
  collectionBaseObj<StoreType, KeyType, ItemType> &
  comparatorObj;

export type collectionObj<StoreType, KeyType, ItemType> = {
  // Reflection
  hasItem: (item: ItemType) => boolean;
  hasKey: (key: KeyType) => boolean;
  keyOf: (item: ItemType) => KeyType | undefined; // the _first_ key of a given item
  // an item may be associated with more than one key -- this is the first one.
  get: (key: KeyType) => any;
  // comparison
  withComp: (action: () => any, config: comparatorObj) => any; // performs operations with the given comparators operating, then returns current ones.

  // changes
  set: (
    key: KeyType,
    value: any
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  deleteKey: (
    key: KeyType | Array<KeyType>
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  deleteItem: (
    item: ItemType | Array<ItemType>
  ) => collectionObj<ItemType, KeyType, ItemType>; // self
  clear: () => collectionObj<StoreType, KeyType, ItemType>; // self
  sort: (sorter?: orderingFn) => collectionObj<StoreType, KeyType, ItemType>; // self
  c: collectionObj<StoreType, KeyType, ItemType>; // a property identical to clone; for convenience.brevity

  // iteration
  forEach: (
    action: typesMethods
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  map: (action: typesMethods) => collectionObj<StoreType, KeyType, ItemType>; // mutates properties
  filter: (action: filterAction) => collectionObj<StoreType, KeyType, ItemType>; // a new collection wth some of the values;
  reduce: (action: reduceAction, initial: any) => any; // an arbitrary value, computed by looping over the store
  reduceC: (action: reduceAction, initial: any) => collectionObj<any, any, any>; // a new collection for the output of reduce
  // note : the new collection may not be the same type as the start collection
} & collectionBaseIterProvider<StoreType, KeyType, ItemType>;

/*
type _unusedBooleanOperator<ItemType, ValueType> = {
  union: (
    other: ValueType | collectionObj<any, any, any>,
    mode?: booleanMode
  ) => collectionObj<ValueType, KeyType, ItemType>;
  difference: (
    value: ValueType | collectionObj<any, any, any>,
    mode?: booleanMode
  ) => collectionObj<ValueType, KeyType, ItemType>;
  intersection: (
    other: ValueType | collectionObj<any, any, any>,
    mode?: booleanMode
  ) => collectionObj<ValueType, KeyType, ItemType>;
}*/
