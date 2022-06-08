var TypeEnum;
(function (TypeEnum) {
    TypeEnum["string"] = "string";
    TypeEnum["number"] = "number";
    TypeEnum["date"] = "date";
    TypeEnum["null"] = "null";
    TypeEnum["symbol"] = "symbol";
    TypeEnum["any"] = "any";
    TypeEnum["undefined"] = "undefined";
})(TypeEnum || (TypeEnum = {}));
var FormEnum;
(function (FormEnum) {
    FormEnum["array"] = "Array";
    FormEnum["map"] = "Map";
    FormEnum["object"] = "object";
    FormEnum["set"] = "set";
    FormEnum["scalar"] = "scalar";
    FormEnum["function"] = "function";
    FormEnum["any"] = "any";
})(FormEnum || (FormEnum = {}));
var booleanMode;
(function (booleanMode) {
    booleanMode["byValue"] = "value";
    booleanMode["byKey"] = "key";
    booleanMode["byBoth"] = "both";
})(booleanMode || (booleanMode = {}));
var stopperEnum;
(function (stopperEnum) {
    stopperEnum[stopperEnum["continue"] = 0] = "continue";
    stopperEnum[stopperEnum["last"] = 1] = "last";
    stopperEnum[stopperEnum["stop"] = 2] = "stop";
})(stopperEnum || (stopperEnum = {}));

var constants = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get TypeEnum () { return TypeEnum; },
  get FormEnum () { return FormEnum; },
  get booleanMode () { return booleanMode; },
  get stopperEnum () { return stopperEnum; }
});

const ABSENT = Symbol('ABSENT');

var constants_export = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ABSENT: ABSENT
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
function typeTest(type) {
    return (value) => typeof value === type;
}
function isThere(item) {
    return ![ABSENT, undefined].includes(item);
}
// isEmpty is NOT a simple syntactic inverse of isThere; it includes null,
// which is not a qualifier of isThere.
function isEmpty(item) {
    return [ABSENT, null, undefined].includes(item);
}
const isNum = typeTest('number');
/**
 * a type check; if nonEmpty = true, only true if array has indexed values.
 * @param a
 * @param nonEmpty
 * @returns {boolean}
 */
function isArr(a, nonEmpty = false) {
    return !!(Array.isArray(a) && (!nonEmpty || a.length));
}
const isMap = (m) => m instanceof Map;
/**
 * returns true if the object is a POJO object -- that is,
 * its non-null, is an instance of Object, and is not an array.
 *
 * @param o
 * @param isAnyObj {boolean} whether arrays, maps should be included as objecg
 * @returns {boolean}
 */
function isObj(o, isAnyObj = false) {
    return o && typeof o === 'object' && (isAnyObj || !(isArr(o) || isMap(o)));
}
const isFn = typeTest('function');
const isDate = (d) => d instanceof Date;
const isSet = (d) => d instanceof Set;
const isSymbol$1 = typeTest('symbol');
/**
 * returns a decorated error; an Error instance with extra annotations
 * @param err
 * @param notes
 */
const e = (err, notes = {}) => {
    if (typeof err === 'string') {
        err = new Error(err);
    }
    if (!isThere(notes)) {
        notes = {};
    }
    else if (!isObj(notes)) {
        notes = { notes };
    }
    return Object.assign(err, notes);
};
function isStr(s, nonEmpty = false) {
    if (typeof s === 'string') {
        return nonEmpty ? !!s : true;
    }
    return false;
}
const isUndefined = typeTest('undefined');
const TESTS = [
    { name: TypeEnum.undefined, test: isUndefined, isForm: false },
    { name: FormEnum.map, test: isMap, isForm: true },
    { name: TypeEnum.symbol, test: isSymbol$1, isForm: false },
    { name: FormEnum.array, test: isArr, isForm: true },
    { name: FormEnum.function, test: isFn, isForm: true },
    { name: TypeEnum.date, test: isDate, isForm: false },
    { name: FormEnum.set, test: isSet, isForm: true },
    { name: FormEnum.object, test: isObj, isForm: true },
    { name: TypeEnum.string, test: isStr, isForm: false },
    { name: TypeEnum.number, test: isNum, isForm: false },
    { name: FormEnum.scalar, test: () => true, isForm: true }
];
/**
 * detectForm is only concerned with containment patterns.
 * @param value
 */
