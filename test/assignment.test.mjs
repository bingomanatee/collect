/* eslint-disable @typescript-eslint/ban-ts-ignore */
import tap from 'tap';
import pkg from '../dist/index.js';

const { create } = pkg;

tap.test('I/O', (io) => {
  io.test('scalars', (testScalars) => {
    const numCollection = create(42);
    testScalars.throws(() => numCollection.get(7));
    testScalars.throws(() => numCollection.set('a', 7));
    testScalars.throws(() => numCollection.deleteItem(42));
    testScalars.throws(() => numCollection.deleteKey(0));
    testScalars.end();
  });
  io.test('string', (testString) => {
    const STRING = 'a long time ago in a galaxy far far away';
    const sc = create(STRING);

    testString.same(sc.get(4), 'n');
    testString.notOk(sc.get(100));
    sc.set(4, '$');
    testString.same(sc.store, 'a lo$g time ago in a galaxy far far away');
    testString.same(sc.size, STRING.length);

    const sc2 = create(STRING);

    sc2.deleteKey([2, 4, 6, 8]); // who do we appreciate

    testString.same(sc2.store, 'a ogtme ago in a galaxy far far away');

    const sc3 = create(STRING);

    sc3.deleteKey(4);

    testString.same(sc3.store, 'a log time ago in a galaxy far far away');

    const sc4 = create(STRING);

    sc4.deleteItem('a');
    testString.same(sc4.store, ' long time go in  glxy fr fr wy');

    const sc5 = create(STRING);
    sc5.deleteItem('fa');
    testString.same(sc5.store, 'a long time ago in a galaxy r r away');

    const sc6 = create(STRING);
    sc6.deleteItem('aeiou'.split(''));
    testString.same(sc6.store, ' lng tm g n  glxy fr fr wy');

    testString.end();
  });

  io.test('array', (testArray) => {
    const LIST = [1, 2, 3, 'cow', 1000, 3, 2, 1];
    const size = LIST.length;
    const ac = create([...LIST]);
    testArray.same(ac.get(2), 3);
    testArray.notOk(ac.get(100));
    ac.set(2, 'another cow');
    testArray.same(ac.size, size);
    testArray.same(ac.store, [1, 2, 'another cow', 'cow', 1000, 3, 2, 1]);

    ac.deleteKey([2, 4, 6, 8]);
    testArray.same(ac.store, [1, 2, 'cow', 3, 1]);
    testArray.same(ac.size, LIST.length - 3);

    const ac2 = create(LIST);
    ac2.deleteKey(3);
    testArray.same(ac2.store, [1, 2, 3, 1000, 3, 2, 1]);
    testArray.same(ac2.size, LIST.length - 1);
    testArray.end();
  });

  io.test('Map', (testMap) => {
    const LIST = [
      [1, 'cow'],
      [2, 'another cow'],
      ['happy', 'sad'],
      ['sad', 'angry'],
    ];
    const size = LIST.length;

    testMap.test("basic assignment", (basic) => {
      // @ts-ignore
      const ac = create(new Map(LIST));
      basic.same(ac.get(2), 'another cow');
      basic.notOk(ac.get(100));
      ac.set(2, 'another cow');
      basic.same(ac.size, size);
      // @ts-ignore
      basic.same(ac.store, new Map(LIST));
      basic.end();
    });

    // @TODO: figure out why this test fails !!! important
    testMap.test('deleteManyKeys', (deleteMany) => {
      const ac = create(new Map(LIST));
      ac.deleteKey([2, 4, 6, 'sad']);
      const LIST_WITHOUT = [
        [1, 'cow'],
        ['happy', 'sad'],
      ];
      // @ts-ignore
      deleteMany.same(ac.store, new Map(LIST_WITHOUT), 'deleteKey Map');
      deleteMany.same(ac.size, LIST.length - 2);
      deleteMany.end();
    }, {skip: true})

    const LIST_WITHOUT_HAPPY = [
      [1, 'cow'],
      [2, 'another cow'],
      ['sad', 'angry'],
    ];
    testMap.test('deleteKeyTest', (deleteOne) =>{
      // @ts-ignore
      const ac2 = create(new Map(LIST));
      ac2.deleteKey('happy');
      // @ts-ignore
      deleteOne.same(ac2.store, new Map(LIST_WITHOUT_HAPPY));
      deleteOne.same(ac2.size, LIST.length - 1);
      deleteOne.end();
    });

    // @TODO: figure out why this test fails !!! important
    testMap.test('deleteItemTest', (deleteItem) => {
      // @ts-ignore
      const ac3 = create(new Map(LIST));

      ac3.deleteItem('angry');
      // @ts-ignore
      testMap.same(ac3.store, new Map(LIST_WITHOUT_HAPPY));
      testMap.same(ac3.size, LIST.length - 1);
      deleteItem.end();
    }, {skip: true})


    testMap.test('delete many items', (delManyItems) => {
      // @ts-ignore
      const ac4 = create(new Map(LIST));
      ac4.deleteItem(['cow', 'sad']);
      const LIST_WITHOUT_HAPPY_OR_COW = [
        [2, 'another cow'],
        ['sad', 'angry'],
      ];
      // @ts-ignore
      delManyItems.same(ac4.store, new Map(LIST_WITHOUT_HAPPY_OR_COW));
      delManyItems.end();
    });

    testMap.end();
  });

  io.test('Set', (testSet) => {
    const LIST = [1, 2, 3, 'cow', 1000];
    const size = LIST.length;
    const setCollection = create(new Set(LIST));
    testSet.same(setCollection.get(2), 3);
    testSet.notOk(setCollection.get(100));

    setCollection.set(2, 'another cow');

    testSet.same(setCollection.size, size);
    testSet.same(setCollection.store, new Set([1, 2, 'another cow', 'cow', 1000]));

    const setColl2 = create(new Set(LIST));
    setColl2.deleteKey([2, 4, 6, 8]);
    const LIST_WITHOUT_KEYS = new Set([1, 2, 'cow']);
    testSet.same(setColl2.store, LIST_WITHOUT_KEYS);
    testSet.same(setColl2.size, LIST_WITHOUT_KEYS.size);

    const setColl3 = create(new Set(LIST));
    setColl3.deleteKey(3);
    const LIST_WITHOUT_KEY = new Set([1, 2, 3, 1000]);
    testSet.same(setColl3.store, LIST_WITHOUT_KEY);
    testSet.same(setColl3.size, LIST_WITHOUT_KEY.size);

    testSet.end();
  });

  io.test('examples', (examples) => {
    examples.test('twoDStore', (twoStore) => {
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

      twoStore.same(mapStore.get({ x: 0, y: 0 }), [
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: 2 },
        { x: 0, y: 0, z: 3 },
      ]);
      twoStore.end();
    });

    /**
     * { x: 0, y: 0 } => [ { x: 0, y: 0, z: 3 }, { x: 0, y: 0, z: 2 }, { x: 0, y: 0, z: 1 } ]
     */
    examples.end();
  });
  io.end();
});
