import tap from 'tap';
import { create } from '../dist/collect.es.js';

tap.test('iter', (suite) => {
  suite.test('storeIter', (storeTest) => {
    storeTest.test('should iterate over Object', (objectTest) => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = oc.storeIter();

      const pairs = [];
      for (const item of iter) {
        pairs.push(item);
      }
      objectTest.same(new Set(pairs),
        new Set([
          ['x', 1],
          ['y', 2],
          ['z', 3],
        ])
      );
      objectTest.end();
    });

    storeTest.test('should iterate over Map items', (mapTest) => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = oc.storeIter();
      const items = [];

      for (const item of iter) {
        items.push(item);
      }

      mapTest.same(new Set(items),
        new Set([
          ['x', 1],
          ['y', 2],
          ['z', 3],
        ])
      );
      mapTest.end();
    });

    storeTest.test('should iterate over Array items', (arrayTest) => {
      const ac = create(['a', 'b', 'c']);

      const iter = ac.storeIter();
      const items = [];

      for (const item of iter) {
        items.push(item);
      }

      arrayTest.same(items,
        [
          [0, 'a'],
          [1, 'b'],
          [2, 'c'],
        ]
      );

      arrayTest.end();
    });

    storeTest.test('should iterate over String items', (stringTest) => {
      const oc = create('xyz');

      const iter = oc.storeIter();
      const items = [];

      for (const item of iter) {
        items.push(item);
      }

      stringTest.same(items,
        [
          [0, 'x'],
          [1, 'y'],
          [2, 'z'],
        ]
      );
      stringTest.end();
    });
    storeTest.end();
  });
  suite.test('itemIter', (itemIterTest) => {
    itemIterTest.test('should iterate over Object items', (objectTest) => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = oc.itemIter();
      const items = [];

      for (const item of iter) {
        items.push(item);
      }

      objectTest.same(new Set(items), new Set([1, 2, 3]));
      objectTest.end();
    });

    itemIterTest.test('should iterate over Map items', (mapTest) => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = oc.itemIter();
      const items = [];

      for (const item of iter) {
        items.push(item);
      }

      mapTest.test(new Set(items), new Set([1, 2, 3]));
      mapTest.end();
    });

    itemIterTest.test('should iterate over Array items', (arrayTest) => {
      const oc = create([1, 2, 3]);

      const iter = oc.itemIter();
      const items = [];

      for (const item of iter) {
        items.push(item);
      }

      arrayTest.same(new Set(items), new Set([1, 2, 3]));
      arrayTest.end();
    });

    itemIterTest.test('should iterate over String items', (stringTest) => {
      const oc = create('xyz');

      const iter = oc.itemIter();
      const items = [];

      for (const item of iter) {
        items.push(item);
      }

      stringTest.same(new Set(items), new Set(['x', 'y', 'z']));
      stringTest.end();
    });
    itemIterTest.end();
  });
  suite.test('keyIter', (keyIterTest) => {
    keyIterTest.test('should iterate over Object keys', (objectTest) => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = oc.keyIter();
      const keys = [];

      for (const item of iter) {
        keys.push(item);
      }

      objectTest.same(new Set(keys), new Set(['x', 'y', 'z']));
      objectTest.end();
    });

    keyIterTest.test('should iterate over Map keys', (mapTest) => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = oc.keyIter();
      const keys = [];

      for (const item of iter) {
        keys.push(item);
      }

      mapTest.same(new Set(keys), new Set(['x', 'y', 'z']));
      mapTest.end();
    });

    keyIterTest.test('should iterate over Array keys', (arrayTest) => {
      const oc = create([1, 2, 3]);

      const iter = oc.keyIter();
      const keys = [];

      for (const item of iter) {
        keys.push(item);
      }

      arrayTest.same(new Set(keys), new Set([0, 1, 2]));
      arrayTest.end();
    });

    keyIterTest.test('should iterate over String keys', (stringTest) => {
      const oc = create('xyz');

      const iter = oc.keyIter();
      const keys = [];

      for (const item of iter) {
        keys.push(item);
      }

      stringTest.same(new Set(keys), new Set([0, 1, 2]));
      stringTest.end();
    });
    keyIterTest.end();
  });

  suite.test('loops - example from docs', (loops) => {
    const collect = create;

    const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    numbers.map(item => item * 10);

    console.log('numbers is now ', numbers.store);
    // [10, 20, 30, 40, 50 ,60, 70, 80, 90, 100]

    const sumOfAll = numbers.reduce((memo, item) => memo + item, 0);
    console.log('sum of all', sumOfAll); // 550

    const sumOfFive = numbers.reduce((memo, item, key, _store, stopper) => {
      if (key === 4) {
        stopper.stopAfterThis();
      }
      return memo + item;
    }, 0);

    console.log('sum of first five', sumOfFive); // 150

    const sumOfFour = numbers.reduce((memo, item, key, _store, stopper) => {
      if (key === 4) {
        stopper.stop();
      }
      return memo + item;
    }, 0);

    console.log('sum of four', sumOfFour); // 100
    loops.end();
  }, { skip: true });
  suite.end();
});