function detectForm(value) {
    for (let i = 0; i < TESTS.length; i += 1) {
        const def = TESTS[i];
        if (!def.isForm) {
            continue;
        }
        if (def.test(value)) {
            return def.name;
        }
    }
    return FormEnum.scalar;
}
function formIsCompound(form) {
    return [
        FormEnum.map,
        FormEnum.map,
        FormEnum.array,
        FormEnum.object,
        FormEnum.set
    ].includes(form);
}
function detectType(value) {
    for (let i = 0; i < TESTS.length; i += 1) {
        const def = TESTS[i];
        if (def.isForm) {
            continue;
        }
        try {
            if (def.test(value)) {
                return def.name;
            }
        }
        catch (err) {
            console.log('error in def', def, err);
        }
    }
    return detectForm(value);
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var lodash_clonedeep = {exports: {}};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

(function (module, exports) {
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	cloneableTags[boolTag] = cloneableTags[dateTag] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag] =
	cloneableTags[numberTag] = cloneableTags[objectTag] =
	cloneableTags[regexpTag] = cloneableTags[setTag] =
	cloneableTags[stringTag] = cloneableTags[symbolTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/**
	 * Adds the key-value `pair` to `map`.
	 *
	 * @private
	 * @param {Object} map The map to modify.
	 * @param {Array} pair The key-value pair to add.
	 * @returns {Object} Returns `map`.
	 */
	function addMapEntry(map, pair) {
	  // Don't return `map.set` because it's not chainable in IE 11.
	  map.set(pair[0], pair[1]);
	  return map;
	}

	/**
	 * Adds `value` to `set`.
	 *
	 * @private
	 * @param {Object} set The set to modify.
	 * @param {*} value The value to add.
	 * @returns {Object} Returns `set`.
	 */
	function addSetEntry(set, value) {
	  // Don't return `set.add` because it's not chainable in IE 11.
	  set.add(value);
	  return set;
	}

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array ? array.length : 0;

	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    Symbol = root.Symbol,
	    Uint8Array = root.Uint8Array,
	    getPrototype = overArg(Object.getPrototypeOf, Object),
	    objectCreate = Object.create,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    splice = arrayProto.splice;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols,
	    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
	    nativeKeys = overArg(Object.keys, Object);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView'),
	    Map = getNative(root, 'Map'),
	    Promise = getNative(root, 'Promise'),
	    Set = getNative(root, 'Set'),
	    WeakMap = getNative(root, 'WeakMap'),
	    nativeCreate = getNative(Object, 'create');

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  this.__data__ = new ListCache(entries);
	}

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	}

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  return this.__data__['delete'](key);
	}

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var cache = this.__data__;
	  if (cache instanceof ListCache) {
	    var pairs = cache.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      return this;
	    }
	    cache = this.__data__ = new MapCache(pairs);
	  }
	  cache.set(key, value);
	  return this;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  // Safari 9 makes `arguments.length` enumerable in strict mode.
	  var result = (isArray(value) || isArguments(value))
	    ? baseTimes(value.length, String)
	    : [];

	  var length = result.length,
	      skipIndexes = !!length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    object[key] = value;
	  }
	}

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return object && copyObject(source, keys(source), object);
	}

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @param {boolean} [isFull] Specify a clone including symbols.
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
	  var result;
	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject(value)) {
	    return value;
	  }
	  var isArr = isArray(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return copyArray(value, result);
	    }
	  } else {
	    var tag = getTag(value),
	        isFunc = tag == funcTag || tag == genTag;

	    if (isBuffer(value)) {
	      return cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	      if (isHostObject(value)) {
	        return object ? value : {};
	      }
	      result = initCloneObject(isFunc ? {} : value);
	      if (!isDeep) {
	        return copySymbols(value, baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = initCloneByTag(value, tag, baseClone, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);

	  if (!isArr) {
	    var props = isFull ? getAllKeys(value) : keys(value);
	  }
	  arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
	  });
	  return result;
	}

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} prototype The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	function baseCreate(proto) {
	  return isObject(proto) ? objectCreate(proto) : {};
	}

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}

	/**
	 * The base implementation of `getTag`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  return objectToString.call(value);
	}

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var result = new buffer.constructor(buffer.length);
	  buffer.copy(result);
	  return result;
	}

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	/**
	 * Creates a clone of `map`.
	 *
	 * @private
	 * @param {Object} map The map to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned map.
	 */
	function cloneMap(map, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
	  return arrayReduce(array, addMapEntry, new map.constructor);
	}

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	/**
	 * Creates a clone of `set`.
	 *
	 * @private
	 * @param {Object} set The set to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned set.
	 */
	function cloneSet(set, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
	  return arrayReduce(array, addSetEntry, new set.constructor);
	}

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    assignValue(object, key, newValue === undefined ? source[key] : newValue);
	  }
	  return object;
	}

	/**
	 * Copies own symbol properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
	  return copyObject(source, getSymbols(source), object);
	}

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return baseGetAllKeys(object, keys, getSymbols);
	}

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	/**
	 * Creates an array of the own enumerable symbol properties of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11,
	// for data views in Edge < 14, and promises in Node.js.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : undefined;

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = array.constructor(length);

	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, cloneFunc, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag:
	      return cloneArrayBuffer(object);

	    case boolTag:
	    case dateTag:
	      return new Ctor(+object);

	    case dataViewTag:
	      return cloneDataView(object, isDeep);

	    case float32Tag: case float64Tag:
	    case int8Tag: case int16Tag: case int32Tag:
	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	      return cloneTypedArray(object, isDeep);

	    case mapTag:
	      return cloneMap(object, isDeep, cloneFunc);

	    case numberTag:
	    case stringTag:
	      return new Ctor(object);

	    case regexpTag:
	      return cloneRegExp(object);

	    case setTag:
	      return cloneSet(object, isDeep, cloneFunc);

	    case symbolTag:
	      return cloneSymbol(object);
	  }
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return baseClone(value, true, true);
	}

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	module.exports = cloneDeep;
} (lodash_clonedeep, lodash_clonedeep.exports));

var cloneDeep = lodash_clonedeep.exports;

const clone = cloneDeep;
function makeEmpty(likeThis, type) {
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
function amend(value, change, form = ABSENT) {
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
            out = Object.assign({}, value);
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

class StandInCollection {
    constructor(store, options) {
        this.compItems = (a, b) => a === b;
        this.compKeys = (a, b) => a === b;
        this.quiet = false;
        this.form = FormEnum.object;
        this.items = [];
        this.keys = [];
        this.size = 0;
        this.type = FormEnum.object;
        this.store = store;
        if (options === null || options === void 0 ? void 0 : options.compKeys) {
            this.compKeys = options === null || options === void 0 ? void 0 : options.compKeys;
        }
        if (options === null || options === void 0 ? void 0 : options.compItems) {
            this.compItems = options === null || options === void 0 ? void 0 : options.compItems;
        }
        this.quiet = !!(options === null || options === void 0 ? void 0 : options.quiet);
    }
    withComp(fn) {
        return fn();
    }
    clear() {
        return this;
    }
    clone(newOptions) {
        return new StandInCollection(clone(this.store), newOptions);
    }
    get c() {
        return this.clone();
    }
    deleteKey(_key) {
        return this;
    }
    deleteItem(_key) {
        return this;
    }
    filter(_action) {
        return this;
    }
    forEach(_action) {
        return this;
    }
    get(_key) {
        return null;
    }
    hasItem(_item) {
        return false;
    }
    hasKey(_key) {
        return false;
    }
    keyOf(_item) {
        return undefined;
    }
    map(_action) {
        return this;
    }
    reduce(_action, _initial) {
        return null;
    }
    reduceC(_action, _initial) {
        return this;
    }
    set(_key, _value) {
        return this;
    }
    sort(_sorter) {
        return this;
    }
    change(newStore) {
        this.store = newStore;
        return this;
    }
    // iterators
    keyIter() {
        return this.keys[Symbol.iterator]();
    }
    itemIter() {
        return this.items[Symbol.iterator]();
    }
    storeIter() {
        return this.store[Symbol.iterator]();
    }
    // prepend/append
    addAfter(_item, _key) {
        return this;
    }
    addBefore(_item, _key) {
        return this;
    }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const simpleComparator = (a, b) => a === b;
// note - Collection is NOT compatible with the full collectionObj signature
class Collection {
    constructor(_store, options) {
        this.quiet = false;
        this._compKeys = simpleComparator;
        this._compItems = simpleComparator;
        // note - does NOT set store, as that should be done at the implementor level, for type reasons
        if (options === null || options === void 0 ? void 0 : options.compKeys) {
            this.compKeys = (options === null || options === void 0 ? void 0 : options.compKeys) || simpleComparator;
        }
        if (options === null || options === void 0 ? void 0 : options.compItems) {
            this.compItems = (options === null || options === void 0 ? void 0 : options.compItems) || simpleComparator;
        }
        this.quiet = !!(options === null || options === void 0 ? void 0 : options.quiet);
    }
    change(newStore) {
        if (typeof newStore === 'function') {
            try {
                const cloned = clone(this.store);
                let updated = newStore(cloned);
                if (updated === undefined) {
                    updated = cloned;
                }
                if (updated === newStore) {
                    throw e('circular change', { newStore, target: this });
                }
                return this.change(updated);
            }
            catch (err) {
                throw e('functional newStore throws error:', {
                    err,
                    newStore,
                    target: this
                });
            }
        }
        const newType = detectType(newStore);
        if (newType !== this.type) {
            throw e('attempt to setStore different type than exists now', {
                target: this,
                newStore,
                type: newType
            });
        }
        return this.update(newStore, 'change');
    }
    update(newStore, source, ...input) {
        try {
            if (!this.quiet && this.onChange && source) {
                this.onChange(newStore, source, input);
            }
        }
        catch (err) {
            console.warn('update: onChange error', err);
            return this;
        }
        this._store = newStore;
        return this;
    }
    sorter(sortFn) {
        return sortFn ? (a, b) => sortFn(a, b, this) : undefined;
    }
    get store() {
        return this._store;
    }
    // options and comparator
    mergeOptions(mergeOptions) {
        if (!mergeOptions) {
            return this.options;
        }
        return Object.assign(Object.assign({}, this.options), mergeOptions);
    }
    get options() {
        return {
            quiet: this.quiet,
            compKeys: this.compKeys,
            compItems: this.compItems
        };
    }
    get compKeys() {
        return this._compKeys || simpleComparator;
    }
    set compKeys(value) {
        if (!isFn(value)) {
            throw e('improper compKeys function', { target: this, fn: value });
        }
        this._compKeys = value;
    }
    get compItems() {
        return this._compItems || simpleComparator;
    }
    set compItems(value) {
        if (!isFn(value)) {
            throw e('improper compItems function', { target: this, fn: value });
        }
        this._compItems = value;
    }
    get form() {
        return detectForm(this._store);
    }
    get type() {
        return detectType(this._store);
    }
    get c() {
        return Collection.create(clone(this._store));
    }
    withComp(action, comp) {
        let out = null;
        const { compKeys, compItems } = this;
        try {
            if (comp.compKeys) {
                this.compKeys = comp.compKeys;
            }
            if (comp.compItems) {
                this.compItems = comp.compItems;
            }
            out = action();
        }
        catch (err) {
            this.compKeys = compKeys;
            this.compItems = compItems;
            throw err;
        }
        return out;
    }
}
// must be overridden before any collections are created with a working create method
Collection.create = (store, options) => (new StandInCollection(store, options));

class Stopper {
    constructor() {
        this.state = stopperEnum.continue;
    }
    get isActive() {
        return this.state === stopperEnum.continue;
    }
    get isStopped() {
        return this.state === stopperEnum.stop;
    }
    get isComplete() {
        return this.state !== stopperEnum.continue;
    }
    get isLast() {
        return this.state === stopperEnum.last;
    }
    // change methods
    final() {
        this.state = stopperEnum.last;
    }
    stop() {
        // stop and DO NOT USE the last returned value
        this.state = stopperEnum.stop;
    }
    stopAfterThis() {
        this.final();
    }
}

class Match {
    static sameKey(key, k2, context, many = true, // individually compare keys if arrays
    debug = false) {
        if (many && Array.isArray(k2)) {
            return k2.some((otherSubKey) => {
                const use = (context === null || context === void 0 ? void 0 : context.compKeys)
                    ? context.compKeys(key, otherSubKey)
                    : key === otherSubKey;
                if (debug) {
                    console.log('MATCH subkey comparison: ', otherSubKey, 'to first key', key, 'result: ', use);
                }
                return use;
            });
        }
        if (!(context === null || context === void 0 ? void 0 : context.compKeys)) {
            return key === k2;
        }
        return context.compKeys(key, k2);
    }
    static sameItem(item, i2, context, many = true) {
        if (!(context === null || context === void 0 ? void 0 : context.compItems)) {
            return item === i2;
        }
        if (many && Array.isArray(i2)) {
            return i2.some((otherSubItem) => {
                let out = false;
                if (context === null || context === void 0 ? void 0 : context.compItems) {
                    out = context.compItems(item, otherSubItem);
                }
                else {
                    out = item === otherSubItem;
                }
                return out;
            });
        }
        return context.compItems(item, i2);
    }
}

class CompoundCollection extends Collection {
    get size() {
        return this.store.size;
    }
    get keys() {
        return this.store.keys();
    }
    get items() {
        return this.store.values();
    }
    hasItem(item) {
        return Array.from(this.items).some((storeItem) => (Match.sameItem(storeItem, item, this)));
    }
    hasKey(key) {
        if (this.store.has(key)) {
            return true;
        }
        const iter = this.keyIter();
        let done = false;
        do {
            const iterValue = iter.next();
            done = !!iterValue.done;
            if (done) {
                break;
            }
            const storeKey = iterValue.value;
            if (Match.sameKey(storeKey, key, this)) {
                return true;
            }
        } while (!done);
        return false;
    }
    set(key, item) {
        let done = false;
        const iter = this.keyIter();
        do {
            const iterValue = iter.next();
            done = !!iterValue.done;
            if (done) {
                break;
            }
            const storeKey = iterValue.value;
            if (Match.sameKey(storeKey, key, this)) {
                this.store.set(storeKey, item);
                return this;
            }
        } while (!done);
        this.store.set(key, item);
        return this;
    }
    get(key) {
        return this.reduce((found, item, itemKey, _store, stopper) => {
            if (Match.sameKey(itemKey, key, this)) {
                stopper.final();
                return item;
            }
            return found;
        }, undefined);
    }
    keyOf(item) {
        const index = this.items.indexOf(item);
        if (index === -1) {
            return undefined;
        }
        return index;
    }
    deleteKey(key) {
        this.store.delete(key);
        return this;
    }
    deleteItem(item) {
        return this.filter((oItem) => !Match.sameItem(oItem, item, this));
    }
    clear() {
        this.store.clear();
        return this;
    }
    filter(filterTest) {
        const tempC = this.clone({ quiet: true }).clear();
        const stopper = new Stopper();
        const iter = this.storeIter();
        let done = false;
        do {
            const iterValue = iter.next();
            done = !!iterValue.done;
            if (done) {
                break;
            }
            const [key, item] = iterValue.value;
            const use = filterTest(item, key, this.store, stopper);
            if (stopper.isStopped) {
                break;
            }
            if (use) {
                tempC.set(key, item);
            }
            if (stopper.isLast) {
                break;
            }
        } while (!done);
        this.update(tempC.store, 'filter', filterTest);
        return this;
    }
    forEach(loop) {
        const stopper = new Stopper();
        const iter = this.storeIter();
        let done = false;
        while (!done) {
            const iterValue = iter.next();
            done = !!iterValue.done;
            if (done) {
                break;
            }
            const [key, item] = iterValue.value;
            loop(item, key, this.store, stopper);
            if (stopper.isComplete) {
                break;
            }
        }
        return this;
    }
    map(loop) {
        const stopper = new Stopper();
        const iter = this.storeIter();
        const nextMapCollection = this.clone({ quiet: true }).clear();
        let done = false;
        while (!done) {
            const iterValue = iter.next();
            done = !!iterValue.done;
            if (done) {
                break;
            }
            const [key, keyItem] = iterValue.value;
            const newItem = loop(keyItem, key, this.store, stopper);
            if (stopper.isComplete) {
                break;
            }
            nextMapCollection.set(key, newItem);
            if (stopper.isComplete) {
                break;
            }
        }
        this.update(nextMapCollection.store, 'map', loop);
        return this;
    }
    reduce(looper, initial) {
        const stopper = new Stopper();
        let out = initial;
        const iter = this.storeIter();
        let done = false;
        while (!done) {
            const iterValue = iter.next();
            done = !!iterValue.done;
            if (done) {
                break;
            }
            const [key, item] = iterValue.value;
            const next = looper(out, item, key, this.store, stopper);
            if (stopper.isStopped) {
                return out;
            }
            out = next;
            if (stopper.isComplete) {
                return next;
            }
        }
        return out;
    }
    // append
    // assume that adding a value by key adds to the end of the item
    addAfter(item, key = ABSENT) {
        if (key === ABSENT) {
            throw new Error('you must define a key to addAfter an item for a compound collection');
        }
        this.set(key, item);
        return this;
    }
    addBefore(item, key = ABSENT) {
        if (key === ABSENT) {
            throw new Error('you must define a key to addAfter an item for a compound collection');
        }
        const temp = this.clone({ quiet: true });
        temp.clear();
        temp.set(key, item);
        this.forEach((fItem, fKey) => {
            if (!this.compKeys(key, fKey)) {
                temp.set(fKey, fItem);
            }
        });
        this.update(temp.store, 'addBefore');
        return this;
    }
    reduceC(action, start) {
        const value = this.reduce(action, start);
        return Collection.create(value);
    }
    removeFirst() {
        const key = this.keys.shift();
        const item = this.get(key);
        this.deleteKey(key);
        return item;
    }
    removeLast() {
        const key = this.keys.pop();
        const item = this.get(key);
        this.deleteKey(key);
        return item;
    }
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

var lodash_tostring = toString;

const simpleTypeOrder = [
    TypeEnum.undefined,
    TypeEnum.null,
    TypeEnum.number,
    TypeEnum.string,
];
function compareTypes(a, b, typeA, typeB) {
    if (!typeA) {
        typeA = detectType(a);
    }
    if (!typeB) {
        typeB = detectType(b);
    }
    if (typeA === TypeEnum.date) {
        if (typeB === TypeEnum.date) {
            return compareTypes(a.getTime(), b.getTime(), TypeEnum.number, TypeEnum.number);
        }
        else {
            return compareTypes(a.getTime(), b, TypeEnum.number, typeB);
        }
    }
    else if (typeB === TypeEnum.date) {
        return compareTypes(a, b.getTime(), typeA, TypeEnum.number);
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
        }
        else {
            return -1;
        }
    }
    else if (typeB === TypeEnum.string) {
        return 1;
    }
    /* eslint-disable no-else-return */
    if (formIsCompound(typeA)) {
        if (formIsCompound(typeB)) {
            return compareTypes(lodash_tostring(a), lodash_tostring(b), TypeEnum.string, TypeEnum.string);
        }
        else {
            return 1;
        }
    }
    else if (formIsCompound(typeB)) {
        return compareTypes(a, lodash_tostring(b), typeA, TypeEnum.string);
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
function compare(a, b) {
    if (a === b) {
        return 0;
    }
    if (isEmpty(a)) {
        if (isEmpty(b)) {
            return 0;
        }
    }
    else if (isEmpty(b)) {
        return 1;
    }
    return compareTypes(a, b);
}

class MapCollection extends CompoundCollection {
    constructor(store, options) {
        super(store, options);
        this.update(store, 'constructor', options);
        this._store = store;
    }
    get(key) {
        if (this._store.has(key)) {
            return this._store.get(key);
        }
        return super.get(key);
    }
    get keys() {
        return Array.from(this.store.keys());
    }
    get items() {
        return Array.from(this.store.values());
    }
    clone(newOptions) {
        return new MapCollection(clone(this._store), this.mergeOptions(newOptions));
    }
    keyOf(item) {
        const key = undefined;
        return this.reduce((foundKey, mItem, mKey, _store, iter) => {
            if (Match.sameItem(mItem, item, this)) {
                iter.final();
                return mKey;
            }
            return foundKey;
        }, key);
    }
    sort(sorter = compare) {
        const map = new Map();
        const sortedKeys = Array.from(this.keys).sort(this.sorter(sorter));
        for (let i = 0; i < sortedKeys.length; i += 1) {
            const key = sortedKeys[i];
            map.set(key, this.store.get(key));
        }
        this.update(map, 'sort', sorter);
        return this;
    }
    hasItem(item) {
        return this.reduce((matches, mItem, _key, _store, iter) => {
            if (Match.sameItem(mItem, item, this)) {
                iter.final();
                return true;
            }
            return matches;
        }, false);
    }
    deleteKey(key) {
        const map = new Map(this.store);
        this.forEach((_item, storeKey, _store, stopper) => {
            if (Match.sameKey(storeKey, key, this, Array.isArray(key))) {
                map.delete(storeKey);
                stopper.stop();
            }
        });
        this.update(map, 'delete', key);
        return this;
    }
    // iterators
    keyIter() {
        return this._store.keys();
    }
    itemIter() {
        return this._store.values();
    }
    storeIter() {
        return this._store.entries();
    }
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  compare: compare,
  Match: Match,
  Stopper: Stopper,
  clone: clone,
  amend: amend,
  makeEmpty: makeEmpty
});

