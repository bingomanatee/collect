# Collect

Javascript has several compound objects, sets, Maps, and arrays; they are all "dictionaries" that have multiple values connected 
with keys, that can be added, deleted or iterated over. However, they don't have the same interface; because of this, 
your code can be very heterogeneous. 

Collect aims to make accessing collections easier by enforcing APIs to multiple structures. 

This is similar to the lodash _() object; however Lodash doesn't include Set and Map as collection bases, 
and doesn't include introspection methods identifying the base collection type. 

## Why does this exist?

* There's a bunch of "bridge" functions and detached systems to introspect, change and modify\
  elements depending on the type of store I used. (I created a function called mapReduce  \
  to apply "reduce" to a Map class -- not helping). Most do not incorporate newer structures like Set and Map.
* provide an interruptable version of forEach, reduce, map.
* "typeof" not granular enough
* checks like "has" are inconsistent and key-centric; Colletions have hasKey and hasItem for more specific coverage
* Iterators are not complete or consistent across all store types
* can't do boolean operations on Sets! You'd think that was a fundamental thing. (boolean code to come)
* comparators for many of these operations are locked in compiler code resulting in some unsatisfactory results:

```javascript
const twoDStore = new Map();

function store3DPoint(x, y, z) {
  const key = { x, y };
  const data = { x, y, z };
  const others = twoDStore.has(key) ? twoDStore.get(key) : [];
  twoDStore.set(key, [data, ...others]);
}

store3DPoint(0, 0, 1);
store3DPoint(0, 0, 2);
store3DPoint(0, 0, 3);

console.log('twoDStore:', twoDStore);

/**
 *  Map(3) {
  { x: 0, y: 0 } => [ { x: 0, y: 0, z: 1 } ],
  { x: 0, y: 0 } => [ { x: 0, y: 0, z: 2 } ],
  { x: 0, y: 0 } => [ { x: 0, y: 0, z: 3 } ]
}

 */
```
Why are all the points stored differently? Because the key identity test is using _referential_ comparison. 
But because comparators are part of the collection api you can do this:

```javascript

const mapStore = create(new Map(), {
  compKeys(key1, key2) {
    return key1.x === key2.x && key1.y === key2.y;
  },
});

function store3DPoint(x, y, z) {
  const key = { x, y };
  const data = { x, y, z };
  const others = mapStore.hasKey(key) ? mapStore.get(key) : [];
  mapStore.set(key, [...others, data]);
}

store3DPoint(0, 0, 1);
store3DPoint(0, 0, 2);
store3DPoint(0, 0, 3);

console.log(mapStore.get({ x: 0, y: 0 }));
/**
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: 2 },
  { x: 0, y: 0, z: 3 },
]);
*/
```

The same example works with sets - you can keep adding the same "content" objects into a set and because they are reference based,
the set will keep growing. 

A lot of the terms are ambiguous. Does `myMap.has(item)` mean that the item is a key, or the item is contained in the map?
does `myMap.delete(3)` delete the key 3, or keys whose items === 3? 

It's also never quite clear when you are doing something that messes with the original store or returning a new reference.
`Array.reverse()`, for instance, returns the same reference; `Array.sort()` does not. As the store is always a sub-reference
of the collection, All the collection-returning methods return the target collection; but generally, every time a store
is altered (map, reverse, filter, delete), the collection's store is a new reference.

Are these huge important differences? Mostly not until they are. 

## What is a collection? 

A collection is most fundamentally a thing holder. The term for this sort of structure is 
a _map_ or a _dictionary_: that is a set of **items** referenced by **keys**. 
This is a concrete expression of a mathematical **function** -- for each key, there is one and only one item. 
The reverse is not true - an item may appear under more than one key. 

Another synonym for collection is **store** -- that is the property that the javascript object 
is kept at in the collection classes;

The terms used here are worth listing:

* a collections' **store** is the javascript artifact that stores the values in the collection; \
  this includes maps, sets, arrays, objects.
* the collection contains zero or more items -- in an array like `[10, 20, 30]`, 10, 20, and 30 are **items**. 
* the "address" of the items in the collections are called **keys**. In the above array the keys are 0, 1, and 2. 
* the count of items in the collection are its **size**. In arrays, this is indicated by the `.length` property.
* attaching an item to a collection with a key is sometimes referred to as **associating** the item with the collection.

### Collection order

Collections may but are not always, be _ordered;_ that is, the items in the collection occur in a specific _sequence._
An Array is a clearly ordered collection. A string is clearly ordered as well. Others, like Objects or Maps, are not
strictly ordered; there is no guarantee in which order `Object.keys()`' values are returned, given that properties may
be added on the fly, inherited, or even (with proxies) dynamic.

