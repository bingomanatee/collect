/* eslint-disable @typescript-eslint/ban-ts-ignore */
import create from '../dist';
import {Debug} from '../src/utils/debug';
import tap from 'tap';

tap.test('I/O', (io) => {
  io.test('scalars', (suite) => {
    suite.test('fails most tests', (fails) => {
      const numCollection = create(42);
      fails.throws(() => numCollection.get(7));
      fails.throws(() => numCollection.set('a', 7));
      fails.throws(() => numCollection.deleteItem(42));
      fails.throws(() => numCollection.deleteKey(0));
    });
  });
  io.test('string', (suite) => {
    suite.test('should get/set/delete', (gsd) => {
      const STRING = 'a long time ago in a galaxy far far away';
      const sc = create(STRING);

      gsd.same(sc.get(4), 'n');
      gsd.notOk(sc.get(100));
      sc.set(4, '$');
      gsd.same(sc.store, 'a lo$g time ago in a galaxy far far away');
      gsd.same(sc.size, STRING.length);

      const sc2 = create(STRING);

      sc2.deleteKey([2, 4, 6, 8]); // who do we appreciate

      gsd.same(sc2.store, 'a ogtme ago in a galaxy far far away');

      const sc3 = create(STRING);

      sc3.deleteKey(4);

      gsd.same(sc3.store, 'a log time ago in a galaxy far far away');

      const sc4 = create(STRING);

      sc4.deleteItem('a');
      gsd.same(sc4.store, ' long time go in  glxy fr fr wy');

      const sc5 = create(STRING);
      sc5.deleteItem('fa');
      gsd.same(sc5.store, 'a long time ago in a galaxy r r away');

      const sc6 = create(STRING);
      sc6.deleteItem('aeiou'.split(''));
      gsd.same(sc6.store, ' lng tm g n  glxy fr fr wy');
    });
  });

  io.test('array', (suite) => {
    suite.test('should get/set/delete', (gsd) => {
      const LIST = [1, 2, 3, 'cow', 1000, 3, 2, 1];
      const size = LIST.length;
      const ac = create([...LIST]);
      gsd.same(ac.get(2), 3);
      gsd.notOk(ac.get(100));
      ac.set(2, 'another cow');
      gsd.same(ac.size, size);
      expect(ac.store).toEqual([1, 2, 'another cow', 'cow', 1000, 3, 2, 1]);

      ac.deleteKey([2, 4, 6, 8]);
      expect(ac.store).toEqual([1, 2, 'cow', 3, 1]);
      gsd.same(ac.size, LIST.length - 3);

      const ac2 = create(LIST);
      ac2.deleteKey(3);
      expect(ac2.store).toEqual([1, 2, 3, 1000, 3, 2, 1]);
      gsd.same(ac2.size, LIST.length - 1);
    });
  });

  io.test('Map', (suite) => {
    suite.test('should get/set/delete', (gsd) => {
      const LIST = [
        [1, 'cow'],
        [2, 'another cow'],
        ['happy', 'sad'],
        ['sad', 'angry'],
      ];
      const size = LIST.length;
      // @ts-ignore
      const ac = create(new Map(LIST));
      gsd.same(ac.get(2), 'another cow');
      gsd.notOk(ac.get(100));
      ac.set(2, 'another cow');
      gsd.same(ac.size, size);
      // @ts-ignore
      gsd.same(ac.store, new Map(LIST));

      ac.deleteKey([2, 4, 6, 'sad']);
      const LIST_WITHOUT = [
        [1, 'cow'],
        ['happy', 'sad'],
      ];
      // @ts-ignore
      gsd.same(ac.store, new Map(LIST_WITHOUT));
      gsd.same(ac.size, LIST.length - 2);

      // @ts-ignore
      const ac2 = create(new Map(LIST));
      ac2.deleteKey('happy');
      const LIST_WITHOUT_HAPPY = [
        [1, 'cow'],
        [2, 'another cow'],
        ['sad', 'angry'],
      ];
      // @ts-ignore
      gsd.same(ac2.store, new Map(LIST_WITHOUT_HAPPY));
      gsd.same(ac2.size, LIST.length - 1);

      // @ts-ignore
      const ac3 = create(new Map(LIST));

      ac3.deleteItem('angry');
      // @ts-ignore
      gsd.same(ac2.store, new Map(LIST_WITHOUT_HAPPY));
      gsd.same(ac2.size, LIST.length - 1);

      // @ts-ignore
      const ac4 = create(new Map(LIST));
      ac4.deleteItem(['cow', 'sad']);
      const LIST_WITHOUT_HAPPY_OR_COW = [
        [2, 'another cow'],
        ['sad', 'angry'],
      ];
      // @ts-ignore
      gsd.same(ac4.store, new Map(LIST_WITHOUT_HAPPY_OR_COW));
    });
  });

  io.test('Set', (suite) => {
    const LIST = [1, 2, 3, 'cow', 1000];
    suite.test('should get from key, set', (gsd) => {
      const size = LIST.length;
      const ac = create(new Set(LIST));
      gsd.same(ac.get(2), 3);
      gsd.notOk(ac.get(100));

      ac.set(2, 'another cow');

      gsd.same(ac.size, size);
      gsd.same(ac.store, new Set([1, 2, 'another cow', 'cow', 1000]));
    });

    suite.test('should delete a set of keys', (gsd) => {
      const ac = create(new Set(LIST));
      ac.deleteKey([2, 4, 6, 8]);
      const LIST_WITHOUT_KEYS = new Set([1, 2, 'cow']);
      gsd.same(ac.store, LIST_WITHOUT_KEYS);
      gsd.same(ac.size, LIST_WITHOUT_KEYS.size);
    });

    suite.test('should delete a single key', (gsd) => {
      const ac2 = create(new Set(LIST));
      ac2.deleteKey(3);
      const LIST_WITHOUT_KEY = new Set([1, 2, 3, 1000]);
      gsd.same(ac2.store, LIST_WITHOUT_KEY);
      gsd.same(ac2.size, LIST_WITHOUT_KEY.size);
    });
  });

  io.test('examples', (examples) => {
    examples.test('twoDStore', (twoStore) => {
      const mapStore = create(new Map(), {
        compKeys(key1, key2) {
          return key1.x === key2.x && key1.y === key2.y;
        },
      });

      function store3DPoint(x, y, z) {
        const key = {x, y};
        const data = {x, y, z};
        const others = mapStore.hasKey(key) ? mapStore.get(key) : [];
        mapStore.set(key, [...others, data]);
      }

      store3DPoint(0, 0, 1);
      store3DPoint(0, 0, 2);
      store3DPoint(0, 0, 3);

      twoStore.same(mapStore.get({x: 0, y: 0}),[
        {x: 0, y: 0, z: 1},
        {x: 0, y: 0, z: 2},
        {x: 0, y: 0, z: 3},
      ]);
    });

    /**
     * { x: 0, y: 0 } => [ { x: 0, y: 0, z: 3 }, { x: 0, y: 0, z: 2 }, { x: 0, y: 0, z: 1 } ]
     */
  });
});