class ScalarCollection extends Collection {
    constructor(store, options) {
        super(store, options);
        this._store = store;
    }
    get size() {
        return 0;
    }
    get(_key) {
        ScalarCollection.err('key');
        return 0;
    }
    set(_key, _item) {
        ScalarCollection.err('set');
        return this;
    }
    hasKey(_item) {
        ScalarCollection.err('hasKey');
        return false;
    }
    hasItem(_item) {
        ScalarCollection.err('hasItem');
        return false;
    }
    keyOf(_item) {
        ScalarCollection.err('keyOf');
        return undefined;
    }
    static err(method) {
        throw new Error(`${method} not available for scalar collection`);
    }
    get keys() {
        ScalarCollection.err('keys');
        return [];
    }
    get items() {
        ScalarCollection.err('items');
        return [];
    }
    deleteKey(_key) {
        ScalarCollection.err('delete');
        return this;
    }
    clear() {
        this.update(undefined, 'clear');
        return this;
    }
    forEach(_action) {
        ScalarCollection.err('forEach');
        return this;
    }
    map(_action) {
        ScalarCollection.err('map');
        return this;
    }
    reduce() {
        ScalarCollection.err('reduce');
        return null;
    }
    appendBefore(_item, _key) {
        ScalarCollection.err('reduce');
        return null;
    }
    appendAfter(_item, _key) {
        ScalarCollection.err('reduce');
        return null;
    }
    addAfter(_item, _key) {
        ScalarCollection.err('addAfter');
        return this;
    }
    addBefore(_item, _key) {
        ScalarCollection.err('addAfter');
        return this;
    }
    clone(opts) {
        return new ScalarCollection(clone(this.store), this.mergeOptions(opts));
    }
    deleteItem(_item) {
        ScalarCollection.err('deleteItem');
        return this;
    }
    filter(_action) {
        ScalarCollection.err('filter');
        return this;
    }
    itemIter(_fromIter) {
        ScalarCollection.err('itemIter');
        return [].entries();
    }
    keyIter(_fromIter) {
        ScalarCollection.err('keyIter');
        return [].entries();
    }
    reduceC(_action, _initial) {
        ScalarCollection.err('reduceC');
        return this;
    }
    sort(_sorter) {
        ScalarCollection.err('sort');
        return this;
    }
    storeIter(_fromIter) {
        ScalarCollection.err('keyIter');
        return [].entries();
    }
}