```javascript
/*

Store        Ordered      Keyed       Item            Key
Type                                  inclusion Test  inclusion test 
------------------------------------------------------------------------------------------------------------
_Set         no           no          yes            (N/A)             "its a pocket of things"
Array        yes          posints     yes            no(2)             "its a rolodex of cards"
String       yes          yes         yes_           no(3)              "its a list of letters"
Object       no           strings     no             yes               "its a dictionry of words (and words my dad knows)"
Map          yes(1)       any(3)      no             yes               "its a free association of stuff with stuff"

 */
```
1. items' keys in a map are ordered in the same order they came in, but this is really not a design feature of a map \
   nor a quality of a set theory map.
2. you can _indirectly_ test for keys with length knowing all arrays start with zero.
   But you aren't guaranteed that there is a thing in a given index til you get it.
3. The Javascript Map can hold anything; Collection Maps cannot have **arrays** as keys. 

it's also worth noting - collections are _one-dimensional_ - you have a single index, even if the index of a map can be compound. 
By contrast a database can create compound indexes, made of two or more items. 

### A note on strings

Strings are *structurally* a scalar; they are not a container. But they may also be thought of as an *array of characters*,
and this library treats them as such; the keys of a string are the offset of each character; so much of programming
concerns manipulating strings as a collection that strings are treated as a collection, even though academically, 
they are not. 

### A note on Objects

Object stores are recreated and destructured at the first change event; do not put complex instances, DOM objects, etc.
into a collection and expect it to maintain referential identity. You can do so to inspect or iterate over them, but
the first time you filter, map, delete or reduce them, the object in the store is not going to be your initial target.

### Sets

Sets are the most sparse collection that exists; they have no keys, or definitive order; they are simply a "bag of items",
that exists to represent item membership in a collection. A Set may be thought of as a _team_. Players on a team are 
not required to belong to the team by any order; for instance in a choir the singers are not keyed in any way, they are simply "there."

Sets don't really have keys, or the ability to "get by key"; an attempt is made to do so by iteration, but you
should NOT trust that you are getting the right one when you call `mySetCollection.get(3)`.

### Iteration

Iteration is the process of "walking through" a collection, performing an operation based on the item/value pairs, 
one pair at a time. (except for sets, in which case you just walk the items). You may not be required to walk through 
the entire collection; you may want to stop, for instance, if you are searching for a key/item with a specific quality. 
Unfortunately in standard iteration functions in Javascript, (reduce, map, forEach) you cannot "bail" halfway through. 
In this library, a "stopper" instance is passed into each iteration, that allows you to "bail" out of an iteration midway. 

* `forEach` calls a looping function with the key/value of a single asociation. Unlike javascript forEaches, it comes with a stopper. 

## collection API

The Collection API is a collection of several groups of methods or properties. To instantiate a Collection index call
`create(store)`; this will return a Collection subclass dedicated to parsing a specific javascript element. 

**key**

Depending on your store, your keys may be limited to being strings or numbers; arrays require numeric
keys, where objects require string keys. 
Maps can take virtually anything as a key: symbols, objects, etc. 
However in collections **DO NOT USE ARRAYS AS KEYS**. This can confuse methods like delete which will break apart arrays 
passed in the keys field and treat the array contents as individual keys. 

### Targeting/store reference, return value

Any method that changes the data operates on a new store. That includes set, delete, filter, map, sort, etc. 
If yuu want to retain a reference to the old version, call `.clone()` on the collection to get a new copy 
of the collection(based on clone of the store) before calling your operation. For convenience, there is a '.c' 
property that is an alias to clone. 

The `reduce` method is kind of an outlier in that its return type is often not limited to compound values, so it returns 
a value. If you know for a fact that your reduce method *is* returning a compound, call `.reduceC'`, 
which calls reduce and puts its output into a new collection in a single call. 

Any method that does not return a needed value (eg, get, ) returns undefined.

### Reflection

### (type)
These Properties express the keys/items in discrete collections or identify the type or form
of the store. They are all informational - none of these methods alter the store or its content at all.

* **store**: the actual physical artifact in which the keys and items are stored. 
* **form**: an identifier for the fundamental structural form of the store. (see 'form and type' below)
* **type**: a more specific version of form, including more categories for scalar vales. 
* **size**: (number) a count of the stores' items

**Form** is a more constrained identifier for the basic class of the store; it includes 'map', 'store', etc.,
but does _not discriminate between different classes of scalar values; i.e., numbers, strings, Dates, and
Symbols are all considered 'scalar'.

**Type** on the other hand includes a detailed subset of different scalar types -- as well as all the identifiers
present in Form.

type and form identifications are **not** identical to `typeof` identifiers; it's much more specific about 'object' for instance -
it qualifies object types into 'array', 'set', 'map', 'object' and 'null'.

#### reflection (item/key)

