import create from '../src';
import { Debug } from '../src/utils/debug';

describe('I/O', () => {
  beforeEach(() => {
    Debug.init();
  });
  describe('scalars', () => {
    it('fails most tests', () => {
      const numCollection = create(42);
      expect(() => numCollection.get(7)).toThrow();
      expect(() => numCollection.set('a', 7)).toThrow();
      expect(() => numCollection.deleteItem(42)).toThrow();
      expect(() => numCollection.deleteKey(0)).toThrow();
    });
  });
  describe('string', () => {
    it('should get/set/delete', () => {
      const STRING = 'a long time ago in a galaxy far far away';
      const sc = create(STRING);

      expect(sc.get(4)).toBe('n');
      expect(sc.get(100)).toBeUndefined();
      sc.set(4, '$');
      expect(sc.store).toBe('a lo$g time ago in a galaxy far far away');
      expect(sc.size).toBe(STRING.length);

      const sc2 = create(STRING);

      sc2.deleteKey([2, 4, 6, 8]); // who do we appreciate

      expect(sc2.store).toBe('a ogtme ago in a galaxy far far away');

      const sc3 = create(STRING);

      sc3.deleteKey(4);

      expect(sc3.store).toBe('a log time ago in a galaxy far far away');

      const sc4 = create(STRING);

      sc4.deleteItem('a');
      expect(sc4.store).toBe(' long time go in  glxy fr fr wy');

      const sc5 = create(STRING);
      sc5.deleteItem('fa');
      expect(sc5.store).toBe('a long time ago in a galaxy r r away');

      const sc6 = create(STRING);
      sc6.deleteItem('aeiou'.split(''));
      expect(sc6.store).toBe(' lng tm g n  glxy fr fr wy');
    });
  });

  describe('array', () => {
    it('should get/set/delete', () => {
      const LIST = [1, 2, 3, 'cow', 1000, 3, 2, 1];
      const size = LIST.length;
      const ac = create([...LIST]);
      expect(ac.get(2)).toBe(3);
      expect(ac.get(100)).toBeUndefined();
      ac.set(2, 'another cow');
      expect(ac.size).toBe(size);
      expect(ac.store).toEqual([1, 2, 'another cow', 'cow', 1000, 3, 2, 1]);

      ac.deleteKey([2, 4, 6, 8]);
      expect(ac.store).toEqual([1, 2, 'cow', 3, 1]);
      expect(ac.size).toBe(LIST.length - 3);

      const ac2 = create(LIST);
      ac2.deleteKey(3);
      expect(ac2.store).toEqual([1, 2, 3, 1000, 3, 2, 1]);
      expect(ac2.size).toBe(LIST.length - 1);
    });
  });

  describe('Map', () => {
    it('should get/set/delete', () => {
      const LIST = [
        [1, 'cow'],
        [2, 'another cow'],
        ['happy', 'sad'],
        ['sad', 'angry'],
      ];
      const size = LIST.length;
      // @ts-ignore
      const ac = create(new Map(LIST));
      expect(ac.get(2)).toBe('another cow');
      expect(ac.get(100)).toBeUndefined();
      ac.set(2, 'another cow');
      expect(ac.size).toBe(size);
      // @ts-ignore
      expect(ac.store).toEqual(new Map(LIST));

      ac.deleteKey([2, 4, 6, 'sad']);
      const LIST_WITHOUT = [
        [1, 'cow'],
        ['happy', 'sad'],
      ];
      // @ts-ignore
      expect(ac.store).toEqual(new Map(LIST_WITHOUT));
      expect(ac.size).toBe(LIST.length - 2);

      // @ts-ignore
      const ac2 = create(new Map(LIST));
      ac2.deleteKey('happy');
      const LIST_WITHOUT_HAPPY = [
        [1, 'cow'],
        [2, 'another cow'],
        ['sad', 'angry'],
      ];
      // @ts-ignore
      expect(ac2.store).toEqual(new Map(LIST_WITHOUT_HAPPY));
      expect(ac2.size).toBe(LIST.length - 1);

      // @ts-ignore
      const ac3 = create(new Map(LIST));

      ac3.deleteItem('angry');
      // @ts-ignore
      expect(ac2.store).toEqual(new Map(LIST_WITHOUT_HAPPY));
      expect(ac2.size).toBe(LIST.length - 1);

      // @ts-ignore
      const ac4 = create(new Map(LIST));
      ac4.deleteItem(['cow', 'sad']);
      const LIST_WITHOUT_HAPPY_OR_COW = [
        [2, 'another cow'],
        ['sad', 'angry'],
      ];
      // @ts-ignore
      expect(ac4.store).toEqual(new Map(LIST_WITHOUT_HAPPY_OR_COW));
    });
  });

  describe('examples', () => {
    describe('twoDStore', () => {
      it('should use the same index with a comparator', () => {
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

        expect(mapStore.get({ x: 0, y: 0 })).toEqual([
          { x: 0, y: 0, z: 1 },
          { x: 0, y: 0, z: 2 },
          { x: 0, y: 0, z: 3 },
        ]);
      });

      /**
       * { x: 0, y: 0 } => [ { x: 0, y: 0, z: 3 }, { x: 0, y: 0, z: 2 }, { x: 0, y: 0, z: 1 } ]
       */
    });
  });
});