/**
 * this is the base class for items in which the keys are not named strings but are
 * implicit order numbers - such as Arrays and the character indexes of strings.
 */
class IntIndexedCollection extends Collection {
    get keys() {
        const out = [];
        for (let i = 0; i < this.size; i += 1) {
            out.push(i);
        }
        return out;
    }
    forEach(action) {
        const stopper = new Stopper();
        const originalValue = this.store;
        const items = this.items;
        for (let i = 0; i < this.size; i += 1) {
            action(items[i], i, originalValue, stopper);
            if (stopper.isStopped) {
                break;
            }
        }
        return this;
    }
    map(looper) {
        const stopper = new Stopper();
        const newStore = [];
        const iter = this.storeIter();
        let done = false;
        do {
            const iterValue = iter.next();
            done = iterValue.done;
            if (done) {
                break;
            }
            const [key, keyItem] = iterValue.value;
            const item = looper(keyItem, key, this._store, stopper);
            if (stopper.isStopped) {
                break;
            }
            newStore[key] = item;
            if (stopper.isComplete) {
                break;
            }
        } while (!done);
        this.update(newStore, 'map', looper);
        return this;
    }
    reduce(looper, initial) {
        const stopper = new Stopper();
        const iter = this.storeIter();
        let out = initial;
        let done = false;
        do {
            const iterValue = iter.next();
            done = iterValue.done;
            if (done) {
                break;
            }
            const [key, keyItem] = iterValue.value;
            const next = looper(out, keyItem, key, this._store, stopper);
            if (stopper.isStopped) {
                break;
            }
            out = next;
            if (stopper.isComplete) {
                break;
            }
        } while (!done);
        return out;
    }
    reduceC(looper, start) {
        const out = this.reduce(looper, start);
        return Collection.create(out);
    }
    // iterators
    storeIter() {
        return this._store.entries();
    }
    keyIter() {
        return this._store.keys();
    }
    itemIter() {
        return this._store.values();
    }
}