* **hasItem(item)**: (boolean) indicates whether an item is present in the collection
* **hasKey**: (boolean) indicates the presence of a key in the store. 
* **hasItem**: (boolean) indicates the presence of an item in the store
* **keys**: any[] A list of the keys in the collection
* **items**: any[] a list of the items in the collection
* **keyOf(item)**: (key | undefined) the key under which an item is stored; undefined if the collectioon doesn't have the item
* **get(key)**: (item | undefined) retrieves the item stored at the provided key. 

note that keys and items are _arrays_ of values, that you can mess with in any way you want, sort, map, whatever. 
If you want to traverse the values, see Iterators below. 

### Cloning

cloning produces a new collection - identical to this one; it clones not only the Collection instance, but the store.
The store is _shallow cloned_ -- meaning for instance, if you have an object in the target collection, the cloned collection
will have a _different_ array that contains the _exact same_ object - by reference. If you want to break object references,
use `myArrayCollection.c.map((item) => ({...itemn})` which will deconstruct and break references to each object in the collection. 

* **clone()**: (new collection) returns a new Collection instance with a **cloned copy of the store** in the target collection,
* **c**: a property identical to clone(); but terser in chains. 

### Changes 

these methods _do_ modify the store, adding, deleting, or changing one or more key/value pairs. 

* **set(key, item)**: (self) upserts a key/value pair into the store. 
* **deleteKey(key: any | any[])**: (self) removes an item from the collection. \
  You can also pass in an array of keys to delete several keys at once. 
* **deleteItem(item: any | any[])**: (self) removes one or more items from the collection. \
  If the item is present under more than one key, it removes all references. 
* **clear()**: (self) removes ALL items from the collection;
* **sort(orderingFn)**: (self) reorders elements.
* **reverse()**: (self) A specialized sort that reverses the order of the items in the collection.

### Iteration and Stoppers

Iteration "walks over" the items in the array. Unlike `forEach` methods, iteration methods can stop at any point. 
The final argument in the looping function is an Stopper instance; you can call `stopper.stop()` or `stopper.final()` to
interrupt the looping at any point. 

the difference between `stop()` and `final()` calls is important: 
* If you call `stop()`, the _current return value of the looper is not used._ 
* If you call `stopAfterThis()`, the current return value of the looper function **is used** -- but **no other additional loops will occur**.\
  A synonym for `stopAfterThis()` is `final()`.

Think of iteration like a "bookmark" where `.keys` is like photocopying the page number of each page of a book and putting it in a stack. 

In several cases the store itself is an argument to the looper. It is provided _for informational purposes only._
Do not modify the store from the inside of the looping function.

#### Looper methods
All these methods have the (almost) same interface and behavior -- they go over each key?item pair until you stop the flow, or reach the end. 

* **forEach((item, key, store, stopper) => {... custom content} => void)**: (self) allows you to walk across \
  all the keys and values of the store. `forEach` is for extraction of data - it's not a good idea to modify \
  the store or collection inside a forEach pass. The return value of the looping function is ignored. 
* **map((looper: item, key, store, stopper) => newItem)**: (self) modifies the keys in the store to have new values. the keys stay the same(1) \
  but you will have whatever items the looper returns assigned to those keys.
* **filter(tester: (item, key, store, stopper) => boolean)**: (self) removes all keys and values for which the tester function returns falsy. \
  also removes all key/values after the stopper is stopped. 
* **reduce(reducer: (memo, item, key, store, stopper) => any, initialValue?: any)**: (any) returns a raw object; can be any sort of ting \
  the output of the reduce function is the _last output return value_ of the looper.
* **reduceC(reducer: (memo, item, key, store, stopper) => any, initialValue?: any)** :(Collection) returns a new collection with the  result of reduce as a store. \
There is no guarantee that the result of reduce will be a compound type, which is why there is a seperate reduceC function; \
use that function only if you know for sure that the reducer produces an iterable item -- or, if you want to use the type/form properties
for introspection. 

#### Iterator hooks

This is another shim; not all store types have
[iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)... 
so we force them to here.

The point of iterators is that unlike the `.keys` and `.values` properties which collect ALL the keys/values, 
iterators are just reference pointers that crawl along, getting another value one at a time until the end. 

This takes less memory, as you don't have to have array(s) of values manufactured each time you execute a routine. 
And if you interrupt the process mid way through, you don't waste time collecting values you don't need.

* **keyIter()**: (Iterator) an iterator over the keys. 
* **itemIter()**: (Iterator) an iterator over the items.
* **storeIter()**: (Iterator) an iterator over the store. 
------
(1) If you call stopper, any keys after that loop will be removed. 

### (@TODO) Boolean functions

These methods will blend two collections and produce a third collection, using classical set theory/boolean
methods.

## Comparators

Every time elements are compared, for say getKey, hasKey, set, etc., the comparators of the store , `compKeys` and `compItems`,
are used to determine if a candidate matches a target. As the earlier example shows, you can write your own comparators and 
improve (or at least, change) the comparison technique. 
