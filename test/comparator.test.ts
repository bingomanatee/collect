import create from '../src';
import toString from 'lodash/tostring';

describe('comparator', () => {
  xit('compares by reference by default', () => {
    const collect = create;
    const mapC = collect(new Map([]));

    mapC
      .set(1, 'happy')
      .set({ x: 1, y: 1 }, 'sad')
      .set('Bob', 'angry')
      .set(Symbol('unique'), 'lonely');

    console.log('mapC=', mapC.store);

    console.log('numbers');
    console.log('has 1', mapC.hasKey(1));
    console.log('objects');
    console.log('has {x: 1, y: 1}', mapC.hasKey({ x: 1, y: 1 }));
    console.log('strings');
    console.log('has "Bob"', mapC.hasKey('Bob'));
    console.log('symbols');
    console.log('has Symbol("unique")', mapC.hasKey(Symbol('unique')));

    /*

      mapC= Map(4) {
        1 => 'happy',
        { x: 1, y: 1 } => 'sad',
        'Bob' => 'angry',
        Symbol(unique) => 'lonely'
      }
      numbers
      has 1 true
      objects
      has {x: 1, y: 1} false
      strings
      has "Bob" true
      symbols
      has Symbol("unique") false

     */
  });
  xit('allows custom comparators', () => {
    const collect = create;
    const mapC = collect(new Map([]), {
      compKeys: (item1, item2) => {
        try {
          item1 = JSON.stringify(item1);
        } catch (_e) {
          item1 = toString(item1);
        }
        try {
          item2 = JSON.stringify(item2);
        } catch (_e2) {
          item2 = toString(item2);
        }
        console.log('comparing', item1, 'and', item2);
        return item1 === item2;
      },
    });

    mapC
      .set(1, 'happy')
      .set({ x: 1, y: 1 }, 'sad')
      .set('Bob', 'angry')
      .set(Symbol('unique'), 'lonely');

    console.log('mapC=', mapC.store);

    console.log('numbers');
    console.log('has 1', mapC.hasKey(1));
    console.log('objects');
    console.log('has {x: 1, y: 1}', mapC.hasKey({ x: 1, y: 1 }));
    console.log('strings');
    console.log('has "Bob"', mapC.hasKey('Bob'));
    console.log('symbols');
    console.log('has Symbol("unique")', mapC.hasKey(Symbol('unique')));

    /*

    mapC= Map(4) {
      1 => 'happy',
      { x: 1, y: 1 } => 'sad',
      'Bob' => 'angry',
      Symbol(unique) => 'lonely'
    }
    numbers
    has 1 true
    objects
    comparing 1 and {"x":1,"y":1}
    comparing {"x":1,"y":1} and {"x":1,"y":1}
    has {x: 1, y: 1} true
    strings
    has "Bob" true
    symbols
    comparing 1 and undefined
    comparing {"x":1,"y":1} and undefined
    comparing "Bob" and undefined
    comparing undefined and undefined
    has Symbol("unique") true

     */
  });
});