class StringCollection extends IntIndexedCollection {
    constructor(store, options) {
        super(store, options);
        this._store = store;
    }
    // region inspection
    get size() {
        return this.store.length;
    }
    get items() {
        return this.store.split('');
    }
    hasItem(str) {
        if (str instanceof RegExp) {
            return str.test(this.store);
        }
        return this.store.includes(str);
    }
    hasKey(i) {
        if (i % 1) {
            return false;
        }
        return i >= 0 && i < this.size;
    }
    keyOf(item) {
        const indexOf = this.store.indexOf(item);
        if (indexOf === -1) {
            return undefined;
        }
        return indexOf;
    }
    // endregion
    // region changes
    /**
     * acts like array.splice; inserts a string into/over part of the item;
     * @param key
     * @param item
     */
    set(key, item) {
        const prefix = this.store.substring(0, key) || '';
        const suffix = this.store.substring(key + Math.max(item.length, 1)) || '';
        this.update(prefix + item + suffix, 'set', key, item);
        return this;
    }
    get(key) {
        if (key < 0 || key > this.size) {
            return undefined;
        }
        return this.store.substring(key, key + 1);
    }
    deleteKey(key) {
        if (Array.isArray(key)) {
            return this.filter((_item, itemKey) => !Match.sameKey(itemKey, key, this));
        }
        return this.set(key, '');
    }
    deleteItem(item) {
        if (Array.isArray(item)) {
            const cloned = this.clone({ quiet: true });
            cloned.filter((otherItem) => !Match.sameItem(otherItem, item, this));
            this.update(cloned.store, 'deleteItem', item);
        }
        let newStore = this.store;
        let length = newStore.length;
        do {
            length = newStore.length;
            newStore = newStore.replace(item, '');
        } while (newStore && newStore.length < length);
        this.update(newStore, 'deleteItem', item);
        return this;
    }
    clear() {
        this.update('', 'clear');
        return this;
    }
    reverse() {
        return new StringCollection(this.items.reverse().join(''));
    }
    // note - this is the one version of sort where the item types are known to be 1-char strings
    // so the default array sort works fine as a default
    sort(sort) {
        const letters = Collection.create(this.store.split(''), this.mergeOptions({ quiet: true }));
        letters.sort(this.sorter(sort));
        this.update(letters.store.join(''), 'sort', sort);
        return this;
    }
    // endregion
    // region iteration
    // endregion
    // region duplication
    clone(options) {
        return new StringCollection(this.store, this.mergeOptions(options));
    }
    filter(filterTest) {
        const newStore = this.reduce((memo, letter, key, _original, stopper) => {
            const use = filterTest(letter, key, this.store, stopper);
            if (use && stopper.isActive) {
                return `${memo}${letter}`;
            }
            return memo;
        }, '');
        this.update(newStore, 'filter', filterTest);
        return this;
    }
    // endregion
    // region boolean
    difference(itemsToRemove, _mode = booleanMode.byKey) {
        if (typeof itemsToRemove === 'string' || Array.isArray(itemsToRemove)) {
            const next = new StringCollection(this.store);
            next.deleteItem(itemsToRemove);
            return next;
        }
        return this.difference(itemsToRemove.store);
    }
    union(other, _mode = booleanMode.byKey) {
        if (typeof other === 'string') {
            return this.union(other.split(''));
        }
        if (Array.isArray(other)) {
            const chars = [...this.items, ...other];
            const unique = chars.reduce((memo, char) => {
                if (memo.includes(char)) {
                    return memo;
                }
                return memo + char;
            }, '');
            return new StringCollection(unique);
        }
        return this.union(other.store);
    }
    map(looper) {
        const stopper = new Stopper();
        const newStore = [];
        const iter = this.storeIter();
        let done = false;
        do {
            const iterValue = iter.next();
            done = iterValue.done;
            if (done) {
                break;
            }
            const [key, keyItem] = iter.value;
            const item = looper(keyItem, key, this._store, stopper);
            if (stopper.isStopped) {
                break;
            }
            newStore.push(item);
            if (stopper.isComplete) {
                break;
            }
        } while (!done);
        this.update(newStore.join(''), 'map', looper);
        return this;
    }
    intersection(other) {
        if (typeof other === 'string') {
            return this.intersection(other.split(''));
        }
        if (Array.isArray(other)) {
            const unique = this.items.filter((char) => other.includes(char));
            return new StringCollection(unique.join(''));
        }
        return this.intersection(other.items);
    }
    // endregion
    storeIter() {
        return this.items.entries();
    }
    keyIter() {
        return this.keys[Symbol.iterator]();
    }
    itemIter() {
        return this.items[Symbol.iterator]();
    }
    // append/prepend
    addAfter(item, _key) {
        this.update(`${this.store}${item}`, 'addBefore');
        return this;
    }
    addBefore(item, _key) {
        this.update(`${item}${this.store}`, 'addBefore');
        return this;
    }
    removeFirst() {
        const item = this.store.substring(0, 1);
        const rest = this.store.substring(1);
        this.update(rest, 'removeFirst');
        return item;
    }
    removeLast() {
        const item = this.store.substring(this.size - 1);
        const rest = this.store.substring(0, this.size - 1);
        this.update(rest, 'removeLast');
        return item;
    }
}

