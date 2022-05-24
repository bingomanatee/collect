import create from '../src';
import { Iter } from '../src/Iter';

describe('iter', () => {
  describe('storeIter', () => {
    it('should iterate over Object', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = Iter.storeIter(oc);

      if (iter) {
        const pairs: any[] = [];
        for (const item of iter) {
          pairs.push(item);
        }
        expect(new Set(pairs)).toEqual(
          new Set([
            ['x', 1],
            ['y', 2],
            ['z', 3],
          ])
        );
      }
    });

    it('should iterate over Map items', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = Iter.storeIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(
          new Set([
            ['x', 1],
            ['y', 2],
            ['z', 3],
          ])
        );
      }
    });

    it('should iterate over Array items', () => {
      const ac = create(['a', 'b', 'c']);

      const iter = Iter.storeIter(ac);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(
          new Set([
            [0, 'a'],
            [1, 'b'],
            [2, 'c'],
          ])
        );
      }
    });

    it('should iterate over String items', () => {
      const oc = create('xyz');

      const iter = Iter.storeIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(
          new Set([
            [0, 'x'],
            [1, 'y'],
            [2, 'z'],
          ])
        );
      }
    });
  });
  describe('itemIter', () => {
    it('should iterate over Object items', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set([1, 2, 3]));
      }
    });

    it('should iterate over Map items', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set([1, 2, 3]));
      }
    });

    it('should iterate over Array items', () => {
      const oc = create([1, 2, 3]);

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set([1, 2, 3]));
      }
    });

    it('should iterate over String items', () => {
      const oc = create('xyz');

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set(['x', 'y', 'z']));
      }
    });
  });
  describe('keyIter', () => {
    it('should iterate over Object keys', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set(['x', 'y', 'z']));
      }
    });

    it('should iterate over Map keys', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set(['x', 'y', 'z']));
      }
    });

    it('should iterate over Array keys', () => {
      const oc = create([1, 2, 3]);

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set([0, 1, 2]));
      }
    });

    it('should iterate over String keys', () => {
      const oc = create('xyz');

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set([0, 1, 2]));
      }
    });
  });
});
