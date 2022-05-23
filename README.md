# Collect

Javascript has several compound objects, sets, Maps, and arrays; they are all "dictionaries" that have multiple values connected 
with keys, that can be added, deleted or iterated over. However, they don't have the same interface; because of this, 
your code can be very heterogeneous. 

Collect aims to make accessing collections easier by enforcing APIs to multiple structures. 

This is similar to the lodash _() object; however Lodash doesn't include Set and Map as collection bases, 
and doesn't include introspection methods identifying the base collection type. 

## What is a collection? 

A collection is most fundamentally an object that contains multiple items. The term for this sort of structure is 
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

### A note on strings

Strings are *structurally* a scalar; they are not a container. But they may also be thought of as an *array of characters*,
and this library treats them as such; the keys of a string are the offset of each character; so much of programming
concerns manipulating strings as a collection that strings are treated as a collection, even though academically, 
they are not. 

### Sets

Sets are the most sparse collection that exists; they have no keys, or definitive order; they are simply a "bag of items",
that exists to represent item membership in a collection. A Set may be thought of as a _team_. Players on a team are 
not required to belong to the team by any order; for instance in a choir the singers are not keyed in any way, they are simply "there."


### Iteration

Iteration is the process of "walking through" a collection, performing an operation based on the item/value pairs, 
one pair at a time. (except for sets, in which case you just walk the items). You may not be required to walk through 
the entire collection; you may want to stop, for instance, if you are searching for a key/item with a specific quality. 
Unfortunately in standard iteration functions in Javascript, (reduce, map, forEach) you cannot "bail" halfway through. 
In this library, a "stopper" instance is passed into each iteration, that allows you to "bail" out of an iteration midway. 

* `forEach` calls an function with the key/value of a single pair

## collection API

The Collection API is a collection of several groups of methods or properties. To instantiate a Collection index call
`create(store)`; this will return a Collection subclass dedicated to parsing a specific javascript element. 

**key**

Depending on your store, your key choices may be constrianed to strings or numbers; arrays require numeric
keys, where objects require string keys. Maps can take virtually anything as a key: symbols, objects, etc. 
however in this module **DO NOT USE ARRAYS AS KEYS**. This can confuse methods like delete which will break apart
arrays passed in the keys field and treat the array contents as individual keys. 

### Reflection

**reflection** properties express the keys/items in discrete collections or identify the type or form
of the store. They are all informational - none of these methods alter the store or its content at all. 

Inclusion tests uses `===` to compare candidates to members in hasKey/hasItem. 

* **store**: the actual physical artifact in which the keys and items are stored. 
* **form**: an identifier for the fundamental structural form of the store. (see 'form and type' below)
* **type**: a more specific version of form, including more categories for scalar vales. 
* **size**: (number) a count of the stores' items
* **hasItem(item)**: (boolean) indicates whether an item is present in the collection
* **hasKey**: (boolean) indicates the presence of a key in the store. 
* **keys**: any[] A list of the keys in the collection
* **items**: any[] a list of the items in the colleciton
* **keyOf(item)**: (key | undefined) the key under which an item is stored; returs undefined if the colleciton doesn't have the item
* **get(key)**: (item | undefined) retrieves the item stored at the provided key. 
### Changes 

these methods _do_ modify the store, adding, deleting, or changing one or more key/value pairs. 

* **set(key, item)**: (self) upserts a key/value pair into the store. 
* **delete**(key: any | any[], endKey?)**: (self) removes an item from the collection. \
  Multiple values can be deleted at the same time; in ordered collections you can return endKeys to delete a range of items. \
  You can also pass in an array of keys to delete several specifiic keys at once. 
* **deleteItem(item: any | any[])**: (self) removes one or more items from the collection. \
  If the item is present under more than one key, it removes all references. 
* **clear()**: (self) removes ALL items from the collection;
* **sort(orderingFn)**: (self) reorders elements; patterend after `array.sort()`.
* **reverse()**: (self) A specialized sort that reverses the order of the items in the collection.

### Iteration

Iteration "walks over" the items in the array. Unlike `forEach` methods, iteration methods can stop at any point. 
The final argument in the looping function is an iter object; you can call iter.stop() or iter.final() to
interrupt the looping at any point. 

the difference between stop() and final() calls is inmportant in `reduce(...)`. If you call stop, 
the _current return value of the looper is not used._ Ifon the other hand you call `final()`, the current
return value of the looper function **is used** -- but no other additional loops will occur.

In several vases the store itself is an argument to the looper. It is provided _for informational purposes only._
Do not modify the store from the inside of the looping function.

* **forEach((item, key, store, iter) => {... custom content} => void)**: (self) allows you to walk across \
  all the keys and values of the store. It is intend for extraction of data - its not a good idea to modify \
  the store or collection inside a forEach pass. The return value of the looping function is ignored. 
* **clone()** (new collection) returns a new Collection instance with a cloned copy of the store in the target collection, 
* **map((item, key, store, iter) => newItem)**: (new Collection) with the same keys and store type as the target collecgtion \
  but a different set of items. the return value of the looping function is used in place of the target collections' value. \
  The resulting colleciton will have the same keys as the target -- UNLESS you call iter.stop() or iter.final() \
  in which case the response is a subset of the target collections' keys. 
* **filter((item, key, store, iter) => boolean)**: (new Collection) a new collection whose keys are <= the keys of the original store.\
  Each item in the copied collection are exactly equal to those in the target collection. 
* **reduce((memo, item, key, store, iter) => any, initialValue?: any)**: (any) returns a raw object; can be any sort of ting \
  the output of the redue function is the _last output return value_ of the looper.

### (@TODO) Boolean functions

These methods will blend two collections and produce a third collection, using classical set theory/boolean
methods. 

## Store types: form and type

**Form** is a more constrained identifier for the basic class of the store; it includes 'map', 'store', etc., 
but does _not discriminate between different classes of scalar values; i.e., numbers, strings, Dates, and
Symbols are all considered 'scalar'. 

**Type** on the other hand includes a detailed subset of different scalar types -- as well as all the identifiers 
present in Form. 

type and form identifications are **not** identical to `typeof` identifiers; it's much more specific about 'object' for istance - 
it qualifies object types into 'array', 'set', 'map', 'object' and 'null'. 