class ArrayCollection extends IntIndexedCollection {
    constructor(store, options) {
        super(store, options);
        this.update(store, 'constructor');
        this._store = store; // because typescript is a weak chump
    }
    get size() {
        return this.store.length;
    }
    get items() {
        return [...this.store];
    }
    get(key) {
        return this.store[key];
    }
    set(key, item) {
        const next = [...this.store];
        next[key] = item;
        this.update(next, 'set', key, item);
        return this;
    }
    keyOf(item) {
        let index = this.store.indexOf(item);
        if (index === -1) {
            index = undefined;
        }
        return index;
    }
    hasItem(item) {
        return this.store.includes(item);
    }
    clear() {
        this.update([], 'clear');
        return this;
    }
    deleteKey(key) {
        return this.filter((_item, oKey) => !Match.sameKey(oKey, key, this));
    }
    deleteItem(item) {
        return this.store.filter((sItem) => !Match.sameItem(sItem, item, this));
    }
    hasKey(key) {
        return key >= 0 && key < this.size && !(key % 1);
    }
    sort(sortFn = compare) {
        this.update(this.store.sort(this.sorter(sortFn)), 'sort', sortFn);
        return this;
    }
    clone(newOptions) {
        return new ArrayCollection([...this.store], this.mergeOptions(newOptions));
    }
    filter(filterTest) {
        const stopper = new Stopper();
        const newStore = [];
        for (let i = 0; i < this.size; i += 1) {
            const item = this.get(i);
            const use = filterTest(item, i, this.store, stopper);
            if (stopper.isStopped) {
                break;
            }
            if (use) {
                newStore.push(item);
            }
            if (stopper.isLast) {
                break;
            }
        }
        this.update(newStore, 'filter', filterTest);
        return this;
    }
    // append/prepend
    addAfter(item, _key) {
        this.update([...this.store, item], 'addBefore');
        return this;
    }
    addBefore(item, _key) {
        this.update([item, ...this.store], 'addBefore');
        return this;
    }
    removeFirst() {
        const list = [...this.store];
        const item = list.shift();
        this.update(list, 'removeFirst');
        return item;
    }
    removeLast() {
        const list = [...this.store];
        const item = list.pop();
        this.update(list, 'removeFirst');
        return item;
    }
}

