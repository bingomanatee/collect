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
export type someKeys = Array<keyType>;
export type oneOrMoreKeys = keyType | someKeys;

export type loopAction = (
  item: any,
  key: keyType,
  store: any,
  flow: Iter
) => any;

export type reduceAction = (
  memo: any,
  item: any,
  key: keyType,
  store: any,
  iter: Iter
) => any;

export type filterAction = (
  item: string,
  key: number,
  value: string,
  iter: Iter
) => boolean;

export type someValues = Array<any>;
export type valueType = any;
export type oneOrMoreValues = valueType | someValues;

export type combinerFn = any; // a generator function

export enum booleanMode {
  byValue = 'value',
  byKey = 'key',
  byBoth = 'both',
}

export type valueOrCollectionObj = valueType | collectionObj<any, any, any>;

export type orderingFn = (item1: any, item2: any) => number;

export type collectionObj<StoreType, KeyType, ItemType> = {
  // reflection
  store: StoreType;
  form: FormEnum;
  type: DefEnum;
  size: number;
  hasItem: (item: ItemType) => boolean;
  hasKey: (key: KeyType) => boolean;
  keys: any[];
  get: (key: KeyType) => any;
  items: any[];
  keyOf: (item: ItemType) => KeyType | undefined; // the _first_ key of a given item
  // an item may be associated with more than one key -- this is the first one.

  // changes
  set: (
    key: KeyType,
    value: any,
    endKey?: any
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  delete: (
    key: KeyType | Array<KeyType>,
    endKey?: KeyType
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  /*
  deleteItem: (
    item: ItemType | Array<ItemType>
  ) => collectionObj<ValueType, KeyType, ItemType>; // self
*/
  clear: () => collectionObj<StoreType, KeyType, ItemType>; // self
  sort: (sorter?: orderingFn) => collectionObj<StoreType, KeyType, ItemType>; // self
  // reverse: () => collectionObj<ValueType, KeyType, ItemType>; // self;

  // iteration

  forEach: (action: loopAction) => collectionObj<StoreType, KeyType, ItemType>; // self
  clone: () => collectionObj<StoreType, KeyType, ItemType>; // new collection with cloned item
  map: (action: loopAction) => collectionObj<StoreType, KeyType, ItemType>; // new collection with mutated set
  filter: (action: filterAction) => collectionObj<StoreType, KeyType, ItemType>; // a new collection wth some of the values;
  reduce: (action: reduceAction, initial: any) => any; // a new collection with a different value.
  // note : the new collection may not be the same type as the start collection

  // boolean
  /*
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
  */
};

export enum iterFlow {
  continue,
  last, // process the return value, but stop iteration
  stop, //do not process the return value - stop immediately
}

export class Iter {
  public state = iterFlow.continue;

  get isActive() {
    return this.state === iterFlow.continue;
  }

  get isStopped() {
    return this.state === iterFlow.stop;
  }

  final() {
    this.state = iterFlow.last;
  }
  stop() {
    this.state = iterFlow.stop;
  }
}
