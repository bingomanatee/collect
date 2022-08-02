import tap from 'tap';
import { create } from '../dist/collect.es.js';

tap.test('inspections', (suite) => {
  suite.test('scalars', (scalarsTest) => {
    const c = create(2);
    scalarsTest.same(c.size, 0);
    scalarsTest.throws(() => c.hasKey(1),
      'hasKey not available for scalar collection'
    );
    scalarsTest.throws(() => c.hasItem(1),
      'hasItem not available for scalar collection'
    );
    scalarsTest.throws(() => c.keys, 'keys not available for scalar collection');
    scalarsTest.throws(() => c.items,
      'items not available for scalar collection'
    );
    scalarsTest.throws(() => c.keyOf(1),
      'keyOf not available for scalar collection'
    );
    scalarsTest.end();
  });

  suite.test('strings', (stringTest) => {
    const STRING = 'a long winter';
    const sc = create(STRING);

    stringTest.same(sc.size, STRING.length);
    stringTest.ok(sc.hasItem('w'))
    stringTest.notOk(sc.hasItem('z'));
    stringTest.same(sc.keys, STRING.split('').map((_c, i) => i));
    stringTest.same(sc.items, STRING.split(''));
    stringTest.same(sc.keyOf('w'), STRING.indexOf('w'));
    stringTest.notOk(sc.keyOf('z'));
    stringTest.end();
  });

  suite.test('Map', (mapTest) => {

    const m = new Map([
      ['x', 100],
      ['y', 200],
    ]);

    const mc = create(m);

    mapTest.same(mc.size, 2);
    mapTest.ok(mc.hasItem(200));
    mapTest.notOk(mc.hasItem(500));
    mapTest.same(mc.keys, ['x', 'y']);
    mapTest.same(mc.items, [100, 200]);
    mapTest.same(mc.keyOf(200), 'y');
    mapTest.notOk(mc.keyOf(400));
    mapTest.end();
  });

  suite.test('Array', (arrayTest) => {
    const list = ['a', 1, 'b', 2, 'c', 3];

    const ac = create(list);

    arrayTest.same(ac.size, list.length);
    arrayTest.ok(ac.hasItem('a'));
    arrayTest.ok(ac.hasItem(3));
    arrayTest.notOk(ac.hasItem(4));

    arrayTest.same(ac.keys, [0, 1, 2, 3, 4, 5]);
    arrayTest.end();
  });

  suite.test('Object', (objectTest) => {
    const p = { name: 'home', x: 100, y: 200, z: 300 };

    const objCollection = create(p);

    objectTest.same(objCollection.size, 4);
    objectTest.ok(objCollection.hasItem('home'));
    objectTest.ok(objCollection.hasItem(300));
    objectTest.notOk(objCollection.hasItem(400));

    objectTest.same(objCollection.keys, ['name', 'x', 'y', 'z']);
    objectTest.end();
  });

  suite.test('Set', (setTest) => {
    const VALUES = ['home', 100, 200, 300];
    const setCollection = create(new Set(VALUES));

    setTest.same(setCollection.size, 4);
    setTest.ok(setCollection.hasItem('home'));
    setTest.ok(setCollection.hasItem(300));
    setTest.notOk(setCollection.hasItem(400));

    setTest.same(setCollection.keys, ([0, 1, 2, 3]));
    setTest.end();
  });
  suite.end();
});
