declare enum TypeEnum {
    string = "string",
    number = "number",
    date = "date",
    null = "null",
    symbol = "symbol",
    any = "any",
    undefined = "undefined"
}
declare enum FormEnum {
    array = "Array",
    map = "Map",
    object = "object",
    set = "set",
    scalar = "scalar",
    function = "function",
    any = "any"
}
declare type DefEnum = TypeEnum | FormEnum;
declare enum stopperEnum {
    continue = 0,
    last = 1,
    stop = 2
}

declare type StopperObj = {
    state: stopperEnum;
    isActive: boolean;
    isStopped: boolean;
    isComplete: boolean;
    final: () => void;
    stop: () => void;
    stopAfterThis: () => void;
};
declare type iteratorMethods = (item: any, key: keyType, store: any, stopper: StopperObj) => any;
declare type reduceAction = (memo: any, item: any, key: keyType, store: any, stopper: StopperObj) => any;
declare type filterAction = (item: string, key: number, store: any, stopper: StopperObj) => boolean;
declare type combinerFn = any;
declare type orderingFn = (item1: any, item2: any, coll?: any) => number;
declare type comparatorFn = (k1: any, k2: any) => boolean;
declare type onChangeFn = (newStore: any, source: string, input?: any[]) => any | undefined;
declare type keyType = any;
declare type someValues = Array<any>;
declare type valueType = any;
declare type oneOrMoreValues = valueType | someValues;
declare type comparatorObj = {
    compKeys?: comparatorFn;
    compItems?: comparatorFn;
};
declare type collectionBaseObj<StoreType, KeyType, ItemType> = {
    readonly store: StoreType;
    keys: KeyType[];
    items: ItemType[];
    form: FormEnum;
    type: DefEnum;
    size: number;
    clone: (optionsObj?: any) => collectionObj<StoreType, KeyType, ItemType>;
    cloneShallow: (optionsObj?: any) => collectionObj<StoreType, KeyType, ItemType>;
};
declare type collectionIterProvider<_StoreType, KeyType, ItemType> = {
    storeIter: (fromIter?: boolean) => IterableIterator<[KeyType, ItemType]>;
    itemIter: (fromIter?: boolean) => IterableIterator<ItemType>;
    keyIter: (fromIter?: boolean) => IterableIterator<KeyType>;
};
declare type optionsObj = {
    quiet?: boolean;
} & comparatorObj;
declare type collectionBaseIterProvider<StoreType, KeyType, ItemType> = collectionIterProvider<StoreType, KeyType, ItemType> & collectionBaseObj<StoreType, KeyType, ItemType> & optionsObj;
declare type changeObserver = (pendingStore: any, action: string, opts?: any) => any;
declare type collectionObj<StoreType, KeyType, ItemType> = {
    hasItem: (item: ItemType) => boolean;
    hasKey: (key: KeyType) => boolean;
    keyOf: (item: ItemType) => KeyType | undefined;
    get: (key: KeyType) => any;
    withComp: (action: () => any, config: optionsObj) => any;
    addAfter: (item: ItemType, key?: KeyType) => collectionObj<StoreType, KeyType, ItemType>;
    addBefore: (item: ItemType, key?: KeyType) => collectionObj<StoreType, KeyType, ItemType>;
    removeLast: () => any;
    removeFirst: () => any;
    first: (count?: number) => ItemType[];
    last: (count?: number) => ItemType[];
    firstItem: ItemType | undefined;
    lastItem: ItemType | undefined;
    change(newValue: any): collectionObj<StoreType, KeyType, ItemType>;
    set: (key: KeyType, value: any) => collectionObj<StoreType, KeyType, ItemType>;
    deleteKey: (key: KeyType | Array<KeyType>) => collectionObj<StoreType, KeyType, ItemType>;
    deleteItem: (item: ItemType | Array<ItemType>) => collectionObj<ItemType, KeyType, ItemType>;
    clear: () => collectionObj<StoreType, KeyType, ItemType>;
    sort: (sorter?: orderingFn) => collectionObj<StoreType, KeyType, ItemType>;
    c: collectionObj<StoreType, KeyType, ItemType>;
    cloneEmpty: (optionsObj?: any) => collectionObj<ItemType, KeyType, ItemType>;
    forEach: (action: iteratorMethods) => collectionObj<StoreType, KeyType, ItemType>;
    map: (action: iteratorMethods) => collectionObj<StoreType, KeyType, ItemType>;
    filter: (action: filterAction) => collectionObj<StoreType, KeyType, ItemType>;
    reduce: (action: reduceAction, initial: any) => any;
    reduceC: (action: reduceAction, initial: any) => collectionObj<any, any, any>;
    onChange?: changeObserver;
} & collectionBaseIterProvider<StoreType, KeyType, ItemType>;

export { StopperObj, changeObserver, collectionBaseIterProvider, collectionBaseObj, collectionIterProvider, collectionObj, combinerFn, comparatorFn, comparatorObj, filterAction, iteratorMethods, keyType, onChangeFn, oneOrMoreValues, optionsObj, orderingFn, reduceAction, someValues, valueType };
