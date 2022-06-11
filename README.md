# @wonderlandlabs/Collect LOCAL

[web docs](https://collect-docs.vercel.app/) are actually more likely to be up to date than these documents

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
import { create } from '@#wonderlandlabs.collect';

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

Cloning the _collection_ also clones the _collection store_ using [`lodash.cloneDeep()`](https://lodash.com/docs/4.17.15#cloneDeep). 
This breaks all references in the store and its contents recursively. 

The `reduce` method is kind of an outlier in that its return type is often not limited to compound values, so it returns 
a value. If you know for a fact that your reduce method *is* returning a compound, call `.reduceC'`, 
which calls reduce and puts its output into a new collection in a single call. 

Any method that does not return a needed value (eg, get, ) returns undefined.

## API 


[web docs](https://collect-docs.vercel.app/) is the *definitive* documenation on all public methods

## Comparators

Every time elements are compared, for say getKey, hasKey, set, etc., the comparators of the store , `compKeys` and `compItems`,
are used to determine if a candidate matches a target. As the earlier example shows, you can write your own comparators and 
improve (or at least, change) the comparison technique. 