class ObjectCollection extends CompoundCollection {
    constructor(store, options) {
        super(store, options);
        this.update(store, 'constructor', options);
        this._store = store;
    }
    get size() {
        return Array.from(this.keys).length;
    }
    get keys() {
        return Array.from(Object.keys(this.store));
    }
    get items() {
        return Array.from(Object.values(this.store));
    }
    get(key) {
        return this.store[key];
    }
    set(key, item) {
        this._store[key] = item;
        return this;
    }
    keyOf(item) {
        const keys = this.keys;
        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            const oItem = this.get(key);
            if (Match.sameItem(oItem, item, this)) {
                return key;
            }
        }
        return undefined;
    }
    hasItem(item) {
        return this.items.some((oItem) => Match.sameItem(oItem, item, this));
    }
    hasKey(key) {
        return this.keys.some((oKey) => Match.sameKey(oKey, key, this));
    }
    clear() {
        this.update({}, 'clear');
        return this;
    }
    deleteKey(key) {
        const store = Object.assign({}, this.store);
        delete store[key];
        this.update(store, 'deleteKey', key);
        return this;
    }
    // this is a little dicey but...
    sort(sortFn = compare) {
        const keyArray = Array.from(this.keys).sort(this.sorter(sortFn));
        const newStore = {};
        keyArray.forEach((key) => {
            newStore[key] = this.get(key);
        });
        this.update(newStore, 'sort', sortFn);
        return this;
    }
    clone(newOptions) {
        return new ObjectCollection(clone(this._store), this.mergeOptions(newOptions));
    }
    // iterators
    keyIter() {
        return Object.keys(this.store)[Symbol.iterator]();
    }
    itemIter() {
        return Object.values(this.store)[Symbol.iterator]();
    }
    storeIter() {
        return Object.entries(this.store)[Symbol.iterator]();
    }
    // append/prepend
    // assume that adding a value by key adds to the end of the item
    addAfter(item, key) {
        if (key === undefined) {
            throw new Error('you must define a key to addAfter an item for a compound collection');
        }
        this.set(String(key), item);
        return this;
    }
    addBefore(item, key) {
        if (key === undefined) {
            throw new Error('you must define a key to addAfter an item for a compound collection');
        }
        const temp = this.clone({ quiet: true });
        temp.clear();
        temp.set(String(key), item);
        this.forEach((fItem, fKey) => {
            if (!this.compKeys(key, fKey)) {
                temp.set(fKey, fItem);
            }
        });
        this.update(temp.store, 'addBefore');
        return this;
    }
}

class SetCollection extends Collection {
    constructor(store, options) {
        super(store, options);
        this._store = store;
    }
    clear() {
        this.update(new Set(), 'clear');
        return this;
    }
    clone(options) {
        return new SetCollection(new Set(this.store), this.mergeOptions(options));
    }
    deleteItem(item) {
        const store = new Set(this._store);
        store.delete(item);
        this.update(store, 'deleteItem');
        return this;
    }
    deleteKey(key) {
        if (Array.isArray(key)) {
            const store = this.reduce((memo, item, rKey) => {
                if (!key.includes(rKey)) {
                    memo.add(item);
                }
                return memo;
            }, new Set());
            this.update(store, 'deleteKey');
            return this;
        }
        if (this.hasKey(key)) {
            const item = this.get(key);
            const set = new Set(this._store);
            set.delete(item);
            this.update(set, 'deleteKey');
        }
        return this;
    }
    add(item) {
        const store = new Set(this._store);
        store.add(item);
        return this.update(store, 'add');
    }
    filter(action) {
        const newSet = new Set(this._store);
        this.forEach((item, key, store, stopper) => {
            const use = action(item, key, store, stopper);
            if (stopper.isActive && use) {
                newSet.add(item);
            }
        });
        this.update(newSet, 'filter');
        return this;
    }
    forEach(action) {
        const set = this.clone(this.mergeOptions({ quiet: true }));
        const stopper = new Stopper();
        const iter = set.storeIter();
        let done = false;
        do {
            const iterValue = iter.next();
            done = !!iterValue.done;
            if (done)
                break;
            const [iterKey, iterItem] = iterValue.value;
            action(iterItem, iterKey, this.store, stopper);
            if (!stopper.isActive) {
                break;
            }
        } while (!done);
        return this;
    }
    get(key) {
        if (this.size <= key) {
            return undefined;
        }
        return this.items[key];
    }
    hasItem(item) {
        if (this.store.has(item)) {
            return true;
        }
        return this.reduce((memo, value, _key, _store, stopper) => {
            if (this.compItems(value, item)) {
                stopper.final();
                return true;
            }
            return memo;
        }, false);
    }
    hasKey(key) {
        return typeof key === 'number' && this.size > key;
    }
    itemIter() {
        return this.store.values();
    }
    keyIter() {
        const keys = [];
        for (let i = 0; i < this.size; i += 1) {
            keys.push(i);
        }
        return Collection.create(keys).keyIter();
    }
    keyOf(item) {
        if (!this.hasItem(item)) {
            return undefined;
        }
        return this.reduce((memo, reduceItem, key, _store, stopper) => {
            if (this.compItems(item, reduceItem)) {
                stopper.final();
                return key;
            }
            return memo;
        }, undefined);
    }
    map(action) {
        const newItems = new Set();
        this.forEach((item, key, _store, stopper) => {
            const newItem = action(item, key, this.store, stopper);
            if (stopper.isActive) {
                newItems.add(newItem);
            }
        });
        this.update(newItems, 'map');
        return this;
    }
    reduce(action, initial) {
        const arrayStore = Collection.create(this.items, this.options);
        const subAction = (memo, item, key, _store, stopper) => action(memo, item, key, this.store, stopper);
        return arrayStore.reduce(subAction, initial);
    }
    reduceC(action, initial) {
        return this.c.reduce(action, initial);
    }
    set(key, item) {
        console.warn('set key/value has unpredictable results on a set collection; use add(item) for consistent results');
        if (key > this.size) {
            return this.add(item);
        }
        return this.map((mapItem, mapKey) => {
            if (mapKey === key) {
                return item;
            }
            return mapItem;
        });
    }
    sort(sorter) {
        const arrayOfItems = Collection.create(this.items, this.options);
        arrayOfItems.sort(sorter);
        this.update(new Set(arrayOfItems.store), 'sort');
        return this;
    }
    storeIter() {
        return Collection.create(this.items).storeIter();
    }
    get items() {
        return Array.from(this.store.values());
    }
    get keys() {
        const keys = [];
        for (let i = 0; i < this.size; i += 1)
            keys.push(i);
        return keys;
    }
    get size() {
        return this.store.size;
    }
    // append/prepend
    addAfter(item, _key) {
        const set = new Set(this.store);
        set.add(item);
        this.update(set, 'addBefore');
        return this;
    }
    addBefore(item, _key) {
        const set = new Set([item, ...this.items.filter((other) => !this.compItems(other, item))]);
        this.update(set, 'addBefore');
        return this;
    }
    removeFirst() {
        const set = new Set(this.store);
        const item = this.keys.shift();
        set.delete(item);
        this.update(set, 'removeFirst');
        return item;
    }
    removeLast() {
        const set = new Set(this.store);
        const item = this.keys.pop();
        set.delete(item);
        this.update(set, 'removeFirst');
        return item;
    }
}

var create = (store, options) => {
    let out;
    switch (detectType(store)) {
        case FormEnum.map:
            out = new MapCollection(store, options);
            break;
        case TypeEnum.string:
            out = new StringCollection(store, options);
            break;
        case FormEnum.array:
            out = new ArrayCollection(store, options);
            break;
        case FormEnum.object:
            out = new ObjectCollection(store, options);
            break;
        case FormEnum.set:
            out = new SetCollection(store, options);
            break;
        default:
            out = new ScalarCollection(store, options);
    }
    return out;
};

Collection.create = create;

export { constants_export as constants, create, create as default, constants as enums, index as utils };
//# sourceMappingURL=collections.esm.js.map
